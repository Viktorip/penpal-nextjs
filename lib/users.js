'use server'
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { ACCEPTED_DOMAINS, DB_ADDRESSBOOK, DB_NAME, DB_USERS, DB_VERIFY, NO_REPLY_EMAIL, VISIBILITY_PRIVATE, domain, endpoint } from '@/utils/constants';
import { verifyRecaptcha } from './recaptcha';
import { Resend } from 'resend';
import VerifyEmailTemplate from '@/components/VerifyEmailTemplate';

const { MongoClient } = require('mongodb');



export async function isUserVerified(id) {
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        await client.connect();
        const verify = await client.db(DB_NAME).collection(DB_VERIFY).findOne({owner: id});
        const verified = !!verify?.verified;
        return verified;
    }catch (error) {
        console.log("Server error in isUserVerified");
        return null;
    }
}

export async function getUserByEmail(email) {
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        await client.connect();
        const user = await client.db(DB_NAME).collection(DB_USERS).findOne({ email: email });
        if (user) {
            return user;
        }
        console.log('Didnt find user by email', email);
        return null;
    } catch (error) {
        console.log("Error with database connection in getUserByEmail", email, error);
        return null;
    } finally {
        client.close();
    }
}

async function createUser(email, password, fullname) {
    const client = new MongoClient(process.env.MONGODB_URI);
    console.log("Creating user");
    try {
        await client.connect();

        const unixTimeInSeconds = Date.now();

        const newData = {
            email: email,
            password: password,
            fullname: fullname,
            created: unixTimeInSeconds
        };

        const result = await client.db(DB_NAME).collection(DB_USERS).insertOne(newData);

        if (result) {
            const verify = await client.db(DB_NAME).collection(DB_VERIFY).insertOne({owner: result.insertedId.toString(), created: unixTimeInSeconds});
            console.log("Inserted verify:", verify);
            if (!verify) {
                await client.db(DB_NAME).collection(DB_USERS).deleteOne({_id:result.insertedId});
                console.log("Failed to insert verify code, aborting.");
                return { error: 'Failed to create user', success: false };
            }
            console.log("Succesfully created user with ID", result.insertedId.toString());
            return { _id: result.insertedId.toString(), verifyId: verify.insertedId.toString(), email: email, fullname: fullname, success: true };
        }

        return { error: 'Failed to create user', success: false };

    } catch (error) {
        console.log("Server error failed to create user", error);
        return { error: error, success: false };
    }

}

export async function registerUser(credentials) {
    const parsedCredentials = z
        .object({
            email: z.string().email().refine(email => {
                //const acceptedDomain = email.endsWith()
                const domain = email.split('@').pop().toLowerCase();
                console.log("email domain:", domain);
                const accepted_domains_arr = ACCEPTED_DOMAINS;
                console.log("accepted domains", accepted_domains_arr);
                const allowed = accepted_domains_arr.includes(domain);
                console.log("email validation", allowed);
                return allowed;
            }, {
                message: 'Email domain not allowed'
            }),
            password: z.string().min(4).max(24),
            password2: z.string().min(4).max(24),
            fullname: z.string().min(3).max(32),
            loc: z.string().length(2)
        })
        .safeParse(credentials);


    if (parsedCredentials.success) {
        try {
            const { email, password, password2, fullname, loc } = parsedCredentials.data;
            //check recaptcha
            const captchaData = await verifyRecaptcha(credentials.token);

            if (!(captchaData.success && captchaData.score >= 0.5)) {
                //bot
                console.log("User is a bot!");
                return { error: 'Failed to register user', success: false };
            }
            //check if user exists already
            const userExists = await getUserByEmail(email);

            if (userExists) {
                console.log('User already exists');
                return { error: 'User already exists', success: false };
            }

            const passwordsMatch = !!(password === password2);
            if (passwordsMatch) {
                console.log("Passwords match");
                const hashedPassword = await hashPassword(password);
                const user = await createUser(email, hashedPassword, fullname);
                if (user.success) {
                    console.log("User successfull");
                    const result = await sendVerifyEmailToUser({...user, loc:loc});
                    return user;
                }
                return user;
            }
            console.log('Passwords didnt match');
            return { error: 'Passwords didnt match', success: false };
        } catch (error) {
            console.log('System error in registering user', error);
            return { error: 'System error in registering user', success: false };
        }
    }

    console.log('Invalid credentials');
    return { error: 'Invalid credentials', success: false, status: 600 };
}

export async function addUserToAddressbook(senderId, recipientEmail) {

    try {
        const recipient = await getUserByEmail(recipientEmail);
        if (!recipient) return null;

        const unixTimeInSeconds = Date.now();
        const newData = {
            users: [recipient._id.toString()],
            created: unixTimeInSeconds,
            visibility: VISIBILITY_PRIVATE,
            owner: senderId
        };

        const result = await saveAddressbookData(newData);

        return result;
    } catch (error) {
        console.log("Server error failed to save user to addressbook", error);
        return { error: error, success: false };
    }
}

export async function sendVerifyEmailToUser(data) {
    const {email, fullname, verifyId, loc = 'en'} = data;
    console.log("running sendVerifyEmailToUser", data);
    console.log(email, fullname, verifyId, loc);
    const resend = new Resend(process.env.RESEND_API_KEY);
    try {

        const verifyLink = `${domain}/verify/${verifyId}`;
        console.log("Sending mail, loc", loc);
        const { data, error } = await resend.emails.send({
            from: NO_REPLY_EMAIL,
            to: [email],
            subject: 'kirjekaverit.fi',
            react: VerifyEmailTemplate({email, fullname, loc, verifyLink})
        });

        if (error) {
            console.log("Sending email failed", error);
            return {success: false, error: error};
        }
        console.log("Email sending success, data:", data);
        return {success: true};
    }catch (error) {
        console.log("Server error in sending verify mail");
        return {success: false, error: 'Server error in sending verify mail'};
    }
}

async function saveAddressbookData(data) {
    const client = new MongoClient(process.env.MONGODB_URI);

    try {
        await client.connect();

        const result = await client.db(DB_NAME).collection(DB_ADDRESSBOOK).updateOne(
            { owner: data.owner }, //search to match item
            {
                $setOnInsert: { created: data.created, visibility: data.visibility, owner: data.owner },
                $addToSet: { users: data.users[0] }
            }, //what to do on the item
            { upsert: true } //create new item if it doesn't exist
        );

        if (result) {
            console.log("save addressbook result", result);
            return { success: true };
        }
        console.log('Failed to save user to addressbook');
        return { error: 'Failed to save user to addressbook', success: false };
    } catch (error) {
        console.log('System error failed to save addressbook data', error);
        return { error: error, success: false };
    } finally {
        await client.close();
    }
}

const hashPassword = async (password) => {
    const hashed = await bcrypt.hash(password, 10);
    return hashed;
}
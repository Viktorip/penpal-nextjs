'use server'
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { DB_ADDRESSBOOK, DB_NAME, DB_USERS, VISIBILITY_PRIVATE } from '@/utils/constants';
import { verifyRecaptcha } from './recaptcha';

const { MongoClient } = require('mongodb');

const hashPassword = async (password) => {
    const hashed = await bcrypt.hash(password, 10);
    return hashed;
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
            return { _id: result.insertedId.toString(), email: email, success: true };
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
            email: z.string().email(),
            password: z.string().min(4).max(24),
            password2: z.string().min(4).max(24),
            fullname: z.string().min(3).max(32)
        })
        .safeParse(credentials);

    if (parsedCredentials.success) {
        try {
            const { email, password, password2, fullname } = parsedCredentials.data;
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
                const hashedPassword = await hashPassword(password);
                const user = await createUser(email, hashedPassword, fullname);

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
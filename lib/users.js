'use server'
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { DB_NAME, DB_USERS } from '@/utils/constants';

const { MongoClient } = require('mongodb');

const hashPassword = async (password) => {
    const hashed = await bcrypt.hash(password, 10);
    return hashed;
}

export async function getUserByEmail(email) {
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        await client.connect();
        const user = await client.db(DB_NAME).collection(DB_USERS).findOne({email: email});
        if (user) {
            console.log("Found user", user);
            return user;
        }
        console.log('Didnt find user by email', email);
        return null;
    }catch (error) {
        console.log("Error with database connection in getUserByEmail", email, error);
    }finally {
        client.close();
    }
    
}

export async function createUser(email, password, fullname) {
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
            return {_id: result.insertedId.toString(), email: email, success: true};
        }
        
        return { error:'Failed to create user', success: false };

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
        const { email, password, password2, fullname } = parsedCredentials.data;

        //check if user exists already
        const userExists = await getUserByEmail(email);
        
        if (userExists) {
            console.log('User already exists');
            return {error: 'User already exists', success: false};
        }

        const passwordsMatch = !!(password === password2);
        if (passwordsMatch) {
            const hashedPassword = await hashPassword(password);
            const user = await createUser(email, hashedPassword, fullname);

            return user;
        }
        console.log('Passwords didnt match');
        return {error: 'Passwords didnt match', success: false};

    }

    console.log('Invalid credentials');
    return {error: 'Invalid credentials', success: false};
}
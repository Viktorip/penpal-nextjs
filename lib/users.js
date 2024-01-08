'use server'
import { z } from 'zod';
import bcrypt from 'bcrypt';
import fsPromises from 'fs/promises';
import path from 'path';
import { DB_NAME, DB_USERS } from '@/utils/constants';

const dataFilePath = path.join(process.cwd(), 'data/users_data.json');

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
    console.log("Trying to create user, reading path:", dataFilePath);
    try {
        const jsonDataFromFile = await fsPromises.readFile(dataFilePath);
        const objectData = JSON.parse(jsonDataFromFile);
        let nextId = objectData.data.reduce((a, b) => Math.max(a, b.id), 0) || 0;

        const unixTimeInSeconds = Date.now();

        const newData = {
            id: ++nextId,
            email: email,
            password: password,
            fullname: fullname,
            created: unixTimeInSeconds
        };

        objectData.data.push(newData);

        const updatedData = JSON.stringify(objectData, null, 2);
        await fsPromises.writeFile(dataFilePath, updatedData);
        return { ...newData, success: true };

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
        const userExists = await getUserById(email);
        
        if (userExists.success) {
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
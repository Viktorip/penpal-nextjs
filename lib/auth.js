'use server'
import { z } from 'zod';
import { getUserByEmail, getUserById } from './users';
import { cookies } from 'next/headers';
import { DB_NAME, DB_USERS, cookiename } from '../utils/constants';
import bcrypt from 'bcrypt';

const { MongoClient } = require('mongodb');

export async function signIn(credentials) {
    const parsedCredentials = z
        .object({ email: z.string().email(), password: z.string().min(4) })
        .safeParse(credentials);
    
    if (parsedCredentials.success) {
        const { email, password } = parsedCredentials.data;
        console.log("Getting user", email);
        const user = await getUserByEmail(email);

        if (!user) return {...user, error:'Didnt find user by email', success:false};

        const passwordsMatch = await bcrypt.compare(password, user.password);
        console.log("user:", user._id.toString());
        if (passwordsMatch) return {...user, _id: user._id.toString(), success: true};
    }

    console.log('Invalid credentials');
    return {error: 'Invalid credentials', success: false};
}

export async function signOut() {
    cookies().delete(cookiename);
    return true;
}

const listDatabasesExample = async () => {
    const client = new MongoClient(process.env.MONGODB_URI);
    console.log("URI", process.env.MONGODB_URI);
    try {        
        await client.connect();
        console.log("Client connected");
        const databaseList = await client.db(DB_NAME).collection(DB_USERS).findOne({email: 'testi@hotmail.com'});//await client.db().admin().listDatabases();
        console.log("Databases:", databaseList);
        //databaseList.databases.forEach(db => console.log(`- ${db.name}`));
    }catch (error) {
        console.log("Database error", error);
    } finally {
        await client.close();
    }
}

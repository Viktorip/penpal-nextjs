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

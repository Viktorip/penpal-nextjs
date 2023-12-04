'use server'

import { z } from 'zod';
import { getUserById } from './users';
import { cookies } from 'next/headers';
import { cookiename } from '../utils/constants';


export async function signIn(credentials) {
    console.log("made it here");
    const parsedCredentials = z
        .object({ email: z.string().email(), password: z.string().min(4) })
        .safeParse(credentials);

    if (parsedCredentials.success) {
        const { email, password } = parsedCredentials.data;
        console.log("parsed credentials:", parsedCredentials.data);
        //check from db here if user exists
        //returns user object found, null if not found
        const user = await getUserById(email);
        if (!user) return null;

        const passwordsMatch = true; //do match here
        if (passwordsMatch) return user;//parsedCredentials.data; //return user here
    }

    console.log('Invalid credentials');
    return null;
}

export async function signOut() {
    cookies().delete(cookiename);
    return true;
}

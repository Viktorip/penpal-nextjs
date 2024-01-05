'use server'

import { z } from 'zod';
import { createUser, getUserById } from './users';
import { cookies } from 'next/headers';
import { cookiename } from '../utils/constants';
import bcrypt from 'bcrypt';

const hashPassword = async (password) => {
    const hashed = await bcrypt.hash(password, 10);
    return hashed;
}

export async function signIn(credentials) {
    const parsedCredentials = z
        .object({ email: z.string().email(), password: z.string().min(4) })
        .safeParse(credentials);

    if (parsedCredentials.success) {
        const { email, password } = parsedCredentials.data;

        const user = await getUserById(email);
        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);
        
        if (passwordsMatch) return user;
    }

    console.log('Invalid credentials');
    return null;
}

export async function signOut() {
    cookies().delete(cookiename);
    return true;
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
        
        const passwordsMatch = !!(password === password2);
        if (passwordsMatch) {
            const hashedPassword = await hashPassword(password);
            const user = await createUser(email, hashedPassword, fullname);
            if (!user) return null;
            console.log("success, returning new user");
            return user;
        }
        console.log('Passwords didnt match');
        return null;
        
    }

    console.log('Invalid credentials');
    return null;
}

'use server'
import { z } from 'zod';
import { getUserById } from './users';
import { cookies } from 'next/headers';
import { cookiename } from '../utils/constants';
import bcrypt from 'bcrypt';

export async function signIn(credentials) {
    const parsedCredentials = z
        .object({ email: z.string().email(), password: z.string().min(4) })
        .safeParse(credentials);
    
    if (parsedCredentials.success) {
        const { email, password } = parsedCredentials.data;
        const user = await getUserById(email);
        if (!user.success) return {error: 'Failed to get user', success: false};

        const passwordsMatch = await bcrypt.compare(password, user.password);
        
        if (passwordsMatch) return {...user, success: true};
    }

    console.log('Invalid credentials');
    return {error: 'Invalid credentials', success: false};
}

export async function signOut() {
    cookies().delete(cookiename);
    return true;
}

'use server'
import { z } from 'zod';
import { getUserByEmail } from './users';
import { cookies } from 'next/headers';
import { cookiename, jwtcookiename } from '../utils/constants';
import bcrypt from 'bcrypt';
import { createJwtToken, saveJwtTokenToCookie } from './jwt';


export async function signIn(credentials) {
    const parsedCredentials = z
        .object({ email: z.string().email(), password: z.string().min(4) })
        .safeParse(credentials);
    
    if (parsedCredentials.success) {
        const { email, password } = parsedCredentials.data;
        const user = await getUserByEmail(email);

        if (!user) return {error:'Didnt find user by email', success:false};

        const passwordsMatch = await bcrypt.compare(password, user.password);
        
        if (passwordsMatch) {
            //create jwt token
            const jwtToken = await createJwtToken(user._id.toString());
            if (!jwtToken) return {error: 'Failed to create jwt token', success: false};
            await saveJwtTokenToCookie(jwtToken);
            return {...user, _id: user._id.toString(), success: true};
        }
    }

    console.log('Invalid credentials');
    return {error: 'Invalid credentials', success: false};
}

export async function signOut() {
    cookies().delete(cookiename);
    cookies().delete(jwtcookiename);
}

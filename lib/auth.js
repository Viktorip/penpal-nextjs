'use server'
import { z } from 'zod';
import { getUserByEmail, isUserVerified } from './users';
import { cookies } from 'next/headers';
import { cookiename, jwtcookiename } from '../utils/constants';
import bcrypt from 'bcrypt';
import { createJwtToken, saveJwtTokenToCookie } from './jwt';
import { verifyRecaptcha } from './recaptcha';


export async function signIn(credentials) {
    const parsedCredentials = z
        .object({ email: z.string().email(), password: z.string().min(4) })
        .safeParse(credentials);

    if (parsedCredentials.success) {
        try {
            const { email, password } = parsedCredentials.data;
            //check recaptcha
            const captchaData = await verifyRecaptcha(credentials.token);
            /*
                captchaData {
                success: true,
                challenge_ts: '2024-01-10T11:23:56Z',
                hostname: 'localhost',
                score: 0.9
                }
            */
            if (!(captchaData.success && captchaData.score >= 0.5)) {
                //bot
                console.log("User is a bot!");
                return { error: 'Failed to register user', success: false };
            }

            const user = await getUserByEmail(email);

            if (!user) return { error: 'Didnt find user by email', success: false };

            const passwordsMatch = await bcrypt.compare(password, user.password);

            if (passwordsMatch) {
                //create jwt token
                const jwtToken = await createJwtToken(user._id.toString());
                if (!jwtToken) return { error: 'Failed to create jwt token', success: false };
                await saveJwtTokenToCookie(jwtToken);
                const verified = await isUserVerified(user._id.toString());
                return { ...user, _id: user._id.toString(), success: true, verified: verified };
            }
        } catch (error) {
            console.log('System error in signing in');
            return { error: 'System error in signing in', success: false };
        }

    }
    console.log('Invalid credentials');
    return { error: 'Invalid credentials', success: false, status: 400 };
}

export async function signOut() {
    cookies().delete(cookiename);
    cookies().delete(jwtcookiename);
}

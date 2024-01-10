'use server'
import { jwtcookiename } from '@/utils/constants';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export async function getJwtSecretKey() {
    const secret = process.env.NEXT_PUBLIC_JWT_SECRET_KEY;

    return new TextEncoder().encode(secret);
}

export async function verifyJwtToken(token) {
    try {
        const secret = await getJwtSecretKey();
        const { payload } = await jwtVerify(token, secret, {
            issuer: `${process.env.JWT_ISSUER}`,
            audience: `${process.env.JWT_AUDIENCE}`
        });
        return payload;
    } catch (error) {
        console.log('Failed to verify jwt', error);
        return null;
    }
}

export async function createJwtToken(userId, expireTime="2h") {
    const secretKey = await getJwtSecretKey();

    const jwt = await new SignJWT({
        _id: userId
    })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setIssuer(process.env.JWT_ISSUER)
        .setAudience(process.env.JWT_AUDIENCE)
        .setExpirationTime(expireTime)
        .sign(secretKey);

    return jwt;
}

export async function saveJwtTokenToCookie(token) {
    cookies().set(jwtcookiename, JSON.stringify(token), {
        path: "/",
        maxAge: 7200,
        secure: true,
        httpOnly: true,
        sameSite: true
    });
}
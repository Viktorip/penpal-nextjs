import { NextResponse } from "next/server";
import { cookiename, jwtcookiename, redirectcookiename } from "./utils/constants";
import { verifyJwtToken } from "./lib/jwt";

//req is NextRequest type
export async function middleware(request) {
    const userCookie = request.cookies.get(cookiename);
    const userId = userCookie?.value ? JSON.parse(userCookie.value)._id : null;
    const isLoggedIn = !!userId;
    const isOnInbox = !!request.nextUrl.pathname.startsWith('/inbox');
    const jwtCookie = request.cookies.get(jwtcookiename) ?? { value: null };
    const jwtToken = jwtCookie.value ? JSON.parse(jwtCookie.value) : null;

    if (isOnInbox) {
        const isVerified = jwtToken && userId ? await verifyDataFromJwt(jwtToken, userId) : false;
        if (isLoggedIn && isVerified) return NextResponse.next();
        const resp = NextResponse.redirect(new URL('/login', request.nextUrl));
        resp.cookies.set(redirectcookiename, JSON.stringify({ path: 'inbox' }), {
            path: "/",
            maxAge: 9600,
            secure: true,
            httpOnly: true,
        });

        return resp;
    }

    const isOnCompose = !!request.nextUrl.pathname.startsWith('/compose');
    if (isOnCompose) {
        const isVerified = jwtToken && userId ? await verifyDataFromJwt(jwtToken, userId) : false;
        if (isLoggedIn && isVerified) return NextResponse.next();
        const resp = NextResponse.redirect(new URL('/login', request.nextUrl));
        resp.cookies.set(redirectcookiename, JSON.stringify({ path: 'compose' }), {
            path: "/",
            maxAge: 9600,
            secure: true,
            httpOnly: true,
        });

        return resp;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
};

export async function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function verifyDataFromJwt(token, userId) {
    /*
        payload returns:
        {
            _id: '659a73b6be9a27df33b65eb5',
            iat: 1704806297,
            iss: 'kirjekaverit',
            aud: 'kirjekaveritkirjoittajat',
            exp: 1704813497
        }
    */
    const payload = await verifyJwtToken(token);
    
    if (payload) {
        const dataOk = !!(payload._id == userId && payload.iss == `${process.env.JWT_ISSUER}` && payload.aud == `${process.env.JWT_AUDIENCE}`);
        return dataOk;
    }
    return false;
}

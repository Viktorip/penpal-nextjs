import { NextResponse } from "next/server";
import { cookiename, redirectcookiename } from "./utils/constants";


//req is NextRequest type
export default function auth(request) {
    console.log("middleware auth");
    //authenticate by getting a cookie which will tell if authenticated or not
    const isLoggedIn = !!request.cookies.get(cookiename);
    const isOnInbox = !!request.nextUrl.pathname.startsWith('/inbox');
    if (isOnInbox) {
        if (isLoggedIn) return NextResponse.next();
        const resp = NextResponse.redirect(new URL('/login', request.nextUrl));
        resp.cookies.set(redirectcookiename, JSON.stringify({path:'inbox'}), {
            path: "/",
            maxAge: 9600,
            secure: true,
            httpOnly: true,
        });
        return resp;
    }

    const isOnCompose = !!request.nextUrl.pathname.startsWith('/compose');
    if (isOnCompose) {
        if (isLoggedIn) return NextResponse.next();
        const resp = NextResponse.redirect(new URL('/login', request.nextUrl));
        resp.cookies.set(redirectcookiename, JSON.stringify({path:'compose'}), {
            path: "/",
            maxAge: 9600,
            secure: true,
            httpOnly: true,
        });
        return resp;
    }

    const isOnLogout = !!request.nextUrl.pathname.startsWith('/logout');
    if (isOnLogout) {
        if (isLoggedIn) {
            
        }
    }
    
    return NextResponse.next();

}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
};

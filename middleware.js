'use server'

import { NextResponse } from "next/server";
import {cookies} from 'next/headers';
import { cookiename } from "./utils/constants";
import { isLoggedIn } from "./app/actions";

const checkLogin = () => {
    console.log("checking login in middleware");
    const user = cookies().get(cookiename);
    //console.log("got user from cookie", user);

    if (user) return true;
    return false;
}

//req is NextRequest type
export default function auth(request) {
    console.log("middleware auth");
    //authenticate by getting a cookie which will tell if authenticated or not
    const isLoggedIn = checkLogin();
    const isOnInbox = !!request.nextUrl.pathname.startsWith('/inbox');
    if (isOnInbox) {
        if (isLoggedIn) return NextResponse.next();
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }

    const isOnCompose = !!request.nextUrl.pathname.startsWith('/compose');
    if (isOnCompose) {
        if (isLoggedIn) return NextResponse.next();
        return NextResponse.redirect(new URL('/login', request.nextUrl));
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

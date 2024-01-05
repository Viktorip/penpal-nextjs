'use server'

import { registerUser, signIn, signOut } from "@/lib/auth";
import { cookies } from 'next/headers';
import { cookiename, redirectcookiename } from "@/utils/constants";
import { send } from "@/lib/letters";

export async function authenticate(formData) {
    try {
        console.log("object from entries", Object.fromEntries(formData));
        const user = await signIn(Object.fromEntries(formData));
        console.log("after formdata", user);
        if (user) {
            console.log('user is found, setting to cookie');
            console.log('previous page was:',)
            cookies().set(cookiename, JSON.stringify(user), {
                path: "/",
                maxAge: 9600,
                secure: true,
                httpOnly: true,
            });
            //check if user was redirected
            const redicookie = cookies().get(redirectcookiename);
            console.log("redicookie", redicookie);
            if (redicookie) {
                const { path } = JSON.parse(redicookie.value);
                const resp = { ...user, redirected: "/" + path };
                console.log("returning resp:", resp);
                cookies().delete(redirectcookiename);
                return resp;
            }

            return user;
        }
        return {error: 'Signing in failed.'};
    } catch (error) {
        console.log("went to error");

        return {error: error, errorMsg: 'Error while signing in.'};
    }
}

export async function register(formData) {
    console.log("registering user");
    console.log("object from entries", Object.fromEntries(formData));
    try {
        const user = await registerUser(Object.fromEntries(formData));
        if (user) {
            console.log("returning user to frontend", user);
            return user;
        }

        console.log("failed to get user", user);
        return {error: 'Failed to create user.'};
    } catch (error) {
        console.log("error", error);
        return {error: 'System error when trying to create user.'};
    }
}

export async function isLoggedIn() {
    console.log("checking login in Actions");
    const user = cookies().get(cookiename);
    //console.log("got user from cookie", user);

    if (user?.value) return JSON.parse(user.value);
    return null;
}

export async function logout() {
    try {
        console.log("running logout in Actions.js");
        const status = await signOut();
        return status;
    } catch (error) {
        throw error;
    }
}

export async function sendLetter(formData) {
    try {
        console.log("object from entries in sendLetter", Object.fromEntries(formData));
        await timeout(5000);
        const letter = await send(Object.fromEntries(formData));
        return letter;
    } catch (error) {
        throw error;
    }
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
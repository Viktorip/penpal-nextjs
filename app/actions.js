'use server'

import { signIn, signOut } from "@/lib/auth";
import {cookies} from 'next/headers';
import { cookiename } from "@/utils/constants";
import { send } from "@/lib/letters";

export async function authenticate(prevState, formData) {
    try {
        console.log("object from entries", Object.fromEntries(formData));
        const user = await signIn(Object.fromEntries(formData));
        console.log("after formdata", user);
        if (user) {
            console.log('user is found, setting to cookie');
            console.log('previous page was:', )
            cookies().set(cookiename, JSON.stringify(user), {
                path: "/",
                maxAge: 3600,
                secure: true,
                httpOnly: true,
            });
            return user;
            //redirect somehow from here??? useRouter ??? can only be used in client side though           
        }
    }catch (error) {
        console.log("went to error");
        /*
        if (error.message.includes('CredentialsSignin')) {
            return 'CredentialSignin';
        }
        */
        throw error;
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
    }catch (error){
        throw error;
    }
}

export async function sendLetter(formData) {
    try {
        console.log("object from entries in sendLetter", Object.fromEntries(formData));
        const letter = await send(Object.fromEntries(formData));
        return letter;
    }catch (error) {
        throw error;
    }
    
}
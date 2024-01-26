'use server'
import { signIn, signOut } from "@/lib/auth";
import { cookies } from 'next/headers';
import { cookiename, jwtcookiename, redirectcookiename } from "@/utils/constants";
import { send } from "@/lib/letters";
import { getUserByEmail, isUserVerified, registerUser } from "@/lib/users";

export async function authenticate(formData) {
    try {
        const user = await signIn(Object.fromEntries(formData));
        
        if (user.success) {
            delete user.password;
            cookies().set(cookiename, JSON.stringify(user), {
                path: "/",
                maxAge: 7200,
                secure: true,
                httpOnly: true,
                sameSite: "strict"
            });
            //check if user was redirected
            const redicookie = cookies().get(redirectcookiename);
            if (redicookie) {
                const { path } = JSON.parse(redicookie.value);
                const resp = { ...user, redirected: "/" + path };
                
                cookies().delete(redirectcookiename);
                return resp;
            }        
            return user;
        }else{
            console.log("Signing in failed", user.error);
            return user;
        }
        
    } catch (error) {
        console.log("System error in signing in", error);

        return {error: error, success: false};
    }
}

export async function register(formData) {
    try {
        const user = await registerUser(Object.fromEntries(formData));
        console.log("Registering returning user:", user);
        if (user?.password) delete user.password;
        return user;
    } catch (error) {
        console.log("System error in registering", error);
        return {error: 'System error when trying to create user.', success: false};
    }
}

export async function isLoggedIn() {
    const user = cookies().get(cookiename);
    
    if (user?.value) return user.value;
    return JSON.stringify({error: 'Not logged in', success: false});
}

export async function logout() {
    try {
        await signOut();
    } catch (error) {
        console.log('Failed to logout which should be impossible.', error);
    }
}

export async function sendLetter(formData) {
    try {
        const data = Object.fromEntries(formData);
        const verified = await isUserVerified(data.senderId);
        if (!verified) return {error: 'User not verified', success: false, status: 400}
        const letter = await send(data);
        return letter;
    } catch (error) {
        return {error: error, success:false, status: 500};
    }
}

export async function doesUserExist(email) {
    try {
        const user = await getUserByEmail(email);
        if (user) {
            return {success: true, status:200};
        }
        return {error:'User doesnt exist', success: false, status: 601};
    }catch (error) {
        console.log('System error in finding out if user exists');
        return {error: 'System error in trying to find user', success: false, status: 500};
    }
}

async function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
'use server'
import { endpoint } from "@/utils/constants";

export async function getUserById(id) {
    const res = await fetch(`${endpoint}/users/${id}`);
    const data = await res.json();
    const { user } = data;
    
    return user;

}

export async function createUser(email, password, fullname) {
    console.log("trying to createUser");
    try {
        const res = await fetch(`${endpoint}/users/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            },
            body: JSON.stringify({data:{email, password, fullname}})
        });
        const data = await res.json();
    
        console.log("created user");
        return data;
    } catch (error) {
        console.log("Server error failed to create user", error);
        return {error: error, success: false};
    }
    
}
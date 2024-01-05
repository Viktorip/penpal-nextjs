import { endpoint } from "@/utils/constants";
import { z } from "zod";


export async function getUserById(id) {
    const res = await fetch(`${endpoint}/users/${id}`);
    const data = await res.json();
    const { user } = data;
    
    return user;

}

export async function createUser(email, password, fullname) {
    const res = await fetch(`${endpoint}/users/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({data:{email, password, fullname}}),
        cache: 'no-store'
    });
    const data = await res.json();

    console.log("created user");
    return data;
}
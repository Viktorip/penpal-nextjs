import { endpoint } from "@/utils/constants";


export async function getUserById(id) {
    console.log("getting user by id", id);
    /*
    const user = await fetch(`${endpoint}/users/${email}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email:email}),
        cache: 'no-store'
    });
    */
    const res = await fetch(`${endpoint}/users/${id}`);
    const data = await res.json();
    const { user } = data;
    console.log("got user:", user);
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

    console.log("created user:", data);
    return data;
}
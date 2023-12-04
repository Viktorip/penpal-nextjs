import { endpoint } from "@/utils/constants";

export async function getAllLetters() {
    try {
        const res = await fetch(`${endpoint}/letters`);

        if (!res.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await res.json();
        return data;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getLettersByRecipientId(id) {
    console.log("running getlettersbyrecipientid", id);
    try {
        const res = await fetch(`${endpoint}/users/${id}/letters`); //{ cache: 'no-store' }
        console.log("got data from fetch:", res.ok);

        if (!res.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await res.json();
        return data;
    } catch (error) {
        throw new Error(error);
    }

}

export async function send(letterData) {
    try {
        console.log("Try SendLetter, letterData:", letterData);
        const res = await fetch(`${endpoint}/letters/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({data:letterData}),
            cache: 'no-store'
        });
        const data = await res.json();
        return data;
    }catch (error) {
        throw new Error(error);
    }
}
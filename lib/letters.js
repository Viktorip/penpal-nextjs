'use server'

import { endpoint } from "@/utils/constants";
import { getAllStyleIds } from "@/utils/helper";
import { z } from "zod";

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
    try {
        const res = await fetch(`${endpoint}/users/${id}/letters`); //{ cache: 'no-store' }

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
        const styleIds = getAllStyleIds();
        const parsedData = z
        .object({ 
            body: z.string().min(1), 
            recipientEmail: z.string().email(),
            senderId: z.string().min(1).max(3),
            style: z.enum(styleIds),
            optionalSender: z.string().optional(),
            optionalRecipient: z.string().optional(),
            stamp: z.string().optional()           
        })
        .safeParse(letterData);
        if (parsedData.success) {
            const res = await fetch(`${endpoint}/letters/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({data:letterData})
            });
            const data = await res.json();
            return data;
        }else{
            console.log("Send data failed parsing.");
            return {success: false, error: 'Data failed parsing'};
        }
        
    }catch (error) {
        console.log("Server error caused Fail to send() letter.");
        throw new Error(error);
    }
}
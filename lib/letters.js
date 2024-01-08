'use server'
import { getAllStyleIds } from "@/utils/helper";
import { z } from "zod";
import { getUserByEmail } from '@/lib/users';
import { DB_LETTERS, DB_NAME } from "@/utils/constants";

const { MongoClient } = require('mongodb');

const verifyRecaptcha = async (token) => {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    const response = await fetch(verificationUrl,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            },
        });

    return await response.json();
}


const saveData = async (data) => {
    const recipient = await getUserByEmail(data.recipientEmail);
    
    if (recipient && data.token) {
        const client = new MongoClient(process.env.MONGODB_URI);
        try {
            const captchaData = await verifyRecaptcha(data.token);
            
            if (!(captchaData.success && captchaData.score >= 0.5)) {
                //bot
                console.log("User is a bot!");
                return { error: 'Failed to save data', success: false };
            }
            
            const unixTimeInSeconds = Date.now();

            const newData = {
                optional_recipient: data.optionalRecipient,
                optional_sender: data.optionalSender,
                body: data.body,
                recipient_id: recipient._id.toString(),
                sender_id: data.senderId,
                style: data.style,
                stamp: data.stamp,
                timestamp: unixTimeInSeconds
            };
            console.log("Saving newData", newData);
            await client.connect();
            const result = await client.db(DB_NAME).collection(DB_LETTERS).insertOne(newData); 
            console.log("result of creating letter", result);           
            return { _id: result.insertedId.toString(), success: true };
        } catch (error) {
            console.log("Error writing data to file at letters/send");
        }finally {
            await client.close();
        }
    }

    return { error: 'Failed to save data', success:false };
}

export async function send(letterData) {
    try {
        const styleIds = getAllStyleIds();
        console.log("Got letterdata", letterData);
        const parsedData = z
        .object({ 
            body: z.string().min(1), 
            recipientEmail: z.string().email(),
            senderId: z.string().min(12).max(64),
            style: z.enum(styleIds),
            optionalSender: z.string().optional(),
            optionalRecipient: z.string().optional(),
            stamp: z.string().optional()           
        })
        .safeParse(letterData);
        if (parsedData.success) {           
            const data = await saveData(letterData);
            console.log("Returning to frontend:", data);
            return data;
        }else{
            console.log("Send data failed parsing.");
            return {success: false, error: 'Data failed parsing'};
        }
        
    }catch (error) {
        console.log("Server error caused Fail to send() letter.");
        return {error: error, success:false};
    }
}
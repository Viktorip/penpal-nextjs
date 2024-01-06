'use server'
import { getAllStyleIds } from "@/utils/helper";
import { z } from "zod";
import fsPromises from 'fs/promises';
import path from 'path';
import { getUserById } from '@/lib/users';

const dataFilePath = path.join(process.cwd(), 'data/letters_data.json');

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
    console.log("savedata data:", data);
    const recipient = await getUserById(data.recipientEmail);
    console.log("saveData recipient", recipient);
    console.log("path to write:", dataFilePath);
    if (recipient.success && data.token) {
        try {
            const captchaData = await verifyRecaptcha(data.token);
            
            if (!(captchaData.success && captchaData.score >= 0.5)) {
                //bot
                console.log("User is a bot!");
                return { error: 'Failed to save data', success: false };
            }

            const jsonDataFromFile = await fsPromises.readFile(dataFilePath);
            const objectData = JSON.parse(jsonDataFromFile);
            let nextId = objectData.data.reduce((a, b) => Math.max(a, b.id), 0) || 0;
            
            const unixTimeInSeconds = Date.now();

            const newData = {
                id: ++nextId,
                optional_recipient: data.optionalRecipient,
                optional_sender: data.optionalSender,
                body: data.body,
                recipient_id: recipient.id,
                sender_id: parseInt(data.senderId, 10),
                style: data.style,
                stamp: data.stamp,
                timestamp: unixTimeInSeconds
            };

            objectData.data.push(newData);

            const updatedData = JSON.stringify(objectData, null, 2);
            await fsPromises.writeFile(dataFilePath, updatedData);
            return { ...newData, success: true };
        } catch (error) {
            console.log("Error writing data to file at letters/send");
        }

    }

    return { error: 'Failed to save data', success:false };
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
            const data = await saveData(letterData);
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
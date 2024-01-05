import fsPromises from 'fs/promises';
import path from 'path';
import { getUserById } from '@/lib/users';
import { NextResponse } from 'next/server';

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

export async function POST(req, { params }) {
    const { data } = await req.json();
    
    const recipient = await getUserById(data.recipientEmail);

    if (recipient?.id && data.token) {
        try {
            const captchaData = await verifyRecaptcha(data.token);
            
            if (!(captchaData.success && captchaData.score >= 0.5)) {
                //bot
                console.log("User is a bot!");
                return NextResponse.json({ error: 'Failed to save data', success: false });
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
            return NextResponse.json({ ...newData, success: true });
        } catch (error) {
            console.log("Error writing data to file at letters/send");
        }

    }

    return NextResponse.json({ error: 'Failed to save data', success:false });
}
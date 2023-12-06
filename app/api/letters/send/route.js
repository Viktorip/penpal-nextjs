const fs = require('fs');
import fsPromises from 'fs/promises';
import path from 'path';
import letters from '@/data/letters_data';
import { getUserById } from '@/lib/users';
import { NextResponse } from 'next/server';

const dataFilePath = path.join(process.cwd(), 'data/letters_data.json');

export async function GET(req, {params}) {


}

export async function POST(req, {params}) {
    const {data} = await req.json();
    console.log("running POST on letters/send");
    const recipient = await getUserById(data.recipientEmail);

    if (recipient?.id) {
        try {
            const jsonDataFromFile = await fsPromises.readFile(dataFilePath);
            const objectData = JSON.parse(jsonDataFromFile);
            let nextId = objectData.data.reduce((a,b) => Math.max(a,b.id), 0);
            console.log("nextId is:", nextId);
    
            const newData = {
                id: ++nextId,
                title: data.title,
                body: data.body,
                recipient_id: recipient.id,
                sender_id: parseInt(data.senderId, 10),
                style: data.style
            };
    
            console.log("created newData to insert:", newData);
    
            objectData.data.push(newData);
    
            const updatedData = JSON.stringify(objectData, null, 2);
            await fsPromises.writeFile(dataFilePath, updatedData);
            return NextResponse.json({newData});
        }catch (error) {
            console.log("Error writing data to file at letters/send");

        }
        
    }

    return NextResponse.json({error:'Failed to save data'});
}
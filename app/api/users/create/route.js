const fs = require('fs');
import fsPromises from 'fs/promises';
import path from 'path';
import letters from '@/data/letters_data';
import { NextResponse } from 'next/server';

const dataFilePath = path.join(process.cwd(), 'data/users_data.json');

export async function POST(req, {params}) {
    const {data} = await req.json();
    console.log("running POST on users/create", data);
    const { email, password, fullname } = data;
    if (email && password && fullname) {
        try {
            const jsonDataFromFile = await fsPromises.readFile(dataFilePath);
            const objectData = JSON.parse(jsonDataFromFile);
            let nextId = objectData.data.reduce((a,b) => Math.max(a,b.id), 0) || 0;
            console.log("nextId is:", nextId);
            const unixTimeInSeconds = Date.now();
    
            const newData = {
                id: ++nextId,
                email: email,
                password: password,
                fullname: fullname,
                created: unixTimeInSeconds
            };
    
            console.log("created newData to insert:", newData);
    
            objectData.data.push(newData);
    
            const updatedData = JSON.stringify(objectData, null, 2);
            await fsPromises.writeFile(dataFilePath, updatedData);
            return NextResponse.json({...newData});
        }catch (error) {
            console.log("Error writing data to file at letters/send");
        }
        
    }

    return NextResponse.json({error:'Failed to save data'});
}
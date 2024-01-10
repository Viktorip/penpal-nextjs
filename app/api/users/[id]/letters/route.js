import { DB_LETTERS, DB_NAME } from '@/utils/constants';
import { NextResponse } from 'next/server';

const { MongoClient } = require('mongodb');

export async function GET(req, {params}) {
    const client = new MongoClient(process.env.MONGODB_URI);
    
    try {
        await client.connect();
        const cursor = client.db(DB_NAME).collection(DB_LETTERS).find({ recipient_id: params.id }).sort({ timestamp: 1});
        const letters = await cursor.toArray(); 

        if (letters) {
            return NextResponse.json({data: letters, success: true, status:"200"});
        }
        return NextResponse.json({error: 'No letters found', success: false, status: "404"});      
    }catch (error) {
        console.log("Error with database connection in getting letters", params.id);
        return NextResponse.json({error: 'Server error with getting letters', success: false, status: "500"});
    }finally {
        await client.close();
    }
}
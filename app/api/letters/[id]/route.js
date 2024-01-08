import { DB_LETTERS, DB_NAME } from '@/utils/constants';
import { NextResponse } from 'next/server';

const { MongoClient, ObjectId } = require('mongodb');

export async function GET(req, {params}) {
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        await client.connect();
        const mongo_id = new ObjectId(params.id);
        const letter = await client.db(DB_NAME).collection(DB_LETTERS).findOne({_id:mongo_id});

        if (!letter) {
            return NextResponse.json({error:'Letter not found', status: 404});
        }

        return NextResponse.json({data: letter, success: true, status: 200});
    }catch (error) {
        console.log("Getting letter server error", error);
        return NextResponse.json({error:'Server error in getting letter', status: 500});
    }finally {
        await client.close();
    }
}
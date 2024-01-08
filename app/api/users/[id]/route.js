import { NextResponse } from "next/server";
import { DB_NAME, DB_USERS } from "@/utils/constants";

const { MongoClient, ObjectId } = require('mongodb');

export async function GET(req, {params}) {
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        await client.connect();
        const mongo_id = new ObjectId(params.id);
        const user = await client.db(DB_NAME).collection(DB_USERS).findOne({_id:mongo_id});

        if (!user) {
            return NextResponse.json({error:'User not found', status: 404});
        }

        return NextResponse.json({data: user, success: true, status: 200});
    }catch (error) {
        console.log("Getting user server error", error);
        return NextResponse.json({error:'Server error in getting user', status: 500});
    }finally {
        await client.close();
    }
}

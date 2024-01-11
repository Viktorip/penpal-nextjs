import { verifyJwtToken } from '@/lib/jwt';
import { DB_LETTERS, DB_NAME, cookiename, jwtcookiename } from '@/utils/constants';
import { NextResponse } from 'next/server';

const { MongoClient } = require('mongodb');

export async function GET(req, { params }) {
    const client = new MongoClient(process.env.MONGODB_URI);
    const userCookie = req.cookies.get(cookiename);
    const jwtCookie = req.cookies.get(jwtcookiename);

    try {
        const token = JSON.parse(jwtCookie.value);
        const user = JSON.parse(userCookie.value);
        const payload = await verifyJwtToken(token);

        if (!(user?._id === payload?._id)) {
            console.log('User id does not match. Access denied.');
            return NextResponse.json({ error: 'Access denied', success: false, status: 403 });
        }

        await client.connect();
        const cursor = client.db(DB_NAME).collection(DB_LETTERS).find({ recipient_id: params.id }).sort({ timestamp: 1 });
        const letters = await cursor.toArray();

        if (letters) {
            return NextResponse.json({ data: letters, success: true, status: "200" });
        }
        return NextResponse.json({ error: 'No letters found', success: false, status: "404" });
    } catch (error) {
        console.log("Error with database connection in getting letters", params.id);
        return NextResponse.json({ error: 'Server error with getting letters', success: false, status: "500" });
    } finally {
        await client.close();
    }
}
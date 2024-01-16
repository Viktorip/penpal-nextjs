import { verifyJwtToken } from '@/lib/jwt';
import { DB_ADDRESSBOOK, DB_NAME, DB_USERS, cookiename, jwtcookiename } from '@/utils/constants';
import { NextResponse } from 'next/server';

const { MongoClient, ObjectId } = require('mongodb');

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
        const result = await client.db(DB_NAME).collection(DB_ADDRESSBOOK).findOne({ owner: user._id });

        if (result) {
            const objIds = result.users.map(id => new ObjectId(id));
            const cursor = client.db(DB_NAME).collection(DB_USERS).find({
                _id: { $in: objIds }
            });
            const users = await cursor.toArray();
            const filteredUserData = users.map(u => ({email:u.email,fullname:u.fullname}));
            return NextResponse.json({ data: filteredUserData, visibility: result.visibility, success: true, status: "200" });
        }
        return NextResponse.json({ error: 'No addressbook found', success: false, status: "404" });
    } catch (error) {
        console.log("Error with database connection in getting addressbook", params.id);
        return NextResponse.json({ error: 'Server error with getting addressbook', success: false, status: "500" });
    } finally {
        await client.close();
    }
}
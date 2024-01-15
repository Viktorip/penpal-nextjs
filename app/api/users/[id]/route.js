import { NextResponse } from "next/server";
import { DB_NAME, DB_USERS, cookiename, jwtcookiename } from "@/utils/constants";
import { verifyJwtToken } from "@/lib/jwt";

const { MongoClient, ObjectId } = require('mongodb');

export async function GET(req, {params}) {
    const client = new MongoClient(process.env.MONGODB_URI);
    const userCookie = req.cookies.get(cookiename);
    const jwtCookie = req.cookies.get(jwtcookiename);

    try {
        //only users who are logged in should request user info based on ID
        //currently used to get sender info on a letter
        const token = JSON.parse(jwtCookie.value);
        const userc = JSON.parse(userCookie.value);
        const payload = await verifyJwtToken(token);

        if (!(userc?._id === payload?._id)) {
            console.log('User id does not match. Access denied.');
            return NextResponse.json({ error: 'Access denied', success: false, status: 403 });
        }

        await client.connect();
        const mongo_id = new ObjectId(params.id);
        const user = await client.db(DB_NAME).collection(DB_USERS).findOne({_id:mongo_id});

        if (!user) {
            return NextResponse.json({error:'User not found', status: 404});
        }
        //return only relavant info
        const filter_user = {
            email: user.email,
            fullname: user.fullname
        };
        
        return NextResponse.json({data: filter_user, success: true, status: 200});
    }catch (error) {
        console.log("Getting user server error", error);
        return NextResponse.json({error:'Server error in getting user', status: 500});
    }finally {
        await client.close();
    }
}

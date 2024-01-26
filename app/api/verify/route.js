import { isUserVerified } from "@/lib/users";
import { DB_NAME, DB_VERIFY, cookiename } from "@/utils/constants";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


const { MongoClient, ObjectId } = require('mongodb');

export async function POST(req, { params }) {
    const body = await req.json();
    const { userId, verifyId } = body;
    /*
        expected body: {
            userId: id,
            verifyId: id,
        }
    */
    if (!(userId && verifyId)) {
        console.log("No userId and verifyId gotten. Exiting.");
        return NextResponse.json({ success: false, status: 400 });
    }
    try {
        const isVerifiedAlready = await isUserVerified(userId);
        if (isVerifiedAlready) {
            console.log("Is already verified");
            const updatedUser = await updateCookie();
            return NextResponse.json({ success: true, status: 201, user: updatedUser });
        }

        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        const mongo_id = new ObjectId(verifyId);
        const result = await client.db(DB_NAME).collection(DB_VERIFY).findOne({ _id: mongo_id });
        if (result) {
            const ownerId = result?.owner.toString();
            if (userId === ownerId) {
                const verified = await client.db(DB_NAME).collection(DB_VERIFY).updateOne({ _id: mongo_id }, { $set: { verified: Date.now() } });
                if (verified) {
                    const updatedUser = await updateCookie();
                    return NextResponse.json({ success: true, status: 200, user: updatedUser });
                }
            }
        }
        console.log("Got no result, returning error", result);
        return NextResponse.json({ success: false, status: 400 });

    } catch (error) {
        console.log("Server error in verifying user");
        return NextResponse.json({ success: false, status: 500 });
    }
}

async function updateCookie() {
    console.log("running updateCookie")
    const userCookie = cookies().get(cookiename);
    const user = JSON.parse(userCookie.value);
    console.log("user value is:", user);
    const updatedUser = {...user, verified: true};
    cookies().set(cookiename, JSON.stringify(updatedUser), {
        path: "/",
        maxAge: 7200,
        secure: true,
        httpOnly: true,
        sameSite: "strict"
    });

    return updatedUser;
}
async function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
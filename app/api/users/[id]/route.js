import { NextResponse } from "next/server";
import users from '@/data/users_data';


export async function GET(req, {params}) {
    console.log("running GET in users/:id, params:", params);
    const user = users.data.find(item => item.email === params.id) || users.data.find(item => parseInt(item.id, 10) === parseInt(params.id, 10));
    console.log("found user:", user);
    return NextResponse.json({user});
}

/*
export async function POST(req, {params}) {
    const data = await req.json();
    console.log("running POST on users/:id, params:", params);
    const user = users.data.find(item => item.email === data.email);
    return NextResponse.json({user});
}
*/
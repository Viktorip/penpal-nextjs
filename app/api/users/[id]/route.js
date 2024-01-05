import { NextResponse } from "next/server";
import users from '@/data/users_data';


export async function GET(req, {params}) {
    const user = users.data.find(item => item.email === params.id) || users.data.find(item => parseInt(item.id, 10) === parseInt(params.id, 10));
    
    return NextResponse.json({user});
}

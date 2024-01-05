import letters from '@/data/letters_data';
import { NextResponse } from 'next/server';


export async function GET(req, {params}) {
    const user_letters = letters.data.filter(item => parseInt(item.recipient_id, 10) === parseInt(params.id, 10));
    
    return NextResponse.json({"letters":user_letters}, {status: "200"});
}
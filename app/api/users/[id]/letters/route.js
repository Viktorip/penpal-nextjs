import letters from '@/data/letters_data';
import { NextResponse } from 'next/server';


export async function GET(req, {params}) {
    console.log("Getting user/:id/letters, params:", params);
    const user_letters = letters.data.filter(item => parseInt(item.recipient_id, 10) === parseInt(params.id, 10));
    
    return NextResponse.json({"letters":user_letters}, {status: "200"});
    /*
    try {
        const user_letters = letters.data.filter(item => item.recipient_id === params.id);
        
        if (!user_letters.length) {
            return new NextResponse.json({status: 404});
        }
        const mapped_letters = user_letters.map(item => ({id: item.id, sender_id: item.sender_id, title: item.title}));
        console.log("mapped letters:", mapped_letters);
        return new NextResponse.json({letters:mapped_letters});
    }catch(error) {
        throw new Error(error);
    }
    */
}
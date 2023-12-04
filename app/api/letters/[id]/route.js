import letters from '@/data/letters_data';
import { NextResponse } from 'next/server';


export async function GET(req, {params}) {
    try {
        const letter = letters.data.find(item => parseInt(item.id, 10) === parseInt(params.id, 10));

        if (!letter) {
            return NextResponse({error:'Letter not found', status: 404});
        }

        return NextResponse.json({letter});
    }catch (error) {
        throw new Error(error);
    }
}
import letters from '@/data/letters_data';

import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({letters: letters.data});
}
import users from '@/data/users_data';

import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({users: users.data});
}
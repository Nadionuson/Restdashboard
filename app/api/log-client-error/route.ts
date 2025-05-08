// app/api/log-client-error/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const errorData = await req.json();

    console.log('🔔 Client Error Received:', errorData);

    // Optionally save to a database or external logging service
    // await saveErrorToDB(errorData);

    return NextResponse.json({ message: 'Logged' });
  } catch (error) {
    console.error('Error logging client-side error:', error);
    return NextResponse.json({ message: 'Failed to log' }, { status: 500 });
  }
}

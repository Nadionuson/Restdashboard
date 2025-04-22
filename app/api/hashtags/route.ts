// app/api/hashtags/route.ts
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const hashtags = await prisma.hashtag.findMany();
    
    return NextResponse.json(hashtags);
  } catch (error) {
    console.error('Failed to fetch hashtags:', error);
    return NextResponse.json({ error: 'Failed to fetch hashtags' }, { status: 500 });
  }
}

// app/api/locations/route.ts
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

// GET distinct locations
export async function GET() {
  try {
    const locations = await prisma.restaurant.findMany({
      distinct: ['city'],
      select: {
        location: true,
      },
    })

    // Extract and return only the unique locations
    const locationList = locations.map((restaurant) => restaurant.city);
    return NextResponse.json(locationList);
  } catch (error) {
    console.error('Failed to fetch locations:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

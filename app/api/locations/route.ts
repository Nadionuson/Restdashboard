// app/api/locations/route.ts
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

// GET distinct locations
export async function GET() {
  try {
    const cities: { city: string }[] = await prisma.restaurant.findMany({
      distinct: ['city'],
      select: { city: true },
    })

    // Extract and return only the unique cities
    const cityList = cities.map((restaurant) => restaurant.city);
    return NextResponse.json(cityList);
  } catch (error) { 
    console.error('Failed to fetch locations:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

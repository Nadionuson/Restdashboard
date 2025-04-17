import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

// GET all restaurants
export async function GET() {
  const restaurants = await prisma.restaurant.findMany({
    include: { evaluation: true }
  })
  return NextResponse.json(restaurants)
}

// POST create new restaurant
export async function POST(req: Request) {
  const data = await req.json()

  console.log("Creating new restaurant:", data);
  const restaurant = await prisma.restaurant.create({
    data: {
      name: data.name,
      location: data.location,
      status: data.status,
      highlights: data.highlights,
      evaluation: {
        create: {
          locationRating: data.evaluation.locationRating,
          serviceRating: data.evaluation.serviceRating,
          priceQualityRating: data.evaluation.priceQualityRating,
          foodQualityRating: data.evaluation.foodQualityRating,
          atmosphereRating: data.evaluation.atmosphereRating,
          finalEvaluation: data.evaluation.finalEvaluation,
        },
      },
    },
    include: { evaluation: true }
  })

  return NextResponse.json({
    message: 'Restaurant created!',
    created: restaurant,
  });
  
}

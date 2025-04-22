import { PrismaClient } from '@prisma/client'
import { Trykker } from 'next/font/google'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

// GET all restaurants
export async function GET() {
  const restaurants = await prisma.restaurant.findMany({
    include: { evaluation: true, hashtags: true }
  })

  return NextResponse.json(restaurants)
}

// POST create new restaurant
export async function POST(req: Request) {
  const data = await req.json();

  try {
    const {
      name,
      location,
      status,
      highlights,
      lastVisitedDate,
      evaluation,
      hashtags,
    } = data;

    console.log("Creating new restaurant:", data);

    const restaurant = await prisma.restaurant.create({
      data: {
        name: data.name,
        location: data.location,
        status: data.status,
        highlights: data.highlights,
        lastVisitedDate: data.lastVisitedDate ? new Date(data.lastVisitedDate) : null,
        hashtags: {
          connectOrCreate: hashtags.map((tag: { name: string }) => ({
            where: { name: tag.name.toLowerCase().trim() },
            create: { name: tag.name.toLowerCase().trim() },  // Fixed here with the parentheses
          })),
        },
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
      include: { hashtags: true, evaluation: true }
    });

    return NextResponse.json({
      message: 'Restaurant created!',
      created: restaurant,
    });
  } catch (error) {
    console.error('[POST /api/restaurants]', error);
    return NextResponse.json({ error: 'Failed to create restaurant' }, { status: 500 });
  }
}


import { PrismaClient } from '@prisma/client'
import { Console } from 'console'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

// PUT: update a restaurant
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const id = parseInt(context.params.id)
  const data = await req.json()

  try {
    const updated = await prisma.restaurant.update({
      where: { id },
      data: {
        name: data.name,
        location: data.location,
        status: data.status,
        highlights: data.highlights,
        lastVisitedDate: data.lastVisitedDate ? new Date(data.lastVisitedDate) : null,
        evaluation: {
          update: {
            locationRating: data.evaluation.locationRating,
            serviceRating: data.evaluation.serviceRating,
            priceQualityRating: data.evaluation.priceQualityRating,
            foodQualityRating: data.evaluation.foodQualityRating,
            atmosphereRating: data.evaluation.atmosphereRating,
            finalEvaluation: data.evaluation.finalEvaluation,
          },
        },
      },
      include: { evaluation: true },
    })

    return NextResponse.json({ message: `Restaurant ${id} updated`, data: updated })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update restaurant' }, { status: 500 })
  }
}

// DELETE: delete a restaurant
export async function DELETE(
  _req: NextRequest,
  context: { params: { id: string } }
) {
  const id = parseInt(context.params.id)

  try {
    await prisma.evaluation.deleteMany({ where: { restaurantId: id } })
    await prisma.restaurant.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to delete restaurant' }, { status: 500 })
  }
}

// GET one restaurant by ID
export async function GET(req: Request, context: { params: { id: string }} ) {
  
  const id = parseInt(context.params.id);

  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    include: { evaluation: true },
  });

  if (!restaurant) {
    return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
  }

  return NextResponse.json(restaurant);
}
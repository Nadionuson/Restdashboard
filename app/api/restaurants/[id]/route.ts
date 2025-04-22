import { PrismaClient } from '@prisma/client'
import { Console } from 'console'
import { NextRequest, NextResponse } from 'next/server'


const prisma = new PrismaClient()

type Context = {
  params: {
    id: string;
  };
};

// PUT: update a restaurant
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const restaurantId = parseInt(params.id);
  const data = await req.json();

  try {
    const updated = await prisma.restaurant.update({
      where: { id: restaurantId },
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
        hashtags: {
          connectOrCreate: data.hashtags.map((tag: { name: string }) => ({
            where: {
              name: tag.name.toLowerCase().trim(),
            },
            create: {
              name: tag.name.toLowerCase().trim(),
            },
          })),
        },
      },
      include: { evaluation: true, hashtags: true },
    });

    return NextResponse.json({
      message: `Restaurant ${restaurantId} updated`,
      data: updated,
    });
  } catch (error) {
    console.error('[PUT /api/restaurants/[id]]', error);
    return NextResponse.json(
      { error: 'Failed to update restaurant' },
      { status: 500 }
    );
  }
}


// DELETE: delete a restaurant and its related records, but keep hashtags
export async function DELETE(
  _req: NextRequest,
  context: { params: { id: string } }
) {
  const id = parseInt(context.params.id)

  try {
    // Step 1: Disconnect the restaurant from its hashtags using their IDs
    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
      include: { hashtags: true }, // Fetch the associated hashtags
    });

    if (restaurant && restaurant.hashtags) {
      // Disconnect hashtags by their IDs
      await prisma.restaurant.update({
        where: { id },
        data: {
          hashtags: {
            disconnect: restaurant.hashtags.map((hashtag) => ({
              id: hashtag.id,
            })),
          },
        },
      });
    }

    // Step 2: Delete the restaurant's associated evaluation and the restaurant itself
    await prisma.evaluation.deleteMany({ where: { restaurantId: id } });
    const deletedRestaurant = await prisma.restaurant.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, deleted: deletedRestaurant });
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
    include: { evaluation: true, hashtags: true },
  });

  if (!restaurant) {
    return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
  }

  return NextResponse.json(restaurant);
}
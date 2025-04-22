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
    // Fetch the current hashtags of the restaurant
    const currentRestaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      include: { hashtags: true },
    });

    const currentHashtagNames = currentRestaurant?.hashtags.map((tag) => tag.name.toLowerCase().trim()) || [];
    const newHashtags = data.hashtags.map((tag: { name: string }) => tag.name.toLowerCase().trim());

    // 1. Determine hashtags to create (new hashtags not in the current list)
    const hashtagsToCreate = newHashtags.filter((tag: string) => !currentHashtagNames.includes(tag));
    
    // 2. Determine hashtags to connect (hashtags that are already in the database)
    const hashtagsToConnect = newHashtags.filter((tag: string) => currentHashtagNames.includes(tag));

    // 3. Determine hashtags to disconnect (hashtags that should no longer be associated with the restaurant)
    const hashtagsToDisconnect = currentHashtagNames.filter((tag) => !newHashtags.includes(tag));

    // First, create the new hashtags that don't exist in the database
    const createdHashtags = await Promise.all(
      hashtagsToCreate.map(async (name: any) => {
        const existingHashtag = await prisma.hashtag.findUnique({
          where: { name },
        });

        // If the hashtag doesn't exist, create it
        if (!existingHashtag) {
          return await prisma.hashtag.create({
            data: {
              name,
            },
          });
        }
        return existingHashtag;
      })
    );

    // Proceed with updating the restaurant
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
        // Manage hashtags: connect existing ones by name and newly created hashtags by id
        hashtags: {
          connect: [
            ...hashtagsToConnect.map((name: any) => ({ name })), // Connect by name
            ...createdHashtags.map((tag) => ({ id: tag.id })), // Connect by id for newly created hashtags
          ],
          disconnect: hashtagsToDisconnect.map((name) => ({ name })),
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
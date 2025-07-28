import { PrismaClient, PrivacyLevel } from '@prisma/client';
import { Console } from 'console';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET: Retrieve a restaurant by ID
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const restaurantId = parseInt(id, 10);

  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    include: { evaluation: true, hashtags: true },
  });

  if (!restaurant) {
    return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
  }

  return NextResponse.json(restaurant);
}

// PUT: Update a restaurant
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const restaurantId = parseInt(id, 10);
  const data = await req.json();
  console.log("passou");
  
  
  try {
    const currentRestaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      include: { hashtags: true },
    });

    const currentHashtagNames =
      currentRestaurant?.hashtags.map((tag) => tag.name.toLowerCase().trim()) || [];
    const newHashtags = data.hashtags.map((tag: { name: string }) =>
      tag.name.toLowerCase().trim()
    );

    const hashtagsToCreate = newHashtags.filter(
      (tag: string) => !currentHashtagNames.includes(tag)
    );
    const hashtagsToConnect = newHashtags.filter((tag: string) =>
      currentHashtagNames.includes(tag)
    );
    const hashtagsToDisconnect = currentHashtagNames.filter(
      (tag) => !newHashtags.includes(tag)
    );

    const createdHashtags = await Promise.all(
      hashtagsToCreate.map(async (name: string) => {
        const existingHashtag = await prisma.hashtag.findUnique({
          where: { name },
        });

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

    const updated = await prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        name: data.name,
        city: data.city,
        detailedLocation: data.detailedLocation || data.city,
        status: data.status,
        highlights: data.highlights,
        privacyLevel: data.privacyLevel,
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
          connect: [
            ...hashtagsToConnect.map((name: string) => ({ name })),
            ...createdHashtags.map((tag) => ({ id: tag.id })),
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
    return NextResponse.json({ error: 'Failed to update restaurant' }, { status: 500 });
  }
}

// DELETE: Delete a restaurant and its related records, but keep hashtags
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const restaurantId = parseInt(id, 10);

  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      include: { hashtags: true },
    });

    if (restaurant && restaurant.hashtags) {
      await prisma.restaurant.update({
        where: { id: restaurantId },
        data: {
          hashtags: {
            disconnect: restaurant.hashtags.map((hashtag) => ({
              id: hashtag.id,
            })),
          },
        },
      });
    }

    await prisma.evaluation.deleteMany({ where: { restaurantId } });
    const deletedRestaurant = await prisma.restaurant.delete({
      where: { id: restaurantId },
    });

    return NextResponse.json({ success: true, deleted: deletedRestaurant });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete restaurant' }, { status: 500 });
  }
}

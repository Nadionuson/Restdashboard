import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

type HashtagInput = { name: string };

// GET: Retrieve a restaurant by ID
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const restaurantId = parseInt(id, 10);

  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    include: {
      evaluation: true,
      hashtags: true,
      contactDetail: true, // ✅ match your Prisma field name exactly
    },
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

  try {
    const currentRestaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      include: { hashtags: true, contactDetail: true },
    });

    const currentHashtagNames =
      currentRestaurant?.hashtags.map((tag) => tag.name.toLowerCase().trim()) || [];

    const newHashtags = data.hashtags.map((tag: HashtagInput) =>
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
      hashtagsToCreate.map(async (name: any) => {
        const existing = await prisma.hashtag.findUnique({ where: { name } });
        return existing ?? await prisma.hashtag.create({ data: { name } });
      })
    );
console.log('data:', data);
    const updated = await prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        name: data.name,
        city: data.city,
        neighborhood: data.neighborhood || data.city,
        status: data.status,
        highlights: data.highlights,
        privacyLevel: data.privacyLevel,
        contactDetail: currentRestaurant?.contactDetail
          ? {
              update: {
                phoneNumber: data.contactDetail.phone,
                website: data.contactDetail.website,
                address: data.contactDetail.address,
                latitude: data.contactDetail.latitude,
                longitude: data.contactDetail.longitude,
                openingHours: data.contactDetail.openingHours,
              },
            }
          : {
              create: {
                phoneNumber: data.contactDetail.phone,
                website: data.contactDetail.website,
                address: data.contactDetail.address,
                latitude: data.contactDetail.latitude,
                longitude: data.contactDetail.longitude,
                openingHours: data.contactDetail.openingHours,
              },
            },
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
            ...hashtagsToConnect.map((name: any) => ({ name })),
            ...createdHashtags.map((tag) => ({ id: tag.id })),
          ],
          disconnect: hashtagsToDisconnect.map((name) => ({ name })),
        },
      },
      include: { evaluation: true, hashtags: true, contactDetail: true },
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

    if (restaurant?.hashtags?.length) {
      await prisma.restaurant.update({
        where: { id: restaurantId },
        data: {
          hashtags: {
            disconnect: restaurant.hashtags.map((tag) => ({ id: tag.id })),
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
    console.error('[DELETE /api/restaurants/[id]]', error);
    return NextResponse.json({ error: 'Failed to delete restaurant' }, { status: 500 });
  }
}

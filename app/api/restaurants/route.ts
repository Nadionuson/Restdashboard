  import { PrismaClient } from '@prisma/client'
  import { NextResponse } from 'next/server'
  import { getServerSession } from 'next-auth';
  import { authOptions } from '../auth/[...nextauth]/authOptions';


  const prisma = new PrismaClient()

  // GET all restaurants
  export async function GET() {
    
    const session = await getServerSession(authOptions);

    const userId = session?.user?.id; 
    
    const restaurants = await prisma.restaurant.findMany({
      where:{
        OR: [
          { ownerId: Number(userId) },          // Your own
          { privacyLevel : "PUBLIC" }                   // Public others
        ]
      },
      include: { 
        evaluation: true, 
        hashtags: true, 
        owner: {
          select: {
            email: true,
            id: true,
            username: true, 
          }
        }
      }
    })

    return NextResponse.json(restaurants)
  }

  // POST create new restaurant
  export async function POST(req: Request) {
    
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await req.json();

    try {

      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }


      const {
        name,
        city,
        neighborhood,
        status,
        highlights,
        evaluation,
        hashtags,
      } = data;

      console.log("Creating new restaurant:", data);

      const restaurant = await prisma.restaurant.create({
        data: {
          name: data.name,
          city: data.city,
          neighborhood: data.neighborhood || data.city,  // Handle optional neighborhood
          status: data.status,
          highlights: data.highlights,
          ownerId: user.id,
          privacyLevel: data.private ?? "PUBLIC",
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


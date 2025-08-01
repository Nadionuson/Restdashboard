// app/api/friends/list/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

interface FriendUser {
  id: number;
  username: string;
  email: string | null;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Find current user id by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find accepted friendships where current user is requester or addressee
    const acceptedFriendships = await prisma.friend.findMany({
      where: {
        status: 'accepted',
        OR: [
          { requesterId: user.id },
          { addresseeId: user.id },
        ],
      },
      select: {
        requester: { select: { id: true, username: true, email: true } },
        addressee: { select: { id: true, username: true, email: true } },
      },
    });

    // Map to list of friend users (the other user in each friendship)
    const friends: FriendUser[] = acceptedFriendships.map(friendship => {
      if (friendship.requester.id === user.id) {
        return friendship.addressee;
      }
      return friendship.requester;
    });

    return NextResponse.json(friends);
  } catch (error) {
    console.error('Friends list API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// app/api/friends/list/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get current user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = user.id;

    // Accepted friends (bidirectional)
    const acceptedFriendships = await prisma.friend.findMany({
      where: {
        status: 'accepted',
        OR: [
          { requesterId: userId },
          { addresseeId: userId },
        ],
      },
      select: {
        requester: { select: { id: true, username: true, email: true } },
        addressee: { select: { id: true, username: true, email: true } },
      },
    });

    const friends = acceptedFriendships.map(f =>
      f.requester.id === userId ? f.addressee : f.requester
    );

    // Incoming requests (someone sent to me)
    const incomingRequests = await prisma.friend.findMany({
      where: {
        status: 'pending',
        addresseeId: userId,
      },
      select: {
        requester: { select: { id: true, username: true, email: true } },
      },
    });

    // Sent requests (I sent to someone)
    const sentRequests = await prisma.friend.findMany({
      where: {
        status: 'pending',
        requesterId: userId,
      },
      select: {
        addressee: { select: { id: true, username: true, email: true } },
      },
    });

    return NextResponse.json({
      friends,
      incomingRequests: incomingRequests.map(f => f.requester),
      sentRequests: sentRequests.map(f => f.addressee),
    });
  } catch (error) {
    console.error('Friends list API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

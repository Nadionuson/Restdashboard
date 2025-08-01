import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const fromUserId = body.fromUserId;
  if (!fromUserId || typeof fromUserId !== 'number') {
    return NextResponse.json({ error: 'Invalid "fromUserId"' }, { status: 400 });
  }

  try {
    const toUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!toUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const request = await prisma.friend.findFirst({
      where: {
        requesterId: fromUserId,
        addresseeId: toUser.id,
        status: 'pending',
      },
    });

    if (!request) {
      return NextResponse.json({ error: 'Friend request not found' }, { status: 404 });
    }

    await prisma.friend.delete({
      where: { id: request.id },
    });

    return NextResponse.json({ message: 'Friend request declined' });
  } catch (error) {
    console.error('Decline friend request API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

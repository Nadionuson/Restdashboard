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
  const toUserId = body.toUserId;
  if (!toUserId || typeof toUserId !== 'number') {
    return NextResponse.json({ error: 'Invalid "toUserId"' }, { status: 400 });
  }

  try {
    const fromUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!fromUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    if (fromUser.id === toUserId) {
      return NextResponse.json({ error: 'Cannot send request to yourself' }, { status: 400 });
    }

    // Check if request or friendship exists (in either direction)
    const existingRelation = await prisma.friend.findFirst({
      where: {
        OR: [
          { requesterId: fromUser.id, addresseeId: toUserId },
          { requesterId: toUserId, addresseeId: fromUser.id },
        ],
      },
    });

    if (existingRelation) {
      return NextResponse.json({ error: 'Friendship or request already exists' }, { status: 400 });
    }

    await prisma.friend.create({
      data: {
        requesterId: fromUser.id,
        addresseeId: toUserId,
        status: 'pending',
      },
    });

    return NextResponse.json({ message: 'Friend request sent' });
  } catch (error) {
    console.error('Friend request API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

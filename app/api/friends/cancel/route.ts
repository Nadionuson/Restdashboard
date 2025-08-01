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

    const requestToCancel = await prisma.friend.findFirst({
      where: {
        requesterId: fromUser.id,
        addresseeId: toUserId,
        status: 'pending',
      },
    });

    if (!requestToCancel) {
      return NextResponse.json({ error: 'Friend request not found' }, { status: 404 });
    }

    await prisma.friend.delete({
      where: { id: requestToCancel.id },
    });

    return NextResponse.json({ message: 'Friend request cancelled' });
  } catch (error) {
    console.error('Cancel friend request API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

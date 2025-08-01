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
  const friendUserId = body.friendUserId;
  if (!friendUserId || typeof friendUserId !== 'number') {
    return NextResponse.json({ error: 'Invalid "friendUserId"' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const friendRecord = await prisma.friend.findFirst({
      where: {
        status: 'accepted',
        OR: [
          { requesterId: user.id, addresseeId: friendUserId },
          { requesterId: friendUserId, addresseeId: user.id },
        ],
      },
    });

    if (!friendRecord) {
      return NextResponse.json({ error: 'Friendship not found' }, { status: 404 });
    }

    await prisma.friend.delete({
      where: { id: friendRecord.id },
    });

    return NextResponse.json({ message: 'Friend removed' });
  } catch (error) {
    console.error('Remove friend API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

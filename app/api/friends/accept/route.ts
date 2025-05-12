// POST /api/friends/accept
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = Number(session.user.id);
  const { userId: requesterId } = await req.json();

  if (!requesterId || requesterId === userId) {
    return NextResponse.json({ error: 'Invalid requester' }, { status: 400 });
  }

  // Find the friend request where requesterId sent the request to current user
  const request = await db.friend.findFirst({
    where: {
      requesterId,
      addresseeId: userId,
      status: 'PENDING',
    },
  });

  if (!request) {
    return NextResponse.json({ error: 'Friend request not found' }, { status: 404 });
  }

  // Update the request to accepted
  await db.friend.update({
    where: { id: request.id },
    data: { status: 'ACCEPTED' },
  });

  return NextResponse.json({ success: true });
}

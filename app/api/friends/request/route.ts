// POST /api/friends/request
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/authOptions'
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  
  const session = await getServerSession(authOptions);
  
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { userId: addresseeId } = await req.json();
  const requesterId = parseInt(session.user.id);

  if (requesterId === addresseeId) return NextResponse.json({ error: 'Cannot friend yourself' }, { status: 400 });

  const exists = await db.friend.findFirst({
    where: {
      OR: [
        { requesterId, addresseeId },
        { requesterId: addresseeId, addresseeId: requesterId },
      ],
    },
  });

  if (exists) return NextResponse.json({ error: 'Already requested or friends' }, { status: 400 });

  await db.friend.create({
    data: {
      requesterId,
      addresseeId,
      status: 'PENDING',
    },
  });

  return NextResponse.json({ success: true });
}

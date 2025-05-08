// GET /api/friends/requests
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/authOptions'
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = session.user.id;

  const incoming = await db.friend.findMany({
    where: { addresseeId: Number(userId), status: 'PENDING' },
    include: { requester: true },
  });

  const sent = await db.friend.findMany({
    where: { requesterId: Number(userId), status: 'PENDING' },
    include: { addressee: true },
  });

  return NextResponse.json({
    incoming: incoming.map(r => ({ id: r.requester.id, email: r.requester.email })),
    sent: sent.map(r => ({ id: r.addressee.id, email: r.addressee.email })),
  });
}

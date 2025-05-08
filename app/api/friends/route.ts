// GET /api/friends
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/authOptions';
import { db } from '@/lib/db';


export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const userId = session.user.id;

  const friends = await db.friend.findMany({
  where: {
    OR: [
      { requesterId: Number(userId), status: { equals: 'ACCEPTED' } },  // Explicit filter with equals
      { addresseeId: Number(userId), status: { equals: 'ACCEPTED' } },  // Explicit filter with equals
    ],
  },
  include: {
    requester: true,  // Correct relation: requester (User model)
    addressee: true,  // Correct relation: addressee (User model)
  },
});


  const result = friends.map(f => {
  // Determine which user is not the logged-in user
  const other = f.requester.id === Number(userId)  ? f.addressee : f.requester;
  
  // Return the user's information
  return { id: other.id, email: other.email };
});
  return NextResponse.json(result);
}

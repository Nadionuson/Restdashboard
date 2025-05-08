import { NextRequest, NextResponse } from "next/server";

// POST /api/friends/accept
export async function POST(req: NextRequest) {
  const session = await auth(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { userId: requesterId } = await req.json();
  const userId = session.user.id;

  const request = await db.friend.findFirst({
    where: {
      userId: requesterId,
      friendId: userId,
      status: 'PENDING',
    },
  });

  if (!request) return NextResponse.json({ error: 'No request found' }, { status: 404 });

  await db.friend.update({
    where: { id: request.id },
    data: { status: 'ACCEPTED' },
  });

  return NextResponse.json({ success: true });
}

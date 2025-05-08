import { NextRequest, NextResponse } from "next/server";

// POST /api/friends/decline
export async function POST(req: NextRequest) {
  const session = await auth(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { userId: requesterId } = await req.json();
  const userId = session.user.id;

  await db.friend.deleteMany({
    where: {
      userId: requesterId,
      friendId: userId,
      status: 'PENDING',
    },
  });

  return NextResponse.json({ success: true });
}

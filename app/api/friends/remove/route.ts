import { NextRequest, NextResponse } from "next/server";

// POST /api/friends/remove
export async function POST(req: NextRequest) {
  const session = await auth(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { userId: otherId } = await req.json();
  const userId = session.user.id;

  await db.friend.deleteMany({
    where: {
      OR: [
        { userId, friendId: otherId },
        { userId: otherId, friendId: userId },
      ],
      status: 'ACCEPTED',
    },
  });

  return NextResponse.json({ success: true });
}

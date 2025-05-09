import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/authOptions'
import { db } from '@/lib/db';

// GET /api/friends/search?query=abc@example.com
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');

  if (!query) return NextResponse.json({ user: null });

  const user = await db.user.findFirst({
    where: {
      OR: [
       { email: { contains: query, mode: 'insensitive' } },
        { username: { contains: query, mode: 'insensitive' } },
      ],
    },
    select: { id: true, email: true, username: true },
  });

  return NextResponse.json({ user });
}

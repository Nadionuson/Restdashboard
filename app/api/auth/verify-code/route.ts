import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers';
import { getToken } from 'next-auth/jwt';
import { SignJWT } from 'jose';

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const { email, code } = await req.json();

  if (!email || !code) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (
    !user ||
    user.loginCode !== code ||
    !user.loginCodeExpires ||
    new Date() > user.loginCodeExpires
  ) {
    return NextResponse.json({ error: 'Invalid or expired code' }, { status: 401 });
  }

  // 🔐 Create a session token manually (or handle via credentials provider if preferred)
  const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);

  const token = await new SignJWT({ email: user.email, id: user.id })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret);

  (await cookies()).set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  // Optionally clear the code after use
  await prisma.user.update({
    where: { email },
    data: {
      loginCode: null,
      loginCodeExpires: null,
    },
  });

  return NextResponse.json({ success: true });
}

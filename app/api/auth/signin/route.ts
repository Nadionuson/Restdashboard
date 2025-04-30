import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import cookie from 'cookie';

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash || '');
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Create JWT token
    const token = sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    // Set the JWT token in the cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Make sure cookies are secure in production
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax' as const,
      path: '/',
    };

    const res = NextResponse.json({ message: 'Login successful' });
    res.headers.set('Set-Cookie', cookie.serialize('authToken', token, cookieOptions));

    return res;
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred during sign-in' }, { status: 500 });
  }
}

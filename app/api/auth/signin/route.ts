import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import cookie from 'cookie';

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    // Find user by either email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier },
        ],
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash || '');

    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
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

    const res = NextResponse.json({ message: 'Login successful', user: { id: user.id, email: user.email, username: user.username } });
    res.headers.set('Set-Cookie', cookie.serialize('authToken', token, cookieOptions));

    return res;
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred during sign-in' }, { status: 500 });
  }
}

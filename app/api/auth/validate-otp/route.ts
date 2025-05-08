import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { signIn } from 'next-auth/react';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email, otpCode } = await req.json();

  // Find the user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  // Check if the OTP exists and is still valid
  if (user.loginCode !== otpCode) {
    return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
  }

  const loginCodeExpires = user.loginCodeExpires ?? new Date();

 if (new Date() > new Date(loginCodeExpires))  {
    return NextResponse.json({ message: 'OTP has expired' }, { status: 400 });
  }


  // Clear the OTP after successful validation
  await prisma.user.update({
    where: { email },
    data: {
      loginCode: null,
      loginCodeExpires: null,
    },
  });

  // Log the user in (you may use next-auth to create a session)
  const result = await signIn('credentials', {
    identifier: email,
    password: '', // Password is not needed since we're logging in with OTP
    redirect: false,
  });

  if (result?.ok) {
    return NextResponse.json({ message: 'Login successful' }, { status: 200 });
  }

  return NextResponse.json({ message: 'Login failed' }, { status: 500 });
}

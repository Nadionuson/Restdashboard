import { NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Input validation using Zod
const bodySchema = z.object({
  email: z.string().email(),
  code: z.string().length(6), // Assuming 6-digit code
});

export async function POST(req: Request) {
  try {
    const { email, code } = await bodySchema.parseAsync(await req.json());

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Check if the code is valid and not expired
    if (user.loginCode !== code || !user.loginCodeExpires || new Date() > new Date(user.loginCodeExpires)) {
      return NextResponse.json({ message: 'Invalid or expired code' }, { status: 400 });
    }

    // Clear the login code after successful verification
    await prisma.user.update({
      where: { email },
      data: {
        loginCode: null,
        loginCodeExpires: null,
      },
    });

    // Successful login
    return NextResponse.json({ message: 'Login successful', userId: user.id });
  } catch (error) {
    console.error('Error verifying code:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}

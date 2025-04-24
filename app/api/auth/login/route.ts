import { NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client'
import { sendLoginCodeEmail } from '../../../../lib/sendEmail'; // (optional) for real email sending

const prisma = new PrismaClient()

// Input validation using Zod
const bodySchema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const { email } = await bodySchema.parseAsync(await req.json());

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Generate a random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Save the code and expiration time (1 hour validity)
    await prisma.user.update({
      where: { email },
      data: {
        loginCode: code,
        loginCodeExpires: new Date(Date.now() + 3600000), // 1 hour from now
      },
    });

    // Send the code to the user (via email or console)
    await sendLoginCodeEmail(user.email, code); // Implement this function for real email sending
    console.log(`Login code for ${email}: ${code}`); // For testing, can be replaced with actual email sending

    return NextResponse.json({ message: 'Code sent to your email' });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}

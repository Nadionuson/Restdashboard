// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

async function sendLoginCode(email: string, code: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your One-Time Login Code',
    text: `Your one-time login code is: ${code}`,
  };

  await transporter.sendMail(mailOptions);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, loginCode } = body;

    if (!email || (!password && !loginCode)) {
      return NextResponse.json(
        { error: 'Email and either password or loginCode are required' },
        { status: 400 }
      );
    }

    if (password) {
      // Traditional Registration
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email,
          username: email.split('@')[0], // or any default logic
          passwordHash: hashedPassword,
        },
      });

      return NextResponse.json(user, { status: 201 });
    } else {
      // Passwordless Registration with one-time code
      const generatedCode = crypto.randomBytes(6).toString('hex');

      const user = await prisma.user.upsert({
        where: { email },
        update: {
          loginCode: generatedCode,
          loginCodeExpires: new Date(Date.now() + 15 * 60 * 1000),
        },
        create: {
          email,
          username: email.split('@')[0], // or any default logic
          loginCode: generatedCode,
          loginCodeExpires: new Date(Date.now() + 15 * 60 * 1000),
        },
      });

      await sendLoginCode(email, generatedCode);

      return NextResponse.json(
        { message: 'One-time login code sent to your email.' },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'An error occurred while registering the user.' },
      { status: 500 }
    );
  }
}

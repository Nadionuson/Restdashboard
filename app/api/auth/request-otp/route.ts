import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

async function sendOtpEmail(email: string, otpCode: string) {
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    console.log(`[DEV MODE] OTP for ${email}: ${otpCode}`);
    return;
  }

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;

  if (!user || !pass) {
    console.error('Missing EMAIL_USER or EMAIL_PASSWORD in environment variables.');
    throw new Error('Missing email credentials');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });

  const mailOptions = {
    from: user,
    to: email,
    subject: 'Your One-Time Login Code',
    text: `Your one-time login code is: ${otpCode}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending OTP email via nodemailer:', error);
    throw new Error('Failed to send OTP email');
  }
}

export async function POST(req: Request) {
  console.log('🔐 Incoming OTP request');

  let email: string;

  try {
    const body = await req.json();
    email = body.email;
    if (!email || typeof email !== 'string') {
      console.warn('❗ Email missing or invalid in request body');
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }
  } catch (error) {
    console.error('❌ Failed to parse JSON body:', error);
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.warn('🚫 User not found:', email);
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const otpCode = uuidv4().split('-')[0];
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.user.update({
      where: { email },
      data: {
        loginCode: otpCode,
        loginCodeExpires: expiresAt,
      },
    });

    console.log(`✅ OTP generated for ${email}: ${otpCode} (expires at ${expiresAt.toISOString()})`);

    await sendOtpEmail(email, otpCode);

    return NextResponse.json({ message: 'OTP sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('❌ Unexpected error during OTP request:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

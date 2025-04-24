// pages/api/auth/register.ts
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto';
import nodemailer from 'nodemailer'; // We'll need this for sending email codes

const prisma = new PrismaClient()

// Helper to send the one-time code
async function sendLoginCode(email: string, code: string) {
  // Set up email transport (assuming you're using an SMTP server or email service)
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Example: Using Gmail service
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;

  // Check if the user is registering with a password or a one-time code
  if (!email || (!password && !req.body.loginCode)) {
    return res.status(400).json({ error: 'Email and either password or loginCode are required' });
  }

  try {
    if (password) {
      // Traditional Registration (with password)
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the user with the hashed password
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash: hashedPassword,
        },
      });

      return res.status(201).json(user);
    } else if (req.body.loginCode) {
      // Passwordless Registration (with one-time code)
      const loginCode = crypto.randomBytes(6).toString('hex'); // Generate a 6-digit code

      // Save the login code in the user record (it will expire after some time)
      const user = await prisma.user.upsert({
        where: { email },
        update: {
          loginCode,
          loginCodeExpires: new Date(Date.now() + 15 * 60 * 1000), // Expires in 15 minutes
        },
        create: {
          email,
          loginCode,
          loginCodeExpires: new Date(Date.now() + 15 * 60 * 1000), // Expires in 15 minutes
        },
      });

      // Send the one-time login code to the user
      await sendLoginCode(email, loginCode);

      return res.status(200).json({ message: 'One-time login code sent to your email.' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while registering the user.' });
  }
}

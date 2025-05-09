import { NextRequest, NextResponse } from 'next/server';
import { sendInvitationEmail } from '@/lib/sendEmail'; // A function to handle sending the email (to be created)

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  // Basic validation
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  // Send the invitation email (you'll need to implement this function)
  try {
    await sendInvitationEmail(email);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}

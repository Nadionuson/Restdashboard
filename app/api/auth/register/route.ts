import { NextResponse } from 'next/server';

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient()

// Helper to generate anagram-like suggestions
function generateUsernameSuggestions(base: string, maxSuggestions = 5): string[] {
  const chars = base.split('');
  const results = new Set<string>();

  while (results.size < maxSuggestions * 3 && results.size < 1000) {
    const shuffled = chars
      .slice()
      .sort(() => 0.5 - Math.random())
      .join('');
    if (shuffled !== base) {
      results.add(shuffled);
    }
  }

  return Array.from(results);
}

export async function POST(req: Request) {
  try {
    const { email, username, password } = await req.json();

    if (!email || !username || !password) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

// ✅ Check email first — it's required to be unique
const existingEmailUser = await prisma.user.findUnique({
  where: { email },
});

if (existingEmailUser) {
  return NextResponse.json({ message: 'Email already in use' }, { status: 409 });
}

// ✅ Check username separately
const existingUsernameUser = await prisma.user.findUnique({
  where: { username },
});

if (existingUsernameUser) {
  const suggestions = generateUsernameSuggestions(username);
  const existingUsernames = await prisma.user.findMany({
    where: { username: { in: suggestions } },
    select: { username: true },
  });

  const takenUsernames = new Set(existingUsernames.map(u => u.username));
  const available = suggestions.filter(s => !takenUsernames.has(s)).slice(0, 3);

  return NextResponse.json(
    {
      message: 'Username already taken',
      suggestions: available,
    },
    { status: 409 }
  );
}

    

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash: hashedPassword,
      },
    });

    return NextResponse.json(newUser);
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred during registration' }, { status: 500 });
  }
}

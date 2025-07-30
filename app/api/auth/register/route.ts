import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Generate username suggestions by shuffling characters
function generateUsernameSuggestions(base: string, max = 5): string[] {
  const chars = base.split('');
  const results = new Set<string>();

  while (results.size < max * 3 && results.size < 1000) {
    const shuffled = chars.slice().sort(() => 0.5 - Math.random()).join('');
    if (shuffled !== base) results.add(shuffled);
  }

  return Array.from(results);
}

export async function POST(req: Request) {
  try {
    const { email, username, password } = await req.json();

    if (!email || !username || !password) {
      console.warn('Missing fields in registration:', { email, username });
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // Check if email is already in use
    const existingEmailUser = await prisma.user.findUnique({ where: { email } });
    if (existingEmailUser) {
      console.warn('Duplicate email:', email);
      return NextResponse.json({ message: 'Email already in use' }, { status: 409 });
    }

    // Check if username is already taken
    const existingUsernameUser = await prisma.user.findUnique({ where: { username } });
    if (existingUsernameUser) {
      console.warn('Username taken:', username);

      const suggestionsPool = generateUsernameSuggestions(username);
      const existingUsernames: { username: string }[] = await prisma.user.findMany({
  where: { username: { in: suggestionsPool } },
  select: { username: true },
});

      const takenSet = new Set(existingUsernames.map(u => u.username));
      const suggestions = suggestionsPool.filter(s => !takenSet.has(s)).slice(0, 3);

      return NextResponse.json(
        {
          message: 'Username already taken',
          suggestions,
        },
        { status: 409 }
      );
    }

    // Hash password and create user
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
      },
    });

    console.log('✅ User created:', newUser.email);
    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });

  } catch (error) {
    console.error('🔥 Registration error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

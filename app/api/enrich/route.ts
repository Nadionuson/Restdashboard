import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const body = await req.json();
  const { name, city, neighborhood } = body;

  if (!name || !city ) {
    return NextResponse.json(
      { error: 'Name and City are required' },
      { status: 400 }
    );
  }

  const prompt = `
You are a helpful assistant. A user is entering a restaurant into their system.
Given the following details:

- Name: "${name}"
- City: "${city}"
- Neighborhood: "${neighborhood}"

Return the following details based on a quick online search:
- Full address (including street, number, zip code if available)
- Official website (if available)
- Phone Number for reservations
- Working hours

Respond ONLY in strict JSON format:
{
  "address": "...",
  "website": "...",
  "PhoneNumber": "...",
  "WorkingHours": "..."
}
  `;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4',
      temperature: 0.2,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = chatCompletion.choices[0].message?.content || '';

    const jsonMatch = content.match(/{[\s\S]*}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    if (!parsed) throw new Error('Failed to parse AI response');

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Enrichment failed:', error);
    return NextResponse.json(
      { error: 'Failed to enrich restaurant info' },
      { status: 500 }
    );
  }
}

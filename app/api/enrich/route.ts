import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { name, city, neighborhood } = await req.json();

  if (!name || !city || !neighborhood) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  try {
   const geminiRes = await fetch(
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': process.env.GEMINI_API_KEY!,
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `
You are a helpful assistant. A user is entering a restaurant into their system.
Given the following details:

- Name: "${name}"
- City: "${city}"
- reference point: "${neighborhood}"

Return the following details based on a quick online search:
- Full address (including street, number, zip code if available)
- Official website (if available)
- Phone Number for reservations
- Working hours
- Geo Coordinates (latitude and longitude)

Return ONLY a JSON object with the following exact structure. Do NOT explain, do NOT wrap in a code block, do NOT add markdown:

{
  "address": "...",
  "website": "...",
  "phoneNumber": "...",
  "workingHours": "...",
  "geoCoordinates": {
    "latitude": "...",
    "longitude": "..."
  }
}
              `.trim(),
            },
          ],
        },
      ],
      tools: [
    { google_search: {} } // 👈 Enables real-time search
  ],
      generationConfig: {
        temperature: 0.7,
        topK: 32,
        topP: 1,
        maxOutputTokens: 1024,
        stopSequences: [],
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_NONE',
        },
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_NONE',
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_NONE',
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_NONE',
        },
      ],
    }),
  }
);


    const geminiJson = await geminiRes.json();
    const text = geminiJson?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error('No text returned from Gemini');
      return NextResponse.json({ error: 'Empty response from Gemini' }, { status: 502 });
    }

    // Clean code block markers if present
    const cleaned = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error('JSON parsing failed:', parseErr, '\nRaw text:', cleaned);
      return NextResponse.json({ error: 'Invalid JSON from Gemini' }, { status: 502 });
    }

    return NextResponse.json({
      address: parsed.address ?? '',
      website: parsed.website ?? '',
      phoneNumber: parsed.phoneNumber ?? '',
      openingHours: parsed.workingHours ?? '',
      geoCoordinates: {
        latitude: parsed.geoCoordinates?.latitude ?? '',
        longitude: parsed.geoCoordinates?.longitude ?? '',
      },
    });
  } catch (err) {
    console.error('Gemini API error:', err);
    return NextResponse.json({ error: 'Failed to contact Gemini API' }, { status: 500 });
  }
}

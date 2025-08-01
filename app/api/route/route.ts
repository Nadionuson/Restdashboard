// /app/api/route/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { from, to, mode } = await req.json(); // mode = 'foot-walking' | 'driving-car'


  if (!from || !to) {
    return NextResponse.json({ error: 'Missing coordinates' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.openrouteservice.org/v2/directions/${mode}`, {
      method: 'POST',
      headers: {
        'Authorization': process.env.ORS_API_KEY || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        coordinates: [
          [8.681495, 49.41461],
          [8.687872, 49.420318],
        ],
      }),
    });

    
    if (!res.ok) {
      const error = await res.json();
      return NextResponse.json({ error: error.message }, { status: res.status });
    }

    const data = await res.json();
    console.log('Route data:', data.routes[0].segments[0]);
    const distanceKm = data.routes[0].segments[0].distance / 1000;
    const durationMin = data.routes[0].segments[0].duration / 60;

    return NextResponse.json({
      distanceKm: distanceKm.toFixed(2),
      durationMin: Math.round(durationMin),
    });
  } catch (err) {
    console.error('Route calculation failed', err);
    return NextResponse.json({ error: 'Failed to fetch route' }, { status: 500 });
  }
}

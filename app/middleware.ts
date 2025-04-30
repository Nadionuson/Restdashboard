// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

const protectedRoutes = ['/dashboard', '/profile', '/restaurants'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('authToken')?.value;

  const isProtected = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );
  
  if (!isProtected) {
    return NextResponse.next(); // skip auth check
  }
  
  
  if (!token) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  try {
    verify(token, process.env.JWT_SECRET!);
    return NextResponse.next(); // token is valid
  } catch {
    return NextResponse.redirect(new URL('/signin', req.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/restaurants/:path*'],
};

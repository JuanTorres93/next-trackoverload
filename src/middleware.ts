import { NextResponse, NextRequest } from 'next/server';

import { AppAuthService } from './interface-adapters/app/services/AppAuthService';
import { AuthError } from './domain/common/errors';
import { cookieSessionName } from './app/api/auth/cookie';

const notAllowedForLoggedInUsers = ['/auth/login', '/auth/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(cookieSessionName)?.value;

  if (notAllowedForLoggedInUsers.includes(pathname)) {
    if (!token) return NextResponse.next();

    const validToken = await AppAuthService.validateToken(token);

    if (validToken) return NextResponse.redirect(new URL('/app', request.url));

    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  try {
    const validToken = await AppAuthService.validateToken(token);

    if (!validToken) throw new AuthError('middleware: Invalid token');

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}

export const config = {
  matcher: ['/app/:path*', '/auth/login', '/auth/register'],
};

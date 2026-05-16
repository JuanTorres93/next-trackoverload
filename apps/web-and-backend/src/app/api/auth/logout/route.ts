import { NextResponse } from 'next/server';
import { cookieSessionName } from '../cookie';

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out' });

  response.cookies.set(cookieSessionName, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date('1970-01-01'), // Set cookie to expire in the past
  });

  return response;
}

import { NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json({ success: true });
  // Clear the auth cookie
  response.cookies.set(COOKIE_NAME, '', { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 0 });
  // Set force-logout flag so IP whitelist doesn't auto-redirect back in
  response.cookies.set('tws_force_logout', '1', { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 3600 });
  return response;
}

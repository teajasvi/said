import { NextResponse } from 'next/server';
import { validateAdminPassword, generateAdminToken, COOKIE_NAME } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password || !validateAdminPassword(password)) {
      // Intentionally vague error to prevent info leaking
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    const token = await generateAdminToken();

    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 604800, // 7 days
    });

    return response;
  } catch (err) {
    console.error('[API] Admin login error:', err.message);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}

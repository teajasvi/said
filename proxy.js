import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = () => new TextEncoder().encode(process.env.JWT_SECRET);
const COOKIE_NAME = 'tws_admin_token';
const WHITELISTED_IPS = (process.env.ADMIN_WHITELISTED_IPS || '').split(',').map(ip => ip.trim()).filter(Boolean);

function getClientIp(request) {
  const cfIp = request.headers.get('cf-connecting-ip') || '';
  const forwardedFor = request.headers.get('x-forwarded-for') || '';
  const realIp = request.headers.get('x-real-ip') || '';
  return [cfIp.trim(), forwardedFor.split(',')[0].trim(), realIp].filter(Boolean);
}

async function isAuthenticated(request) {
  // 1. IP whitelist
  const ips = getClientIp(request);
  if (WHITELISTED_IPS.length > 0 && ips.some(ip => WHITELISTED_IPS.includes(ip))) return true;

  // 2. Valid JWT cookie
  const cookie = request.cookies.get(COOKIE_NAME);
  if (!cookie?.value) return false;
  try {
    const { payload } = await jwtVerify(cookie.value, JWT_SECRET());
    return payload.role === 'admin';
  } catch {
    return false;
  }
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co https://*.upstash.io; frame-ancestors 'none';"
  );

  // Admin routes auth
  if (pathname.startsWith('/admin')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');

    const authed = await isAuthenticated(request);

    // Auto-redirect whitelisted/authed users from login → dashboard
    if (pathname === '/admin' && authed) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    // Block dashboard for unauthenticated users
    if (pathname.startsWith('/admin/dashboard') && !authed) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};

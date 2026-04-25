import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = () => new TextEncoder().encode(process.env.JWT_SECRET);
const COOKIE_NAME = 'tws_admin_token';

const WHITELISTED_IPS = (process.env.ADMIN_WHITELISTED_IPS || '').split(',').map(ip => ip.trim()).filter(Boolean);

function getClientIp(request) {
  // Cloudflare passes the real IP here
  const cfIp = request.headers.get('cf-connecting-ip') || '';
  const forwardedFor = request.headers.get('x-forwarded-for') || '';
  const realIp = request.headers.get('x-real-ip') || '';
  return [cfIp.trim(), forwardedFor.split(',')[0].trim(), realIp].filter(Boolean);
}

async function isAuthenticated(request) {
  // 1. IP whitelist — always grant access
  const ips = getClientIp(request);
  if (ips.some(ip => WHITELISTED_IPS.includes(ip))) return true;

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

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const authed = await isAuthenticated(request);

  // If authed and on login page → redirect to dashboard
  if (pathname === '/admin' && authed) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // If not authed and on dashboard → redirect to login
  if (pathname.startsWith('/admin/dashboard') && !authed) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/dashboard/:path*'],
};

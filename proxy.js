import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = () => new TextEncoder().encode(process.env.JWT_SECRET);
const COOKIE_NAME = 'tws_admin_token';
const WHITELISTED_IPS = (process.env.ADMIN_WHITELISTED_IPS || '').split(',').map(ip => ip.trim()).filter(Boolean);

// Secret admin path — set ADMIN_PANEL_PATH in env (e.g. "x7k2m9")
// Actual Next.js routes stay under /admin, but only accessible via the secret path
const ADMIN_PANEL_PATH = process.env.ADMIN_PANEL_PATH || 'admin';

function getClientIp(request) {
  const cfIp = request.headers.get('cf-connecting-ip') || '';
  const forwardedFor = request.headers.get('x-forwarded-for') || '';
  const realIp = request.headers.get('x-real-ip') || '';
  return [cfIp.trim(), forwardedFor.split(',')[0].trim(), realIp].filter(Boolean);
}

async function isAuthenticated(request) {
  // If user explicitly logged out, respect that — skip IP whitelist
  const forceLogout = request.cookies.get('tws_force_logout');
  if (forceLogout?.value === '1') return false;

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

  // Secret path: block /admin* unless accessed via secret path or already internal
  // Map /{ADMIN_PANEL_PATH} → /admin internally
  if (pathname === `/${ADMIN_PANEL_PATH}` || pathname.startsWith(`/${ADMIN_PANEL_PATH}/`)) {
    const internalPath = pathname.replace(`/${ADMIN_PANEL_PATH}`, '/admin');
    const rewriteUrl = new URL(internalPath, request.url);
    rewriteUrl.search = request.nextUrl.search;

    const authed = await isAuthenticated(request);
    if (internalPath === '/admin' && authed) {
      return NextResponse.redirect(new URL(`/${ADMIN_PANEL_PATH}/dashboard`, request.url));
    }
    if (internalPath.startsWith('/admin/dashboard') && !authed) {
      return NextResponse.redirect(new URL(`/${ADMIN_PANEL_PATH}`, request.url));
    }

    const rewrite = NextResponse.rewrite(rewriteUrl);
    rewrite.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return rewrite;
  }

  // Block direct /admin access — 404 it so the path isn't guessable
  if (pathname.startsWith('/admin')) {
    return new NextResponse(null, { status: 404 });
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};

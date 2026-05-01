import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = () => new TextEncoder().encode(process.env.JWT_SECRET);
const COOKIE_NAME = 'tws_admin_token';
const WHITELISTED_IPS = (process.env.ADMIN_WHITELISTED_IPS || '').split(',').map(ip => ip.trim()).filter(Boolean);

// ─── Known AI training crawlers to block from UGC pages ───
// These bots scrape content to train LLMs. We don't want traumatic
// user-submitted content ending up in AI training datasets.
const AI_BOT_PATTERNS = [
  /gptbot/i,
  /chatgpt-user/i,
  /ccbot/i,
  /anthropic-ai/i,
  /claude-web/i,
  /google-extended/i,
  /cohere-ai/i,
  /bytespider/i,
  /perplexitybot/i,
  /youbot/i,
  /petalbot/i,
  /amazonbot/i,
  /facebookexternal/i,
  /meta-externalagent/i,
  /omgili/i,
  /diffbot/i,
  /applebot-extended/i,
  /img2dataset/i,
  /commoncrawl/i,
];

// ─── Generic scraper signatures (block on API routes) ───
const SCRAPER_PATTERNS = [
  /python-requests/i,
  /python-urllib/i,
  /scrapy/i,
  /curl\//i,
  /wget\//i,
  /httpie/i,
  /java\//i,
  /libwww-perl/i,
  /go-http-client/i,
  /node-fetch/i,
  /axios/i,
  /php\//i,
  /ruby/i,
];

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
  const ua = request.headers.get('user-agent') || '';

  // ── Check if this is a legitimate search bot (never block these) ──
  const isLegitBot = /googlebot|bingbot|mediapartners|adsbot|slurp|duckduckbot|yandexbot|baiduspider/i.test(ua);

  // ── Block AI training crawlers from all pages ──
  if (!isLegitBot) {
    for (const pattern of AI_BOT_PATTERNS) {
      if (pattern.test(ua)) {
        return new NextResponse('Forbidden', { status: 403 });
      }
    }
  }

  // ── Block generic scrapers from the public API ──
  if (pathname.startsWith('/api/submissions') && !isLegitBot) {
    for (const pattern of SCRAPER_PATTERNS) {
      if (pattern.test(ua)) {
        return new NextResponse(JSON.stringify({ error: 'Forbidden' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }
  }

  // ── Block empty user-agents on API routes ──
  if (pathname.startsWith('/api/') && !ua) {
    return new NextResponse(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── Security headers ──
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co https://*.upstash.io; frame-ancestors 'none';"
  );

  // ── Admin routes auth ──
  if (pathname.startsWith('/admin')) {
    // Cloudflare challenge sends POST after verification — redirect to GET
    if (request.method === 'POST' && !pathname.startsWith('/api/')) {
      return NextResponse.redirect(new URL(pathname, request.url), 303);
    }

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
    '/((?!_next/static|_next/image|favicon.ico|icon-192.png|icon-512.png|apple-touch-icon.png|opengraph-image.png|ads.txt|robots.txt|sitemap.xml).*)',
  ],
};

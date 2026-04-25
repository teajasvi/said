import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = () => new TextEncoder().encode(process.env.JWT_SECRET);
const TOKEN_EXPIRY = '7d';
const COOKIE_NAME = 'tws_admin_token';

/** Generate admin JWT */
export async function generateAdminToken() {
  return new SignJWT({ role: 'admin', iat: Date.now() })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET());
}

/** Verify admin JWT — returns payload or null */
export async function verifyAdminToken(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET());
    if (payload.role !== 'admin') return null;
    return payload;
  } catch {
    return null;
  }
}

/** Validate admin password */
export function validateAdminPassword(password) {
  if (!password || !process.env.ADMIN_SECRET) return false;
  // Constant-time comparison to prevent timing attacks
  const expected = process.env.ADMIN_SECRET;
  if (password.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < password.length; i++) {
    mismatch |= password.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}

/** Extract token from cookies in request */
export function getTokenFromRequest(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  return match ? match[1] : null;
}

/** Check if request is authenticated admin */
export async function isAdminRequest(request) {
  // Check IP whitelist first — use Cloudflare's real IP header
  const cfIp = request.headers.get('cf-connecting-ip') || '';
  const forwardedFor = request.headers.get('x-forwarded-for') || '';
  const realIp = request.headers.get('x-real-ip') || '';
  const ips = [cfIp.trim(), forwardedFor.split(',')[0].trim(), realIp].filter(Boolean);
  
  const WHITELISTED_IPS = [
    '2001:4860:7:405::de',
    '103.161.233.102'
  ];

  if (ips.some(ip => WHITELISTED_IPS.includes(ip))) {
    return { role: 'admin' };
  }

  // Fallback to token
  const token = getTokenFromRequest(request);
  return verifyAdminToken(token);
}

export { COOKIE_NAME };

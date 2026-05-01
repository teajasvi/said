import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase/client';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { sanitizeText, validateSubmission, countWords } from '@/lib/validation';
import { checkRateLimit } from '@/lib/rateLimit';
import { headers } from 'next/headers';

/** GET /api/submissions — Public: fetch approved submissions */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(30, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const tag = searchParams.get('tag') || 'all';
    const offset = (page - 1) * limit;

    const supabase = getSupabaseClient();
    let query = supabase
      .from('submissions')
      .select('id, text, tag, created_at', { count: 'exact' })
      .eq('status', 'approved')
      .order('approved_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (tag !== 'all') query = query.eq('tag', tag);

    const { data, error, count } = await query;
    if (error) throw error;

    return NextResponse.json({
      submissions: data || [],
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      page,
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' },
    });
  } catch (err) {
    console.error('[API] GET /submissions error:', err.message);
    return NextResponse.json({ error: 'Failed to fetch submissions.' }, { status: 500 });
  }
}

/** POST /api/submissions — Public: create a new submission */
export async function POST(request) {
  try {
    // Get client IP and country
    const headersList = await headers();
    const ip = headersList.get('cf-connecting-ip')
      || headersList.get('x-forwarded-for')?.split(',')[0]?.trim()
      || headersList.get('x-real-ip')
      || 'unknown';
    const country = headersList.get('cf-ipcountry') || 'XX';

    // Parse body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const { text, tag } = body;

    // Sanitize
    const sanitized = sanitizeText(text || '');

    // Validate
    const errors = validateSubmission(sanitized, tag);
    if (errors.length > 0) {
      return NextResponse.json({ error: errors[0] }, { status: 400 });
    }

    // Generate user UUID from IP (deterministic for rate limiting)
    const encoder = new TextEncoder();
    const data = encoder.encode(ip + (process.env.UUID_SALT || 'tws-salt'));
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const userUuid = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Check if banned
    const supabaseAdmin = getSupabaseAdmin();
    const { data: banCheck } = await supabaseAdmin
      .from('banned_users')
      .select('id')
      .or(`ip_address.eq.${ip},user_uuid.eq.${userUuid}`)
      .limit(1);

    if (banCheck && banCheck.length > 0) {
      return NextResponse.json({ error: 'You have been banned from submitting.' }, { status: 403 });
    }

    // Rate limit
    const rateResult = await checkRateLimit(userUuid);
    if (!rateResult.allowed) {
      return NextResponse.json({
        error: `You've reached the daily limit. Try again later.`,
      }, { status: 429 });
    }

    // Insert submission
    const { error: insertError } = await supabaseAdmin
      .from('submissions')
      .insert({
        text: sanitized,
        tag,
        status: 'pending',
        ip_address: ip,
        user_uuid: userUuid,
        word_count: countWords(sanitized),
        country,
      });

    if (insertError) throw insertError;

    return NextResponse.json({
      success: true,
      message: 'Submitted for review.',
      remaining: rateResult.remaining,
    }, { status: 201 });
  } catch (err) {
    console.error('[API] POST /submissions error:', err.message);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase/server';

/** POST /api/admin/ban — ban a user by IP/UUID */
export async function POST(request) {
  const admin = await isAdminRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { ip_address, user_uuid, reason } = await request.json();
    if (!ip_address && !user_uuid) {
      return NextResponse.json({ error: 'IP or UUID required.' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('banned_users').insert({
      ip_address: ip_address || null,
      user_uuid: user_uuid || null,
      reason: reason || 'Banned by admin',
    });

    if (error) throw error;

    // Auto-reject all pending submissions from this user
    const orFilters = [
      ip_address ? `ip_address.eq.${ip_address}` : null,
      user_uuid ? `user_uuid.eq.${user_uuid}` : null,
    ].filter(Boolean).join(',');

    if (orFilters) {
      await supabase
        .from('submissions')
        .update({ status: 'rejected' })
        .eq('status', 'pending')
        .or(orFilters);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Admin] Ban error:', err.message);
    return NextResponse.json({ error: 'Failed to ban.' }, { status: 500 });
  }
}

/** GET /api/admin/ban — list banned users */
export async function GET(request) {
  const admin = await isAdminRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('banned_users')
      .select('*')
      .order('banned_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ banned: data || [] });
  } catch (err) {
    console.error('[Admin] List bans error:', err.message);
    return NextResponse.json({ error: 'Failed to fetch.' }, { status: 500 });
  }
}

/** DELETE /api/admin/ban — unban a user */
export async function DELETE(request) {
  const admin = await isAdminRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'ID required.' }, { status: 400 });

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('banned_users').delete().eq('id', id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Admin] Unban error:', err.message);
    return NextResponse.json({ error: 'Failed to unban.' }, { status: 500 });
  }
}

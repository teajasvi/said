import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase/server';

/** GET /api/admin/submissions — list all submissions (admin) */
export async function GET(request) {
  const admin = await isAdminRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || 'pending';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = 30;
  const offset = (page - 1) * limit;

  try {
    const supabase = getSupabaseAdmin();
    const { data, error, count } = await supabase
      .from('submissions')
      .select('*', { count: 'exact' })
      .eq('status', status)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({
      submissions: data || [],
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      page,
    });
  } catch (err) {
    console.error('[Admin] Fetch submissions error:', err.message);
    return NextResponse.json({ error: 'Failed to fetch.' }, { status: 500 });
  }
}

/** PATCH /api/admin/submissions — approve/reject a submission */
export async function PATCH(request) {
  const admin = await isAdminRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id, action } = await request.json();
    if (!id || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const updateData = {
      status: action === 'approve' ? 'approved' : 'rejected',
    };
    if (action === 'approve') updateData.approved_at = new Date().toISOString();

    let error;
    if (Array.isArray(id)) {
      if (id.length > 0) {
        const { error: batchError } = await supabase.from('submissions').update(updateData).in('id', id);
        error = batchError;
      }
    } else {
      const { error: singleError } = await supabase.from('submissions').update(updateData).eq('id', id);
      error = singleError;
    }
    
    if (error) throw error;

    // Invalidate caches
    try {
      const { invalidateSubmissionCaches } = await import('@/lib/redis');
      await invalidateSubmissionCaches();
    } catch {}

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Admin] Update submission error:', err.message);
    return NextResponse.json({ error: 'Failed to update.' }, { status: 500 });
  }
}

/** DELETE /api/admin/submissions — delete a submission */
export async function DELETE(request) {
  const admin = await isAdminRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'ID required.' }, { status: 400 });

    const supabase = getSupabaseAdmin();
    let error;
    if (Array.isArray(id)) {
      if (id.length > 0) {
        const { error: batchError } = await supabase.from('submissions').delete().in('id', id);
        error = batchError;
      }
    } else {
      const { error: singleError } = await supabase.from('submissions').delete().eq('id', id);
      error = singleError;
    }
    if (error) throw error;

    try {
      const { invalidateSubmissionCaches } = await import('@/lib/redis');
      await invalidateSubmissionCaches();
    } catch {}

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Admin] Delete submission error:', err.message);
    return NextResponse.json({ error: 'Failed to delete.' }, { status: 500 });
  }
}

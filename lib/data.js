import { getSupabaseClient } from './supabase/client';
import { getCached } from './redis';

const EMPTY_RESULT = { submissions: [], total: 0, totalPages: 0 };

function isConfigured() {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

/** Fetch approved submissions for public display */
export async function fetchApprovedSubmissions({ limit = 20, page = 1 } = {}) {
  if (!isConfigured()) return EMPTY_RESULT;
  const cacheKey = `submissions:wall:${page}:${limit}`;

  return getCached(cacheKey, async () => {
    try {
      const supabase = getSupabaseClient();
      const offset = (page - 1) * limit;

      const { data, error, count } = await supabase
        .from('submissions')
        .select('id, text, created_at, said_by, is_sensitive', { count: 'exact' })
        .eq('status', 'approved')
        .order('approved_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) { console.error('[Data] Error:', error.message); return EMPTY_RESULT; }

      return {
        submissions: data || [],
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      };
    } catch (err) {
      console.error('[Data] Fetch submissions failed:', err.message);
      return EMPTY_RESULT;
    }
  }, 300);
}

/** Fetch a single approved submission by ID */
export async function fetchSubmissionById(id) {
  if (!isConfigured()) return null;
  const cacheKey = `submission:${id}`;

  return getCached(cacheKey, async () => {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('submissions')
        .select('id, text, created_at, said_by, is_sensitive')
        .eq('id', id)
        .eq('status', 'approved')
        .single();

      if (error) return null;
      return data;
    } catch { return null; }
  }, 600);
}

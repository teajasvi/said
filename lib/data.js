import { getSupabaseClient } from './supabase/client';
import { getCached } from './redis';

const EMPTY_RESULT = { submissions: [], total: 0, totalPages: 0 };
const EMPTY_STORIES = { stories: [], total: 0, totalPages: 0 };

function isConfigured() {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

/** Fetch approved submissions for public display */
export async function fetchApprovedSubmissions({ limit = 20, page = 1, tag = 'all' } = {}) {
  if (!isConfigured()) return EMPTY_RESULT;
  const cacheKey = `submissions:wall:${tag}:${page}:${limit}`;

  return getCached(cacheKey, async () => {
    try {
      const supabase = getSupabaseClient();
      const offset = (page - 1) * limit;

      let query = supabase
        .from('submissions')
        .select('id, text, tag, created_at', { count: 'exact' })
        .eq('status', 'approved')
        .order('approved_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (tag !== 'all') query = query.eq('tag', tag);

      const { data, error, count } = await query;
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
  }, 60);
}

/** Fetch published stories */
export async function fetchPublishedStories({ limit = 20, page = 1 } = {}) {
  if (!isConfigured()) return EMPTY_STORIES;
  const cacheKey = `stories:list:${page}:${limit}`;

  return getCached(cacheKey, async () => {
    try {
      const supabase = getSupabaseClient();
      const offset = (page - 1) * limit;

      const { data, error, count } = await supabase
        .from('stories')
        .select('id, title, slug, excerpt, created_at', { count: 'exact' })
        .eq('published', true)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) { console.error('[Data] Error:', error.message); return EMPTY_STORIES; }

      return {
        stories: data || [],
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      };
    } catch (err) {
      console.error('[Data] Fetch stories failed:', err.message);
      return EMPTY_STORIES;
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
        .select('id, text, tag, created_at')
        .eq('id', id)
        .eq('status', 'approved')
        .single();

      if (error) return null;
      return data;
    } catch { return null; }
  }, 300);
}

/** Fetch a single story by slug */
export async function fetchStoryBySlug(slug) {
  if (!isConfigured()) return null;
  const cacheKey = `story:${slug}`;

  return getCached(cacheKey, async () => {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) return null;
      return data;
    } catch { return null; }
  }, 300);
}

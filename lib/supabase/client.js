import { createClient } from '@supabase/supabase-js';

let supabaseInstance = null;

/** Public Supabase client (respects RLS) */
export function getSupabaseClient() {
  if (supabaseInstance) return supabaseInstance;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }

  supabaseInstance = createClient(url, key, {
    auth: { persistSession: false },
    global: { headers: { 'X-Client-Info': 'theworstsaid-web' } },
  });
  return supabaseInstance;
}

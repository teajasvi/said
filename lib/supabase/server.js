import { createClient } from '@supabase/supabase-js';

let serviceInstance = null;

/** Service-role Supabase client (bypasses RLS — admin only) */
export function getSupabaseAdmin() {
  if (serviceInstance) return serviceInstance;
  serviceInstance = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    }
  );
  return serviceInstance;
}

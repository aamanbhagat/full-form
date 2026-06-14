import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseBrowserConfigured(): boolean {
  return Boolean(url && anonKey);
}

/** Browser client (anon key, RLS-scoped). Returns null when unconfigured. */
export function createBrowserSupabaseClient(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, { auth: { persistSession: false } });
}

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** True once a URL + anon key are present — reads can hit the real DB. */
export function isSupabaseConfigured(): boolean {
  return Boolean(url && anonKey);
}

/** True once a service-role key is present — writes/admin can run. */
export function isSupabaseServiceConfigured(): boolean {
  return Boolean(url && serviceKey);
}

/** Anon, read-only client. Subject to RLS (published + reviewed rows only). */
export function createServerSupabaseClient(): SupabaseClient {
  if (!url || !anonKey) {
    throw new Error('Supabase read client requested without configuration.');
  }
  return createClient(url, anonKey, { auth: { persistSession: false } });
}

/** Service-role client. Bypasses RLS — server-side writes and admin only. */
export function createServiceSupabaseClient(): SupabaseClient {
  if (!url || !serviceKey) {
    throw new Error('Supabase service client requested without configuration.');
  }
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

import 'server-only';
import {
  createServiceSupabaseClient,
  isSupabaseServiceConfigured,
} from '@/lib/supabase-server';
import { getSql, isPgConfigured } from '@/lib/pg';

// Best-effort logging of user queries into search_logs. Silent no-op on any
// error — analytics must never affect the user's request.
export async function logSearch(query: string, resultCount: number): Promise<void> {
  try {
    if (isSupabaseServiceConfigured()) {
      const supabase = createServiceSupabaseClient();
      await supabase.from('search_logs').insert({
        query,
        result_count: resultCount,
        found: resultCount > 0,
      });
      return;
    }
    if (isPgConfigured()) {
      const sql = getSql();
      await sql`insert into search_logs (query, result_count, found)
        values (${query}, ${resultCount}, ${resultCount > 0})`;
    }
  } catch {
    /* swallow — logging is non-critical */
  }
}

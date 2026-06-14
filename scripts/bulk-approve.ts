/**
 * Approve (review + publish) every pending acronym after a human pass.
 *
 *   npm run approve
 *
 * Works with either the Supabase service key or the direct Postgres URL.
 */
import {
  createServiceSupabaseClient,
  isSupabaseServiceConfigured,
} from '../lib/supabase-server';
import { getSql, isPgConfigured } from '../lib/pg';

async function main() {
  if (isSupabaseServiceConfigured()) {
    const supabase = createServiceSupabaseClient();
    const { data, error } = await supabase
      .from('acronyms')
      .update({ is_reviewed: true, is_published: true })
      .eq('is_published', false)
      .select('acronym');
    if (error) throw new Error(error.message);
    console.log(`Approved ${data?.length ?? 0} acronyms.`);
    return;
  }

  if (isPgConfigured()) {
    const sql = getSql();
    const rows = await sql`
      update acronyms set is_reviewed = true, is_published = true
      where is_published = false returning acronym`;
    console.log(`Approved ${rows.length} acronyms.`);
    await sql.end();
    return;
  }

  console.error('Set SUPABASE_DB_URL (or the Supabase service key) to approve.');
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

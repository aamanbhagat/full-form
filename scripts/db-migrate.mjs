// Apply supabase/migrations/*.sql to the database in SUPABASE_DB_URL.
//   npm run migrate
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import postgres from 'postgres';

const url = process.env.SUPABASE_DB_URL;
if (!url) {
  console.error('SUPABASE_DB_URL is not set.');
  process.exit(1);
}

const sql = postgres(url, { ssl: 'require', prepare: false });
const dir = 'supabase/migrations';
const files = readdirSync(dir)
  .filter((f) => f.endsWith('.sql'))
  .sort();

try {
  for (const file of files) {
    const text = readFileSync(path.join(dir, file), 'utf8');
    await sql.unsafe(text);
    console.log(`applied ${file}`);
  }
  console.log('migrations complete');
} catch (err) {
  console.error('migration failed:', err.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}

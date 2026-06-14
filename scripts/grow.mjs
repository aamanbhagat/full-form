// Two-stage bulk generator: DeepSeek *enumerates* the acronyms, then DeepSeek
// *writes* each page. This is what fills "every category, every alphabet"
// without hand-typing lists.
//
//   Stage 1 (enumerate): ask the model for the real, commonly-searched acronyms
//                        in a category — optionally letter by letter (A–Z).
//   Stage 2 (generate):  for each NEW acronym (not already in the DB), generate
//                        full page content in parallel and insert it live.
//
// Usage:
//   npm run grow -- all                 # every category, bulk list each
//   npm run grow -- chat slang          # just these categories
//   npm run grow -- tech --by-letter    # A–Z sweep of Technology
//   TARGET=200 npm run grow -- banking  # ask for ~200 (bulk mode)
//   PER_LETTER=12 npm run grow -- all --by-letter   # ~12 per letter, every cat
//   CONCURRENCY=15 npm run grow -- all  # tune Stage-2 parallelism
//
// Idempotent: anything already in the DB is skipped, so re-running only adds
// what's missing. Inserts as is_published=true, is_reviewed=true.
import postgres from 'postgres';

const DB_URL = process.env.SUPABASE_DB_URL;
const DS_KEY = process.env.DEEPSEEK_API_KEY;
const DS_BASE = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1';
const CONCURRENCY = Number(process.env.CONCURRENCY || 12);
const TARGET = Number(process.env.TARGET || 120); // bulk-mode list size per category
const PER_LETTER = Number(process.env.PER_LETTER || 10); // by-letter list size
if (!DB_URL) { console.error('SUPABASE_DB_URL not set'); process.exit(1); }
if (!DS_KEY) { console.error('DEEPSEEK_API_KEY not set'); process.exit(1); }

// slug → { name, hint } for every browsable category. `hint` steers enumeration.
const CATALOG = {
  banking: { cat: 'Banking', name: 'Banking & Finance', hint: 'banking, finance, RBI, payments, markets; Indian and global.' },
  government: { cat: 'Government', name: 'Government & Exams', hint: 'Indian government bodies, schemes, ministries, and competitive exams.' },
  education: { cat: 'Education', name: 'Education', hint: 'school boards, entrance exams, degrees, and institutions; Indian and global.' },
  medical: { cat: 'Medical', name: 'Medical & Health', hint: 'medical tests, diseases, anatomy, and health organisations.' },
  tech: { cat: 'Tech', name: 'Technology', hint: 'computing, software, hardware, internet, file formats, and AI.' },
  science: { cat: 'Science', name: 'Science', hint: 'physics, chemistry, biology, space, and research.' },
  business: { cat: 'Business', name: 'Business & Corporate', hint: 'management, marketing, corporate roles, and finance jargon.' },
  law: { cat: 'Law', name: 'Law & Legal', hint: 'courts, acts, taxes, and legal procedure; Indian and global.' },
  defence: { cat: 'Defence', name: 'Defence & Police', hint: 'armed forces, paramilitary, police, and defence agencies; Indian and global.' },
  sports: { cat: 'Sports', name: 'Sports', hint: 'games, tournaments, leagues, and sporting bodies worldwide.' },
  organisations: { cat: 'Organisations', name: 'Organisations', hint: 'companies, PSUs, and well-known Indian and international bodies.' },
  chat: { cat: 'Chat', name: 'Chat & Texting', hint: 'texting and messaging shorthand used in WhatsApp, SMS, and DMs (e.g. BRB, GTG, TTYL, IMO, OMW, TBH).' },
  slang: { cat: 'Slang', name: 'Slang & Internet', hint: 'internet slang and social-media lingo (e.g. LOL, LMAO, ROFL, YOLO, FOMO, GOAT, SMH, POV).' },
  general: { cat: 'General', name: 'General', hint: 'common everyday acronyms across all domains; Indian and global.' },
};
const ALL_SLUGS = Object.keys(CATALOG);
const VALID_CATS = Object.values(CATALOG).map((c) => c.cat);
const CHATTY = new Set(['Chat', 'Slang']); // these skip the exam/India framing

const slugOf = (a) => `full-form-of-${a.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const A_TO_Z = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];

async function chat(messages, maxTokens) {
  const res = await fetch(`${DS_BASE}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${DS_KEY}` },
    body: JSON.stringify({
      model: 'deepseek-v4-pro',
      chat_template_kwargs: { thinking: false },
      max_tokens: maxTokens,
      temperature: 0.4,
      messages,
    }),
  });
  if (!res.ok) throw new Error(`DeepSeek ${res.status} ${res.statusText}`);
  const data = await res.json();
  return (data.choices?.[0]?.message?.content || '').replace(/```json|```/g, '').trim();
}

// Keep only plausible acronym tokens (2–10 chars, letters/digits/&./-).
const cleanList = (arr) =>
  [...new Set(
    (Array.isArray(arr) ? arr : [])
      .map((s) => String(s).trim().toUpperCase())
      .filter((s) => /^[A-Z0-9][A-Z0-9&./-]{1,9}$/.test(s)),
  )];

// ── Stage 1: enumerate ────────────────────────────────────────────
async function enumerateBulk(slug) {
  const { name, hint } = CATALOG[slug];
  const raw = await chat([
    { role: 'system', content: 'You list real, well-known acronyms. Respond ONLY with a JSON array of uppercase strings. No prose, no markdown.' },
    { role: 'user', content: `List ${TARGET} of the most commonly-searched real acronyms in the category "${name}" (${hint}) Spread them across the alphabet A–Z. Only real acronyms people look up the full form of — no invented ones. JSON array of strings only.` },
  ], 8000); // V4 Pro burns ~1.5k+ reasoning tokens even with thinking off; a low cap leaves nothing for the answer.
  try { return cleanList(JSON.parse(raw)); } catch { return []; }
}

async function enumerateLetter(slug, letter) {
  const { name, hint } = CATALOG[slug];
  const raw = await chat([
    { role: 'system', content: 'You list real, well-known acronyms. Respond ONLY with a JSON array of uppercase strings. No prose, no markdown.' },
    { role: 'user', content: `List up to ${PER_LETTER} real, commonly-searched acronyms in the category "${name}" (${hint}) that START WITH THE LETTER "${letter}". Only real acronyms people look up the full form of. JSON array of uppercase strings only. If none, return [].` },
  ], 8000); // see enumerateBulk — reasoning needs headroom or the response truncates to empty.
  try { return cleanList(JSON.parse(raw)); } catch { return []; }
}

// ── Stage 2: generate one page ────────────────────────────────────
function systemPrompt(cat) {
  const common = `Respond ONLY in valid JSON. No markdown, no backticks, no preamble. Raw JSON only.

Required schema:
{
  "full_form": "complete expansion of the acronym",
  "description": "<DESC>",
  "example_usage": "<EXAMPLE>",
  "hindi_full_form": "Hindi translation of the full form in Devanagari script (or the English term written in Devanagari if it is a chat/slang term)",
  "related_acronyms": ["3 to 5 related acronym strings, uppercase"],
  "tags": ["3 to 8 lowercase tags"],
  "meta_description": "exactly 150-160 characters. Must include the acronym and its full form. Natural, no truncation.",
  "faq": [
    {"question": "What is the full form of [ACRONYM]?", "answer": "concise 1-2 sentence answer"},
    {"question": "second question people search about this acronym", "answer": "concise answer"},
    {"question": "third question", "answer": "concise answer"}
  ]
}`;
  if (CHATTY.has(cat)) {
    return `You are a friendly writer explaining texting and internet slang to everyday readers in India.
${common}

<DESC>: 140-180 words in plain, casual English. Cover: what it stands for, what it actually means in a conversation, where it's used (WhatsApp, Instagram, gaming, etc.), and the tone/etiquette (formal vs. friendly). Flowing prose, no bullet points.
<EXAMPLE>: one short realistic chat/text message that uses the term naturally.`;
  }
  return `You are an expert content writer for an Indian educational reference site targeting students and professionals.
${common}

<DESC>: 180-220 words in plain English. Cover: what it is, its role (in India, and globally where relevant), when and where it is used, and one sentence on exam relevance if applicable. Flowing prose, no bullet points.
<EXAMPLE>: one real sentence showing the acronym used naturally in an Indian context.`;
}

async function generate(acronym, cat) {
  const raw = await chat([
    { role: 'system', content: systemPrompt(cat) },
    { role: 'user', content: `Generate content for the acronym "${acronym}" in the "${cat}" category.` },
  ], 8000);
  if (!raw) throw new Error('empty content');
  const c = JSON.parse(raw);
  if (!c.full_form || !c.description || !Array.isArray(c.faq)) throw new Error('malformed JSON');
  c.category = VALID_CATS.includes(cat) ? cat : 'General';
  return c;
}

async function insert(sql, acronym, c, sv) {
  await sql`insert into acronyms (
    acronym, full_form, category, description, example_usage, hindi_full_form,
    faq, related_acronyms, tags, slug, meta_title, meta_description,
    search_volume_estimate, is_published, is_reviewed
  ) values (
    ${acronym}, ${c.full_form}, ${c.category}, ${c.description}, ${c.example_usage || null},
    ${c.hindi_full_form || null}, ${sql.json(c.faq)}, ${c.related_acronyms || []}, ${c.tags || []},
    ${slugOf(acronym)}, ${`${acronym} Full Form | ${c.full_form}`}, ${c.meta_description || null},
    ${sv}, true, true
  ) on conflict (slug) do nothing`;
}

async function main() {
  const args = process.argv.slice(2);
  const byLetter = args.includes('--by-letter');
  const dryRun = args.includes('--dry-run') || args.includes('--count');
  const wanted = args.filter((a) => !a.startsWith('-')).map((a) => a.toLowerCase());
  const slugs = wanted.includes('all') || wanted.length === 0
    ? ALL_SLUGS
    : wanted.filter((s) => ALL_SLUGS.includes(s));
  if (!slugs.length) {
    console.error(`No valid categories. Choose from: ${ALL_SLUGS.join(', ')} (or "all").`);
    process.exit(1);
  }

  const sql = postgres(DB_URL, { ssl: 'require', prepare: false, max: CONCURRENCY + 2 });
  const start = Date.now();

  // ── Stage 1: enumerate every requested category ──
  console.log(`Stage 1 — enumerating ${slugs.length} categor${slugs.length === 1 ? 'y' : 'ies'} (${byLetter ? 'A–Z sweep' : 'bulk'})…`);
  const jobs = []; // { acronym, cat }
  const seen = new Set();
  for (const slug of slugs) {
    const { cat, name } = CATALOG[slug];
    let list = [];
    if (byLetter) {
      const perLetter = await Promise.all(A_TO_Z.map((L) => enumerateLetter(slug, L).catch(() => [])));
      list = perLetter.flat();
    } else {
      list = await enumerateBulk(slug).catch(() => []);
    }
    let added = 0;
    for (const a of list) {
      if (seen.has(a)) continue; // first category to claim an acronym wins
      seen.add(a);
      jobs.push({ acronym: a, cat });
      added++;
    }
    console.log(`  ${name}: ${added} candidates`);
  }
  console.log(`Stage 1 done — ${jobs.length} unique candidates.\n`);

  // Drop ones already in the DB up front (one query).
  if (jobs.length) {
    const existing = await sql`select slug from acronyms where slug in ${sql(jobs.map((j) => slugOf(j.acronym)))}`;
    const have = new Set(existing.map((r) => r.slug));
    const before = jobs.length;
    for (let i = jobs.length - 1; i >= 0; i--) if (have.has(slugOf(jobs[i].acronym))) jobs.splice(i, 1);
    console.log(`Skipping ${before - jobs.length} already in the database. ${dryRun ? 'Would generate' : 'Generating'} ${jobs.length} new.\n`);
  }

  if (dryRun) {
    const byCat = {};
    for (const j of jobs) byCat[j.cat] = (byCat[j.cat] || 0) + 1;
    for (const [cat, n] of Object.entries(byCat).sort((a, b) => b[1] - a[1])) {
      console.log(`  ${String(n).padStart(4)}  ${cat}`);
    }
    console.log(`\nDry run — ${jobs.length} new pages would be generated. Nothing written.`);
    await sql.end();
    return;
  }

  // ── Stage 2: generate + insert in parallel ──
  let ok = 0, fail = 0, idx = 0;
  async function worker() {
    for (let i = idx++; i < jobs.length; i = idx++) {
      const { acronym, cat } = jobs[i];
      try {
        let c;
        for (let attempt = 1; ; attempt++) {
          try { c = await generate(acronym, cat); break; }
          catch (e) { if (attempt >= 2) throw e; await sleep(600); }
        }
        await insert(sql, acronym, c, Math.max(500, 8000 - i));
        console.log(`OK    [${cat}] ${acronym} — ${c.full_form}`); ok++;
      } catch (e) {
        console.error(`FAIL  [${cat}] ${acronym}: ${e.message}`); fail++;
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  await sql.end();

  const secs = ((Date.now() - start) / 1000).toFixed(0);
  console.log(`\nDone in ${secs}s. added=${ok} failed=${fail}`);
}

main().catch((e) => { console.error(e); process.exit(1); });

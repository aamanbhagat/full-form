// Self-contained content seeder: DeepSeek V4 Pro → Postgres, no Next runtime.
// Runs requests in parallel (a worker pool) so hundreds of acronyms take
// minutes, not hours. Content is one-time: a seeded page never regenerates.
//
//   npm run seed                  # default list, published live
//   npm run seed -- RBI SEBI UPI  # specific acronyms
//   CONCURRENCY=15 npm run seed   # tune parallelism
//
// Inserts rows as is_published=true, is_reviewed=true (owner-curated seed).
import postgres from 'postgres';

const DB_URL = process.env.SUPABASE_DB_URL;
const DS_KEY = process.env.DEEPSEEK_API_KEY;
const DS_BASE = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1';
const CONCURRENCY = Number(process.env.CONCURRENCY || 10);
if (!DB_URL) { console.error('SUPABASE_DB_URL not set'); process.exit(1); }
if (!DS_KEY) { console.error('DEEPSEEK_API_KEY not set'); process.exit(1); }

const CATEGORIES = ['Banking', 'Government', 'Education', 'Medical', 'Tech', 'Science', 'Business', 'Law', 'Defence', 'Sports', 'Organisations', 'Chat', 'Slang', 'General'];

const SYSTEM_PROMPT = `You are an expert content writer for an Indian educational reference site targeting students and professionals.
Generate structured content for acronym pages.
Respond ONLY in valid JSON. No markdown. No backticks. No preamble. No explanation. Raw JSON only.

Required schema:
{
  "full_form": "complete expansion of the acronym",
  "category": "exactly one of: Government | Banking | Education | Medical | Tech | Science | Business | Law | Defence | Sports | Organisations | General",
  "description": "180-220 words in plain English. Cover: what it is, its role in India, when and where it is used, and one sentence on exam relevance if applicable. No bullet points. Flowing prose only.",
  "example_usage": "one real sentence showing the acronym used naturally in Indian context",
  "hindi_full_form": "Hindi translation of the full form in Devanagari script",
  "related_acronyms": ["3 to 5 related acronym strings, uppercase"],
  "tags": ["3 to 8 lowercase tags relevant to Indian context"],
  "meta_description": "exactly 150-160 characters. Must include the acronym and its full form. Natural conversational language. No truncation.",
  "faq": [
    {"question": "What is the full form of [ACRONYM]?", "answer": "concise 1-2 sentence answer"},
    {"question": "second relevant question Indians search about this acronym", "answer": "concise answer"},
    {"question": "third relevant question", "answer": "concise answer"}
  ]
}`;

const DEFAULT_SEED = [
  // Banking & finance
  'RBI','SEBI','NEFT','RTGS','IMPS','UPI','KYC','EMI','CIBIL','IFSC','NBFC','ATM','NPCI','NSE','BSE','SENSEX','NIFTY','FD','PPF','EPF',
  // Government & exams
  'UPSC','IAS','IPS','IFS','SSC','IBPS','NDA','CDS','CAPF','RTI','PIL','CBI','ED','NIA','RAW','MEA','MHA','MGNREGA','PMAY','AADHAAR',
  // Education
  'CBSE','ICSE','NEET','JEE','GATE','UGC','NET','AICTE','NAAC','NIRF','IIT','NIT','IIM','AIIMS','CLAT','CAT','MBBS','BTECH','MBA','PHD',
  // Medical
  'WHO','ICU','OPD','MRI','CT','ECG','EEG','BP','BMI','HIV','AIDS','TB','ORS','RBC','WBC','ENT',
  // Tech
  'AI','ML','API','OS','CPU','GPU','RAM','ROM','SSD','HTTP','HTTPS','URL','VPN','DNS','HTML','CSS','SQL','USB','GPS','OTP','PDF','QR','LED',
  // Science
  'DNA','RNA','ATP','NASA','ISRO','UV','LASER','PH',
  // Business
  'CEO','CFO','CTO','COO','HR','KPI','ROI','MSME','IPO','CRM','ERP','USP',
  // Law / taxes
  'FIR','IPC','CRPC','POCSO','NDPS','GST','PAN','TDS','ITR',
  // Defence & police
  'NSG','CRPF','BSF','ITBP','DRDO','HAL','IAF',
  // Sports
  'BCCI','IPL','ICC','FIFA','ODI','NBA','IOC',
  // Organisations
  'ONGC','LIC','SBI','UN','UNESCO','UNICEF',
  // General
  'NGO','GDP','ASAP','FAQ','DIY','DOB','VIP','PIN',
];

const slugOf = (a) => `full-form-of-${a.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function generate(acronym) {
  const res = await fetch(`${DS_BASE}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${DS_KEY}` },
    body: JSON.stringify({
      model: 'deepseek-v4-pro',
      chat_template_kwargs: { thinking: false },
      max_tokens: 8000,
      temperature: 0.3,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Generate content for the acronym: ${acronym}` },
      ],
    }),
  });
  if (!res.ok) throw new Error(`DeepSeek ${res.status} ${res.statusText}`);
  const data = await res.json();
  const raw = (data.choices?.[0]?.message?.content || '').replace(/```json|```/g, '').trim();
  if (!raw) throw new Error('empty content');
  const c = JSON.parse(raw);
  if (!c.full_form || !c.description || !Array.isArray(c.faq)) throw new Error('malformed JSON');
  if (!CATEGORIES.includes(c.category)) c.category = 'General';
  return c;
}

async function insert(sql, acronym, i, c) {
  const slug = slugOf(acronym);
  const sv = Math.max(500, 100000 - i * 300);
  await sql`insert into acronyms (
    acronym, full_form, category, description, example_usage, hindi_full_form,
    faq, related_acronyms, tags, slug, meta_title, meta_description,
    search_volume_estimate, is_published, is_reviewed
  ) values (
    ${acronym}, ${c.full_form}, ${c.category}, ${c.description}, ${c.example_usage || null},
    ${c.hindi_full_form || null}, ${sql.json(c.faq)}, ${c.related_acronyms || []}, ${c.tags || []},
    ${slug}, ${`${acronym} Full Form | ${c.full_form}`}, ${c.meta_description || null},
    ${sv}, true, true
  )`;
}

async function main() {
  const args = process.argv.slice(2).filter((a) => !a.startsWith('-'));
  const list = [...new Set((args.length ? args : DEFAULT_SEED).map((a) => a.trim().toUpperCase()))];
  const sql = postgres(DB_URL, { ssl: 'require', prepare: false, max: CONCURRENCY + 2 });
  const start = Date.now();
  let ok = 0, skip = 0, fail = 0, idx = 0;

  console.log(`Seeding ${list.length} acronyms, concurrency ${CONCURRENCY}…\n`);

  async function worker() {
    for (let i = idx++; i < list.length; i = idx++) {
      const acronym = list[i];
      try {
        const exists = await sql`select 1 from acronyms where slug = ${slugOf(acronym)} limit 1`;
        if (exists.length) { console.log(`SKIP  ${acronym}`); skip++; continue; }
        let c;
        for (let attempt = 1; ; attempt++) {
          try { c = await generate(acronym); break; }
          catch (e) { if (attempt >= 2) throw e; await sleep(600); }
        }
        await insert(sql, acronym, i, c);
        console.log(`OK    ${acronym} — ${c.full_form}`); ok++;
      } catch (e) {
        console.error(`FAIL  ${acronym}: ${e.message}`); fail++;
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  await sql.end();
  const secs = ((Date.now() - start) / 1000).toFixed(0);
  console.log(`\nDone in ${secs}s. ok=${ok} skip=${skip} fail=${fail}`);
}

main().catch((e) => { console.error(e); process.exit(1); });

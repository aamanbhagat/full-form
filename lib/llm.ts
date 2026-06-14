import type { AcronymContent, Category } from '@/types';
import { CATEGORIES } from '@/types';

// ─── Generation backend (env-switchable) ─────────────────────
// DeepSeek, TokenRouter (MiniMax-M3), and any other OpenAI-compatible endpoint
// all speak the same POST /chat/completions shape, so a "provider" is just
// { baseUrl, apiKey, model, maxTokens }. Selection precedence:
//   1. LLM_PROVIDER=deepseek|tokenrouter, if set (and its key is present)
//   2. otherwise the first provider whose API key is configured
//   3. otherwise mock mode (deterministic placeholder content, no network)
//
// Switch providers with env only — no code change:
//   LLM_PROVIDER=tokenrouter
//   TOKENROUTER_API_KEY=sk-...
// Optional overrides: *_BASE_URL, *_MODEL.

interface ProviderConfig {
  name: string;
  baseUrl: string;
  apiKey: string | undefined;
  model: string;
  maxTokens: number;
}

const PROVIDERS = {
  deepseek: (): ProviderConfig => ({
    name: 'deepseek',
    baseUrl: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1',
    apiKey: process.env.DEEPSEEK_API_KEY,
    model: process.env.DEEPSEEK_MODEL || 'deepseek-v4-flash',
    maxTokens: 4000,
  }),
  tokenrouter: (): ProviderConfig => ({
    name: 'tokenrouter',
    baseUrl:
      process.env.TOKENROUTER_BASE_URL || 'https://api.tokenrouter.com/v1',
    apiKey: process.env.TOKENROUTER_API_KEY,
    // MiniMax-M3 is a reasoning model — it spends tokens on a <think> block
    // before the JSON, so give it more headroom than DeepSeek.
    model: process.env.TOKENROUTER_MODEL || 'MiniMax-M3',
    maxTokens: 8000,
  }),
} as const;

type ProviderName = keyof typeof PROVIDERS;

function selectProvider(): ProviderConfig | null {
  const explicit = process.env.LLM_PROVIDER?.toLowerCase();
  if (explicit && explicit in PROVIDERS) {
    const cfg = PROVIDERS[explicit as ProviderName]();
    return cfg.apiKey ? cfg : null;
  }
  for (const make of Object.values(PROVIDERS)) {
    const cfg = make();
    if (cfg.apiKey) return cfg;
  }
  return null;
}

/** True when a real generation backend is configured (else we mock). */
export function isLlmConfigured(): boolean {
  return selectProvider() !== null;
}

/** Human-readable label for the active backend, for logging. */
export function activeProvider(): string {
  return selectProvider()?.name ?? 'mock';
}

// Exact generation contract — do not modify the schema description.
const GENERATION_SYSTEM_PROMPT = `You are an expert content writer for an Indian educational reference site targeting students and professionals.
Generate structured content for acronym pages.
Respond ONLY in valid JSON. No markdown. No backticks. No preamble. No explanation. Raw JSON only.

Required schema:
{
  "full_form": "complete expansion of the acronym",
  "category": "exactly one of: Government | Banking | Education | Medical | Tech | Science | Business | Law | Defence | Sports | Organisations | Chat | Slang | General | Country | State",
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

interface ChatCompletionResponse {
  choices: Array<{ message: { content: string } }>;
}

function isCategory(value: unknown): value is Category {
  return (
    typeof value === 'string' && (CATEGORIES as readonly string[]).includes(value)
  );
}

// Reasoning models (e.g. MiniMax-M3) prefix the answer with a <think>…</think>
// block, and models occasionally wrap JSON in prose or code fences. Strip the
// reasoning, drop fences, then slice to the outermost {…} so JSON.parse only
// ever sees the payload — regardless of which provider produced it.
function extractJson(raw: string): string {
  let s = raw.replace(/<think>[\s\S]*?<\/think>/gi, '');
  s = s.replace(/```json|```/g, '').trim();
  const start = s.indexOf('{');
  const end = s.lastIndexOf('}');
  return start !== -1 && end > start ? s.slice(start, end + 1) : s;
}

/** Narrow unknown JSON into AcronymContent, throwing on a contract breach. */
function parseContent(raw: string, acronym: string): AcronymContent {
  const cleaned = extractJson(raw);
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(
      `Invalid JSON from model for ${acronym}: ${cleaned.slice(0, 200)}`,
    );
  }

  const c = parsed as Record<string, unknown>;
  if (
    typeof c.full_form !== 'string' ||
    !isCategory(c.category) ||
    typeof c.description !== 'string' ||
    !Array.isArray(c.faq)
  ) {
    throw new Error(`Malformed content from model for ${acronym}.`);
  }

  return {
    full_form: c.full_form,
    category: c.category,
    description: c.description,
    example_usage: typeof c.example_usage === 'string' ? c.example_usage : '',
    hindi_full_form:
      typeof c.hindi_full_form === 'string' ? c.hindi_full_form : '',
    related_acronyms: Array.isArray(c.related_acronyms)
      ? (c.related_acronyms as string[])
      : [],
    tags: Array.isArray(c.tags) ? (c.tags as string[]) : [],
    meta_description:
      typeof c.meta_description === 'string' ? c.meta_description : '',
    faq: c.faq as AcronymContent['faq'],
  };
}

/** Deterministic placeholder used until a generation backend is configured. */
function mockContent(acronym: string): AcronymContent {
  const upper = acronym.toUpperCase();
  return {
    full_form: `${upper} (full form pending review)`,
    category: 'General',
    description:
      `${upper} is an acronym commonly used in India. This is placeholder content generated in mock mode because no generation backend is configured. ` +
      'Once a key is provided, this description will be replaced with a 180–220 word explanation covering what it is, its role in India, where it is used, and its exam relevance.',
    example_usage: `The term ${upper} is widely used in everyday Indian contexts.`,
    hindi_full_form: `${upper} का पूरा रूप`,
    related_acronyms: [],
    tags: ['india', 'acronym', 'full form'],
    meta_description: `${upper} full form and meaning — a quick reference for students and professionals in India. Placeholder pending review.`.slice(
      0,
      160,
    ),
    faq: [
      {
        question: `What is the full form of ${upper}?`,
        answer: `The full form of ${upper} will be confirmed during review.`,
      },
      {
        question: `Where is ${upper} used?`,
        answer: `${upper} is used in common Indian contexts.`,
      },
      {
        question: `Is ${upper} important for exams?`,
        answer: 'Relevance to competitive exams will be added during review.',
      },
    ],
  };
}

export async function generateAcronymContent(
  acronym: string,
): Promise<AcronymContent> {
  const provider = selectProvider();
  if (!provider) return mockContent(acronym);

  const response = await fetch(`${provider.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${provider.apiKey}`,
    },
    body: JSON.stringify({
      model: provider.model,
      max_tokens: provider.maxTokens,
      temperature: 0.3,
      messages: [
        { role: 'system', content: GENERATION_SYSTEM_PROMPT },
        { role: 'user', content: `Generate content for the acronym: ${acronym}` },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(
      `${provider.name} API error: ${response.status} ${response.statusText}`,
    );
  }

  const data: ChatCompletionResponse = await response.json();
  const raw = data.choices[0]?.message?.content;
  if (!raw) throw new Error(`Empty response from ${provider.name} for ${acronym}.`);
  return parseContent(raw, acronym);
}

# FullFormHub

A production-grade, SEO-first reference site for Indian acronyms. Every acronym
gets its own statically generated, schema-rich page that answers *"what does X
stand for"* in under two seconds. Built on Next.js 16 (Cache Components),
Supabase, and DeepSeek V4 Pro.

> **Design:** see [DESIGN.md](./DESIGN.md). The visual concept is "The Record
> Office" — a colour-tabbed index card per acronym. Lighthouse mobile (verified):
> Performance 96–99, Accessibility 100, Best Practices 100, SEO 100, CLS 0.

## Runs today with zero services

The site ships with a bundled mock dataset ([lib/mock-data.ts](./lib/mock-data.ts))
of 24 real acronyms across all six categories. With **no Supabase or DeepSeek
keys**, everything works — homepage, search, acronym pages, category hubs, admin,
sitemaps.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm run start
```

Every read goes through the cached data layer in [lib/data.ts](./lib/data.ts),
which uses Supabase when configured and falls back to the mock dataset otherwise.
Flip to the real database just by filling in env vars — no code changes.

## Going live

1. **Supabase** — create a project, then either:
   - **Direct Postgres (simplest):** set `SUPABASE_DB_URL` to the pooled connection
     string (Settings → Database) and run `npm run migrate`. This alone powers every
     read/write. Or
   - **REST:** set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and
     `SUPABASE_SERVICE_ROLE_KEY` (Settings → API), and run the SQL in the editor.

   Data resolves REST → Postgres → mock, so whichever you provide wins.
2. **DeepSeek** — set `DEEPSEEK_API_KEY` (model `deepseek-v4-pro`). Without it,
   generation runs in mock mode.
3. **Site** — set `NEXT_PUBLIC_SITE_URL` to the real domain and
   `ADMIN_SECRET_TOKEN` to a long random string.
4. **AdSense (optional)** — set `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-…` to load the
   script. Ad slots reserve their space regardless, so CLS stays 0.

### Content pipeline

```bash
npm run migrate                  # apply supabase/migrations/*.sql to SUPABASE_DB_URL
npm run seed                     # parallel generate the default list → published live
npm run seed -- RBI SEBI UPI     # specific acronyms
CONCURRENCY=15 npm run seed      # tune parallelism (default 10)
```

`seed` runs DeepSeek requests through a **worker pool**, so hundreds of acronyms take
minutes, not hours — and content is one-time (a seeded page never regenerates).
`scripts/generate-content.ts` + `/api/generate` remain for the review workflow, where
drafts land as `is_published=false` and are approved at `/admin` or via `npm run approve`.

> Generation note: `deepseek-v4-pro` spends ~1.5k reasoning tokens per call even in
> non-thinking mode, so `max_tokens` is 8000 to fit reasoning + the full JSON.

## Architecture notes

- **Next.js 16 specifics** were read from the bundled docs in `node_modules/next/dist/docs`
  before use — this is not Next 14. `proxy.ts` replaces `middleware.ts`;
  `cacheComponents: true` replaces PPR; `'use cache'` + `cacheLife` replace
  `revalidate`.
- **Caching** lives on the data functions, not the page files. Pages read
  `params`/`searchParams` (illegal inside `use cache`) and pass plain values into
  cached functions. The 24 acronym pages + 6 hubs prerender; unknown slugs render
  on demand and return a real **404** (no soft-404).
- **`searchParams`** (category pagination, search query) is read inside
  `<Suspense>` so the page shells stay static under Cache Components.
- **Sitemaps:** App Router has no partial-dynamic segments, so `sitemap-<cat>.xml`
  are literal routes backed by one factory in [lib/sitemap-xml.ts](./lib/sitemap-xml.ts).
- **No client JS for content** — only the search bar is a client component. FAQs
  use native `<details>`; the category colour system is pure CSS via a single
  `--cat` custom property.

## Deliberate deviations from the original spec

- **Mock-data fallback layer** added so the site builds and demos with zero
  services. The spec's pages queried Supabase directly; routing them through
  [lib/data.ts](./lib/data.ts) keeps that option while staying buildable today.
- **`'use cache'` placement:** on data functions, not atop pages that read
  `searchParams` (which would break the build under Cache Components).
- **Query strings on acronym URLs** 308-redirect to the clean URL instead of
  hard-404 — same SEO dedup, but a real visitor arriving with `?utm=…` keeps their
  page.
- **Category colours** were refined from the spec's values (see DESIGN.md) for a
  more legible, cohesive institutional palette; all pass 4.5:1 with white text.

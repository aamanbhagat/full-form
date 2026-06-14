# FullFormHub — Design Plan

**Concept: The Record Office.** A full-form site is, at heart, an index — a card catalogue of Indian
institutional acronyms. So the interface borrows the vernacular of the Indian record office: the
ruled register, the index card, the colour-tabbed file drawer. The signature is a **record card** whose
left edge carries a coloured **category tab**, and that one category colour threads through every
surface that touches it. Fast, scannable, unmistakably Indian-institutional — without a single hero image.

**Subject / audience / job.** Subject: Indian acronyms and their full forms. Audience: students, exam
aspirants, and professionals on low-end Android over 4G. The page's single job: answer *"what does X
stand for"* in under two seconds. The search bar is the hero; everything else is the answer.

---

## 1. Palette — roles

| Token | Hex | Role |
|---|---|---|
| `--paper` | `#F4F6F8` | Page surface. A **cool** register-paper grey — deliberately *not* warm cream. |
| `--card` | `#FFFFFF` | Raised record cards, answer box, inputs. |
| `--ink` | `#161B26` | Primary text. Near-black indigo — fountain-pen ink, warmer than `#000`. |
| `--ink-soft` | `#4B5566` | Secondary text, descriptions. |
| `--ink-faint` | `#8A93A3` | Muted labels, eyebrows, captions. |
| `--rule` | `#DCE1E8` | Hairline borders and the ruled-register baselines. |

Two accents, used with restraint:
- `--indigo` `#1C3D6E` — the brand anchor: links, primary brand marks, the wordmark.
- `--saffron` `#E8732B` — India saffron. Appears **only** on the search CTA and one masthead stroke. Spent once, deliberately.

## 2. Typography — two voices

- **Display — Bricolage Grotesque** (600 / 700). A contemporary grotesque with institutional weight and a
  little idiosyncrasy in the letterforms. Used with restraint: the wordmark, `h1`, `h2`. Not Inter, not a serif.
- **Body & UI — IBM Plex Sans** (400 / 500 / 600). Built for clarity at small sizes on cheap screens; an
  institutional heritage that fits the subject. Crucially it has a **Devanagari sibling** — so Latin and Hindi
  content share one type system.
  - **IBM Plex Sans Devanagari** (400/600) for the Hindi full forms — loaded only where Hindi renders.
  - **IBM Plex Mono** (500) renders the acronym itself as a *record identifier* (`U P S C`), letter-spaced.

All faces self-hosted via `next/font` (build-time subset, `display: swap`, `size-adjust` → zero layout shift,
no third-party connection). Only the display face is preloaded.

**Type scale** (rem): `xs .75 / sm .875 / base 1 / lg 1.125 / xl 1.25 / 2xl 1.5 / 3xl 1.875 / 4xl 2.25 / 5xl 3`.
Line heights: `1.05` display, `1.3` headings, `1.65` prose. Body base is 16px (never smaller for prose).

## 3. Category colour map

One colour per category, threaded through tab, badge, breadcrumb segment, card border, and hub header.
All are mid-dark and desaturated so they share one institutional register **and** clear white text (≥4.5:1).

| Category | Hex | Justification |
|---|---|---|
| Banking & Finance | `#0F6E5C` | Ledger green — money, account books. |
| Government & Exams | `#9B2D2D` | Seal-wax red — official files, red tape. |
| Education | `#1F5FA8` | Scholar's blue — boards, school crests. |
| Medical & Health | `#7A2E8F` | Clinical violet — distinct from the rest of the drawer. |
| Technology | `#14627E` | Circuit teal — screens and boards. |
| General | `#6E5E2F` | Bronze/khaki — the miscellaneous file drawer. |

## 4. Signature element — the record card

The acronym answer is a white **record card**. Its left edge is a 6px coloured **category tab** (the file
divider). A faint ruled baseline (1px, `--rule`, ~6% beneath the prose) evokes register paper. The acronym
prints large in IBM Plex Mono, letter-spaced, as the record's identifier; the full form sits directly under it.

**Implementation — one source of truth.** A wrapper sets a single custom property from the row's category:
```
<article class="record-card" style={{ ['--cat']: categoryColor }}>
```
The tab, badge, breadcrumb category link, related-card borders, and category hub band all read `var(--cat)`.
Change the category, the whole colour system follows — no per-category CSS branches.

## Dark mode (added by request)

The original brief specified light-only; the owner later asked for dark mode, so it
was added. It is a token-only theme — the same record-office system on a deep
navy-charcoal (`--paper #0F141B`, `--card #181D26`). Category colours are *solid* on
tabs/badges (white text, unchanged) and **lightened for text** via a single
`--cat-on-surface = color-mix(--cat 62%, white)` indirection, so every category label
clears 4.5:1 on the dark card (measured 5.17–6.11:1). A `prefers-color-scheme` default
plus a header toggle (persisted to `localStorage`, set pre-paint to avoid flash) drive
a `data-theme` attribute on `<html>`. Links/brand text use `--link`; solid brand
buttons keep `--indigo`.

## 5. Aesthetic risk

The **ruled-register texture + monospace identifier**. Skeuomorphic texture can read dated; I'm taking it
because it makes the answer instantly recognisable as *a record being looked up* and earns the filing-system
concept its keep. Mitigated hard: lines are 1px at ~6% opacity, never behind body prose, and the texture
is the only ornament on an otherwise disciplined page.

---

## Critique against the brief & the AI defaults

- **vs. cream + serif + terracotta:** rejected. Cool register-grey `#F4F6F8` (not cream), a grotesque
  (not a serif), indigo anchor with saffron *as a restrained, India-grounded accent* — not terracotta wallpaper.
- **vs. near-black + acid accent:** rejected outright — brief mandates light mode for low-end Android.
- **vs. broadsheet hairlines / zero-radius newspaper:** the hairlines here are *register rules* tied to the
  filing concept, paired with a small 4px card radius and a warm institutional palette — a record office, not a newspaper.
- **Brief gates honoured:** search bar is the hero (autofocus, largest weight); no hero image; light only;
  ad slots reserved at fixed `min-height` (CLS 0); mobile-first 375 → 768 → 1024.

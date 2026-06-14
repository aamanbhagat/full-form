import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAcronymsByCategory, getCategoryRows, PER_PAGE } from '@/lib/data';
import {
  CATEGORY_META,
  CATEGORY_SLUGS,
  slugToCategory,
} from '@/lib/categories';
import { AZ_LETTERS } from '@/lib/slug';
import { catVars } from '@/lib/css';
import { absoluteUrl } from '@/lib/seo';
import { buildBreadcrumbSchema, buildItemListSchema } from '@/lib/schema';
import { AcronymCard } from '@/components/AcronymCard';
import { BreadcrumbNav } from '@/components/BreadcrumbNav';
import { CategoryTile } from '@/components/CategoryIcon';
import { SchemaOrg } from '@/components/SchemaOrg';

type Params = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export function generateStaticParams() {
  return CATEGORY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: Pick<Params, 'params'>): Promise<Metadata> {
  const { slug } = await params;
  const category = slugToCategory(slug);
  if (!category) return { title: 'Not found', robots: { index: false } };
  const meta = CATEGORY_META[category];
  const canonical = absoluteUrl(`/category/${meta.slug}`);

  // Don't let Google index an empty hub as thin content. The moment the
  // category has published acronyms it becomes indexable again automatically.
  const rows = await getCategoryRows();
  const count = rows.find((r) => r.slug === meta.slug)?.acronym_count ?? 0;
  const title = `${meta.name} Full Forms${count > 0 ? ` — ${count} Acronyms` : ''}`;

  return {
    title,
    description: meta.description,
    // Canonical always points to page 1 — paginated views dedupe to it.
    alternates: { canonical },
    openGraph: {
      title,
      description: meta.description,
      type: 'website',
      url: canonical,
    },
    robots: { index: count > 0, follow: true },
  };
}

function parsePage(value: string | string[] | undefined): number {
  const n = Number(Array.isArray(value) ? value[0] : value);
  return Number.isFinite(n) && n > 1 ? Math.floor(n) : 1;
}

function parseLetter(value: string | string[] | undefined): string | undefined {
  const raw = (Array.isArray(value) ? value[0] : value)?.toUpperCase();
  return raw && (AZ_LETTERS as readonly string[]).includes(raw)
    ? raw
    : undefined;
}

function hrefFor(slug: string, letter?: string, page?: number): string {
  const qs = new URLSearchParams();
  if (letter) qs.set('letter', letter);
  if (page && page > 1) qs.set('page', String(page));
  const s = qs.toString();
  return `/category/${slug}${s ? `?${s}` : ''}`;
}

export default async function CategoryPage({ params, searchParams }: Params) {
  const { slug } = await params;
  const category = slugToCategory(slug);
  if (!category) notFound();
  const meta = CATEGORY_META[category];

  const sp = await searchParams;
  const letter = parseLetter(sp.letter);
  const page = parsePage(sp.page);
  const { items, total, availableLetters } = await getAcronymsByCategory(
    category,
    page,
    letter,
  );
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  return (
    <div className="shell" style={catVars(category)}>
      <SchemaOrg
        schemas={[
          buildBreadcrumbSchema([
            { name: 'Home', url: absoluteUrl('/') },
            { name: meta.name, url: absoluteUrl(`/category/${meta.slug}`) },
          ]),
          ...(items.length > 0 ? [buildItemListSchema(items)] : []),
        ]}
      />

      <BreadcrumbNav
        items={[
          { label: 'Home', href: '/' },
          { label: meta.name, href: null, isCategory: true },
        ]}
      />

      <header className="category-header">
        <CategoryTile category={category} size="lg" />
        <h1 className="category-header__name">{meta.name} Full Forms</h1>
        <p className="category-header__desc">{meta.description}</p>
      </header>

      <p className="prose category-intro">{meta.intro}</p>

      <nav className="az" aria-label="Filter by first letter">
        <Link
          href={hrefFor(meta.slug)}
          className={`az-link ${letter ? '' : 'az-link--active'}`}
        >
          All
        </Link>
        {AZ_LETTERS.map((l) => {
          const has = availableLetters.includes(l);
          const cls = !has
            ? 'az-link az-link--disabled'
            : l === letter
              ? 'az-link az-link--active'
              : 'az-link';
          return (
            <Link key={l} href={hrefFor(meta.slug, l)} className={cls}>
              {l}
            </Link>
          );
        })}
      </nav>

      {items.length > 0 ? (
        <div className="acard-grid">
          {items.map((a) => (
            <AcronymCard key={a.slug} acronym={a} />
          ))}
        </div>
      ) : (
        <p className="notice">
          No full forms here yet{letter ? ` under “${letter}”` : ''}. Try another
          letter or the search bar.
        </p>
      )}

      {totalPages > 1 ? (
        <nav className="pagination" aria-label="Pagination">
          {page > 1 ? (
            <Link
              href={hrefFor(meta.slug, letter, page - 1)}
              className="page-link"
              rel="prev"
            >
              ← Prev
            </Link>
          ) : null}
          <span className="page-status">
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <Link
              href={hrefFor(meta.slug, letter, page + 1)}
              className="page-link"
              rel="next"
            >
              Next →
            </Link>
          ) : null}
        </nav>
      ) : null}
    </div>
  );
}

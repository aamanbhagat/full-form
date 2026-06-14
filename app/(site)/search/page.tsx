import type { Metadata } from 'next';
import { Suspense } from 'react';
import { searchAcronyms } from '@/lib/data';
import { SearchBar } from '@/components/SearchBar';
import { AcronymCard } from '@/components/AcronymCard';

export const metadata: Metadata = {
  title: 'Search',
  // Results pages are crawlable for links but never indexed.
  robots: { index: false, follow: true },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div className="shell page-stack">
      <h1 className="hero-title" style={{ textAlign: 'left' }}>
        Search full forms
      </h1>
      <Suspense fallback={<p className="page-status">Loading…</p>}>
        <SearchView searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function SearchView({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const raw = sp.q;
  const query = (typeof raw === 'string' ? raw : '').trim();
  const results = query.length >= 2 ? await searchAcronyms(query, 50) : [];

  return (
    <>
      <SearchBar initialQuery={query} />

      {query ? (
        <p className="eyebrow">
          {results.length} result{results.length === 1 ? '' : 's'} for “{query}”
        </p>
      ) : (
        <p className="notice">
          Start typing an acronym above — like UPSC, NEET, or UPI.
        </p>
      )}

      {results.length > 0 ? (
        <div className="acard-grid">
          {results.map((a) => (
            <AcronymCard key={a.slug} acronym={a} />
          ))}
        </div>
      ) : query ? (
        <p className="notice">
          No acronym matches “{query}”. Check the spelling, or browse a category.
        </p>
      ) : null}
    </>
  );
}

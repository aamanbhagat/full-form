import type { Metadata } from 'next';
import { getCategoryRows, getTrendingAcronyms } from '@/lib/data';
import { SearchBar } from '@/components/SearchBar';
import { CategoryGrid } from '@/components/CategoryGrid';
import { AcronymCard } from '@/components/AcronymCard';
import { SchemaOrg } from '@/components/SchemaOrg';
import { buildOrganizationSchema, buildWebsiteSchema } from '@/lib/schema';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: { url: '/' },
};

// ISR — refresh the homepage (counts + trending) hourly.
export const revalidate = 3600;

export default async function HomePage() {
  const [categories, trending] = await Promise.all([
    getCategoryRows(),
    getTrendingAcronyms(10),
  ]);

  return (
    <>
      <SchemaOrg schemas={[buildWebsiteSchema(), buildOrganizationSchema()]} />

      {/* The search bar is the hero (DESIGN brief). */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="shell">
          <span className="hero-kicker">India’s acronym reference</span>
          <h1 className="hero-title" id="hero-title">
            Full forms, <em>found fast</em>.
          </h1>
          <p className="hero-sub">
            Type any acronym — UPSC, NEET, UPI, GST — and get the full form in
            plain English, in seconds.
          </p>
          <SearchBar autoFocus />
        </div>
      </section>

      <div className="shell">
        <section className="section" aria-labelledby="browse-title">
          <p className="eyebrow">Browse the drawer</p>
          <h2 className="section-title" id="browse-title">
            Categories
          </h2>
          <CategoryGrid categories={categories} />
        </section>

        {trending.length > 0 ? (
          <section className="section" aria-labelledby="trending-title">
            <p className="eyebrow">Most looked up</p>
            <h2 className="section-title" id="trending-title">
              Trending full forms
            </h2>
            <div className="acard-grid">
              {trending.map((a) => (
                <AcronymCard key={a.slug} acronym={a} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </>
  );
}

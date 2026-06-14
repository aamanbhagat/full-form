import Link from 'next/link';
import { SearchBar } from '@/components/SearchBar';
import { CategoryTile } from '@/components/CategoryIcon';
import { CATEGORY_META } from '@/lib/categories';
import type { Category } from '@/types';

const POPULAR: Category[] = [
  'Banking',
  'Government',
  'Education',
  'Medical',
  'Tech',
  'General',
];

export default function NotFound() {
  return (
    <>
      <section className="hero" aria-labelledby="nf-title">
        <div className="shell">
          <span className="hero-kicker">404 — not on file</span>
          <h1 className="hero-title" id="nf-title">
            That record isn’t in the drawer.
          </h1>
          <p className="hero-sub">
            We couldn’t find that page. The acronym you’re after probably exists
            though — search for it below.
          </p>
          <SearchBar autoFocus />
        </div>
      </section>

      <div className="shell">
        <section className="section" aria-labelledby="nf-browse">
          <p className="eyebrow">Or browse the drawer</p>
          <h2 className="section-title" id="nf-browse">
            Popular categories
          </h2>
          <div className="cat-grid">
            {POPULAR.map((cat) => (
              <Link
                key={cat}
                href={`/category/${CATEGORY_META[cat].slug}`}
                className="cat-card"
                style={{ ['--cat']: CATEGORY_META[cat].color } as React.CSSProperties}
              >
                <CategoryTile category={cat} />
                <div className="cat-card__name">{CATEGORY_META[cat].name}</div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

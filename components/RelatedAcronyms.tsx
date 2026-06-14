import Link from 'next/link';
import type { AcronymSummary } from '@/types';
import { catVars } from '@/lib/css';

// Renders only related acronyms that resolved to real, published pages — never
// a dead link.
export function RelatedAcronyms({ items }: { items: AcronymSummary[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="related-heading">
      <h2 className="section-title" id="related-heading">
        Related full forms
      </h2>
      <div className="chips">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/full-form/${item.slug}`}
            className="chip"
            style={catVars(item.category)}
            title={item.full_form}
          >
            {item.acronym}
          </Link>
        ))}
      </div>
    </section>
  );
}

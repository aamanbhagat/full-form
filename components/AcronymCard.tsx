import Link from 'next/link';
import type { AcronymSummary } from '@/types';
import { catVars } from '@/lib/css';

// Used in trending and category listings. Sets its own --cat so mixed-category
// lists stay correctly colour-coded.
export function AcronymCard({ acronym }: { acronym: AcronymSummary }) {
  return (
    <Link
      href={`/full-form/${acronym.slug}`}
      className="acard"
      style={catVars(acronym.category)}
    >
      <span className="acard__ac">{acronym.acronym}</span>
      <span className="acard__ff">{acronym.full_form}</span>
    </Link>
  );
}

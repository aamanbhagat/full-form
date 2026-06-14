import Link from 'next/link';
import type { CategoryRow } from '@/types';
import type { CSSProperties } from 'react';
import { CategoryTile } from '@/components/CategoryIcon';

export function CategoryGrid({ categories }: { categories: CategoryRow[] }) {
  return (
    <div className="cat-grid">
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/category/${cat.slug}`}
          className="cat-card"
          style={{ ['--cat']: cat.color_hex } as CSSProperties}
        >
          <CategoryTile category={cat.category} />
          <div className="cat-card__name">{cat.name}</div>
          <div className="cat-card__count">
            {cat.acronym_count} full {cat.acronym_count === 1 ? 'form' : 'forms'}
          </div>
        </Link>
      ))}
    </div>
  );
}

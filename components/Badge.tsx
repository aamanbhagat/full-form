import type { Category } from '@/types';
import { CATEGORY_META } from '@/lib/categories';
import { catVars } from '@/lib/css';
import { CategoryIcon } from '@/components/CategoryIcon';

// Category badge. Reads its own colour so it works outside a `--cat` subtree.
export function Badge({
  category,
  withIcon = true,
}: {
  category: Category;
  withIcon?: boolean;
}) {
  const meta = CATEGORY_META[category];
  return (
    <span className="badge" style={catVars(category)}>
      {withIcon ? (
        <CategoryIcon category={category} className="badge__icon" />
      ) : null}
      {meta.name}
    </span>
  );
}

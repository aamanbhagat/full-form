import type { CSSProperties } from 'react';
import type { Category } from '@/types';
import { categoryColor } from '@/lib/categories';

/** Inline style that sets the signature `--cat` colour for a subtree. */
export function catVars(category: Category): CSSProperties {
  return { ['--cat']: categoryColor(category) } as CSSProperties;
}

import type { Category, CategorySlug, CategoryRow } from '@/types';

// Category metadata + the signature colour system (see DESIGN.md §3).
// One colour per category, threaded through tab, badge, breadcrumb, and hub.
// Icons are SVG (components/CategoryIcon), not emoji.
interface CategoryMeta {
  slug: CategorySlug;
  name: string;
  description: string;
  color: string;
}

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  Banking: {
    slug: 'banking',
    name: 'Banking & Finance',
    description:
      'Full forms of banking, finance, and RBI-related acronyms used across India.',
    color: '#0F6E5C',
  },
  Government: {
    slug: 'government',
    name: 'Government & Exams',
    description:
      'Full forms of government bodies, schemes, and competitive exam acronyms.',
    color: '#9B2D2D',
  },
  Education: {
    slug: 'education',
    name: 'Education',
    description:
      'Full forms of boards, entrance exams, and educational institution acronyms.',
    color: '#1F5FA8',
  },
  Medical: {
    slug: 'medical',
    name: 'Medical & Health',
    description:
      'Full forms of medical terms, diseases, and health-organisation acronyms.',
    color: '#7A2E8F',
  },
  Tech: {
    slug: 'tech',
    name: 'Technology',
    description:
      'Full forms of tech, software, hardware, and internet acronyms.',
    color: '#14627E',
  },
  Science: {
    slug: 'science',
    name: 'Science',
    description:
      'Full forms from physics, chemistry, biology, space, and research.',
    color: '#2A7030',
  },
  Business: {
    slug: 'business',
    name: 'Business & Corporate',
    description:
      'Full forms of management, corporate, marketing, and workplace acronyms.',
    color: '#9E5512',
  },
  Law: {
    slug: 'law',
    name: 'Law & Legal',
    description:
      'Full forms of courts, acts, and legal-procedure acronyms used in India.',
    color: '#3E4C9A',
  },
  Defence: {
    slug: 'defence',
    name: 'Defence & Police',
    description:
      'Full forms of the armed forces, paramilitary, and police acronyms.',
    color: '#4F5E2A',
  },
  Sports: {
    slug: 'sports',
    name: 'Sports',
    description:
      'Full forms of games, tournaments, and sporting-body acronyms.',
    color: '#8A6D1F',
  },
  Organisations: {
    slug: 'organisations',
    name: 'Organisations',
    description:
      'Full forms of companies, PSUs, and well-known Indian and global bodies.',
    color: '#5C6470',
  },
  Chat: {
    slug: 'chat',
    name: 'Chat & Texting',
    description:
      'Full forms of texting and messaging shorthand — BRB, GTG, TTYL, IMO, and the rest.',
    color: '#C2255C',
  },
  Slang: {
    slug: 'slang',
    name: 'Slang & Internet',
    description:
      'Full forms of internet slang and social-media lingo — LOL, LMAO, YOLO, FOMO, GOAT.',
    color: '#6741D9',
  },
  General: {
    slug: 'general',
    name: 'General',
    description: 'Common everyday acronyms used in India across all domains.',
    color: '#6E5E2F',
  },
  Country: {
    slug: 'country',
    name: 'Countries',
    description:
      'Country codes, international abbreviations, and global organisation acronyms.',
    color: '#D14D0A',
  },
  State: {
    slug: 'state',
    name: 'States & Provinces',
    description:
      'Full forms of states, provinces, and territories from India and around the world.',
    color: '#FF7F50',
  },
};

const SLUG_TO_CATEGORY = Object.fromEntries(
  (Object.keys(CATEGORY_META) as Category[]).map((c) => [
    CATEGORY_META[c].slug,
    c,
  ]),
) as Record<CategorySlug, Category>;

export const CATEGORY_SLUGS = Object.values(CATEGORY_META).map((c) => c.slug);

export function categoryColor(category: Category): string {
  return CATEGORY_META[category].color;
}

export function categoryToSlug(category: Category): CategorySlug {
  return CATEGORY_META[category].slug;
}

export function slugToCategory(slug: string): Category | null {
  return SLUG_TO_CATEGORY[slug as CategorySlug] ?? null;
}

/** Build the public `categories` listing from metadata + live counts. */
export function buildCategoryRows(
  counts: Record<Category, number>,
): CategoryRow[] {
  return (Object.keys(CATEGORY_META) as Category[]).map((category) => {
    const meta = CATEGORY_META[category];
    return {
      slug: meta.slug,
      category,
      name: meta.name,
      description: meta.description,
      color_hex: meta.color,
      acronym_count: counts[category] ?? 0,
    };
  });
}

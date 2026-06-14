import type { AcronymRow, AcronymSummary, FaqItem } from '@/types';
import { CATEGORY_META } from '@/lib/categories';
import { SITE_NAME, SITE_URL, absoluteUrl } from '@/lib/seo';

type JsonLd = Record<string, unknown>;

export function buildDefinedTermSchema(acronym: AcronymRow): JsonLd {
  const meta = CATEGORY_META[acronym.category];
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: acronym.acronym,
    alternateName: acronym.full_form,
    description: acronym.description,
    url: absoluteUrl(`/full-form/${acronym.slug}`),
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: `${meta.name} Acronyms — ${SITE_NAME}`,
      url: absoluteUrl(`/category/${meta.slug}`),
    },
  };
}

export function buildFAQSchema(faqs: FaqItem[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

export function buildBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Brand entity — helps Google build the Knowledge Graph panel. */
export function buildOrganizationSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl('/icon.svg'),
    description:
      'A reference site for the full forms of Indian acronyms across banking, government, education, medical, tech, and more.',
  };
}

/** A category hub's acronyms as an ordered list. */
export function buildItemListSchema(items: AcronymSummary[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: `${item.acronym} — ${item.full_form}`,
      url: absoluteUrl(`/full-form/${item.slug}`),
    })),
  };
}

/** Homepage WebSite node with a sitelinks search box. */
export function buildWebsiteSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

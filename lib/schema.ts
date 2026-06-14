import type { AcronymRow, AcronymSummary, FaqItem } from '@/types';
import { CATEGORY_META } from '@/lib/categories';
import { SITE_NAME, SITE_URL, SOCIAL_LINKS, absoluteUrl } from '@/lib/seo';

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
  const org: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    // Raster logo (PNG) — Google's logo guidelines prefer a raster over SVG.
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/apple-icon'),
      width: 180,
      height: 180,
    },
    description:
      'A reference site for the full forms of Indian acronyms across banking, government, education, medical, tech, and more.',
  };
  if (SOCIAL_LINKS.length > 0) org.sameAs = SOCIAL_LINKS;
  return org;
}

/** Editorial guide page as an Article (with breadcrumb emitted separately). */
export function buildArticleSchema(article: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url: article.url,
    mainEntityOfPage: article.url,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: { '@id': `${SITE_URL}/#organization` },
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

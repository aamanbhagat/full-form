import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getAcronymBySlug,
  getRelatedSummaries,
  getTopSlugs,
} from '@/lib/data';
import { CATEGORY_META } from '@/lib/categories';
import { catVars } from '@/lib/css';
import { absoluteUrl } from '@/lib/seo';
import {
  buildBreadcrumbSchema,
  buildDefinedTermSchema,
  buildFAQSchema,
} from '@/lib/schema';
import { AcronymAnswerBox } from '@/components/AcronymAnswerBox';
import { BreadcrumbNav } from '@/components/BreadcrumbNav';
import { FAQAccordion } from '@/components/FAQAccordion';
import { RelatedAcronyms } from '@/components/RelatedAcronyms';
import { SchemaOrg } from '@/components/SchemaOrg';

type Params = { params: Promise<{ slug: string }> };

// ISR — pages refresh daily; unlisted slugs render on demand and are cached.
export const revalidate = 86400;
export const dynamicParams = true;

// Prerender the top pages at build; the rest render on demand and cache.
export async function generateStaticParams() {
  const slugs = await getTopSlugs(60);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const acronym = await getAcronymBySlug(slug);
  if (!acronym) return { title: 'Not found', robots: { index: false } };

  const canonical = absoluteUrl(`/full-form/${acronym.slug}`);
  const description =
    acronym.meta_description ??
    `${acronym.acronym} full form is ${acronym.full_form}.`;
  const title =
    acronym.meta_title ?? `${acronym.acronym} Full Form — ${acronym.full_form}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `What is the full form of ${acronym.acronym}?`,
      description,
      type: 'article',
      url: canonical,
    },
    twitter: {
      // We ship a 1200×630 OG image (opengraph-image.tsx) — use the large card
      // so it renders full-bleed rather than as a thumbnail.
      card: 'summary_large_image',
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function AcronymPage({ params }: Params) {
  const { slug } = await params;
  const acronym = await getAcronymBySlug(slug);
  if (!acronym) notFound();

  const meta = CATEGORY_META[acronym.category];
  const related = await getRelatedSummaries(acronym.related_acronyms);
  const canonical = absoluteUrl(`/full-form/${acronym.slug}`);

  return (
    <div className="shell page-stack" style={catVars(acronym.category)}>
      <SchemaOrg
        schemas={[
          buildDefinedTermSchema(acronym),
          buildFAQSchema(acronym.faq),
          buildBreadcrumbSchema([
            { name: 'Home', url: absoluteUrl('/') },
            { name: meta.name, url: absoluteUrl(`/category/${meta.slug}`) },
            { name: acronym.acronym, url: canonical },
          ]),
        ]}
      />

      <BreadcrumbNav
        items={[
          { label: 'Home', href: '/' },
          { label: meta.name, href: `/category/${meta.slug}`, isCategory: true },
          { label: acronym.acronym, href: null },
        ]}
      />

      <h1 className="hero-title" style={{ textAlign: 'left' }}>
        Full Form of {acronym.acronym}
      </h1>

      <AcronymAnswerBox
        acronym={acronym.acronym}
        fullForm={acronym.full_form}
        category={acronym.category}
      />

      <section aria-labelledby="about-heading">
        <h2 className="section-title" id="about-heading">
          What is {acronym.acronym}?
        </h2>
        <p className="prose">{acronym.description}</p>
      </section>

      {acronym.hindi_full_form ? (
        <section aria-labelledby="hindi-heading">
          <h2 className="section-title" id="hindi-heading">
            {acronym.acronym} का फुल फॉर्म
          </h2>
          <div className="hindi-box" lang="hi">
            <p className="hindi-box__value">{acronym.hindi_full_form}</p>
          </div>
        </section>
      ) : null}

      {acronym.example_usage ? (
        <section aria-labelledby="example-heading">
          <h2 className="section-title" id="example-heading">
            Example
          </h2>
          <blockquote className="example">{acronym.example_usage}</blockquote>
        </section>
      ) : null}

      <FAQAccordion faqs={acronym.faq} acronym={acronym.acronym} />

      <RelatedAcronyms items={related} />

      <section>
        <Link href={`/category/${meta.slug}`} className="btn btn--primary">
          Browse all {meta.name} full forms →
        </Link>
      </section>
    </div>
  );
}

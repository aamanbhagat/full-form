import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { GUIDES, getGuide } from '@/lib/guides';
import { CATEGORY_META } from '@/lib/categories';
import { catVars } from '@/lib/css';
import { absoluteUrl } from '@/lib/seo';
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildFAQSchema,
} from '@/lib/schema';
import { AcronymCard } from '@/components/AcronymCard';
import { BreadcrumbNav } from '@/components/BreadcrumbNav';
import { FAQAccordion } from '@/components/FAQAccordion';
import { SchemaOrg } from '@/components/SchemaOrg';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return { title: 'Not found', robots: { index: false } };
  const canonical = absoluteUrl(`/guides/${guide.slug}`);
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical },
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: 'article',
      url: canonical,
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.title,
      description: guide.description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function GuidePage({ params }: Params) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const meta = CATEGORY_META[guide.category];
  const canonical = absoluteUrl(`/guides/${guide.slug}`);

  return (
    <div className="shell page-stack" style={catVars(guide.category)}>
      <SchemaOrg
        schemas={[
          buildArticleSchema({
            title: guide.title,
            description: guide.description,
            url: canonical,
            datePublished: new Date(guide.datePublished).toISOString(),
            dateModified: new Date(guide.dateModified).toISOString(),
          }),
          buildFAQSchema(guide.faq),
          buildBreadcrumbSchema([
            { name: 'Home', url: absoluteUrl('/') },
            { name: 'Guides', url: absoluteUrl('/guides') },
            { name: guide.title, url: canonical },
          ]),
        ]}
      />

      <BreadcrumbNav
        items={[
          { label: 'Home', href: '/' },
          { label: 'Guides', href: '/guides' },
          { label: guide.title, href: null },
        ]}
      />

      <header>
        <h1 className="hero-title" style={{ textAlign: 'left' }}>
          {guide.title}
        </h1>
        <p className="legal-meta">
          Last updated:{' '}
          <time dateTime={new Date(guide.dateModified).toISOString()}>
            {new Date(guide.dateModified).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </time>
        </p>
      </header>

      <section>
        {guide.intro.map((p, i) => (
          <p className="prose" key={i}>
            {p}
          </p>
        ))}
      </section>

      {guide.sections.map((section, i) => (
        <section key={i} aria-labelledby={`s-${i}`}>
          <h2 className="section-title" id={`s-${i}`}>
            {section.heading}
          </h2>
          {section.body.map((p, j) => (
            <p className="prose" key={j}>
              {p}
            </p>
          ))}
        </section>
      ))}

      {guide.related.length > 0 ? (
        <section aria-labelledby="related-heading">
          <h2 className="section-title" id="related-heading">
            Full forms referenced in this guide
          </h2>
          <div className="acard-grid">
            {guide.related.map((a) => (
              <AcronymCard key={a.slug} acronym={a} />
            ))}
          </div>
        </section>
      ) : null}

      <FAQAccordion faqs={guide.faq} title="Frequently asked questions" />

      <section>
        <Link href={`/category/${meta.slug}`} className="btn btn--primary">
          Browse all {meta.name} full forms →
        </Link>
      </section>
    </div>
  );
}

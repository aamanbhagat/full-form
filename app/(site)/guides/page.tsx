import type { Metadata } from 'next';
import Link from 'next/link';
import { GUIDES } from '@/lib/guides';
import { CATEGORY_META } from '@/lib/categories';
import { catVars } from '@/lib/css';
import { absoluteUrl, SITE_NAME } from '@/lib/seo';
import { BreadcrumbNav } from '@/components/BreadcrumbNav';
import { SchemaOrg } from '@/components/SchemaOrg';
import { buildBreadcrumbSchema } from '@/lib/schema';

const DESCRIPTION = `In-depth guides from ${SITE_NAME} — clear explainers that compare and decode the acronyms India searches, from banking transfers to government exams.`;

export const metadata: Metadata = {
  title: 'Guides',
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl('/guides') },
  openGraph: {
    title: `Guides — ${SITE_NAME}`,
    description: DESCRIPTION,
    type: 'website',
    url: absoluteUrl('/guides'),
  },
};

export default function GuidesIndexPage() {
  return (
    <div className="shell page-stack">
      <SchemaOrg
        schemas={[
          buildBreadcrumbSchema([
            { name: 'Home', url: absoluteUrl('/') },
            { name: 'Guides', url: absoluteUrl('/guides') },
          ]),
        ]}
      />
      <BreadcrumbNav
        items={[
          { label: 'Home', href: '/' },
          { label: 'Guides', href: null },
        ]}
      />

      <header>
        <h1 className="hero-title" style={{ textAlign: 'left' }}>
          Guides
        </h1>
        <p className="prose">
          Deeper explainers that go beyond a single full form — comparing related
          acronyms and decoding the terms India searches for most.
        </p>
      </header>

      <div className="guide-list">
        {GUIDES.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="guide-card"
            style={catVars(guide.category)}
          >
            <span className="guide-card__cat">
              {CATEGORY_META[guide.category].name}
            </span>
            <h2 className="guide-card__title">{guide.title}</h2>
            <p className="guide-card__excerpt">{guide.excerpt}</p>
            <span className="guide-card__more">Read guide →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

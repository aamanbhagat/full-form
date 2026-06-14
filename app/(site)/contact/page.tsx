import type { Metadata } from 'next';
import Link from 'next/link';
import { absoluteUrl, CONTACT_EMAIL, SITE_NAME } from '@/lib/seo';
import { BreadcrumbNav } from '@/components/BreadcrumbNav';
import { SchemaOrg } from '@/components/SchemaOrg';
import { buildBreadcrumbSchema } from '@/lib/schema';

const DESCRIPTION = `Contact ${SITE_NAME} — report a correction, suggest an acronym, or get in touch about partnerships and feedback.`;

export const metadata: Metadata = {
  title: 'Contact',
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl('/contact') },
  openGraph: {
    title: `Contact ${SITE_NAME}`,
    description: DESCRIPTION,
    type: 'website',
    url: absoluteUrl('/contact'),
  },
};

export default function ContactPage() {
  return (
    <div className="shell page-stack legal">
      <SchemaOrg
        schemas={[
          buildBreadcrumbSchema([
            { name: 'Home', url: absoluteUrl('/') },
            { name: 'Contact', url: absoluteUrl('/contact') },
          ]),
        ]}
      />
      <BreadcrumbNav
        items={[
          { label: 'Home', href: '/' },
          { label: 'Contact', href: null },
        ]}
      />

      <h1 className="hero-title" style={{ textAlign: 'left' }}>
        Contact us
      </h1>

      <section>
        <p className="prose">
          We would love to hear from you. The fastest way to reach {SITE_NAME} is
          by email:
        </p>
        <p className="prose">
          <a className="contact-email" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
        </p>
      </section>

      <section aria-labelledby="reasons">
        <h2 className="section-title" id="reasons">
          What to write to us about
        </h2>
        <ul className="prose">
          <li>
            <strong>Corrections.</strong> If a full form or explanation is wrong
            or outdated, send us the acronym and the page link and we will review
            it.
          </li>
          <li>
            <strong>Suggestions.</strong> Want an acronym added that we do not
            cover yet? Tell us the term and the field it belongs to.
          </li>
          <li>
            <strong>Partnerships &amp; feedback.</strong> For collaborations,
            advertising, or general feedback about the site, drop us a line.
          </li>
        </ul>
        <p className="prose">
          To help us respond quickly, please include the relevant page link where
          possible. We read every message and typically reply within a few
          business days.
        </p>
      </section>

      <section aria-labelledby="meanwhile">
        <h2 className="section-title" id="meanwhile">
          In the meantime
        </h2>
        <p className="prose">
          You can <Link href="/">search for any acronym</Link>,{' '}
          <Link href="/category/banking">browse by category</Link>, or read our{' '}
          <Link href="/guides">guides</Link> for deeper explainers.
        </p>
      </section>
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { absoluteUrl, CONTACT_EMAIL, SITE_NAME } from '@/lib/seo';
import { BreadcrumbNav } from '@/components/BreadcrumbNav';
import { SchemaOrg } from '@/components/SchemaOrg';
import { buildBreadcrumbSchema } from '@/lib/schema';

const DESCRIPTION = `Disclaimer for ${SITE_NAME} — our content is for general reference and education, not professional advice. Always verify with official sources.`;

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl('/disclaimer') },
  openGraph: {
    title: `Disclaimer — ${SITE_NAME}`,
    description: DESCRIPTION,
    type: 'website',
    url: absoluteUrl('/disclaimer'),
  },
};

export default function DisclaimerPage() {
  return (
    <div className="shell page-stack legal">
      <SchemaOrg
        schemas={[
          buildBreadcrumbSchema([
            { name: 'Home', url: absoluteUrl('/') },
            { name: 'Disclaimer', url: absoluteUrl('/disclaimer') },
          ]),
        ]}
      />
      <BreadcrumbNav
        items={[
          { label: 'Home', href: '/' },
          { label: 'Disclaimer', href: null },
        ]}
      />

      <h1 className="hero-title" style={{ textAlign: 'left' }}>
        Disclaimer
      </h1>

      <section>
        <p className="prose">
          The information on {SITE_NAME} is provided for general reference and
          educational purposes only. We make every reasonable effort to keep our
          full forms and explanations accurate and up to date, but we make no
          warranty of any kind as to their completeness, accuracy, or
          reliability.
        </p>
      </section>

      <section aria-labelledby="meanings">
        <h2 className="section-title" id="meanings">
          Acronyms can have many meanings
        </h2>
        <p className="prose">
          Most acronyms expand to more than one thing depending on the field and
          country. Where an acronym is commonly used in several ways, we focus on
          the meaning most relevant to readers in India. The expansion you need
          may differ from the one shown — always consider the context in which you
          encountered the term.
        </p>
      </section>

      <section aria-labelledby="not-advice">
        <h2 className="section-title" id="not-advice">
          Not professional advice
        </h2>
        <p className="prose">
          Nothing on this site constitutes medical, legal, financial, tax, or
          other professional advice. Entries about medical terms, laws, banking
          products, exams, or government schemes are explanatory only. For any
          decision that matters, consult a qualified professional and verify
          details with the relevant official source — for example the issuing
          authority, examination board, regulator, or institution.
        </p>
      </section>

      <section aria-labelledby="external">
        <h2 className="section-title" id="external">
          External links
        </h2>
        <p className="prose">
          Our pages may link to third-party websites for convenience. We do not
          control and are not responsible for the content, accuracy, or
          practices of those sites.
        </p>
      </section>

      <section aria-labelledby="liability">
        <h2 className="section-title" id="liability">
          Limitation of liability
        </h2>
        <p className="prose">
          To the fullest extent permitted by law, {SITE_NAME} is not liable for
          any loss or damage arising from the use of, or reliance on, information
          on this website. By using the site you agree to this disclaimer.
        </p>
      </section>

      <section aria-labelledby="report">
        <h2 className="section-title" id="report">
          Spotted an error?
        </h2>
        <p className="prose">
          Help us improve. If you find a mistake, email{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or use our{' '}
          <Link href="/contact">contact page</Link> and we will review it
          promptly.
        </p>
      </section>
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { absoluteUrl, CONTACT_EMAIL, SITE_NAME } from '@/lib/seo';
import { BreadcrumbNav } from '@/components/BreadcrumbNav';
import { SchemaOrg } from '@/components/SchemaOrg';
import { buildBreadcrumbSchema } from '@/lib/schema';

const DESCRIPTION = `Privacy Policy for ${SITE_NAME} — what data we collect, how cookies and third-party advertising work, and your choices.`;
const EFFECTIVE = '14 June 2026';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl('/privacy-policy') },
  openGraph: {
    title: `Privacy Policy — ${SITE_NAME}`,
    description: DESCRIPTION,
    type: 'website',
    url: absoluteUrl('/privacy-policy'),
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="shell page-stack legal">
      <SchemaOrg
        schemas={[
          buildBreadcrumbSchema([
            { name: 'Home', url: absoluteUrl('/') },
            { name: 'Privacy Policy', url: absoluteUrl('/privacy-policy') },
          ]),
        ]}
      />
      <BreadcrumbNav
        items={[
          { label: 'Home', href: '/' },
          { label: 'Privacy Policy', href: null },
        ]}
      />

      <h1 className="hero-title" style={{ textAlign: 'left' }}>
        Privacy Policy
      </h1>
      <p className="legal-meta">Last updated: {EFFECTIVE}</p>

      <section>
        <p className="prose">
          This Privacy Policy explains what information {SITE_NAME} (“we”, “us”)
          collects when you use{' '}
          <Link href="/">our website</Link>, how we use it, and the choices you
          have. We have designed the site to collect as little personal
          information as possible.
        </p>
      </section>

      <section aria-labelledby="collect">
        <h2 className="section-title" id="collect">
          Information we collect
        </h2>
        <ul className="prose">
          <li>
            <strong>Search queries.</strong> When you use our search box, we may
            log the words you searched for and how many results were returned.
            This is used in aggregate to understand which acronyms people want
            and to fill gaps in our content. We do not attach this to your
            identity.
          </li>
          <li>
            <strong>Preferences.</strong> Your light/dark theme choice is stored
            locally in your browser (local storage). It never leaves your device
            and is not sent to us.
          </li>
          <li>
            <strong>Technical logs.</strong> Like most websites, our hosting
            provider automatically records standard request data such as IP
            address, browser type, and pages requested, for security and to keep
            the service running.
          </li>
        </ul>
        <p className="prose">
          We do not ask you to create an account, and we do not knowingly collect
          personal information from children.
        </p>
      </section>

      <section aria-labelledby="cookies">
        <h2 className="section-title" id="cookies">
          Cookies &amp; advertising
        </h2>
        <p className="prose">
          We may use cookies and similar technologies to operate the site and, if
          advertising is enabled, to display ads. Third-party vendors, including
          Google, use cookies to serve ads based on your prior visits to this and
          other websites. Google’s use of advertising cookies enables it and its
          partners to serve ads to you based on your visit to our site and/or
          other sites on the Internet.
        </p>
        <p className="prose">
          You can opt out of personalised advertising by visiting{' '}
          <a
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Ads Settings
          </a>
          . For more options on how third parties use cookies for personalised
          advertising, visit{' '}
          <a
            href="https://www.aboutads.info/choices/"
            target="_blank"
            rel="noopener noreferrer"
          >
            aboutads.info
          </a>
          . You can also control cookies through your browser settings.
        </p>
      </section>

      <section aria-labelledby="third-parties">
        <h2 className="section-title" id="third-parties">
          Third-party services
        </h2>
        <p className="prose">
          We rely on reputable third parties to run the site — including a cloud
          host that serves the pages and a managed database that stores our
          content. These providers process data on our behalf under their own
          privacy and security terms.
        </p>
      </section>

      <section aria-labelledby="rights">
        <h2 className="section-title" id="rights">
          Your choices &amp; rights
        </h2>
        <p className="prose">
          You can clear cookies and local storage from your browser at any time,
          opt out of personalised ads using the links above, and contact us to
          ask what information we hold or to request its deletion. Depending on
          where you live, you may have additional rights under laws such as the
          GDPR.
        </p>
      </section>

      <section aria-labelledby="changes">
        <h2 className="section-title" id="changes">
          Changes to this policy
        </h2>
        <p className="prose">
          We may update this policy from time to time. When we do, we will revise
          the “last updated” date at the top of this page.
        </p>
      </section>

      <section aria-labelledby="contact">
        <h2 className="section-title" id="contact">
          Contact
        </h2>
        <p className="prose">
          Questions about this policy? Email us at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or use our{' '}
          <Link href="/contact">contact page</Link>.
        </p>
      </section>
    </div>
  );
}

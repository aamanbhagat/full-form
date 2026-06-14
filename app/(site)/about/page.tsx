import type { Metadata } from 'next';
import Link from 'next/link';
import { absoluteUrl, SITE_NAME } from '@/lib/seo';
import { BreadcrumbNav } from '@/components/BreadcrumbNav';
import { SchemaOrg } from '@/components/SchemaOrg';
import { buildBreadcrumbSchema } from '@/lib/schema';

const DESCRIPTION = `About ${SITE_NAME} — a free, plain-English reference for the full forms of acronyms India searches, across banking, government, exams, medical, tech, and more.`;

export const metadata: Metadata = {
  title: 'About',
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl('/about') },
  openGraph: {
    title: `About ${SITE_NAME}`,
    description: DESCRIPTION,
    type: 'website',
    url: absoluteUrl('/about'),
  },
};

export default function AboutPage() {
  return (
    <div className="shell page-stack legal">
      <SchemaOrg
        schemas={[
          buildBreadcrumbSchema([
            { name: 'Home', url: absoluteUrl('/') },
            { name: 'About', url: absoluteUrl('/about') },
          ]),
        ]}
      />
      <BreadcrumbNav
        items={[
          { label: 'Home', href: '/' },
          { label: 'About', href: null },
        ]}
      />

      <h1 className="hero-title" style={{ textAlign: 'left' }}>
        About {SITE_NAME}
      </h1>

      <section>
        <p className="prose">
          {SITE_NAME} is a free reference for the full forms of the acronyms and
          abbreviations India searches for every day. Whether you are a student
          revising for a competitive exam, a professional decoding a document, or
          simply curious about a term you came across, our goal is to give you a
          clear, accurate answer in seconds — with the context to actually
          understand it.
        </p>
      </section>

      <section aria-labelledby="what">
        <h2 className="section-title" id="what">
          What we cover
        </h2>
        <p className="prose">
          We organise full forms across sixteen categories — banking, government
          and exams, education, medical, technology, science, business, law,
          defence, sports, organisations, chat, slang, general terms, countries,
          and states. Each entry explains what the acronym stands for, what it
          means, where it is used in India, and answers the questions people most
          commonly ask about it. Many entries also include the full form in
          Hindi.
        </p>
        <p className="prose">
          You can <Link href="/">search any acronym</Link> from the homepage or{' '}
          <Link href="/category/banking">browse a category</Link> to explore
          related terms.
        </p>
      </section>

      <section aria-labelledby="how">
        <h2 className="section-title" id="how">
          How our content is made
        </h2>
        <p className="prose">
          Our explanations are drafted with the help of AI language models and
          then structured to a consistent editorial standard before they are
          published. We focus on the Indian context first, because that is what
          most of our readers are looking for. Acronyms can have more than one
          meaning, and language evolves — so if you spot something that is wrong
          or out of date, we want to know.{' '}
          <Link href="/contact">Tell us</Link> and we will fix it.
        </p>
      </section>

      <section aria-labelledby="free">
        <h2 className="section-title" id="free">
          Free to use
        </h2>
        <p className="prose">
          {SITE_NAME} is free for everyone. The site may show advertising to
          cover its running costs — see our{' '}
          <Link href="/privacy-policy">Privacy Policy</Link> for how that works
          and our <Link href="/disclaimer">Disclaimer</Link> for how to use the
          content responsibly.
        </p>
      </section>
    </div>
  );
}

import Link from 'next/link';
import { CATEGORY_META } from '@/lib/categories';
import { SITE_NAME } from '@/lib/seo';
import { ThemeToggle } from '@/components/ThemeToggle';
import type { Category } from '@/types';

// Resolved once at build — keeps the layout fully static under Cache Components.
const YEAR = new Date().getFullYear();

const NAV: Category[] = ['Banking', 'Government', 'Education', 'Tech'];
const ALL: Category[] = [
  'Banking',
  'Government',
  'Education',
  'Medical',
  'Tech',
  'General',
];

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="site-header">
        <div className="shell masthead">
          <Link href="/" className="wordmark">
            FullForm<span className="wordmark__hub">Hub</span>
          </Link>
          <div className="masthead__right">
            <nav className="site-nav" aria-label="Browse categories">
              {NAV.map((cat) => (
                <Link
                  key={cat}
                  href={`/category/${CATEGORY_META[cat].slug}`}
                  className="nav-link"
                >
                  {CATEGORY_META[cat].name.split(' ')[0]}
                </Link>
              ))}
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main id="main" className="content-main">
        {children}
      </main>

      <footer className="site-footer">
        <div className="shell">
          <div className="footer-grid">
            <div>
              <Link href="/" className="wordmark">
                FullForm<span className="wordmark__hub">Hub</span>
              </Link>
              <p className="footer-blurb">
                Plain-English full forms for the acronyms India searches —
                banking, government, exams, medical, tech, and more.
              </p>
            </div>
            <nav aria-label="All categories">
              <p className="eyebrow">Categories</p>
              <div className="footer-cats">
                {ALL.map((cat) => (
                  <Link key={cat} href={`/category/${CATEGORY_META[cat].slug}`}>
                    {CATEGORY_META[cat].name}
                  </Link>
                ))}
              </div>
            </nav>
            <nav aria-label="About this site">
              <p className="eyebrow">FullFormHub</p>
              <div className="footer-cats footer-cats--stack">
                <Link href="/guides">Guides</Link>
                <Link href="/about">About</Link>
                <Link href="/contact">Contact</Link>
                <Link href="/privacy-policy">Privacy Policy</Link>
                <Link href="/disclaimer">Disclaimer</Link>
              </div>
            </nav>
          </div>
          <p className="footer-legal">
            © {YEAR} {SITE_NAME}. Reference content for
            students and professionals.
          </p>
        </div>
      </footer>
    </>
  );
}

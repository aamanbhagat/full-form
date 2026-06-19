import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';
import styles from './blog.module.css';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://fullformhub.live';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Blog — Full Forms & Abbreviations Explained',
  description:
    'Clear explainers on Indian full forms, acronyms and abbreviations across exams, banking, government and tech.',
  alternates: { canonical: `${SITE_URL}/blog` },
};

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function BlogIndex() {
  const posts = getAllPosts();
  return (
    <div className="shell">
      <header>
        <p className="eyebrow">Blog</p>
        <h1 className="section-title">Full forms, explained</h1>
      </header>

      {posts.length === 0 ? (
        <p>Nothing published yet. Check back soon.</p>
      ) : (
        <ul className={styles.list}>
          {posts.map((p) => (
            <li key={p.slug} className={styles.item}>
              <Link href={`/blog/${p.slug}`} className={styles.itemLink}>
                {p.frontmatter.cover && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className={styles.thumb}
                    src={p.frontmatter.cover}
                    alt={p.frontmatter.coverAlt || p.frontmatter.title}
                    width={1200}
                    height={630}
                    loading="lazy"
                  />
                )}
                <div>
                  <p className={styles.meta}>
                    <span className={styles.metaCat}>
                      {p.frontmatter.category}
                    </span>
                    <span className={styles.sep}>·</span>
                    <span>{fmtDate(p.frontmatter.publishedAt)}</span>
                    <span className={styles.sep}>·</span>
                    <span>{p.readingTimeMinutes} min read</span>
                  </p>
                  <h2 className={styles.itemTitle}>{p.frontmatter.title}</h2>
                  <p className={styles.itemDesc}>{p.frontmatter.description}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

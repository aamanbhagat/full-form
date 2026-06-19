import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { BreadcrumbNav } from '@/components/BreadcrumbNav';
import { getAllPostSlugs, getPostBySlug, getRelatedPosts } from '@/lib/blog';
import styles from '../blog.module.css';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://fullformhub.live';
const SITE_NAME = 'FullFormHub';

export const revalidate = 3600;
export const dynamicParams = true;

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Not found', robots: { index: false } };
  const { title, description, cover, coverAlt, publishedAt, updatedAt } =
    post.frontmatter;
  const url = `${SITE_URL}/blog/${slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: updatedAt || publishedAt,
      images: cover ? [{ url: cover, alt: coverAlt || title }] : undefined,
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default async function BlogPost({ params }: Params) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { frontmatter: fm } = post;
  const url = `${SITE_URL}/blog/${slug}`;
  const related = getRelatedPosts(post, 3);

  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: fm.title,
      description: fm.description,
      datePublished: fm.publishedAt,
      dateModified: fm.updatedAt || fm.publishedAt,
      image: fm.cover ? `${SITE_URL}${fm.cover}` : undefined,
      author: { '@type': 'Organization', name: SITE_NAME },
      publisher: { '@type': 'Organization', name: SITE_NAME },
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
        { '@type': 'ListItem', position: 3, name: fm.title, item: url },
      ],
    },
  ];

  return (
    <div className="shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
      <BreadcrumbNav
        items={[
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: fm.title, href: null },
        ]}
      />

      <header>
        <p className="eyebrow">{fm.category}</p>
        <h1 className="section-title">{fm.title}</h1>
        <p className={styles.dateline}>
          <span>{fmtDate(fm.publishedAt)}</span>
          <span className={styles.sep}>·</span>
          <span>{post.readingTimeMinutes} min read</span>
        </p>
      </header>

      {fm.cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={styles.cover}
          src={fm.cover}
          alt={fm.coverAlt || fm.title}
          width={1200}
          height={630}
          fetchPriority="high"
        />
      )}

      <article className="prose">
        <MDXRemote
          source={post.content}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [
                rehypeSlug,
                [rehypeAutolinkHeadings, { behavior: 'wrap' }],
              ],
            },
          }}
        />
      </article>

      {related.length > 0 && (
        <section className={styles.related}>
          <p className="eyebrow">Keep reading</p>
          <ul className={styles.relatedList}>
            {related.map((r) => (
              <li key={r.slug} className={styles.relatedItem}>
                <Link href={`/blog/${r.slug}`}>{r.frontmatter.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

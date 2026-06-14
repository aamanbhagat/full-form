import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Turbopack is the default bundler in Next.js 16 — no flag needed.
  //
  // Cache Components is intentionally NOT enabled: its `use cache` isolation
  // doesn't co-operate with a stateful Postgres connection pool during
  // prerender. We use standard SSG + ISR (generateStaticParams + revalidate)
  // instead, which is rock-solid for an SEO content site.

  // Canonicalise host + trailing slashes — one hop, never a chain. Critical for
  // SEO dedup. The www→apex rule only fires on the production host, so local
  // dev (localhost) is unaffected; it makes canonicalisation correct even if the
  // hosting platform isn't configured to redirect www.
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.fullformhub.live' }],
        destination: 'https://fullformhub.live/:path*',
        permanent: true,
      },
      {
        source: '/:path+/',
        destination: '/:path+',
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
      {
        source: '/admin/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },

  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // Keep build-time DB pressure bounded: one static-generation worker, a few
  // pages at a time, sized to the pg pool below so queries never queue or
  // exhaust the shared Supabase pooler.
  experimental: {
    cpus: 1,
    staticGenerationMaxConcurrency: 4,
  },
};

export default nextConfig;

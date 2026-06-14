import { ImageResponse } from 'next/og';
import { SITE_NAME } from '@/lib/seo';

// Default social card for the homepage, category hubs, search, and anything
// that doesn't define its own opengraph-image. /full-form/[slug] overrides this
// with a per-acronym card. Static (no `dynamic` export) → generated once at
// build and served immutable, so there's no per-request font/network cost.
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = `${SITE_NAME} — full forms of Indian acronyms`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: '#0f141b',
          padding: '0 96px',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 30,
            letterSpacing: 8,
            color: '#7BA7D9',
            fontWeight: 700,
          }}
        >
          {SITE_NAME.toUpperCase()}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 92,
            fontWeight: 700,
            color: '#FFFFFF',
            marginTop: 24,
            lineHeight: 1.05,
          }}
        >
          Full forms, found fast.
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 36,
            color: '#AEB6C2',
            marginTop: 28,
            maxWidth: 900,
            lineHeight: 1.3,
          }}
        >
          Banking, government, exams, medical, tech &amp; more — the full form of
          any Indian acronym, in plain English.
        </div>
        <div style={{ display: 'flex', marginTop: 44 }}>
          <div
            style={{
              display: 'flex',
              background: '#1c3d6e',
              color: '#FFFFFF',
              fontSize: 28,
              fontWeight: 700,
              padding: '10px 28px',
              borderRadius: 999,
            }}
          >
            fullformhub.live
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

import { ImageResponse } from 'next/og';
import { getAcronymBySlug } from '@/lib/data';
import { CATEGORY_META } from '@/lib/categories';
import { SITE_NAME } from '@/lib/seo';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Full form';
// Generate on demand (and cache), never at build — keeps builds light.
export const dynamic = 'force-dynamic';

// Fetch only the glyphs we need as a TTF Satori can rasterise.
async function loadFont(text: string, weight: number): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const match = css.match(
    /src: url\((.+?)\) format\('(?:opentype|truetype|woff)'\)/,
  );
  if (!match) throw new Error('font src not found');
  return (await fetch(match[1])).arrayBuffer();
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const acronym = await getAcronymBySlug(slug);
  const ac = acronym?.acronym ?? 'Full Forms';
  const ff = acronym?.full_form ?? 'Indian acronym full forms, found fast.';
  const category = acronym?.category ?? 'General';
  const color = CATEGORY_META[category].color;
  const catName = CATEGORY_META[category].name;

  const text = `${SITE_NAME} ${ac} ${ff} ${catName} stands for`;
  let fonts;
  try {
    const [bold, medium] = await Promise.all([
      loadFont(text, 700),
      loadFont(text, 500),
    ]);
    fonts = [
      { name: 'Plex', data: bold, weight: 700 as const, style: 'normal' as const },
      { name: 'Plex', data: medium, weight: 500 as const, style: 'normal' as const },
    ];
  } catch {
    fonts = undefined;
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          background: '#F4F6F8',
          fontFamily: 'Plex',
        }}
      >
        <div style={{ width: 20, background: color }} />
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '64px 80px',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 26,
              letterSpacing: 6,
              color: '#5C6573',
              fontWeight: 500,
            }}
          >
            {SITE_NAME.toUpperCase()}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 124,
              fontWeight: 700,
              color: '#161B26',
              letterSpacing: 10,
              marginTop: 22,
            }}
          >
            {ac}
          </div>
          <div
            style={{ display: 'flex', fontSize: 28, color: '#5C6573', marginTop: 10 }}
          >
            stands for
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 58,
              fontWeight: 700,
              color,
              marginTop: 6,
              lineHeight: 1.1,
            }}
          >
            {ff}
          </div>
          <div style={{ display: 'flex', marginTop: 34 }}>
            <div
              style={{
                display: 'flex',
                background: color,
                color: '#ffffff',
                fontSize: 24,
                fontWeight: 500,
                padding: '8px 22px',
                borderRadius: 999,
              }}
            >
              {catName}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}

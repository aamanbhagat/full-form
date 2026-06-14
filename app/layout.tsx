import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import {
  Bricolage_Grotesque,
  IBM_Plex_Sans,
  IBM_Plex_Mono,
  IBM_Plex_Sans_Devanagari,
} from 'next/font/google';
import './globals.css';
import { SITE_NAME, SITE_URL } from '@/lib/seo';

// Display — characterful grotesque, used with restraint (wordmark, h1/h2).
const display = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

// Body & UI — built for clarity at small sizes on low-end screens.
const body = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-body',
});

// The acronym rendered as a "record identifier".
const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['500', '600'],
  display: 'swap',
  variable: '--font-mono',
  preload: false,
});

// Bilingual: Hindi full forms share the IBM Plex superfamily.
const devanagari = IBM_Plex_Sans_Devanagari({
  subsets: ['devanagari', 'latin'],
  weight: ['400', '600'],
  display: 'swap',
  variable: '--font-devanagari',
  preload: false,
});

const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f6f8' },
    { media: '(prefers-color-scheme: dark)', color: '#0f141b' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Full Forms of Indian Acronyms`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Find the full form of any Indian acronym — banking, government, exams, medical, tech, and more. Fast, clear answers for students and professionals.',
  applicationName: SITE_NAME,
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_IN',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const fontVars = `${display.variable} ${body.variable} ${mono.variable} ${devanagari.variable}`;
  return (
    <html lang="en" className={`${fontVars} h-full`} suppressHydrationWarning>
      <body className="min-h-full">
        {/* Set the theme before first paint to avoid a flash of the wrong mode. */}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('theme');var d=t||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=d;}catch(e){}})();",
          }}
        />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
        {adsenseClient ? (
          <Script
            async
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
          />
        ) : null}
      </body>
    </html>
  );
}

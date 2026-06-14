import type { MetadataRoute } from 'next';
import { SITE_NAME } from '@/lib/seo';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Indian Acronym Full Forms`,
    short_name: SITE_NAME,
    description:
      'Find the full form of any Indian acronym — banking, government, exams, medical, tech, and more.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f4f6f8',
    theme_color: '#1c3d6e',
    categories: ['education', 'reference'],
    icons: [
      { src: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
      { src: '/apple-icon', type: 'image/png', sizes: '180x180' },
    ],
  };
}

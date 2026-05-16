import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Cimientos',
    short_name: 'Cimientos',
    description: 'Toma el control de tu salud física.',
    start_url: '/',
    display: 'standalone', // No browser UI, looks like a native app
    background_color: '#fafafa', // Splash screen background color
    theme_color: '#fafafa', // Status bar color
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}

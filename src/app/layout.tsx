import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import TextRegular from './_ui/typography/TextRegular';
import { Providers } from './_providers/Providers';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Cimientos',
  description: 'Toma el control de tu salud física.',
  applicationName: 'Cimientos',
  keywords: [
    'salud',
    'bienestar',
    'ejercicio',
    'nutrición',
    'tracking',
    'progreso',
  ],
  authors: [{ name: 'Juan Torres', url: 'https://juantorres.me' }],
  creator: 'Juan Torres',
  publisher: 'Juan Torres',

  // Apple PWA meta tags
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true, // Allows the app to run in standalone mode (without browser UI)
    title: 'Cimientos', // The title shown on the home screen when added as a PWA
    statusBarStyle: 'default', // Copy color of system status bar
  },
  icons: {
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
};

// Apple PWA
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // Prevent automatic zooming on form inputs
  userScalable: false, // Optional: disable manual zoom
  viewportFit: 'cover', // For iPhones with notch (iPhone X+): content reaches the edges
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased overflow-y-scroll text-text bg-background`}
      >
        <Providers>
          <TextRegular
            id="wrapper-all-always"
            className="w-full overflow-x-hidden"
          >
            {children}
          </TextRegular>
        </Providers>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

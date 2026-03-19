import type { NextConfig } from 'next';

const securityHeaders = [
  // Prevents the browser from guessing the MIME type (stops MIME-sniffing attacks)
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Stops the page from being embedded in an iframe (clickjacking protection)
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // Restricts which browser features the page can use
  // camera=self is required for barcode scanning
  {
    key: 'Permissions-Policy',
    value: 'camera=(self), microphone=(), geolocation=()',
  },
  // Controls how much referrer info is sent with requests
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Content Security Policy: restricts where resources can be loaded from
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-inline/eval needed by Next.js
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: res.cloudinary.com images.openfoodfacts.org images.openfoodfacts.net", // Defense in browser, sync below with next.config.ts remotePatterns
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns:
      process.env.NODE_ENV === 'development'
        ? // Allow all hosts in development
          [
            { protocol: 'https', hostname: '**' },
            { protocol: 'http', hostname: '**' },
          ]
        : // Restrict to specific host in production
          // Defense in server, sync above with Content-Security-Policy img-src
          [
            { protocol: 'https', hostname: 'res.cloudinary.com' },
            { protocol: 'https', hostname: 'images.openfoodfacts.org' },
            { protocol: 'https', hostname: 'images.openfoodfacts.net' },
          ],
  },
};

export default nextConfig;

import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';

const ContentSecurityPolicy = [
  "default-src 'self'",

  // Scripts
  isDev
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    : "script-src 'self'",

  // Styles
  isDev ? "style-src 'self' 'unsafe-inline'" : "style-src 'self'",

  // Images
  "img-src 'self' data: blob: res.cloudinary.com images.openfoodfacts.org images.openfoodfacts.net", // NOTE: Defense in browser, sync below with next.config.ts remotePatterns

  // Fonts
  "font-src 'self'",

  // API / fetch / websockets
  "connect-src 'self'",

  // Extra security headers
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

const securityHeaders = [
  {
    // Content Security Policy: restricts where resources can be loaded from
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy,
  },
  {
    // Prevents the browser from guessing the MIME type (stops MIME-sniffing attacks)
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    // Stops the page from being embedded in an iframe (clickjacking protection)
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    // Controls how much referrer info is sent with requests
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    // Restricts which browser features the page can use
    key: 'Permissions-Policy',
    value: 'camera=(self), microphone=(), geolocation=()',
  },

  // Only makes sense in real production (but doesn't break in preview)
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
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
        ? [
            { protocol: 'https', hostname: '**' },
            { protocol: 'http', hostname: '**' },
          ]
        : [
            // Restrict to specific host in production
            // NOTE: Defense in server, sync above with Content-Security-Policy img-src
            { protocol: 'https', hostname: 'res.cloudinary.com' },
            { protocol: 'https', hostname: 'images.openfoodfacts.org' },
            { protocol: 'https', hostname: 'images.openfoodfacts.net' },
          ],
  },
};

export default nextConfig;

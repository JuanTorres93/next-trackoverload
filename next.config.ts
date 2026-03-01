import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns:
      process.env.NODE_ENV === 'development'
        ? // Allow all hosts in development
          [
            { protocol: 'https', hostname: '**' },
            { protocol: 'http', hostname: '**' },
          ]
        : // Restrict to specific host in production
          [
            { protocol: 'https', hostname: 'res.cloudinary.com' },
            { protocol: 'https', hostname: 'images.openfoodfacts.org' },
            { protocol: 'https', hostname: 'images.openfoodfacts.net' },
          ],
  },
};

export default nextConfig;

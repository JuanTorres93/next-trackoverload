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
          // TODO: change when production storage is set up
          [{ protocol: 'https', hostname: 'mi-dominio.com' }],
  },
};

export default nextConfig;

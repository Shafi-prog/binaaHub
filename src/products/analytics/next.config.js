/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  env: {
    NEXT_PUBLIC_APP_NAME: 'BinnaAnalytics',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
    NEXT_PUBLIC_APP_DESCRIPTION: 'Complete business intelligence and analytics system',
    NEXT_PUBLIC_PORT: '3005',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/analytics/:path*',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig;

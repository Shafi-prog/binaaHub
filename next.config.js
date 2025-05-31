/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    forceSwcTransforms: true,
  },
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Other settings
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
};

module.exports = nextConfig;

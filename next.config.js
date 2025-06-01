/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    forceSwcTransforms: false,
  },
  eslint: {
    // Re-enable linting but ignore errors during build for now
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Keep type checking enabled
    ignoreBuildErrors: false,
  },
  // Other settings
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;

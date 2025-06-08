/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  // basePath: '/binaaHub', // Commented out for local development
  // assetPrefix: '/binaaHub/', // Commented out for local development
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
}

module.exports = nextConfig

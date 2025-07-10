/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['binna-public-images.s3.eu-west-1.amazonaws.com'],
  },
  env: {
    NEXT_PUBLIC_APP_NAME: 'BinnaBooks',
    NEXT_PUBLIC_APP_DESCRIPTION: 'Accounting & Financial Management System',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },
  basePath: process.env.NODE_ENV === 'production' ? '/accounting' : '',
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig

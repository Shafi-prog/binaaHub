/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  
  // CDN Configuration
  assetPrefix: process.env.CDN_URL || '',
  
  // Image optimization with CDN
  images: {
    loader: 'cloudinary',
    path: process.env.CLOUDINARY_URL || 'https://res.cloudinary.com/binna/',
    domains: [
      'res.cloudinary.com',
      'cdn.binna.sa',
      'assets.binna.sa',
      'static.binna.sa',
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // Caching headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, stale-while-revalidate=300',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Compression
  compress: true,
  
  // Bundle analyzer
  webpack: (config, { isServer }) => {
    // Bundle size optimization
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Analyze bundle if needed
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: isServer
            ? '../analyze/server.html'
            : './analyze/client.html',
        })
      );
    }
    
    return config;
  },
  
  // Environment variables
  env: {
    CDN_URL: process.env.CDN_URL,
    CLOUDINARY_URL: process.env.CLOUDINARY_URL,
    REDIS_URL: process.env.REDIS_URL,
    ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS,
  },
  
  // Output configuration for static export
  output: 'export',
  trailingSlash: true,
  
  // Redirects for CDN
  async redirects() {
    return [
      {
        source: '/assets/:path*',
        destination: `${process.env.CDN_URL || ''}/assets/:path*`,
        permanent: true,
      },
    ];
  },
  
  // Rewrites for API routing
  async rewrites() {
    return [
      {
        source: '/api/pos/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
      {
        source: '/api/inventory/:path*',
        destination: 'http://localhost:3002/api/:path*',
      },
      {
        source: '/api/accounting/:path*',
        destination: 'http://localhost:3003/api/:path*',
      },
      {
        source: '/api/crm/:path*',
        destination: 'http://localhost:3004/api/:path*',
      },
      {
        source: '/api/analytics/:path*',
        destination: 'http://localhost:3005/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;

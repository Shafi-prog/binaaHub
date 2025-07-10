/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exclude Medusa development folder from Next.js compilation
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  webpack: (config, { isServer }) => {
    // Exclude medusa-develop folder from compilation
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        '**/node_modules/**',
        '**/src/app/store/medusa-develop/**',
      ],
    };
    
    // Add fallbacks for Node.js modules to prevent CloudFlare sockets issues
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'cloudflare:sockets': false,
        'pg-native': false,
        'pg': false,
        'sqlite3': false,
        'bindings': false,
        'fs': false,
        'path': false,
        'crypto': false,
      };
    }
    
    // Externalize problematic packages that cause CloudFlare sockets import
    config.externals = [
      ...(config.externals || []),
      'pg-cloudflare',
      '@mikro-orm/postgresql',
      '@mikro-orm/core',
      '@mikro-orm/migrations',
      '@medusajs/framework/utils',
      '@medusajs/framework/http',
      '@medusajs/core-flows',
      '@medusajs/utils',
      'awilix',
      'ajv-draft-04',
      'umzug',
      '@rushstack/node-core-library',
      '@rushstack/terminal',
      '@rushstack/ts-command-line',
      'sqlite3',
      'sqlite',
      'bindings',
    ];
    
    return config;
  },
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    forceSwcTransforms: false,
    optimizeCss: true,
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
  trailingSlash: true,
  // basePath: '/binaaHub', // Commented out for local development
  // assetPrefix: '/binaaHub/', // Commented out for local development
  images: {
    unoptimized: true
  },
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;

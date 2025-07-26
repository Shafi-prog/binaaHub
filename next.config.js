/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exclude Medusa development folder from Next.js compilation
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  
  // Turbopack configuration for better development performance
  turbopack: {
    resolveExtensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.json'],
  },
  
  webpack: (config, { isServer }) => {
    // Exclude medusa-develop folder from compilation
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        '**/node_modules/**',
        '**/src/app/store/medusa-develop/**',
        '**/.next/**',
        '**/.git/**',
        '**/coverage/**',
        '**/scripts/**',
        '**/*.md',
        '**/*.txt',
        '**/auto-fix-*.js',
        '**/validate-*.js',
        '**/check-*.js',
        '**/fix-*.js',
        '**/comprehensive-*.js',
        '**/diagnose-*.js',
      ],
      aggregateTimeout: 300,
      poll: false,
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
        'fs/promises': false,
        'net': false,
        'tls': false,
        'module': false,
        'timers/promises': false,
        'child_process': false,
        'os': false,
        'path': require.resolve('path-browserify'),
        'crypto': require.resolve('crypto-browserify'),
        'umzug': false,
        '@mikro-orm/migrations': false,
        '@medusajs/framework/utils': false,
        '@medusajs/utils': false,
        '@rushstack/node-core-library': false,
        '@rushstack/terminal': false,
        '@rushstack/ts-command-line': false,
        'libsql': false,
        'mariadb/callback': false,
        'mariadb': false,
      };
    }
    
    // Externalize problematic packages that cause CloudFlare sockets import
    if (!isServer) {
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
        'libsql',
        'mariadb',
        'fs',
        'fs/promises',
        'net',
        'tls',
        'module',
        'timers/promises',
        'child_process',
        'os',
      ];
    }
    
    return config;
  },
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizeCss: true,
    typedRoutes: false,
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

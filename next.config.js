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
  serverExternalPackages: ['@supabase/auth-helpers-nextjs'],
  experimental: {
    optimizeCss: true,
    typedRoutes: false,
  },
  async headers() {
    return [
      {
        // Apply CORS headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, apikey, x-client-info',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; connect-src 'self' https://*.supabase.co https://lqhopwohuddhapkhhikf.supabase.co http://localhost:* https://api.supabase.co wss://realtime.supabase.co; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:;",
          },
        ],
      },
    ];
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

export default nextConfig;

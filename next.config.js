import path from 'path'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exclude Medusa development folder from Next.js compilation
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  
  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
    optimizePackageImports: ['lucide-react', '@/components/ui'],
  },
  
  // Turbopack configuration for better development performance
  turbopack: {
    resolveExtensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.json'],
  },
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },
  
  // Performance optimizations
  poweredByHeader: false,
  generateEtags: false,
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
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
    
    // Aliases to replace Medusa icons with local equivalents
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@medusajs/icons': path.resolve(process.cwd(), 'src/adapters/medusa/icons.tsx'),
      '@medusajs/ui': path.resolve(process.cwd(), 'src/adapters/medusa/ui.tsx'),
      '@medusajs/types': path.resolve(process.cwd(), 'src/adapters/medusa/types.ts'),
      '@medusajs/framework/types': path.resolve(process.cwd(), 'src/adapters/medusa/framework-types.ts'),
      '@medusajs/framework/utils': path.resolve(process.cwd(), 'src/adapters/medusa/framework-utils.ts'),
      '@medusajs/framework/modules-sdk': path.resolve(process.cwd(), 'src/adapters/medusa/modules-sdk.ts'),
      '@medusajs/framework/orchestration': path.resolve(process.cwd(), 'src/adapters/medusa/orchestration.ts'),
  '@medusajs/framework/workflows-sdk': path.resolve(process.cwd(), 'src/adapters/medusa/workflows-sdk.ts'),
      '@medusajs/utils': path.resolve(process.cwd(), 'src/adapters/medusa/utils.ts'),
      '@medusajs/js-sdk': path.resolve(process.cwd(), 'src/adapters/medusa/js-sdk.ts'),
  // Platform-prefixed aliases to remove Medusa naming from imports
  '@platform/icons': path.resolve(process.cwd(), 'src/adapters/medusa/icons.tsx'),
  '@platform/ui': path.resolve(process.cwd(), 'src/adapters/medusa/ui.tsx'),
  '@platform/types': path.resolve(process.cwd(), 'src/adapters/medusa/types.ts'),
  '@platform/framework/types': path.resolve(process.cwd(), 'src/adapters/medusa/framework-types.ts'),
  '@platform/framework/utils': path.resolve(process.cwd(), 'src/adapters/medusa/framework-utils.ts'),
  '@platform/framework/modules-sdk': path.resolve(process.cwd(), 'src/adapters/medusa/modules-sdk.ts'),
  '@platform/framework/orchestration': path.resolve(process.cwd(), 'src/adapters/medusa/orchestration.ts'),
  '@platform/framework/workflows-sdk': path.resolve(process.cwd(), 'src/adapters/medusa/workflows-sdk.ts'),
  '@platform/utils': path.resolve(process.cwd(), 'src/adapters/medusa/utils.ts'),
  '@platform/js-sdk': path.resolve(process.cwd(), 'src/adapters/medusa/js-sdk.ts'),
    }

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
        'path': 'path-browserify',
        'crypto': 'crypto-browserify',
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
  
  // Redirect legacy project routes to unified page
  async redirects() {
    return [
      // Removed project creation redirect - now goes directly to 7-step construction
      {
        source: '/user/projects/new', 
        destination: '/user/projects/create',
        permanent: true,
      },
      // Calculator redirects
      {
        source: '/user/projects/calculator',
        destination: '/user/comprehensive-construction-calculator',
        permanent: true,
      },
      {
        source: '/(public)/calculator',
        destination: '/user/comprehensive-construction-calculator',
        permanent: false, // Keep as temporary for public access
      },
      // Keep enhanced page as specialized workflow
      {
        source: '/user/projects/create/enhanced',
        destination: '/user/projects/create/construction-guidance',
        permanent: true,
      },
      // Redirects for removed redundant project pages
      {
        source: '/user/projects/create/unified',
        destination: '/user/projects/unified?create=true&enhanced=true',
        permanent: true,
      },
      // Test page redirects (for any remaining links)
      {
        source: '/auth-test',
        destination: '/user/dashboard',
        permanent: true,
      },
      {
        source: '/quick-test',
        destination: '/user/dashboard', 
        permanent: true,
      },
      {
        source: '/test-login',
        destination: '/simple-login',
        permanent: true,
      },
      // Redirects for removed redundant test pages
      {
        source: '/test-context',
        destination: '/dev/test-context',
        permanent: true,
      },
      {
        source: '/test-data-connection',
        destination: '/dev/test-supabase',
        permanent: true,
      },
      {
        source: '/user/direct-test',
        destination: '/dev/test-supabase',
        permanent: true,
      },
      {
        source: '/test/data-quick',
        destination: '/dev/test-supabase',
        permanent: true,
      },
      {
        source: '/test/simple-data',
        destination: '/dev/test-supabase',
        permanent: true,
      },
      {
        source: '/user/test-console',
        destination: '/dev/test-console',
        permanent: true,
      },
      {
        source: '/user/test-context',
        destination: '/dev/test-context',
        permanent: true,
      },
      {
        source: '/user/env-test',
        destination: '/dev/env-test',
        permanent: true,
      },
    ];
  },
  
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: [
          // CORS headers
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
          // Content Security Policy - Enhanced for XSS protection
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "connect-src 'self' https://*.supabase.co http://localhost:* https://api.supabase.co wss://realtime.supabase.co https://*.google.com https://generativelanguage.googleapis.com",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://maps.googleapis.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: https: blob:",
              "frame-src 'self' https://maps.googleapis.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
              "upgrade-insecure-requests"
            ].join('; '),
          },
          // Prevent clickjacking attacks
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Enable XSS protection in older browsers
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Control referrer information
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Permissions Policy (formerly Feature-Policy)
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()',
              'microphone=()',
              'geolocation=(self)',
              'payment=(self)',
              'usb=()',
              'magnetometer=()',
              'gyroscope=()',
              'accelerometer=()'
            ].join(', '),
          },
          // Strict Transport Security (HTTPS only)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
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

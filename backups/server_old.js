const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

// Medusa configuration
const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000';
const MEDUSA_STOREFRONT_URL = process.env.MEDUSA_STOREFRONT_URL || 'http://localhost:8000';

// Initialize Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;

      // Redirect to appropriate Medusa services for user and store access
      if (pathname.startsWith('/user-store') || pathname.startsWith('/shop') || pathname.startsWith('/products')) {
        // Redirect to Medusa storefront (user pages)
        res.writeHead(302, { Location: `${MEDUSA_STOREFRONT_URL}${pathname}` });
        res.end();
        return;
      }

      if (pathname.startsWith('/store-admin') || pathname.startsWith('/admin')) {
        // Redirect to Medusa admin backend
        res.writeHead(302, { Location: `${MEDUSA_BACKEND_URL}/app${pathname.replace('/store-admin', '').replace('/admin', '')}` });
        res.end();
        return;
      }

      // Handle API calls that need to communicate with Medusa
      if (pathname.startsWith('/api/medusa')) {
        await handle(req, res, parsedUrl);
        return;
      }

      // Handle all other Binna platform requests (public pages, user dashboard, etc.)
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });server.listen(port, (err) => {
    if (err) throw err;
    console.log(`🚀 Unified Binna Platform ready on http://${hostname}:${port}`);
    console.log('📋 Available routes:');
    console.log('  🌐 Frontend: http://localhost:3000');
    console.log('  🏪 Store Pages: http://localhost:3000/store');
    console.log('  🛒 Products: http://localhost:3000/products');
    console.log('  👤 User Dashboard: http://localhost:3000/dashboard');
    console.log('  ⚙️  Admin Panel: http://localhost:3000/admin');
    console.log('  🔧 Medusa Admin Proxy: http://localhost:3000/medusa-admin');
    console.log('  🛍️  Medusa Store Proxy: http://localhost:3000/medusa-store');
    console.log('  📊 Medusa API Proxy: http://localhost:3000/medusa-api');
    console.log('  🔐 API: http://localhost:3000/api');
    console.log('');
    console.log('🔗 Direct Medusa Backend: http://localhost:9000');
    console.log('� Direct Medusa Storefront: http://localhost:8000');
    console.log('💡 Unified platform integrates real Medusa Community Edition');
  });
});

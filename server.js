const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { createProxyMiddleware } = require('http-proxy-middleware');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

// Odoo configuration
const ODOO_URL = process.env.ODOO_URL || 'http://localhost:8069';

// Initialize Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Create Odoo proxy middleware
const odooProxy = createProxyMiddleware({
  target: ODOO_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/odoo': '', // Remove /odoo prefix when forwarding to Odoo
  },
  onError: (err, req, res) => {
    console.error('Odoo proxy error:', err.message);
    res.status(500).json({ error: 'Odoo service unavailable' });
  },
});

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;

      // Route Odoo Admin (iframe or redirect to Odoo backend)
      if (pathname.startsWith('/odoo') || pathname.startsWith('/web')) {
        odooProxy(req, res);
        return;
      }      // Route unified admin (your custom admin with Odoo integration)
      if (pathname.startsWith('/admin') || pathname.startsWith('/store')) {
        await handle(req, res, parsedUrl);
        return;
      }

      // Route API endpoints for Odoo integration
      if (pathname.startsWith('/api/odoo')) {
        await handle(req, res, parsedUrl);
        return;
      }

      // Route Medusa API endpoints (legacy support)
      if (pathname.startsWith('/api/medusa') || pathname.startsWith('/store') || pathname.startsWith('/admin/api')) {
        await handle(req, res, parsedUrl);
        return;
      }

      // Handle all other requests with Next.js
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`🚀 Unified Binaa Platform ready on http://${hostname}:${port}`);
    console.log('📋 Available routes:');
    console.log('  🌐 Frontend: http://localhost:3000');
    console.log('  🏪 Store: http://localhost:3000/store');
    console.log('  🛒 Products: http://localhost:3000/products');
    console.log('  👤 User Dashboard: http://localhost:3000/dashboard');
    console.log('  ⚙️  Admin Panel: http://localhost:3000/admin');
    console.log('  🔧 Odoo Backend: http://localhost:3000/odoo');
    console.log('  📊 API: http://localhost:3000/api');
    console.log('  🔐 Auth: http://localhost:3000/api/auth');
    console.log('');
    console.log('🔗 Direct Odoo access: http://localhost:8069');
    console.log('💡 Best practice: Use unified frontend for customer-facing features');
  });
});

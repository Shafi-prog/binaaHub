const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { createProxyMiddleware } = require('http-proxy-middleware');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

// Initialize Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;

      // Route Medusa Admin to integrated admin
      if (pathname.startsWith('/admin')) {
        // Serve integrated Medusa admin
        await handle(req, res, parsedUrl);
        return;
      }

      // Route Medusa API endpoints
      if (pathname.startsWith('/api/medusa') || pathname.startsWith('/store') || pathname.startsWith('/admin/api')) {
        // Proxy to Medusa backend (if still needed for some operations)
        // But we'll integrate most functionality directly
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
    console.log(`🚀 Unified server ready on http://${hostname}:${port}`);
    console.log('📋 Available routes:');
    console.log('  🌐 Frontend: http://localhost:3000');
    console.log('  🏪 Store API: http://localhost:3000/api/store');
    console.log('  ⚙️  Admin: http://localhost:3000/admin');
    console.log('  🔐 Auth: http://localhost:3000/api/auth');
  });
});

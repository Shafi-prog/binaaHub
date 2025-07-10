const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

// Medusa configuration
const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000';

// Initialize Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;      // Route user shopping pages to integrated storefront within Binna
      if (pathname.startsWith('/shop') || pathname.startsWith('/products') || pathname.startsWith('/cart') || pathname.startsWith('/account')) {
        // Handle as regular Binna platform pages with integrated Medusa API
        await handle(req, res, parsedUrl);
        return;
      }

      // Redirect to Medusa admin backend for store management
      if (pathname.startsWith('/store-admin') || pathname.startsWith('/admin')) {
        // Redirect to Medusa admin backend (store admin at localhost:9000)
        res.writeHead(302, { Location: `${MEDUSA_BACKEND_URL}/app${pathname.replace('/store-admin', '').replace('/admin', '')}` });
        res.end();
        return;
      }

      // Handle API calls that need to communicate with Medusa
      if (pathname.startsWith('/api/medusa')) {
        await handle(req, res, parsedUrl);
        return;
      }

      // Handle all other Binna platform requests (public pages, user dashboard, construction management, etc.)
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });
  
  server.listen(port, (err) => {
    if (err) throw err;    console.log(`🚀 Binna Platform ready on http://${hostname}:${port}`);
    console.log('📋 Clean & Integrated Architecture:');
    console.log('');
    console.log('🏛️  BINNA PLATFORM (localhost:3000) - All-in-One:');
    console.log('  🌐 Homepage: http://localhost:3000');
    console.log('  📋 About: http://localhost:3000/about');
    console.log('  📞 Contact: http://localhost:3000/contact');
    console.log('  🔐 Auth: http://localhost:3000/login');
    console.log('  👤 User Dashboard: http://localhost:3000/dashboard');
    console.log('  🏗️  Construction Management: http://localhost:3000/projects');
    console.log('  �️  Shopping: http://localhost:3000/shop');
    console.log('  📦 Products: http://localhost:3000/products');
    console.log('  🛒 Cart: http://localhost:3000/cart');
    console.log('  👤 Account: http://localhost:3000/account');
    console.log('');
    console.log('🏪 STORE ADMIN (Medusa Backend - localhost:9000):');
    console.log('  ⚙️  Admin Panel: http://localhost:9000/app');
    console.log('  📊 Dashboard: http://localhost:9000/app/dashboard');
    console.log('  📦 Manage Products: http://localhost:9000/app/products');
    console.log('  📋 Manage Orders: http://localhost:9000/app/orders');
    console.log('  👥 Customers: http://localhost:9000/app/customers');
    console.log('');
    console.log('🔗 Quick Access from Binna:');
    console.log('  🏪 /store-admin → http://localhost:9000/app (Store Management)');
    console.log('');
    console.log('💡 Simple & Integrated - Everything in one platform!');
  });
});

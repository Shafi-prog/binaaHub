// Mock Medusa Server for Development
// This provides all Medusa APIs locally without requiring the full Medusa backend

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 9000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Mock data
let products = [
  {
    id: 'prod_01',
    title: 'Construction Safety Helmet',
    description: 'High-quality safety helmet for construction workers',
    handle: 'safety-helmet',
    status: 'published',
    variants: [
      {
        id: 'variant_01',
        title: 'Standard Size',
        sku: 'HELMET-001',
        inventory_quantity: 50,
        prices: [
          { amount: 2500, currency_code: 'usd' },
          { amount: 9375, currency_code: 'sar' },
        ],
      },
      {
        id: 'variant_02',
        title: 'Large Size',
        sku: 'HELMET-002',
        inventory_quantity: 30,
        prices: [
          { amount: 2700, currency_code: 'usd' },
          { amount: 10125, currency_code: 'sar' },
        ],
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod_02',
    title: 'High-Visibility Safety Vest',
    description: 'Reflective safety vest meeting industry standards',
    handle: 'safety-vest',
    status: 'published',
    variants: [
      {
        id: 'variant_03',
        title: 'Medium',
        sku: 'VEST-M-001',
        inventory_quantity: 75,
        prices: [
          { amount: 1500, currency_code: 'usd' },
          { amount: 5625, currency_code: 'sar' },
        ],
      },
      {
        id: 'variant_04',
        title: 'Large',
        sku: 'VEST-L-001',
        inventory_quantity: 60,
        prices: [
          { amount: 1600, currency_code: 'usd' },
          { amount: 6000, currency_code: 'sar' },
        ],
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod_03',
    title: 'Steel-Toe Work Boots',
    description: 'Durable steel-toe boots for construction sites',
    handle: 'steel-toe-boots',
    status: 'published',
    variants: [
      {
        id: 'variant_05',
        title: 'Size 42',
        sku: 'BOOTS-42-001',
        inventory_quantity: 25,
        prices: [
          { amount: 8500, currency_code: 'usd' },
          { amount: 31875, currency_code: 'sar' },
        ],
      },
      {
        id: 'variant_06',
        title: 'Size 44',
        sku: 'BOOTS-44-001',
        inventory_quantity: 20,
        prices: [
          { amount: 8500, currency_code: 'usd' },
          { amount: 31875, currency_code: 'sar' },
        ],
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod_04',
    title: 'Construction Tool Set',
    description: 'Complete set of essential construction tools',
    handle: 'tool-set',
    status: 'published',
    variants: [
      {
        id: 'variant_07',
        title: 'Basic Set',
        sku: 'TOOLS-BASIC-001',
        inventory_quantity: 15,
        prices: [
          { amount: 12500, currency_code: 'usd' },
          { amount: 46875, currency_code: 'sar' },
        ],
      },
      {
        id: 'variant_08',
        title: 'Professional Set',
        sku: 'TOOLS-PRO-001',
        inventory_quantity: 10,
        prices: [
          { amount: 25000, currency_code: 'usd' },
          { amount: 93750, currency_code: 'sar' },
        ],
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod_05',
    title: 'Cement Bags (50kg)',
    description: 'High-grade Portland cement for construction',
    handle: 'cement-bags',
    status: 'published',
    variants: [
      {
        id: 'variant_09',
        title: 'Single Bag',
        sku: 'CEMENT-50KG-001',
        inventory_quantity: 200,
        prices: [
          { amount: 800, currency_code: 'usd' },
          { amount: 3000, currency_code: 'sar' },
        ],
      },
      {
        id: 'variant_10',
        title: 'Pallet (40 bags)',
        sku: 'CEMENT-PALLET-001',
        inventory_quantity: 25,
        prices: [
          { amount: 30000, currency_code: 'usd' },
          { amount: 112500, currency_code: 'sar' },
        ],
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

let orders = [
  {
    id: 'order_01',
    display_id: 1001,
    status: 'completed',
    payment_status: 'captured',
    fulfillment_status: 'shipped',
    total: 5000,
    currency_code: 'usd',
    customer: {
      first_name: 'Ahmed',
      last_name: 'Al-Mahmoud',
      email: 'ahmed@example.com',
    },
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    id: 'order_02',
    display_id: 1002,
    status: 'pending',
    payment_status: 'awaiting',
    fulfillment_status: 'not_fulfilled',
    total: 12500,
    currency_code: 'sar',
    customer: {
      first_name: 'Sarah',
      last_name: 'Al-Rashid',
      email: 'sarah@example.com',
    },
    created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    id: 'order_03',
    display_id: 1003,
    status: 'processing',
    payment_status: 'captured',
    fulfillment_status: 'fulfilled',
    total: 8500,
    currency_code: 'usd',
    customer: {
      first_name: 'Mohammed',
      last_name: 'Al-Fahad',
      email: 'mohammed@example.com',
    },
    created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
  },
];

let regions = [
  {
    id: 'region_01',
    name: 'Saudi Arabia',
    currency_code: 'sar',
  },
  {
    id: 'region_02',
    name: 'United States',
    currency_code: 'usd',
  },
];

let carts = {};

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Mock Medusa server running' });
});

// Store API endpoints
app.get('/store/products', (req, res) => {
  const { limit = 10, offset = 0 } = req.query;
  const startIndex = parseInt(offset);
  const endIndex = startIndex + parseInt(limit);
  
  const paginatedProducts = products.slice(startIndex, endIndex);
  
  res.json({
    products: paginatedProducts,
    count: products.length,
    offset: parseInt(offset),
    limit: parseInt(limit),
  });
});

app.get('/store/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ product });
});

app.get('/store/regions', (req, res) => {
  res.json({ regions });
});

app.post('/store/carts', (req, res) => {
  const cartId = 'cart_' + Date.now();
  const cart = {
    id: cartId,
    region_id: req.body.region_id,
    items: req.body.items || [],
    total: 0,
    created_at: new Date().toISOString(),
  };
  carts[cartId] = cart;
  res.json({ cart });
});

app.get('/store/carts/:id', (req, res) => {
  const cart = carts[req.params.id];
  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }
  res.json({ cart });
});

// Admin API endpoints
app.get('/admin/products', (req, res) => {
  const { limit = 50, offset = 0 } = req.query;
  const startIndex = parseInt(offset);
  const endIndex = startIndex + parseInt(limit);
  
  const paginatedProducts = products.slice(startIndex, endIndex);
  
  res.json({
    products: paginatedProducts,
    count: products.length,
    offset: parseInt(offset),
    limit: parseInt(limit),
  });
});

app.post('/admin/products', (req, res) => {
  const newProduct = {
    id: 'prod_' + Date.now(),
    ...req.body,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  // Add default variant if none provided
  if (!newProduct.variants || newProduct.variants.length === 0) {
    newProduct.variants = [
      {
        id: 'variant_' + Date.now(),
        title: 'Default Variant',
        sku: newProduct.handle?.toUpperCase() + '-001' || 'PRODUCT-001',
        inventory_quantity: 100,
        prices: [
          { amount: 1000, currency_code: 'usd' },
          { amount: 3750, currency_code: 'sar' },
        ],
      },
    ];
  }
  
  products.push(newProduct);
  res.json({ product: newProduct });
});

app.get('/admin/orders', (req, res) => {
  const { limit = 50, offset = 0 } = req.query;
  const startIndex = parseInt(offset);
  const endIndex = startIndex + parseInt(limit);
  
  const paginatedOrders = orders.slice(startIndex, endIndex);
  
  res.json({
    orders: paginatedOrders,
    count: orders.length,
    offset: parseInt(offset),
    limit: parseInt(limit),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mock Medusa Server running on http://localhost:${PORT}`);
  console.log('📦 Available endpoints:');
  console.log('  🛒 Store API: http://localhost:9000/store/products');
  console.log('  👨‍💼 Admin API: http://localhost:9000/admin/products');
  console.log('  🏥 Health Check: http://localhost:9000/health');
  console.log('');
  console.log('📊 Mock Data:');
  console.log(`  📦 ${products.length} products`);
  console.log(`  📋 ${orders.length} orders`);
  console.log(`  🌍 ${regions.length} regions`);
});

module.exports = app;

// Main API entry point for the Binna platform
import { NextRequest } from 'next/server';
import { apiLayer } from './unified-api';
import './routes/api-routes'; // Import to register routes

// Main API handler for all requests
export async function handleAPIRequest(request: NextRequest) {
  // Add CORS headers
  const response = await apiLayer.processRequest(request);
  
  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return response;
}

// Handle OPTIONS requests for CORS
export async function handleOPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// API documentation endpoint
export async function getAPIDocs() {
  const docs = {
    title: 'Binna Platform API',
    version: '1.0.0',
    description: 'RESTful API for the Binna marketplace and ERP platform',
    baseUrl: '/api/v1',
    endpoints: [
      {
        path: '/products',
        methods: ['GET', 'POST'],
        description: 'Product management endpoints',
        auth: 'Bearer token required for POST',
      },
      {
        path: '/orders',
        methods: ['GET', 'POST'],
        description: 'Order management endpoints',
        auth: 'Bearer token required',
      },
      {
        path: '/stores',
        methods: ['GET'],
        description: 'Store listing endpoint',
        auth: 'Public endpoint',
      },
      {
        path: '/analytics/sales',
        methods: ['GET'],
        description: 'Sales analytics endpoint',
        auth: 'Bearer token required (store_owner role)',
      },
      {
        path: '/auth/login',
        methods: ['POST'],
        description: 'Authentication endpoint',
        auth: 'Public endpoint',
      },
    ],
    authentication: {
      type: 'Bearer Token',
      header: 'Authorization: Bearer <token>',
      description: 'Include JWT token in Authorization header',
    },
    rateLimit: {
      api: '100 requests per minute',
      auth: '5 requests per 15 minutes',
      public: '200 requests per minute',
    },
  };

  return new Response(JSON.stringify(docs, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
}

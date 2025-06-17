'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Package, Plus, Search, Filter } from 'lucide-react';

export default function ProductsPage() {
  const [medusaRunning, setMedusaRunning] = useState(false);

  useEffect(() => {
    // Check if Medusa admin is running
    fetch('http://localhost:9000/admin/products', { 
      method: 'HEAD',
      mode: 'no-cors'
    })
    .then(() => setMedusaRunning(true))
    .catch(() => setMedusaRunning(false));
  }, []);

  const startMedusaAdmin = () => {
    window.open('http://localhost:9000/admin', '_blank');
  };

  const startMedusaServer = async () => {
    // This would trigger starting the Medusa server
    window.open('/store/medusa-develop', '_blank');
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600">Manage your products using Medusa Commerce</p>
        </div>
        <div className="flex gap-2">
          <button onClick={startMedusaAdmin} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <ExternalLink className="w-4 h-4" />
            Open Medusa Admin
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {medusaRunning ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-green-800">Medusa Admin is Running</h3>
            </div>
            <p className="text-green-700 mb-4">
              Your Medusa admin panel is active and ready to use. Click the button below to access the full product management interface.
            </p>
            <button onClick={startMedusaAdmin} className="bg-green-600 hover:bg-green-700 px-4 py-2 text-white rounded">
              <ExternalLink className="w-4 h-4 mr-2 inline" />
              Access Medusa Admin
            </button>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-yellow-800">Start Medusa Server</h3>
            </div>
            <p className="text-yellow-700 mb-4">
              To use the full Medusa product management features, you need to start the Medusa server first.
            </p>
            <div className="flex gap-2">
              <button onClick={startMedusaServer} className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 text-white rounded">
                <Package className="w-4 h-4 mr-2 inline" />
                Start Medusa Server
              </button>
              <button onClick={() => window.open('/store/medusa-develop/README.md', '_blank')} className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50">
                View Setup Guide
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onClick={startMedusaAdmin}>
              <Package className="w-8 h-8 text-blue-600 mb-2" />
              <h4 className="font-medium">Manage Products</h4>
              <p className="text-sm text-gray-600">Add, edit, and organize your product catalog</p>
            </div>
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onClick={startMedusaAdmin}>
              <Search className="w-8 h-8 text-green-600 mb-2" />
              <h4 className="font-medium">View Inventory</h4>
              <p className="text-sm text-gray-600">Check stock levels and manage inventory</p>
            </div>
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onClick={startMedusaAdmin}>
              <Filter className="w-8 h-8 text-purple-600 mb-2" />
              <h4 className="font-medium">Categories & Tags</h4>
              <p className="text-sm text-gray-600">Organize products with categories and tags</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">About Medusa Integration</h3>
          <p className="text-blue-700 text-sm">
            Your store now uses Medusa Commerce for advanced product management. Medusa provides enterprise-grade 
            e-commerce features including product variants, inventory tracking, order management, and much more.
          </p>
        </div>
      </div>
    </div>
  );
}

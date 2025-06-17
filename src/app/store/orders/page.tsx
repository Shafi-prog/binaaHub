'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, ShoppingCart, Package, Users } from 'lucide-react';

export default function OrdersPage() {
  const [medusaRunning, setMedusaRunning] = useState(false);

  useEffect(() => {
    fetch('http://localhost:9000/admin/orders', { 
      method: 'HEAD',
      mode: 'no-cors'
    })
    .then(() => setMedusaRunning(true))
    .catch(() => setMedusaRunning(false));
  }, []);

  const startMedusaAdmin = () => {
    window.open('http://localhost:9000/admin/orders', '_blank');
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600">Manage your orders using Medusa Commerce</p>
        </div>
        <div className="flex gap-2">
          <button onClick={startMedusaAdmin} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <ExternalLink className="w-4 h-4" />
            Open Medusa Orders
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
              Access the full order management interface with Medusa's powerful order processing features.
            </p>
            <button onClick={startMedusaAdmin} className="bg-green-600 hover:bg-green-700 px-4 py-2 text-white rounded">
              <ExternalLink className="w-4 h-4 mr-2 inline" />
              Access Order Management
            </button>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-yellow-800">Start Medusa Server</h3>
            </div>
            <p className="text-yellow-700 mb-4">
              Start the Medusa server to access order management features.
            </p>
          </div>
        )}

        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Order Management Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onClick={startMedusaAdmin}>
              <ShoppingCart className="w-8 h-8 text-blue-600 mb-2" />
              <h4 className="font-medium">Process Orders</h4>
              <p className="text-sm text-gray-600">View, edit, and fulfill customer orders</p>
            </div>
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onClick={startMedusaAdmin}>
              <Package className="w-8 h-8 text-green-600 mb-2" />
              <h4 className="font-medium">Track Shipments</h4>
              <p className="text-sm text-gray-600">Monitor order fulfillment and shipping</p>
            </div>
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onClick={startMedusaAdmin}>
              <Users className="w-8 h-8 text-purple-600 mb-2" />
              <h4 className="font-medium">Customer Service</h4>
              <p className="text-sm text-gray-600">Handle returns, refunds, and exchanges</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

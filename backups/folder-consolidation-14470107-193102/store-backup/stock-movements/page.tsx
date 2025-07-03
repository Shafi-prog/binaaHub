'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, TrendingUp, ArrowUpDown, Package } from 'lucide-react';

export default function StockMovementsPage() {
  const [medusaRunning, setMedusaRunning] = useState(false);

  useEffect(() => {
    // Check if Medusa admin is running
    fetch('http://localhost:9000/admin/inventory', { 
      method: 'HEAD',
      mode: 'no-cors'
    })
    .then(() => setMedusaRunning(true))
    .catch(() => setMedusaRunning(false));
  }, []);

  const startMedusaAdmin = () => {
    window.open('http://localhost:9000/admin/inventory', '_blank');
  };

  const startMedusaServer = async () => {
    // This would trigger starting the Medusa server
    window.open('/store/medusa-develop', '_blank');
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stock Movements</h1>
          <p className="text-gray-600">Track inventory movements using Medusa Commerce</p>
        </div>
        <div className="flex gap-2">
          <button onClick={startMedusaAdmin} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <ExternalLink className="w-4 h-4" />
            Open Inventory Tracking
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
              Access comprehensive inventory tracking with detailed stock movement history and analytics.
            </p>
            <button onClick={startMedusaAdmin} className="bg-green-600 hover:bg-green-700 px-4 py-2 text-white rounded">
              <ExternalLink className="w-4 h-4 mr-2 inline" />
              Access Inventory Tracking
            </button>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-yellow-800">Start Medusa Server</h3>
            </div>
            <p className="text-yellow-700 mb-4">
              To track stock movements and inventory changes, you need to start the Medusa server first.
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
          <h3 className="text-lg font-semibold mb-4">Movement Tracking</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onClick={startMedusaAdmin}>
              <ArrowUpDown className="w-8 h-8 text-blue-600 mb-2" />
              <h4 className="font-medium">Stock Movements</h4>
              <p className="text-sm text-gray-600">View all inventory in/out movements</p>
            </div>
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onClick={startMedusaAdmin}>
              <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
              <h4 className="font-medium">Movement Analytics</h4>
              <p className="text-sm text-gray-600">Analyze inventory movement patterns</p>
            </div>
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onClick={startMedusaAdmin}>
              <Package className="w-8 h-8 text-purple-600 mb-2" />
              <h4 className="font-medium">Adjustment History</h4>
              <p className="text-sm text-gray-600">Track manual stock adjustments</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Stock Movement Features</h3>
          <ul className="text-blue-700 space-y-1 text-sm">
            <li>• Real-time movement tracking</li>
            <li>• Movement type categorization (sales, adjustments, returns)</li>
            <li>• Historical movement data</li>
            <li>• Movement analytics and reporting</li>
            <li>• Location-based tracking</li>
            <li>• Audit trails for all changes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

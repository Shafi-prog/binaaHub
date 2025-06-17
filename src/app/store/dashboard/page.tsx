'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, BarChart3, TrendingUp, Package, ShoppingCart, Users, Layers, Settings, AlertTriangle } from 'lucide-react';

const medusaFeatures = [
  {
    name: 'Products',
    description: 'Manage your product catalog, variants, and categories',
    icon: <Package className="w-8 h-8 text-blue-600 mb-2" />,
    link: '/store/products',
  },
  {
    name: 'Orders',
    description: 'View and process customer orders',
    icon: <ShoppingCart className="w-8 h-8 text-orange-600 mb-2" />,
    link: '/store/orders',
  },
  {
    name: 'Inventory',
    description: 'Track and manage inventory across locations',
    icon: <Layers className="w-8 h-8 text-green-600 mb-2" />,
    link: '/store/inventory',
  },
  {
    name: 'Customers',
    description: 'Manage customer accounts and details',
    icon: <Users className="w-8 h-8 text-purple-600 mb-2" />,
    link: '/store/customers',
  },
  {
    name: 'Analytics',
    description: 'View sales, revenue, and performance analytics',
    icon: <BarChart3 className="w-8 h-8 text-cyan-600 mb-2" />,
    link: '/store/analytics',
  },
  {
    name: 'Settings',
    description: 'Configure store, regions, taxes, and more',
    icon: <Settings className="w-8 h-8 text-gray-600 mb-2" />,
    link: '/store/settings',
  },
];

export default function StoreDashboardPage() {
  const [medusaRunning, setMedusaRunning] = useState(false);

  useEffect(() => {
    // Check if Medusa admin is running
    fetch('http://localhost:9000/admin', { 
      method: 'HEAD',
      mode: 'no-cors'
    })
    .then(() => setMedusaRunning(true))
    .catch(() => setMedusaRunning(false));
  }, []);

  const openMedusa = (url: string) => {
    window.open(url, '_blank');
  };

  const startMedusaServer = () => {
    window.open('/store/medusa-develop', '_blank');
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Store Dashboard</h1>
          <p className="text-gray-600">Access all Medusa Commerce features from one place</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => openMedusa('http://localhost:9000/admin')} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50" disabled={!medusaRunning}>
            <ExternalLink className="w-4 h-4" />
            Open Medusa Admin
          </button>
        </div>
      </div>

      {!medusaRunning && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6 flex items-center gap-4">
          <AlertTriangle className="w-6 h-6 text-yellow-600" />
          <div>
            <h3 className="text-lg font-semibold text-yellow-800 mb-1">Medusa Admin Not Running</h3>
            <p className="text-yellow-700 mb-2">Start the Medusa server to access all features. <button onClick={startMedusaServer} className="underline text-blue-700">Start Medusa Server</button></p>
            <button onClick={() => window.open('/store/medusa-develop/README.md', '_blank')} className="border border-gray-300 px-3 py-1 rounded hover:bg-gray-50 text-sm">View Setup Guide</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {medusaFeatures.map((feature) => (
          <div
            key={feature.name}
            className={
              'border rounded-lg p-6 bg-white flex flex-col items-start hover:bg-gray-50 transition cursor-pointer'
            }
            onClick={() => openMedusa(feature.link)}
            tabIndex={0}
          >
            {feature.icon}
            <h4 className="font-medium text-lg mb-1">{feature.name}</h4>
            <p className="text-sm text-gray-600 mb-2">{feature.description}</p>
            <span className="text-xs text-blue-700 flex items-center gap-1">
              <ExternalLink className="w-3 h-3 inline" /> Go to {feature.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

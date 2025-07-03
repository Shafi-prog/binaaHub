'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Package, BarChart3, AlertTriangle } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

// TypeScript interfaces moved to the top for correct syntax
interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string;
  price: number;
  stock: number;
  supplier_id?: string;
  created_at: string;
  updated_at: string;
}

interface StockMovement {
  id: string;
  product_id: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  previous_stock: number;
  new_stock: number;
  reference_id?: string;
  reference_type?: string;
  notes?: string;
  created_at: string;
  product?: Product;
}

interface StockAlert {
  id: string;
  product_id: string;
  alert_type: 'low_stock' | 'out_of_stock' | 'overstock';
  current_stock: number;
  threshold_value?: number;
  is_acknowledged: boolean;
  created_at: string;
  product?: Product;
}

interface Supplier {
  id: string;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  vat_number?: string;
  payment_terms?: string;
  is_active: boolean;
  rating?: number;
}

interface PurchaseOrder {
  id: string;
  po_number: string;
  supplier_id: string;
  status: 'draft' | 'sent' | 'confirmed' | 'received' | 'cancelled';
  subtotal: number;
  vat_amount: number;
  total_amount: number;
  order_date: string;
  expected_delivery_date?: string;
  actual_delivery_date?: string;
  supplier?: Supplier;
}

export default function InventoryPage() {
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
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Manage your inventory using Medusa Commerce</p>
        </div>
        <div className="flex gap-2">
          <button onClick={startMedusaAdmin} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <ExternalLink className="w-4 h-4" />
            Open Medusa Inventory
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
              Access the full inventory management interface with real-time stock tracking and analytics.
            </p>
            <button onClick={startMedusaAdmin} className="bg-green-600 hover:bg-green-700 px-4 py-2 text-white rounded">
              <ExternalLink className="w-4 h-4 mr-2 inline" />
              Access Inventory Management
            </button>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-yellow-800">Start Medusa Server</h3>
            </div>
            <p className="text-yellow-700 mb-4">
              To use the full Medusa inventory management features, you need to start the Medusa server first.
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
          <h3 className="text-lg font-semibold mb-4">Inventory Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onClick={startMedusaAdmin}>
              <Package className="w-8 h-8 text-blue-600 mb-2" />
              <h4 className="font-medium">Stock Management</h4>
              <p className="text-sm text-gray-600">Track and manage product stock levels</p>
            </div>
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onClick={startMedusaAdmin}>
              <BarChart3 className="w-8 h-8 text-green-600 mb-2" />
              <h4 className="font-medium">Inventory Analytics</h4>
              <p className="text-sm text-gray-600">View detailed inventory reports and insights</p>
            </div>
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onClick={startMedusaAdmin}>
              <AlertTriangle className="w-8 h-8 text-orange-600 mb-2" />
              <h4 className="font-medium">Low Stock Alerts</h4>
              <p className="text-sm text-gray-600">Get notified when inventory runs low</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Medusa Inventory Features</h3>
          <ul className="text-blue-700 space-y-1 text-sm">
            <li>• Multi-location inventory tracking</li>
            <li>• Real-time stock level updates</li>
            <li>• Automated reorder points</li>
            <li>• Inventory adjustments and transfers</li>
            <li>• Detailed movement history</li>
            <li>• Low stock notifications</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

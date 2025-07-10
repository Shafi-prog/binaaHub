"use client";

import React, { useState, useEffect } from 'react';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  unitPrice: number;
  totalValue: number;
  supplier: string;
  lastUpdated: Date;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

interface EnhancedInventoryManagementProps {
  className?: string;
}

const EnhancedInventoryManagement: React.FC<EnhancedInventoryManagementProps> = ({ className = "" }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data
  useEffect(() => {
    const mockInventory: InventoryItem[] = [
      {
        id: '1',
        name: 'Construction Helmet',
        sku: 'CH-001',
        category: 'Safety Equipment',
        quantity: 45,
        minQuantity: 10,
        maxQuantity: 100,
        unitPrice: 25.99,
        totalValue: 1169.55,
        supplier: 'SafetyFirst Corp',
        lastUpdated: new Date(),
        status: 'in-stock'
      },
      {
        id: '2',
        name: 'Steel Rebar 10mm',
        sku: 'SR-010',
        category: 'Building Materials',
        quantity: 5,
        minQuantity: 10,
        maxQuantity: 500,
        unitPrice: 12.50,
        totalValue: 62.50,
        supplier: 'Steel Supplies Ltd',
        lastUpdated: new Date(),
        status: 'low-stock'
      },
      {
        id: '3',
        name: 'Cement Bags 50kg',
        sku: 'CB-050',
        category: 'Building Materials',
        quantity: 0,
        minQuantity: 20,
        maxQuantity: 200,
        unitPrice: 8.75,
        totalValue: 0,
        supplier: 'BuildMart',
        lastUpdated: new Date(),
        status: 'out-of-stock'
      }
    ];
    
    setTimeout(() => {
      setInventory(mockInventory);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = Array.from(new Set(inventory.map(item => item.category)));

  const getStatusColor = (status: InventoryItem['status']) => {
    switch (status) {
      case 'in-stock': return 'text-green-600 bg-green-100';
      case 'low-stock': return 'text-yellow-600 bg-yellow-100';
      case 'out-of-stock': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleQuantityUpdate = (id: string, newQuantity: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = {
          ...item,
          quantity: newQuantity,
          totalValue: newQuantity * item.unitPrice,
          lastUpdated: new Date()
        };
        
        // Update status based on quantity
        if (newQuantity === 0) {
          updatedItem.status = 'out-of-stock';
        } else if (newQuantity <= item.minQuantity) {
          updatedItem.status = 'low-stock';
        } else {
          updatedItem.status = 'in-stock';
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Enhanced Inventory Management</h2>
        
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-600">Total Items</h3>
            <p className="text-2xl font-bold text-blue-800">{inventory.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-600">In Stock</h3>
            <p className="text-2xl font-bold text-green-800">
              {inventory.filter(item => item.status === 'in-stock').length}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-600">Low Stock</h3>
            <p className="text-2xl font-bold text-yellow-800">
              {inventory.filter(item => item.status === 'low-stock').length}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-red-600">Out of Stock</h3>
            <p className="text-2xl font-bold text-red-800">
              {inventory.filter(item => item.status === 'out-of-stock').length}
            </p>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unit Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInventory.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-500">SKU: {item.sku}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityUpdate(item.id, parseInt(e.target.value) || 0)}
                    className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    min="0"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Min: {item.minQuantity} | Max: {item.maxQuantity}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${item.unitPrice.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${item.totalValue.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                    {item.status.replace('-', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredInventory.length === 0 && (
        <div className="p-6 text-center text-gray-500">
          No inventory items found matching your criteria.
        </div>
      )}
    </div>
  );
};

export default EnhancedInventoryManagement;

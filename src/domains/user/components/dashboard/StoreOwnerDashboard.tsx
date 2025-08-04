'use client';

import React from 'react';

export function StoreOwnerDashboard() {
  const projectOrders = [
    { projectName: 'Downtown Office', orderValue: 15000, status: 'pending', items: 25 },
    { projectName: 'Residential Villa', orderValue: 8500, status: 'shipped', items: 12 },
  ];

  const inventoryAlerts = [
    { item: 'Concrete Mix', currentStock: 15, minThreshold: 50, status: 'low' },
    { item: 'Steel Rebar', currentStock: 5, minThreshold: 20, status: 'critical' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500">Monthly Revenue</div>
          <div className="text-2xl font-bold text-gray-900">$45,200</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500">Project Orders</div>
          <div className="text-2xl font-bold text-gray-900">{projectOrders.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500">Inventory Alerts</div>
          <div className="text-2xl font-bold text-gray-900">{inventoryAlerts.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500">Total Products</div>
          <div className="text-2xl font-bold text-gray-900">284</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Project Orders</h3>
          <div className="space-y-3">
            {projectOrders.map((order, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{order.projectName}</p>
                  <p className="text-sm text-gray-500">{order.items} items</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${order.orderValue.toLocaleString()}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    order.status === 'shipped' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Inventory Alerts</h3>
          <div className="space-y-3">
            {inventoryAlerts.map((alert, index) => (
              <div key={index} className="border border-gray-200 rounded p-3">
                <div className="flex justify-between items-center">
                  <p className="font-medium">{alert.item}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    alert.status === 'critical' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {alert.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Stock: {alert.currentStock} (Min: {alert.minThreshold})
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

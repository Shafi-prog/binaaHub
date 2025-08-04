'use client';

import React from 'react';

export function AdminDashboard() {
  const systemStats = [
    { label: 'Total Users', value: '1,247', change: '+5.2%' },
    { label: 'Active Projects', value: '89', change: '+12.1%' },
    { label: 'Monthly Revenue', value: '$156,890', change: '+8.7%' },
    { label: 'System Health', value: '99.8%', change: '+0.1%' }
  ];

  const recentActivity = [
    { action: 'New project created', user: 'Ahmed Hassan', time: '5 min ago' },
    { action: 'Store registration', user: 'BuildMart Store', time: '12 min ago' },
    { action: 'Large order placed', user: 'Construction Corp', time: '1 hour ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {systemStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">{stat.label}</div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-green-600">{stat.change}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.user}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">System Alerts</h3>
          <div className="space-y-2">
            <div className="bg-green-50 border border-green-200 rounded p-3">
              <p className="text-sm text-green-800">All systems operational</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
              <p className="text-sm text-yellow-800">Scheduled maintenance in 2 days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

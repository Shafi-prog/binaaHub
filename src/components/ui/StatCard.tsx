import React, { ReactNode } from 'react';

export interface StatCardProps {
  title: string;
  value: string;
  icon?: ReactNode;
  color?: string;
}

export function StatCard({ title, value, icon, color = 'blue' }: StatCardProps) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    purple: 'bg-purple-100 text-purple-800',
    indigo: 'bg-indigo-100 text-indigo-800',
    pink: 'bg-pink-100 text-pink-800',
  };

  const bgColor = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center">
        {icon && (
          <div className={`p-3 rounded-full ${bgColor} mr-4`}>
            {icon}
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { useProjectMaterials } from '../../hooks/useProject';

interface ProjectMaterialsOverviewProps {
  projectId: string;
}

export function MaterialInventory({ projectId }: ProjectMaterialsOverviewProps) {
  const { materials, loading, error } = useProjectMaterials(projectId);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Materials & Inventory</h3>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Materials & Inventory</h3>
        <p className="text-red-600">Error loading materials: {error}</p>
      </div>
    );
  }

  const totalValue = materials.reduce((sum, material) => sum + material.totalCost, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Materials & Inventory</h3>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Value</p>
          <p className="text-lg font-semibold text-gray-900">${totalValue.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="space-y-3">
        {materials.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500">No materials added yet</p>
            <button className="mt-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Add Materials
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {materials.slice(0, 5).map((material) => (
              <div key={material.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{material.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{material.quantity} {material.unit}</span>
                    {material.category && <span>• {material.category}</span>}
                    {material.supplierName && <span>• {material.supplierName}</span>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${material.totalCost.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">${material.unitCost}/unit</p>
                </div>
              </div>
            ))}
            
            {materials.length > 5 && (
              <button className="w-full py-2 text-sm text-blue-600 hover:text-blue-800">
                View all {materials.length} materials
              </button>
            )}
          </div>
        )}
      </div>

      {materials.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-semibold text-gray-900">{materials.length}</p>
              <p className="text-sm text-gray-500">Total Items</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {materials.filter(m => m.warrantyPeriodMonths).length}
              </p>
              <p className="text-sm text-gray-500">With Warranty</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {new Set(materials.map(m => m.category)).size}
              </p>
              <p className="text-sm text-gray-500">Categories</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

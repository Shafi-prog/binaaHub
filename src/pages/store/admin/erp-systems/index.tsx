/**
 * Main ERP Systems Management Page
 * Handles multiple ERP systems (Rawaa, Onyx Pro, Wafeq, Mezan, SAP, etc.)
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Settings, 
  Trash2, 
  Power, 
  PowerOff, 
  RefreshCw, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  TrendingUp
} from 'lucide-react';
import { ERPSystemConfig } from '@/core/shared/components/erp/ERPSystemConfig';
import { UnifiedLoader } from '@/core/shared/components/common/UnifiedLoader';
import { UnifiedBreadcrumb } from '@/core/shared/components/common/UnifiedBreadcrumb';

export interface ERPSystemData {
  id: string;
  name: string;
  type: string;
  version: string;
  status: 'active' | 'inactive' | 'error' | 'syncing';
  lastSync?: Date;
  config: any;
  features: string[];
  stats?: {
    products: number;
    orders: number;
    customers: number;
    lastActivity: Date;
  };
}

const ERPSystemsManagement: React.FC = () => {
  const [systems, setSystems] = useState<ERPSystemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [editingSystem, setEditingSystem] = useState<ERPSystemData | null>(null);
  const [syncing, setSyncing] = useState<string | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    const loadSystems = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockSystems: ERPSystemData[] = [
        {
          id: '1',
          name: 'Primary Medusa Store',
          type: 'medusa',
          version: '2.8.7',
          status: 'active',
          lastSync: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
          config: { baseUrl: 'http://localhost:9000' },
          features: ['products', 'orders', 'customers', 'inventory'],
          stats: {
            products: 1247,
            orders: 3891,
            customers: 2156,
            lastActivity: new Date(Date.now() - 2 * 60 * 1000)
          }
        },
        {
          id: '2',
          name: 'Rawaa ERP Production',
          type: 'rawaa',
          version: '3.2.1',
          status: 'inactive',
          config: { baseUrl: 'https://api.rawaa.com' },
          features: ['accounting', 'inventory', 'hr', 'projects']
        },
        {
          id: '3',
          name: 'Wafeq Accounting',
          type: 'wafeq',
          version: '2.1.0',
          status: 'error',
          lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          config: { baseUrl: 'https://api.wafeq.com' },
          features: ['accounting', 'invoicing', 'reports']
        }
      ];
      
      setSystems(mockSystems);
      setLoading(false);
    };

    loadSystems();
  }, []);

  const getStatusColor = (status: ERPSystemData['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'inactive':
        return 'text-gray-600 bg-gray-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      case 'syncing':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: ERPSystemData['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'inactive':
        return <PowerOff className="w-4 h-4" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4" />;
      case 'syncing':
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleAddSystem = () => {
    setEditingSystem(null);
    setIsConfigOpen(true);
  };

  const handleEditSystem = (system: ERPSystemData) => {
    setEditingSystem(system);
    setIsConfigOpen(true);
  };

  const handleSaveSystem = async (systemData: any) => {
    if (editingSystem) {
      // Update existing system
      setSystems(prev => prev.map(sys => 
        sys.id === editingSystem.id 
          ? { ...sys, ...systemData, id: editingSystem.id }
          : sys
      ));
    } else {
      // Add new system
      const newSystem: ERPSystemData = {
        ...systemData,
        id: Date.now().toString(),
        status: 'inactive' as const
      };
      setSystems(prev => [...prev, newSystem]);
    }
  };

  const handleToggleSystem = async (systemId: string) => {
    setSyncing(systemId);
    
    // Simulate activation/deactivation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSystems(prev => prev.map(sys => 
      sys.id === systemId 
        ? { 
            ...sys, 
            status: sys.status === 'active' ? 'inactive' : 'active',
            lastSync: sys.status === 'inactive' ? new Date() : sys.lastSync
          }
        : sys
    ));
    
    setSyncing(null);
  };

  const handleDeleteSystem = async (systemId: string) => {
    if (confirm('Are you sure you want to delete this ERP system? This action cannot be undone.')) {
      setSystems(prev => prev.filter(sys => sys.id !== systemId));
    }
  };

  const handleSyncSystem = async (systemId: string) => {
    setSyncing(systemId);
    
    setSystems(prev => prev.map(sys => 
      sys.id === systemId 
        ? { ...sys, status: 'syncing' as const }
        : sys
    ));
    
    // Simulate sync process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setSystems(prev => prev.map(sys => 
      sys.id === systemId 
        ? { 
            ...sys, 
            status: 'active' as const,
            lastSync: new Date(),
            stats: sys.stats ? {
              ...sys.stats,
              lastActivity: new Date()
            } : undefined
          }
        : sys
    ));
    
    setSyncing(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedBreadcrumb />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <UnifiedLoader type="spinner" context="page" message="Loading ERP systems..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedBreadcrumb />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">ERP Systems</h1>
              <p className="mt-2 text-gray-600">
                Manage integrations with Rawaa, Onyx Pro, Wafeq, Mezan, and other ERP systems
              </p>
            </div>
            <button
              onClick={handleAddSystem}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add ERP System
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Database className="w-8 h-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Systems</p>
                <p className="text-2xl font-bold text-gray-900">{systems.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Systems</p>
                <p className="text-2xl font-bold text-gray-900">
                  {systems.filter(s => s.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Activity className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Last Sync</p>
                <p className="text-2xl font-bold text-gray-900">
                  {systems.filter(s => s.lastSync).length > 0 ? '5m ago' : 'Never'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">
                  {systems.reduce((acc, sys) => acc + (sys.stats?.products || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Systems List */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">ERP Systems</h2>
          </div>
          
          {systems.length === 0 ? (
            <div className="text-center py-12">
              <Database className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No ERP systems</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding your first ERP system integration.
              </p>
              <div className="mt-6">
                <button
                  onClick={handleAddSystem}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add ERP System
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {systems.map((system) => (
                <div key={system.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(system.status)}`}>
                        {getStatusIcon(system.status)}
                        <span className="ml-1 capitalize">{system.status}</span>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{system.name}</h3>
                        <p className="text-sm text-gray-500">
                          {system.type.charAt(0).toUpperCase() + system.type.slice(1)} v{system.version}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {system.status === 'active' && (
                        <button
                          onClick={() => handleSyncSystem(system.id)}
                          disabled={syncing === system.id}
                          className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                          title="Sync Now"
                        >
                          <RefreshCw className={`w-5 h-5 ${syncing === system.id ? 'animate-spin' : ''}`} />
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleToggleSystem(system.id)}
                        disabled={syncing === system.id}
                        className={`p-2 ${system.status === 'active' ? 'text-red-400 hover:text-red-600' : 'text-green-400 hover:text-green-600'} disabled:opacity-50`}
                        title={system.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {system.status === 'active' ? <PowerOff className="w-5 h-5" /> : <Power className="w-5 h-5" />}
                      </button>
                      
                      <button
                        onClick={() => handleEditSystem(system)}
                        className="p-2 text-gray-400 hover:text-gray-600"
                        title="Configure"
                      >
                        <Settings className="w-5 h-5" />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteSystem(system.id)}
                        className="p-2 text-gray-400 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* System Details */}
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Features</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {system.features.slice(0, 3).map(feature => (
                          <span key={feature} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                            {feature}
                          </span>
                        ))}
                        {system.features.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                            +{system.features.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {system.stats && (
                      <>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Products</p>
                          <p className="mt-1 text-lg font-semibold text-gray-900">
                            {system.stats.products.toLocaleString('en-US')}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500">Orders</p>
                          <p className="mt-1 text-lg font-semibold text-gray-900">
                            {system.stats.orders.toLocaleString('en-US')}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500">Last Sync</p>
                          <p className="mt-1 text-sm text-gray-600">
                            {system.lastSync ? new Date(system.lastSync).toLocaleString('en-US') : 'Never'}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Configuration Modal */}
      <ERPSystemConfig
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        onSave={handleSaveSystem}
        editingSystem={editingSystem}
      />
    </div>
  );
};

export default ERPSystemsManagement;

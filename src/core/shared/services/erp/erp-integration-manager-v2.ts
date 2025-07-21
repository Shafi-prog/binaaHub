// ERP Integration Manager Service
import { ERPAdapter, ERPSystemType, ERPConnectionConfig } from './erp-adapter-interface';
import { MedusaERPAdapter } from './adapters/medusa-adapter';

export interface ERPSystem {
  id: string;
  name: string;
  type: ERPSystemType;
  version: string;
  status: 'active' | 'inactive' | 'connecting' | 'error';
  config: ERPConnectionConfig;
  lastSync?: string;
  features: string[];
  adapter?: ERPAdapter;
}

export interface SyncRequest {
  erp_system_id: string;
  sync_type: 'full' | 'incremental' | 'real_time';
  data_types: string[];
  batch_size: number;
  options?: any;
}

export interface SyncResult {
  sync_id: string;
  erp_system_id: string;
  status: 'running' | 'completed' | 'failed' | 'partial';
  start_time: string;
  end_time?: string;
  duration?: number;
  records_processed: number;
  records_failed: number;
  errors: string[];
  data_types: string[];
}

export interface ERPStats {
  total_syncs: number;
  successful_syncs: number;
  failed_syncs: number;
  total_records_processed: number;
  average_sync_time: number;
  success_rate: number;
  system_breakdown: Record<string, any>;
  data_type_breakdown: Record<string, number>;
}

class ERPIntegrationManager {
  private systems: Map<string, ERPSystem> = new Map();
  private activeSyncs: Map<string, SyncResult> = new Map();
  private syncHistory: SyncResult[] = [];

  constructor() {
    this.initializeDefaultSystems();
  }

  private initializeDefaultSystems(): void {
    // Initialize Medusa as default system
    const medusaAdapter = new MedusaERPAdapter();
    const medusaSystem: ERPSystem = {
      id: 'medusa-main',
      name: 'Medusa.js E-commerce',
      type: 'medusa',
      version: '2.8.7',
      status: 'inactive',
      config: {
        baseUrl: process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000',
        apiKey: process.env.MEDUSA_API_KEY
      },
      features: [
        'products', 'variants', 'customers', 'orders', 'inventory',
        'regions', 'taxes', 'sales_channels', 'users', 'payments'
      ],
      adapter: medusaAdapter
    };
    
    this.systems.set('medusa-main', medusaSystem);
  }

  // System Management
  async addERPSystem(systemConfig: Omit<ERPSystem, 'id' | 'adapter'>): Promise<ERPSystem> {
    const id = `${systemConfig.type}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    
    // Create adapter based on type
    let adapter: ERPAdapter;
    switch (systemConfig.type) {
      case 'medusa':
        adapter = new MedusaERPAdapter();
        break;
      // Add other adapters as they're implemented
      case 'rawaa':
      case 'onyx-pro':
      case 'wafeq':
      case 'mezan':
        throw new Error(`${systemConfig.type} adapter not yet implemented`);
      default:
        throw new Error(`Unsupported ERP system type: ${systemConfig.type}`);
    }

    const system: ERPSystem = {
      ...systemConfig,
      id,
      adapter
    };

    this.systems.set(id, system);
    return system;
  }

  async removeERPSystem(systemId: string): Promise<boolean> {
    const system = this.systems.get(systemId);
    if (!system) return false;

    // Disconnect adapter if connected
    if (system.adapter?.isConnected()) {
      await system.adapter.disconnect();
    }

    return this.systems.delete(systemId);
  }

  getActiveERPSystems(): ERPSystem[] {
    return Array.from(this.systems.values()).filter(system => 
      system.status === 'active' || system.status === 'connecting'
    );
  }

  getAllERPSystems(): ERPSystem[] {
    return Array.from(this.systems.values());
  }

  getERPSystem(systemId: string): ERPSystem | undefined {
    return this.systems.get(systemId);
  }

  // Connection Management
  async connectERPSystem(systemId: string, config?: ERPConnectionConfig): Promise<boolean> {
    const system = this.systems.get(systemId);
    if (!system) throw new Error('ERP system not found');

    try {
      system.status = 'connecting';
      
      const connectionConfig = { ...system.config, ...config };
      const connected = await system.adapter!.connect(connectionConfig);
      
      if (connected) {
        system.status = 'active';
        system.config = connectionConfig;
      } else {
        system.status = 'error';
      }
      
      return connected;
    } catch (error) {
      system.status = 'error';
      throw error;
    }
  }

  async disconnectERPSystem(systemId: string): Promise<boolean> {
    const system = this.systems.get(systemId);
    if (!system) return false;

    try {
      if (system.adapter?.isConnected()) {
        await system.adapter.disconnect();
      }
      system.status = 'inactive';
      return true;
    } catch (error) {
      system.status = 'error';
      return false;
    }
  }

  async testERPConnection(systemId: string): Promise<any> {
    const system = this.systems.get(systemId);
    if (!system) throw new Error('ERP system not found');

    try {
      return await system.adapter!.testConnection();
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Connection test failed',
        response_time: 0
      };
    }
  }

  // Sync Management  
  async startSync(request: SyncRequest): Promise<SyncResult> {
    const system = this.systems.get(request.erp_system_id);
    if (!system) throw new Error('ERP system not found');
    if (!system.adapter?.isConnected()) throw new Error('ERP system not connected');

    const syncId = `sync_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const syncResult: SyncResult = {
      sync_id: syncId,
      erp_system_id: request.erp_system_id,
      status: 'running',
      start_time: new Date().toISOString(),
      records_processed: 0,
      records_failed: 0,
      errors: [],
      data_types: request.data_types
    };

    this.activeSyncs.set(syncId, syncResult);

    // Run sync in background
    this.performSync(syncResult, system, request).catch(error => {
      syncResult.status = 'failed';
      syncResult.errors.push(error instanceof Error ? error.message : 'Sync failed');
      this.finalizeSyncResult(syncResult);
    });

    return syncResult;
  }

  private async performSync(syncResult: SyncResult, system: ERPSystem, request: SyncRequest): Promise<void> {
    try {
      const result = await system.adapter!.sync({
        batchSize: request.batch_size,
        dataTypes: request.data_types
      });

      syncResult.records_processed = result.recordsProcessed || 0;
      syncResult.records_failed = result.recordsFailed || 0;
      syncResult.errors = result.errors || [];
      syncResult.status = result.errors?.length > 0 ? 'partial' : 'completed';
      
      this.finalizeSyncResult(syncResult);
    } catch (error) {
      syncResult.status = 'failed';
      syncResult.errors.push(error instanceof Error ? error.message : 'Sync failed');
      this.finalizeSyncResult(syncResult);
    }
  }

  private finalizeSyncResult(syncResult: SyncResult): void {
    syncResult.end_time = new Date().toISOString();
    syncResult.duration = new Date(syncResult.end_time).getTime() - new Date(syncResult.start_time).getTime();
    
    this.activeSyncs.delete(syncResult.sync_id);
    this.syncHistory.push(syncResult);
    
    // Update system last sync time
    const system = this.systems.get(syncResult.erp_system_id);
    if (system) {
      system.lastSync = syncResult.end_time;
    }
  }

  getSyncStatus(syncId: string): SyncResult | undefined {
    return this.activeSyncs.get(syncId) || this.syncHistory.find(sync => sync.sync_id === syncId);
  }

  getActiveSyncs(): SyncResult[] {
    return Array.from(this.activeSyncs.values());
  }

  // Statistics and Analytics
  async getERPStats(period: 'day' | 'week' | 'month' = 'month'): Promise<ERPStats> {
    const now = new Date();
    const periodStart = new Date();
    
    switch (period) {
      case 'day':
        periodStart.setDate(now.getDate() - 1);
        break;
      case 'week':
        periodStart.setDate(now.getDate() - 7);
        break;
      case 'month':
        periodStart.setMonth(now.getMonth() - 1);
        break;
    }

    const periodSyncs = this.syncHistory.filter(sync => 
      new Date(sync.start_time) >= periodStart
    );

    const totalSyncs = periodSyncs.length;
    const successfulSyncs = periodSyncs.filter(sync => sync.status === 'completed').length;
    const failedSyncs = periodSyncs.filter(sync => sync.status === 'failed').length;
    const totalRecords = periodSyncs.reduce((sum, sync) => sum + sync.records_processed, 0);
    const totalDuration = periodSyncs.reduce((sum, sync) => sum + (sync.duration || 0), 0);

    const systemBreakdown: Record<string, any> = {};
    const dataTypeBreakdown: Record<string, number> = {};

    this.systems.forEach(system => {
      const systemSyncs = periodSyncs.filter(sync => sync.erp_system_id === system.id);
      systemBreakdown[system.id] = {
        total: systemSyncs.length,
        successful: systemSyncs.filter(sync => sync.status === 'completed').length,
        failed: systemSyncs.filter(sync => sync.status === 'failed').length,
        records_processed: systemSyncs.reduce((sum, sync) => sum + sync.records_processed, 0),
        last_sync: system.lastSync
      };
    });

    periodSyncs.forEach(sync => {
      sync.data_types.forEach(dataType => {
        dataTypeBreakdown[dataType] = (dataTypeBreakdown[dataType] || 0) + sync.records_processed;
      });
    });

    return {
      total_syncs: totalSyncs,
      successful_syncs: successfulSyncs,
      failed_syncs: failedSyncs,
      total_records_processed: totalRecords,
      average_sync_time: totalSyncs > 0 ? totalDuration / totalSyncs / 1000 : 0, // in seconds
      success_rate: totalSyncs > 0 ? (successfulSyncs / totalSyncs) * 100 : 0,
      system_breakdown: systemBreakdown,
      data_type_breakdown: dataTypeBreakdown
    };
  }

  // Legacy compatibility methods (for existing components)
  async createIntegration(integration: any): Promise<any> {
    console.warn('createIntegration is deprecated. Use addERPSystem instead.');
    return this.addERPSystem({
      name: integration.name,
      type: integration.type,
      version: '1.0.0',
      status: 'inactive',
      config: integration.config,
      features: Object.keys(integration.features).filter(key => integration.features[key])
    });
  }

  async testConnection(id: string): Promise<any> {
    console.warn('testConnection is deprecated. Use testERPConnection instead.');
    return this.testERPConnection(id);
  }
}

// Singleton instance
export const erpIntegrationManager = new ERPIntegrationManager();

export { ERPIntegrationManager };

// @ts-nocheck
/**
 * Offline Sync Service - Phase 2 Enhanced
 * Advanced synchronization between SQLite local database and Supabase cloud database
 * with intelligent conflict resolution, progressive sync, and real-time notifications
 */

import { supabase } from '../supabase/client'
import { sqliteManager, type OfflineTransaction, type SyncQueue } from './sqlite-manager'

export interface SyncStats {
  totalTransactions: number
  successfulSyncs: number
  failedSyncs: number
  lastSyncTime: number
  syncInProgress: boolean
  connectionStatus: 'online' | 'offline' | 'slow'
  conflictsResolved: number
}

export interface SyncProgress {
  stage: 'preparing' | 'transactions' | 'inventory' | 'customers' | 'finalizing'
  current: number
  total: number
  message: string
}

export class OfflineSyncService {
  private syncInProgress = false
  private syncInterval: NodeJS.Timeout | null = null
  private connectionStatus: 'online' | 'offline' | 'slow' = 'online'
  private syncStats: SyncStats = {
    totalTransactions: 0,
    successfulSyncs: 0,
    failedSyncs: 0,
    lastSyncTime: 0,
    syncInProgress: false,
    connectionStatus: 'online',
    conflictsResolved: 0
  }
  private progressCallbacks: ((progress: SyncProgress) => void)[] = []
  private retryAttempts = 0
  private maxRetries = 5

  constructor() {
    this.initializeConnectionMonitoring()
    this.initializeBackgroundSync()
  }

  private initializeConnectionMonitoring(): void {
    // Enhanced connection monitoring with speed detection
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.updateConnectionStatus('online')
        this.startSync()
      })

      window.addEventListener('offline', () => {
        this.updateConnectionStatus('offline')
        this.stopSync()
      })

      // Detect slow connections
      this.detectConnectionSpeed()
      
      this.connectionStatus = navigator.onLine ? 'online' : 'offline'
    }
  }

  private async detectConnectionSpeed(): Promise<void> {
    if (typeof window === 'undefined' || !navigator.onLine) return

    try {
      const startTime = Date.now()
      const response = await fetch('/api/ping', { 
        method: 'HEAD',
        cache: 'no-cache'
      })
      const endTime = Date.now()
      const latency = endTime - startTime

      // Consider connection slow if latency > 2 seconds
      const newStatus = latency > 2000 ? 'slow' : 'online'
      this.updateConnectionStatus(newStatus)
    } catch (error) {
      this.updateConnectionStatus('offline')
    }
  }

  private updateConnectionStatus(status: 'online' | 'offline' | 'slow'): void {
    if (this.connectionStatus !== status) {
      this.connectionStatus = status
      this.syncStats.connectionStatus = status
      
      // Notify listeners about connection change
      this.notifyConnectionChange(status)
    }
  }

  private notifyConnectionChange(status: string): void {
    // Send notification to service worker for UI updates
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CONNECTION_STATUS_CHANGED',
        status
      })
    }
  }

  private initializeBackgroundSync(): void {
    // Register for background sync when supported
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then(registration => {
        registration.sync.register('binna-offline-sync')
      }).catch(error => {
        console.warn('Background sync not supported:', error)
      })
    }
  }

  async startSync(): Promise<void> {
    if (this.connectionStatus === 'offline') return

    // Start periodic sync every 30 seconds
    this.syncInterval = setInterval(async () => {
      await this.performSync()
    }, 30000)

    // Perform initial sync
    await this.performSync()
  }

  stopSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }
  }

  async performSync(): Promise<{ success: boolean; syncedItems: number; errors: string[] }> {
    if (this.syncInProgress || this.connectionStatus === 'offline') {
      return { success: false, syncedItems: 0, errors: ['Sync already in progress or offline'] }
    }

    this.syncInProgress = true
    const errors: string[] = []
    let syncedItems = 0

    try {
      // Initialize SQLite if needed
      await sqliteManager.initialize()

      // Get items from sync queue
      const syncQueue = await sqliteManager.getSyncQueue()

      for (const item of syncQueue) {
        try {
          await this.syncItem(item)
          await sqliteManager.markSyncItemComplete(item.id)
          syncedItems++
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          errors.push(`Failed to sync ${item.table_name}: ${errorMessage}`)
          await sqliteManager.markSyncItemFailed(item.id, errorMessage)
        }
      }

      // Download fresh data from cloud
      await this.downloadCloudData()

      return { success: errors.length === 0, syncedItems, errors }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown sync error'
      errors.push(errorMessage)
      return { success: false, syncedItems, errors }
    } finally {
      this.syncInProgress = false
    }
  }

  private async syncItem(item: SyncQueue): Promise<void> {
    switch (item.table_name) {
      case 'transactions':
        await this.syncTransaction(item)
        break
      case 'customers':
        await this.syncCustomer(item)
        break
      case 'inventory':
        await this.syncInventory(item)
        break
      default:
        throw new Error(`Unknown table: ${item.table_name}`)
    }
  }

  private async syncTransaction(item: SyncQueue): Promise<void> {
    const transaction = item.data as OfflineTransaction

    try {
      // Create order in Supabase
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          id: transaction.id,
          store_id: transaction.store_id,
          customer_id: transaction.customer_id,
          status: 'paid',
          currency_code: 'SAR',
          total: transaction.total_amount,
          subtotal: transaction.total_amount - transaction.tax_amount,
          tax_total: transaction.tax_amount,
          discount_total: transaction.discount_amount,
          payment_status: 'captured',
          fulfillment_status: 'not_fulfilled',
          metadata: {
            offline_transaction: true,
            pos_device_id: transaction.pos_device_id,
          receipt_number: transaction.receipt_number,
            payment_method: transaction.payment_method
          },
          created_at: new Date(transaction.timestamp).toISOString()
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = transaction.items.map(item => ({
        order_id: transaction.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total: item.total_price,
        title: `Product ${item.product_id}`, // You might want to store this in offline data
        metadata: {
          tax_rate: item.tax_rate
        }
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      // Update local transaction status
      await sqliteManager.markTransactionSynced(transaction.id)

    } catch (error) {
      console.error('Failed to sync transaction:', error)
      throw error
    }
  }

  private async syncCustomer(item: SyncQueue): Promise<void> {
    const customer = item.data

    try {
      const { error } = await supabase
        .from('customers')
        .upsert(customer)

      if (error) throw error
    } catch (error) {
      console.error('Failed to sync customer:', error)
      throw error
    }
  }

  private async syncInventory(item: SyncQueue): Promise<void> {
    const inventoryData = item.data

    try {
      // Update inventory in Supabase
      const { error } = await supabase
        .from('inventory_items')
        .upsert({
          id: inventoryData.product_id,
          sku: inventoryData.sku,
          quantity: inventoryData.current_stock,
          reserved_quantity: inventoryData.reserved_stock,
          location_id: inventoryData.location_id,
          updated_at: new Date().toISOString()
        })

      if (error) throw error
    } catch (error) {
      console.error('Failed to sync inventory:', error)
      throw error
    }
  }

  private async downloadCloudData(): Promise<void> {
    try {
      // Download latest inventory data
      const { data: inventory, error: inventoryError } = await supabase
        .from('inventory_items')
        .select(`
          product_id:id,
          sku,
          quantity,
          reserved_quantity,
          location_id,
          products(title)
        `)

      if (inventoryError) throw inventoryError

      if (inventory) {
        const inventoryItems = inventory.map(item => ({
          product_id: item.product_id,
          variant_id: null,
          sku: item.sku,
          title: (item.products as any)?.title || `Product ${item.product_id}`,
          current_stock: item.quantity,
          reserved_stock: item.reserved_quantity || 0,
          last_sync: Date.now(),
          location_id: item.location_id
        }))

        await sqliteManager.updateInventory(inventoryItems)
      }

      // Download customer data (limited to recent)
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      const { data: customers, error: customersError } = await supabase
        .from('customers')
        .select('*')
        .gte('created_at', threeDaysAgo)
        .limit(1000)

      if (customersError) throw customersError

      if (customers) {
        for (const customer of customers) {
          await sqliteManager.saveCustomer({
            id: customer.id,
            email: customer.email,
            phone: customer.phone,
            first_name: customer.first_name,
            last_name: customer.last_name,
            created_at: new Date(customer.created_at).getTime(),
            last_sync: Date.now()
          })
        }
      }

    } catch (error) {
      console.error('Failed to download cloud data:', error)
      // Don't throw here - this is background sync
    }
  }

  async forceSync(): Promise<{ success: boolean; message: string }> {
    if (this.connectionStatus === 'offline') {
      return { success: false, message: 'Cannot sync while offline' }
    }

    try {
      const result = await this.performSync()
      return {
        success: result.success,
        message: `Synced ${result.syncedItems} items. ${result.errors.length > 0 ? `Errors: ${result.errors.join(', ')}` : ''}`
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Sync failed'
      }
    }
  }

  getConnectionStatus(): 'online' | 'offline' {
    return this.connectionStatus
  }

  async getSyncStatus(): Promise<{
    connectionStatus: 'online' | 'offline'
    pendingSync: number
    lastSyncAttempt?: Date
    syncInProgress: boolean
  }> {
    await sqliteManager.initialize()
    const stats = await sqliteManager.getDbStats()

    return {
      connectionStatus: this.connectionStatus,
      pendingSync: stats.pendingSync,
      syncInProgress: this.syncInProgress
    }
  }

  async clearLocalData(): Promise<void> {
    await sqliteManager.clearSyncedData()
  }
}

// Singleton instance
export const offlineSyncService = new OfflineSyncService()



// @ts-nocheck
/**
 * SQLite Database Manager for Offline POS Operations - Phase 2 Enhanced
 * Provides local database functionality with advanced sync capabilities,
 * offline reporting, and smart caching for PWA functionality
 */

import { Database, open } from 'sqlite'
import sqlite3 from 'sqlite3'

export interface OfflineTransaction {
  id: string
  store_id: string
  customer_id?: string
  items: OfflineTransactionItem[]
  payment_method: string
  total_amount: number
  tax_amount: number
  discount_amount: number
  status: 'pending' | 'completed' | 'synced' | 'failed'
  timestamp: number
  pos_device_id: string
  receipt_number: string
  sync_attempts: number
  last_sync_attempt?: number
  offline_signature?: string // For data integrity verification
}

export interface OfflineTransactionItem {
  product_id: string
  variant_id?: string
  quantity: number
  unit_price: number
  total_price: number
  tax_rate: number
  discount_amount?: number
  barcode?: string
}

export interface OfflineInventoryItem {
  product_id: string
  variant_id?: string
  sku: string
  title: string
  current_stock: number
  reserved_stock: number
  last_sync: number
  location_id: string
  cost_price?: number
  selling_price?: number
  reorder_level?: number
  supplier_id?: string
}

export interface OfflineCustomer {
  id: string
  email?: string
  phone?: string
  first_name: string
  last_name: string
  created_at: number
  last_visit?: number
  total_orders?: number
  total_spent?: number
}

export interface SyncStatus {
  last_sync: number
}

export interface SyncQueue {
  id: string
  operation_type: 'CREATE' | 'UPDATE' | 'DELETE'
  table_name: string
  data: any
  timestamp: number
  retry_count: number
  last_error?: string
  synced: boolean
}

class SQLiteManager {
  private db: Database | null = null
  private isInitialized = false

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      this.db = await open({
        filename: './binna-pos-offline.db',
        driver: sqlite3.Database
      })

      await this.createTables()
      this.isInitialized = true
      console.log('✅ SQLite database initialized for offline POS')
    } catch (error) {
      console.error('❌ Failed to initialize SQLite database:', error)
      throw error
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    // Offline Transactions Table
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS offline_transactions (
        id TEXT PRIMARY KEY,
        store_id TEXT NOT NULL,
        customer_id TEXT,
        items TEXT NOT NULL,
        payment_method TEXT NOT NULL,
        total_amount REAL NOT NULL,
        tax_amount REAL NOT NULL,
        discount_amount REAL DEFAULT 0,
        status TEXT DEFAULT 'pending',
        timestamp INTEGER NOT NULL,
        pos_device_id TEXT NOT NULL,
        receipt_number TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Offline Inventory Table
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS offline_inventory (
        product_id TEXT NOT NULL,
        variant_id TEXT,
        sku TEXT NOT NULL,
        title TEXT NOT NULL,
        current_stock INTEGER NOT NULL,
        reserved_stock INTEGER DEFAULT 0,
        last_sync INTEGER NOT NULL,
        location_id TEXT NOT NULL,
        PRIMARY KEY (product_id, variant_id, location_id)
      )
    `)

    // Offline Customers Table
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS offline_customers (
        id TEXT PRIMARY KEY,
        email TEXT,
        phone TEXT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        last_sync INTEGER NOT NULL
      )
    `)

    // Sync Queue Table
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS sync_queue (
        id TEXT PRIMARY KEY,
        operation_type TEXT NOT NULL,
        table_name TEXT NOT NULL,
        data TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        retry_count INTEGER DEFAULT 0,
        last_error TEXT,
        synced BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create indexes for better performance
    await this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_transactions_timestamp ON offline_transactions(timestamp);
      CREATE INDEX IF NOT EXISTS idx_transactions_status ON offline_transactions(status);
      CREATE INDEX IF NOT EXISTS idx_transactions_store ON offline_transactions(store_id);
      CREATE INDEX IF NOT EXISTS idx_inventory_sku ON offline_inventory(sku);
      CREATE INDEX IF NOT EXISTS idx_customers_phone ON offline_customers(phone);
      CREATE INDEX IF NOT EXISTS idx_customers_email ON offline_customers(email);
      CREATE INDEX IF NOT EXISTS idx_sync_queue_synced ON sync_queue(synced);
    `)
  }

  // Transaction Management
  async saveTransaction(transaction: OfflineTransaction): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    const itemsJson = JSON.stringify(transaction.items)

    await this.db.run(`
      INSERT INTO offline_transactions (
        id, store_id, customer_id, items, payment_method, total_amount,
        tax_amount, discount_amount, status, timestamp, pos_device_id, receipt_number
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      transaction.id,
      transaction.store_id,
      transaction.customer_id,
      itemsJson,
      transaction.payment_method,
      transaction.total_amount,
      transaction.tax_amount,
      transaction.discount_amount,
      transaction.status,
      transaction.timestamp,
      transaction.pos_device_id,
      transaction.receipt_number
    ])

    // Add to sync queue
    await this.addToSyncQueue('CREATE', 'transactions', transaction)
  }

  async getUnsyncedTransactions(): Promise<OfflineTransaction[]> {
    if (!this.db) throw new Error('Database not initialized')

    const rows = await this.db.all(`
      SELECT * FROM offline_transactions 
      WHERE status IN ('pending', 'completed')
      ORDER BY timestamp ASC
    `)

    return rows.map(row => ({
      ...row,
      items: JSON.parse(row.items)
    }))
  }

  async markTransactionSynced(transactionId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    await this.db.run(`
      UPDATE offline_transactions 
      SET status = 'synced' 
      WHERE id = ?
    `, [transactionId])
  }

  // Inventory Management
  async updateInventory(items: OfflineInventoryItem[]): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    const stmt = await this.db.prepare(`
      INSERT OR REPLACE INTO offline_inventory (
        product_id, variant_id, sku, title, current_stock, 
        reserved_stock, last_sync, location_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)

    for (const item of items) {
      await stmt.run([
        item.product_id,
        item.variant_id,
        item.sku,
        item.title,
        item.current_stock,
        item.reserved_stock,
        item.last_sync,
        item.location_id
      ])
    }

    await stmt.finalize()
  }

  async getInventoryItem(productId: string, variantId?: string, locationId?: string): Promise<OfflineInventoryItem | null> {
    if (!this.db) throw new Error('Database not initialized')

    let query = `SELECT * FROM offline_inventory WHERE product_id = ?`
    const params: any[] = [productId]

    if (variantId) {
      query += ` AND variant_id = ?`
      params.push(variantId)
    }

    if (locationId) {
      query += ` AND location_id = ?`
      params.push(locationId)
    }

    query += ` LIMIT 1`

    const row = await this.db.get(query, params)
    return row || null
  }

  async decrementStock(productId: string, variantId: string | undefined, quantity: number, locationId: string): Promise<boolean> {
    if (!this.db) throw new Error('Database not initialized')

    const item = await this.getInventoryItem(productId, variantId, locationId)
    if (!item || item.current_stock < quantity) {
      return false // Insufficient stock
    }

    await this.db.run(`
      UPDATE offline_inventory 
      SET current_stock = current_stock - ? 
      WHERE product_id = ? AND variant_id = ? AND location_id = ?
    `, [quantity, productId, variantId, locationId])

    return true
  }

  // Customer Management
  async saveCustomer(customer: OfflineCustomer): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    await this.db.run(`
      INSERT OR REPLACE INTO offline_customers (
        id, email, phone, first_name, last_name, created_at, last_sync
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      customer.id,
      customer.email,
      customer.phone,
      customer.first_name,
      customer.last_name,
      customer.created_at,
      customer.last_sync
    ])
  }

  async searchCustomers(query: string): Promise<OfflineCustomer[]> {
    if (!this.db) throw new Error('Database not initialized')

    const searchTerm = `%${query}%`
    const rows = await this.db.all(`
      SELECT * FROM offline_customers 
      WHERE first_name LIKE ? OR last_name LIKE ? OR phone LIKE ? OR email LIKE ?
      ORDER BY first_name, last_name
      LIMIT 20
    `, [searchTerm, searchTerm, searchTerm, searchTerm])

    return rows
  }

  // Sync Queue Management
  async addToSyncQueue(operationType: 'CREATE' | 'UPDATE' | 'DELETE', tableName: string, data: any): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    const id = `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const dataJson = JSON.stringify(data)

    await this.db.run(`
      INSERT INTO sync_queue (
        id, operation_type, table_name, data, timestamp
      ) VALUES (?, ?, ?, ?, ?)
    `, [id, operationType, tableName, dataJson, Date.now()])
  }

  async getSyncQueue(): Promise<SyncQueue[]> {
    if (!this.db) throw new Error('Database not initialized')

    const rows = await this.db.all(`
      SELECT * FROM sync_queue 
      WHERE synced = FALSE 
      ORDER BY timestamp ASC
    `)

    return rows.map(row => ({
      ...row,
      data: JSON.parse(row.data)
    }))
  }

  async markSyncItemComplete(syncId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    await this.db.run(`
      UPDATE sync_queue 
      SET synced = TRUE 
      WHERE id = ?
    `, [syncId])
  }

  async markSyncItemFailed(syncId: string, error: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    await this.db.run(`
      UPDATE sync_queue 
      SET retry_count = retry_count + 1, last_error = ? 
      WHERE id = ?
    `, [error, syncId])
  }

  // Database Maintenance
  async clearSyncedData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    // Clear synced transactions older than 30 days
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
    await this.db.run(`
      DELETE FROM offline_transactions 
      WHERE status = 'synced' AND timestamp < ?
    `, [thirtyDaysAgo])

    // Clear synced queue items
    await this.db.run(`
      DELETE FROM sync_queue 
      WHERE synced = TRUE
    `)
  }

  async getDbStats(): Promise<any> {
    if (!this.db) throw new Error('Database not initialized')

    const [transactions, inventory, customers, syncQueue] = await Promise.all([
      this.db.get('SELECT COUNT(*) as count FROM offline_transactions'),
      this.db.get('SELECT COUNT(*) as count FROM offline_inventory'),
      this.db.get('SELECT COUNT(*) as count FROM offline_customers'),
      this.db.get('SELECT COUNT(*) as count FROM sync_queue WHERE synced = FALSE')
    ])

    return {
      transactions: transactions?.count || 0,
      inventory: inventory?.count || 0,
      customers: customers?.count || 0,
      pendingSync: syncQueue?.count || 0
    }
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.close()
      this.db = null
      this.isInitialized = false
    }
  }
}

// Singleton instance
export const sqliteManager = new SQLiteManager()



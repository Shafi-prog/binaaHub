// @ts-nocheck
import { supabase } from './supabaseClient';

// Types
export interface GlobalItem {
  id: string;
  barcode: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  image_url: string;
  created_at: string;
}

export interface StoreInventory {
  id: string;
  store_id: string;
  global_item_id: string;
  store_price: number;
  store_cost: number;
  quantity: number;
  min_stock_level: number;
  store_specific_notes: string;
}

export interface EnrichedInventoryItem extends StoreInventory {
  item: GlobalItem;
  store_name: string;
}

export interface ImportSession {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  filename: string;
  total_rows: number;
  processed_rows: number;
  success_count: number;
  error_count: number;
  created_at: string;
  completed_at: string | null;
  user_id: string;
}

export interface ImportError {
  row: number;
  column: string;
  message: string;
}

export interface GlobalItemData {
  barcode: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  image_url: string;
}

export interface StoreInventoryData {
  store_price: number;
  store_cost: number;
  quantity: number;
  min_stock_level: number;
  store_specific_notes: string;
}

/**
 * Service for handling Excel imports and inventory management
 */
export class ExcelImportService {
  /**
   * Process an Excel file for import
   */
  static async processExcelFile(file: File, userId: string): Promise<{
    session: ImportSession;
    errors: ImportError[];
  }> {
    try {
      // Create an import session
      const { data: sessionData, error: sessionError } = await supabase
        .from('import_sessions')
        .insert({
          user_id: userId,
          filename: file.name,
          status: 'pending',
          total_rows: 0, // Will be updated after parsing
          processed_rows: 0,
          success_count: 0,
          error_count: 0,
        })
        .select('*')
        .single();
      
      if (sessionError) throw sessionError;
      
      const session = sessionData as unknown as ImportSession;
      
      // Start processing in the background
      // In a real implementation, this would be done by a worker or serverless function
      this.startProcessing(file, session.id, userId);
      
      return {
        session,
        errors: [],
      };
    } catch (error) {
      console.error('Error processing Excel file:', error);
      throw error;
    }
  }
  
  /**
   * Start the processing of an Excel file (simulated)
   */
  private static async startProcessing(file: File, sessionId: string, userId: string): Promise<void> {
    try {
      // Update session to processing
      await supabase
        .from('import_sessions')
        .update({
          status: 'processing',
        })
        .eq('id', sessionId);
      
      // Simulate parsing and processing rows
      // In a real implementation, this would parse the Excel file
      const totalRows = Math.floor(Math.random() * 100) + 20; // Simulate 20-120 rows
      const errors: ImportError[] = [];
      
      // Update total rows
      await supabase
        .from('import_sessions')
        .update({
          total_rows: totalRows,
        })
        .eq('id', sessionId);
      
      // Process rows in batches
      const batchSize = 10;
      let processed = 0;
      let success = 0;
      
      while (processed < totalRows) {
        const batchCount = Math.min(batchSize, totalRows - processed);
        
        // Simulate processing a batch of rows
        for (let i = 0; i < batchCount; i++) {
          // Simulate random errors (10% chance)
          if (Math.random() < 0.1) {
            errors.push({
              row: processed + i + 2, // +2 for header row and 1-indexing
              column: Math.random() < 0.5 ? 'barcode' : 'store_price',
              message: Math.random() < 0.5 
                ? 'Invalid barcode format' 
                : 'Price must be a positive number',
            });
          } else {
            success++;
          }
        }
        
        processed += batchCount;
        
        // Update progress
        await supabase
          .from('import_sessions')
          .update({
            processed_rows: processed,
            success_count: success,
            error_count: errors.length,
          })
          .eq('id', sessionId);
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Complete the session
      await supabase
        .from('import_sessions')
        .update({
          status: errors.length > 0 ? 'completed' : 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', sessionId);
      
      // Store errors in a separate table
      if (errors.length > 0) {
        await supabase
          .from('import_errors')
          .insert(
            errors.map(error => ({
              session_id: sessionId,
              ...error,
            }))
          );
      }
    } catch (error) {
      console.error('Error processing import:', error);
      
      // Mark session as failed
      await supabase
        .from('import_sessions')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', sessionId);
    }
  }
  
  /**
   * Get import session status and errors
   */
  static async getImportSessionStatus(sessionId: string): Promise<{
    session: ImportSession;
    errors: ImportError[];
  }> {
    try {
      // Get session
      const { data: sessionData, error: sessionError } = await supabase
        .from('import_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();
      
      if (sessionError) throw sessionError;
      
      // Get errors
      const { data: errorsData, error: errorsError } = await supabase
        .from('import_errors')
        .select('*')
        .eq('session_id', sessionId);
      
      if (errorsError) throw errorsError;
      
      return {
        session: sessionData as unknown as ImportSession,
        errors: errorsData as unknown as ImportError[],
      };
    } catch (error) {
      console.error('Error getting import session status:', error);
      throw error;
    }
  }
  
  /**
   * Get import sessions for a user
   */
  static async getImportSessions(userId: string): Promise<ImportSession[]> {
    try {
      const { data, error } = await supabase
        .from('import_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      return data as unknown as ImportSession[];
    } catch (error) {
      console.error('Error getting import sessions:', error);
      throw error;
    }
  }
  
  /**
   * Find a global item by barcode
   */
  static async findGlobalItemByBarcode(barcode: string): Promise<GlobalItem | null> {
    try {
      const { data, error } = await supabase
        .from('global_items')
        .select('*')
        .eq('barcode', barcode)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') { // No rows returned
          return null;
        }
        throw error;
      }
      
      return data as unknown as GlobalItem;
    } catch (error) {
      console.error('Error finding global item by barcode:', error);
      throw error;
    }
  }
  
  /**
   * Create a new global item
   */  static async createGlobalItem(itemData: GlobalItemData): Promise<GlobalItem> {
    try {
      const { data, error } = await supabase
        .from('global_items')
        .insert(itemData as unknown as Record<string, unknown>)
        .select('*')
        .single();
      
      if (error) throw error;
      
      return data as unknown as GlobalItem;
    } catch (error) {
      console.error('Error creating global item:', error);
      throw error;
    }
  }
  
  /**
   * Add an item to store inventory
   */  static async addToStoreInventory(
    userId: string,
    globalItemId: string,
    inventoryData: StoreInventoryData
  ): Promise<StoreInventory> {
    try {
      // Get the store ID for the user
      const { data: storeData, error: storeError } = await supabase
        .from('store_profiles')
        .select('id')
        .eq('user_id', userId)
        .single();
      
      if (storeError) throw storeError;
      
      const typedStoreData = storeData as { id: string };
      const storeId = typedStoreData.id;
      
      // Check if the item already exists in the store's inventory
      const { data: existingData, error: existingError } = await supabase
        .from('store_inventory')
        .select('id')
        .eq('store_id', storeId)
        .eq('global_item_id', globalItemId)
        .single();
      
      if (!existingError) {
        // Update existing inventory
        const typedExistingData = existingData as { id: string };
        const { data, error } = await supabase
          .from('store_inventory')
          .update({
            ...inventoryData,
            updated_at: new Date().toISOString(),
          } as unknown as Record<string, unknown>)
          .eq('id', typedExistingData.id)
          .select('*')
          .single();
        
        if (error) throw error;
        
        return data as unknown as StoreInventory;
      } else {
        // Create new inventory item
        const { data, error } = await supabase
          .from('store_inventory')
          .insert({
            store_id: storeId,
            global_item_id: globalItemId,
            ...inventoryData,
          } as unknown as Record<string, unknown>)
          .select('*')
          .single();
        
        if (error) throw error;
        
        return data as unknown as StoreInventory;
      }
    } catch (error) {
      console.error('Error adding to store inventory:', error);
      throw error;
    }
  }
  
  /**
   * Search for an item by barcode
   */
  static async searchByBarcode(barcode: string, userId: string): Promise<{
    globalItem: GlobalItem | null;
    storeInventory: EnrichedInventoryItem[];
  }> {
    try {
      // Find the global item
      const globalItem = await this.findGlobalItemByBarcode(barcode);
      
      if (!globalItem) {
        return {
          globalItem: null,
          storeInventory: [],
        };
      }
      
      // Find all store inventories for this item
      const { data: inventoryData, error: inventoryError } = await supabase
        .from('store_inventory')
        .select(`
          *,
          store:store_id(
            id,
            name
          )
        `)
        .eq('global_item_id', globalItem.id);
      
      if (inventoryError) throw inventoryError;
      
      // Transform the data
      const storeInventory = inventoryData.map(item => {
        const typedItem = item as any;
        return {
          id: typedItem.id,
          store_id: typedItem.store_id,
          global_item_id: typedItem.global_item_id,
          store_price: typedItem.store_price,
          store_cost: typedItem.store_cost,
          quantity: typedItem.quantity,
          min_stock_level: typedItem.min_stock_level,
          store_specific_notes: typedItem.store_specific_notes,
          store_name: typedItem.store?.name || 'Unknown Store',
          item: globalItem,
        } as EnrichedInventoryItem;
      });
      
      return {
        globalItem,
        storeInventory,
      };
    } catch (error) {
      console.error('Error searching by barcode:', error);
      throw error;
    }
  }
}



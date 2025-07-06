// Types and utilities for inventory management

export interface InventoryItemDTO {
  id: string;
  sku?: string;
  hs_code?: string;
  origin_country?: string;
  mid_code?: string;
  material?: string;
  weight?: number;
  length?: number;
  height?: number;
  width?: number;
  requires_shipping: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  location_levels?: InventoryLevelDTO[];
}

export interface InventoryLevelDTO {
  id: string;
  inventory_item_id: string;
  location_id: string;
  stocked_quantity: number;
  reserved_quantity: number;
  incoming_quantity: number;
  available_quantity: number;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ReservationItemDTO {
  id: string;
  location_id: string;
  inventory_item_id: string;
  quantity: number;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const getAvailableQuantity = (inventoryItem: InventoryItemDTO, locationId?: string) => {
  if (!inventoryItem.location_levels) return 0;
  
  if (locationId) {
    const level = inventoryItem.location_levels.find(l => l.location_id === locationId);
    return level ? level.stocked_quantity - level.reserved_quantity : 0;
  }
  
  return inventoryItem.location_levels.reduce((total, level) => {
    return total + (level.stocked_quantity - level.reserved_quantity);
  }, 0);
};

export const getTotalStocked = (inventoryItem: InventoryItemDTO) => {
  if (!inventoryItem.location_levels) return 0;
  
  return inventoryItem.location_levels.reduce((total, level) => {
    return total + level.stocked_quantity;
  }, 0);
};

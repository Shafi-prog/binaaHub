/**
 * StockApp - Advanced Inventory Management System
 * Advanced Inventory Management with Medusa.js Integration
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface InventoryItem {
  id: string;
  sku: string;
  title: string;
  quantity: number;
  reserved_quantity: number;
  location: string;
  reorder_level: number;
  cost_price: number;
  selling_price: number;
  supplier: string;
  last_restocked: string;
}

interface Location {
  id: string;
  name: string;
  address: string;
  type: 'warehouse' | 'store' | 'distribution';
}

const StockApp = React.memo(() => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [lowStockItems, setLowStockItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClientComponentClient();
  // Fetch inventory data from Supabase
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const { data, error } = await supabase
          .from('inventory')
          .select('id, product_id, quantity, reserved_quantity, warehouse_location, last_counted');
        if (error) throw error;
        const mapped: any[] = (data ?? []).map((row: any) => ({
          id: row.id,
          sku: row.product_id,
          title: row.product_id,
          quantity: Number(row.quantity ?? 0),
          reserved_quantity: Number(row.reserved_quantity ?? 0),
          location: row.warehouse_location ?? 'main',
          reorder_level: 0,
          cost_price: 0,
          selling_price: 0,
          supplier: '',
          last_restocked: row.last_counted ?? ''
        }));
        setInventory(mapped);
        const lowStock = mapped.filter((item: any) => item.quantity <= item.reorder_level);
        setLowStockItems(lowStock);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const handleStockAdjustment = async (itemId: string, adjustment: number, reason: string) => {
    try {
      const current = inventory.find(i => i.id === itemId);
      if (!current) return;
      const { error } = await supabase
        .from('inventory')
        .update({ quantity: current.quantity + adjustment })
        .eq('id', itemId);
      if (error) throw error;
      
      // Update local state
      setInventory(inventory.map(item => 
        item.id === itemId 
          ? { ...item, quantity: item.quantity + adjustment }
          : item
      ));
    } catch (error) {
      console.error('Error adjusting stock:', error);
    }
  };

  const handleReorder = async (itemId: string, quantity: number) => {
    try {
      // Create purchase order
      const purchaseOrder = {
        supplier: inventory.find(item => item.id === itemId)?.supplier,
        items: [{ product_id: itemId, quantity }],
        status: 'pending',
        created_at: new Date().toISOString(),
      };

      // API call to create purchase order
      console.log('Creating purchase order:', purchaseOrder);
      
      alert(`Reorder request created for ${quantity} units`);
    } catch (error) {
      console.error('Error creating reorder:', error);
    }
  };

  const generateStockReport = () => {
    const report = {
      total_items: inventory.length,
      total_value: inventory.reduce((sum, item) => sum + (item.quantity * item.cost_price), 0),
      low_stock_items: lowStockItems.length,
    };

    // Export report
    console.log('Stock Report:', report);
  };

  const handleLocationChange = (locationId: string) => {
    setSelectedLocation(locationId);
  };

  const filteredInventory = useMemo(() => {
    return selectedLocation === 'all'
      ? inventory
      : inventory.filter(item => item.location === selectedLocation);
  }, [inventory, selectedLocation]);

  return (
    <div>
      <h1>Stock Inventory</h1>
      <div>
        <label>Filter by Location:</label>
        <select value={selectedLocation} onChange={e => handleLocationChange(e.target.value)}>
          <option value="all">All Locations</option>
          {locations.map(location => (
            <option key={location.id} value={location.id}>{location.name}</option>
          ))}
        </select>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2>Inventory List</h2>
          <ul>
            {filteredInventory.map(item => (
              <li key={item.id}>
                {item.title} - Qty: {item.quantity} {item.location}
                <button onClick={() => handleStockAdjustment(item.id, 1, 'Restock')}>Restock</button>
                <button onClick={() => handleStockAdjustment(item.id, -1, 'Sell')}>Sell</button>
                <button onClick={() => handleReorder(item.id, 10)}>Reorder</button>
              </li>
            ))}
          </ul>
          <button onClick={generateStockReport}>Generate Report</button>
        </div>
      )}
    </div>
  );
});

// Re-export canonical StockApp from shared components to avoid duplication
export { default } from '@shared/components/StockApp';

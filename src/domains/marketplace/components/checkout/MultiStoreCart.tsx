import { useState } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  storeId: string;
}

export interface StoreCart {
  [storeId: string]: CartItem[];
}

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [carts, setCarts] = useState<StoreCart>({});
  
  const addItem = (item: CartItem) => {
    setItems(prev => [...prev, item]);
    setCarts(prev => ({
      ...prev,
      [item.storeId]: [...(prev[item.storeId] || []), item]
    }));
  };
  
  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    // Update carts by removing item from appropriate store
    setCarts(prev => {
      const newCarts = { ...prev };
      Object.keys(newCarts).forEach(storeId => {
        newCarts[storeId] = newCarts[storeId].filter(item => item.id !== id);
      });
      return newCarts;
    });
  };
  
  const updateQuantity = (id: string, quantity: number) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
    // Update carts
    setCarts(prev => {
      const newCarts = { ...prev };
      Object.keys(newCarts).forEach(storeId => {
        newCarts[storeId] = newCarts[storeId].map(item => 
          item.id === id ? { ...item, quantity } : item
        );
      });
      return newCarts;
    });
  };
  
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalAmount = total; // Alias for compatibility
  
  return {
    items,
    carts,
    addItem,
    removeItem,
    updateQuantity,
    total,
    totalAmount
  };
};
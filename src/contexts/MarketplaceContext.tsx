'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Project } from '@/domains/projects/models/Project';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  storeId: string;
  projectId?: string; // Link to project if applicable
}

interface Purchase {
  id: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
}

type ViewMode = 'public' | 'project' | 'store';

interface MarketplaceContextType {
  viewMode: ViewMode;
  currentProject?: Project;
  cart: CartItem[];
  setViewMode: (mode: ViewMode) => void;
  setCurrentProject: (project: Project | undefined) => void;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItemQuantity: (itemId: string, quantity: number) => void;
  linkPurchaseToProject: (purchase: Purchase, projectId: string) => Promise<void>;
  clearCart: () => void;
  getCartTotal: () => number;
  getProjectCart: (projectId: string) => CartItem[];
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>('public');
  const [currentProject, setCurrentProject] = useState<Project | undefined>();
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    const cartItem: CartItem = {
      ...item,
      id: `cart_${Date.now()}_${Math.random()}`,
      projectId: viewMode === 'project' ? currentProject?.id : item.projectId
    };

    setCart(prevCart => {
      // Check if item already exists in cart
      const existingItemIndex = prevCart.findIndex(
        cartItem => cartItem.productId === item.productId && cartItem.projectId === cartItem.projectId
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += item.quantity;
        return updatedCart;
      } else {
        // Add new item
        return [...prevCart, cartItem];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const updateCartItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const linkPurchaseToProject = async (purchase: Purchase, projectId: string): Promise<void> => {
    try {
      // This would integrate with the project service to link purchases
      console.log(`Linking purchase ${purchase.id} to project ${projectId}`);
      
      // Update cart items to include project reference
      setCart(prevCart =>
        prevCart.map(item => ({
          ...item,
          projectId: projectId
        }))
      );
    } catch (error) {
      console.error('Failed to link purchase to project:', error);
      throw error;
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = (): number => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getProjectCart = (projectId: string): CartItem[] => {
    return cart.filter(item => item.projectId === projectId);
  };

  const value: MarketplaceContextType = {
    viewMode,
    currentProject,
    cart,
    setViewMode,
    setCurrentProject,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    linkPurchaseToProject,
    clearCart,
    getCartTotal,
    getProjectCart
  };

  return (
    <MarketplaceContext.Provider value={value}>
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (context === undefined) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
}

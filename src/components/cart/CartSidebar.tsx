'use client';

import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/lib/utils';
import { Trash2, Plus, Minus, ShoppingCart, X } from 'lucide-react';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { state, removeItem, updateQuantity, clearCart } = useCart();

  if (!isOpen) return null;

  const groupedByStore = state.items.reduce(
    (groups, item) => {
      const storeId = item.product.store_id;
      if (!groups[storeId]) {
        groups[storeId] = {
          store_name: item.store_name || 'متجر غير محدد',
          items: [],
          total: 0,
        };
      }
      groups[storeId].items.push(item);
      groups[storeId].total += item.product.price * item.quantity;
      return groups;
    },
    {} as Record<string, { store_name: string; items: typeof state.items; total: number }>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h2 className="text-lg font-semibold">سلة المشتريات</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{state.itemCount} عنصر</span>
              <button onClick={onClose} className="rounded-lg p-1 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {state.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <ShoppingCart className="h-12 w-12 mb-4" />
                <p className="text-lg font-medium">سلة المشتريات فارغة</p>
                <p className="text-sm">أضف بعض المنتجات لتبدأ التسوق</p>
              </div>
            ) : (
              <div className="p-4 space-y-6">
                {Object.entries(groupedByStore).map(([storeId, storeGroup]) => (
                  <div key={storeId} className="space-y-3">
                    {/* Store header */}
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">{storeGroup.store_name}</h3>
                      <span className="text-sm font-medium text-green-600">
                        {formatCurrency(storeGroup.total)}
                      </span>
                    </div>

                    {/* Store items */}
                    <div className="space-y-3">
                      {storeGroup.items.map((item) => (
                        <CartItem
                          key={item.product.id}
                          item={item}
                          onRemove={() => removeItem(item.product.id)}
                          onUpdateQuantity={(quantity) => updateQuantity(item.product.id, quantity)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="border-t bg-white p-4 space-y-4">
              {/* Total */}
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>الإجمالي</span>
                <span className="text-green-600">{formatCurrency(state.total)}</span>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors">
                  متابعة للدفع
                </button>
                <button
                  onClick={clearCart}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  إفراغ السلة
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface CartItemProps {
  item: any;
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
}

function CartItem({ item, onRemove, onUpdateQuantity }: CartItemProps) {
  return (
    <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
      {/* Product image */}
      <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0 overflow-hidden">
        {item.product.image_url ? (
          <img
            src={item.product.image_url}
            alt={item.product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <ShoppingCart className="h-6 w-6" />
          </div>
        )}
      </div>

      {/* Product details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 line-clamp-2">{item.product.name}</h4>
        <p className="text-sm text-gray-500 mt-1">{formatCurrency(item.product.price)} / الوحدة</p>

        {/* Quantity controls */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => onUpdateQuantity(item.quantity - 1)}
            className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50"
            disabled={item.quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center font-medium">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.quantity + 1)}
            className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50"
            disabled={item.quantity >= item.product.stock}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Price and remove */}
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={onRemove}
          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
        <span className="font-medium text-gray-900">
          {formatCurrency(item.product.price * item.quantity)}
        </span>
      </div>
    </div>
  );
}

// Cart icon with badge component
interface CartIconProps {
  onClick: () => void;
  className?: string;
}

export function CartIcon({ onClick, className = '' }: CartIconProps) {
  const { state } = useCart();

  return (
    <button
      onClick={onClick}
      className={`relative text-white hover:text-gray-100 transition-colors ${className}`}
    >
      <ShoppingCart className="h-5 w-5" />
      {state.itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
          {state.itemCount > 99 ? '99+' : state.itemCount}
        </span>
      )}
    </button>
  );
}

export default CartSidebar;

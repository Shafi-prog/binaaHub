"use client";

import React, { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  barcode: string;
  category: string;
  stock: number;
}

interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

interface EnhancedOfflinePOSProps {
  className?: string;
}

const EnhancedOfflinePOS: React.FC<EnhancedOfflinePOSProps> = ({ className = "" }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOffline, setIsOffline] = useState(false);
  const [pendingTransactions, setPendingTransactions] = useState<any[]>([]);

  // Mock products
  useEffect(() => {
    const mockProducts: Product[] = [
      { id: '1', name: 'Construction Helmet', price: 25.99, barcode: '1234567890123', category: 'Safety', stock: 45 },
      { id: '2', name: 'Steel Rebar 10mm', price: 12.50, barcode: '2345678901234', category: 'Materials', stock: 100 },
      { id: '3', name: 'Cement Bag 50kg', price: 8.75, barcode: '3456789012345', category: 'Materials', stock: 200 },
      { id: '4', name: 'Safety Gloves', price: 15.00, barcode: '4567890123456', category: 'Safety', stock: 75 }
    ];
    setProducts(mockProducts);

    // Simulate offline detection
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);
    
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * product.price }
            : item
        );
      } else {
        return [...prev, { product, quantity: 1, subtotal: product.price }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity, subtotal: quantity * item.product.price }
          : item
      )
    );
  };

  const total = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = total * 0.1; // 10% tax
  const grandTotal = total + tax;

  const processOfflineTransaction = () => {
    const transaction = {
      id: Date.now().toString(),
      items: cart,
      total: grandTotal,
      timestamp: new Date(),
      status: 'pending'
    };
    
    setPendingTransactions(prev => [...prev, transaction]);
    setCart([]);
    
    // Store in localStorage for persistence
    const stored = localStorage.getItem('pendingTransactions') || '[]';
    const existing = JSON.parse(stored);
    localStorage.setItem('pendingTransactions', JSON.stringify([...existing, transaction]));
    
    alert('Transaction saved offline. Will sync when connection is restored.');
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode.includes(searchTerm)
  );

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      {/* Offline Indicator */}
      {isOffline && (
        <div className="bg-red-500 text-white p-2 text-center">
          ⚠️ OFFLINE MODE - Transactions will be saved locally
        </div>
      )}

      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Enhanced Offline POS</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Search and Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Products</h3>
            
            <input
              type="text"
              placeholder="Search products or scan barcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 cursor-pointer"
                  onClick={() => addToCart(product)}
                >
                  <h4 className="font-medium text-gray-900">{product.name}</h4>
                  <p className="text-sm text-gray-500">{product.category}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-lg font-bold text-blue-600">${product.price.toFixed(2)}</span>
                    <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Cart</h3>
            
            <div className="border border-gray-200 rounded-lg p-4 min-h-96">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Cart is empty</p>
              ) : (
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex items-center justify-between border-b pb-3">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product.name}</h4>
                        <p className="text-sm text-gray-500">${item.product.price.toFixed(2)} each</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="ml-2 text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="ml-4 text-right">
                        <span className="font-medium">${item.subtotal.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Total */}
            {cart.length > 0 && (
              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (10%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
                
                <button
                  onClick={processOfflineTransaction}
                  className="w-full mt-4 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {isOffline ? 'Save Transaction (Offline)' : 'Process Payment'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Pending Transactions */}
        {pendingTransactions.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Pending Offline Transactions ({pendingTransactions.length})</h3>
            <div className="space-y-2">
              {pendingTransactions.map(transaction => (
                <div key={transaction.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Transaction #{transaction.id}</span>
                    <span className="text-lg font-bold">${transaction.total.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {transaction.items.length} items • {new Date(transaction.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedOfflinePOS;

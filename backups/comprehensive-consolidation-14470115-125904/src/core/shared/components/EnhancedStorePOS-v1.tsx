"use client";

import React, { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  barcode: string;
  category: string;
  stock: number;
  image?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  loyaltyPoints: number;
}

interface EnhancedStorePOSProps {
  className?: string;
}

const EnhancedStorePOS: React.FC<EnhancedStorePOSProps> = ({ className = "" }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'points'>('cash');
  const [cashReceived, setCashReceived] = useState<number>(0);

  // Mock data
  useEffect(() => {
    const mockProducts: Product[] = [
      { id: '1', name: 'Construction Helmet', price: 25.99, barcode: '1234567890123', category: 'Safety', stock: 45 },
      { id: '2', name: 'Steel Rebar 10mm', price: 12.50, barcode: '2345678901234', category: 'Materials', stock: 100 },
      { id: '3', name: 'Cement Bag 50kg', price: 8.75, barcode: '3456789012345', category: 'Materials', stock: 200 },
      { id: '4', name: 'Safety Gloves', price: 15.00, barcode: '4567890123456', category: 'Safety', stock: 75 },
      { id: '5', name: 'Power Drill', price: 89.99, barcode: '5678901234567', category: 'Tools', stock: 25 },
      { id: '6', name: 'Measuring Tape', price: 12.99, barcode: '6789012345678', category: 'Tools', stock: 60 }
    ];
    
    const mockCustomers: Customer[] = [
      { id: '1', name: 'Ahmed Al-Mahmoud', email: 'ahmed@example.com', phone: '+966501234567', loyaltyPoints: 150 },
      { id: '2', name: 'Fatima Al-Zahra', email: 'fatima@example.com', phone: '+966507654321', loyaltyPoints: 85 },
      { id: '3', name: 'Mohammad Al-Salem', email: 'mohammad@example.com', phone: '+966509876543', loyaltyPoints: 220 }
    ];
    
    setProducts(mockProducts);
    setCustomers(mockCustomers);
  }, []);

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      alert('Product is out of stock');
      return;
    }

    setCart(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          alert('Cannot add more than available stock');
          return prev;
        }
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
    
    const product = products.find(p => p.id === productId);
    if (product && quantity > product.stock) {
      alert('Cannot exceed available stock');
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
  const discount = selectedCustomer ? Math.min(total * 0.05, selectedCustomer.loyaltyPoints * 0.01) : 0;
  const tax = (total - discount) * 0.1; // 10% tax
  const grandTotal = total - discount + tax;

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode.includes(searchTerm)
  );

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.phone.includes(customerSearch)
  );

  const processPayment = () => {
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }

    if (paymentMethod === 'cash' && cashReceived < grandTotal) {
      alert('Insufficient cash received');
      return;
    }

    // Process the transaction
    const transaction = {
      id: Date.now().toString(),
      items: cart,
      customer: selectedCustomer,
      total: grandTotal,
      paymentMethod,
      discount,
      tax,
      timestamp: new Date()
    };

    // Update stock
    cart.forEach(cartItem => {
      setProducts(prev => prev.map(product =>
        product.id === cartItem.product.id
          ? { ...product, stock: product.stock - cartItem.quantity }
          : product
      ));
    });

    // Update customer loyalty points
    if (selectedCustomer) {
      const pointsEarned = Math.floor(grandTotal);
      setCustomers(prev => prev.map(customer =>
        customer.id === selectedCustomer.id
          ? { ...customer, loyaltyPoints: customer.loyaltyPoints + pointsEarned }
          : customer
      ));
    }

    // Reset cart and payment
    setCart([]);
    setSelectedCustomer(null);
    setCashReceived(0);
    setPaymentMethod('cash');
    
    alert(`Payment processed successfully! Transaction ID: ${transaction.id}`);
  };

  const categories = Array.from(new Set(products.map(p => p.category)));

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Enhanced Store POS</h2>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Product Search and Selection */}
          <div className="xl:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold">Products</h3>
            
            <input
              type="text"
              placeholder="Search products, categories, or scan barcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSearchTerm('')}
                className={`px-3 py-1 rounded-full text-sm ${searchTerm === '' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                All
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSearchTerm(category)}
                  className={`px-3 py-1 rounded-full text-sm ${searchTerm === category ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  {category}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                    product.stock > 0 
                      ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50' 
                      : 'border-red-200 bg-red-50 cursor-not-allowed'
                  }`}
                  onClick={() => product.stock > 0 && addToCart(product)}
                >
                  <h4 className="font-medium text-gray-900 text-sm">{product.name}</h4>
                  <p className="text-xs text-gray-500 mb-2">{product.category}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-blue-600">${product.price.toFixed(2)}</span>
                    <span className={`text-xs ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      Stock: {product.stock}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart and Checkout */}
          <div className="space-y-4">
            {/* Customer Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Customer</h3>
              <input
                type="text"
                placeholder="Search customer..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />
              {customerSearch && (
                <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-md">
                  {filteredCustomers.map(customer => (
                    <div
                      key={customer.id}
                      className="p-2 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setCustomerSearch('');
                      }}
                    >
                      <div className="text-sm font-medium">{customer.name}</div>
                      <div className="text-xs text-gray-500">{customer.phone} • {customer.loyaltyPoints} points</div>
                    </div>
                  ))}
                </div>
              )}
              {selectedCustomer && (
                <div className="bg-green-50 border border-green-200 rounded-md p-2">
                  <div className="text-sm font-medium">{selectedCustomer.name}</div>
                  <div className="text-xs text-gray-600">Points: {selectedCustomer.loyaltyPoints}</div>
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Cart */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Cart</h3>
              <div className="border border-gray-200 rounded-lg p-3 min-h-64">
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Cart is empty</p>
                ) : (
                  <div className="space-y-2">
                    {cart.map(item => (
                      <div key={item.product.id} className="flex items-center justify-between text-sm border-b pb-2">
                        <div className="flex-1">
                          <div className="font-medium">{item.product.name}</div>
                          <div className="text-gray-500">${item.product.price.toFixed(2)} each</div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 text-xs"
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-xs">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 text-xs"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="ml-1 text-red-600 hover:text-red-800 text-xs"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="ml-2 text-right">
                          <span className="font-medium">${item.subtotal.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Totals */}
              {cart.length > 0 && (
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax (10%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Payment Method */}
              {cart.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold mb-2">Payment Method</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="cash"
                        checked={paymentMethod === 'cash'}
                        onChange={(e) => setPaymentMethod(e.target.value as any)}
                        className="mr-2"
                      />
                      Cash
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value as any)}
                        className="mr-2"
                      />
                      Card
                    </label>
                    {selectedCustomer && (
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="points"
                          checked={paymentMethod === 'points'}
                          onChange={(e) => setPaymentMethod(e.target.value as any)}
                          className="mr-2"
                        />
                        Loyalty Points
                      </label>
                    )}
                  </div>

                  {paymentMethod === 'cash' && (
                    <div className="mt-2">
                      <label className="text-sm">Cash Received:</label>
                      <input
                        type="number"
                        value={cashReceived}
                        onChange={(e) => setCashReceived(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                        placeholder="0.00"
                        step="0.01"
                      />
                      {cashReceived > grandTotal && (
                        <p className="text-sm text-green-600 mt-1">
                          Change: ${(cashReceived - grandTotal).toFixed(2)}
                        </p>
                      )}
                    </div>
                  )}

                  <button
                    onClick={processPayment}
                    className="w-full mt-4 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Process Payment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedStorePOS;

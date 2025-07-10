import React, { useState, useEffect, useContext, createContext } from 'react';
import { ShoppingCart, Plus, Minus, X, Truck, Store, CreditCard, MapPin, Clock } from 'lucide-react';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  seller: string;
  sellerId: string;
  category: string;
  inStock: boolean;
  maxQuantity: number;
  freeShipping: boolean;
  estimatedDelivery: string;
  specifications?: Record<string, string>;
}

interface StoreCart {
  sellerId: string;
  sellerName: string;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  freeShippingThreshold: number;
  estimatedDelivery: string;
  location: string;
}

interface CartContextType {
  carts: StoreCart[];
  totalItems: number;
  totalAmount: number;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (productId: string, sellerId: string) => void;
  updateQuantity: (productId: string, sellerId: string, quantity: number) => void;
  clearCart: (sellerId?: string) => void;
  getCartBySeller: (sellerId: string) => StoreCart | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [carts, setCarts] = useState<StoreCart[]>([]);

  useEffect(() => {
    // Load cart from localStorage on mount
    const savedCarts = localStorage.getItem('multiStoreCart');
    if (savedCarts) {
      setCarts(JSON.parse(savedCarts));
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem('multiStoreCart', JSON.stringify(carts));
  }, [carts]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCarts(prevCarts => {
      const existingCartIndex = prevCarts.findIndex(cart => cart.sellerId === item.sellerId);
      
      if (existingCartIndex >= 0) {
        // Update existing store cart
        const updatedCarts = [...prevCarts];
        const existingCart = updatedCarts[existingCartIndex];
        const existingItemIndex = existingCart.items.findIndex(cartItem => cartItem.productId === item.productId);
        
        if (existingItemIndex >= 0) {
          // Update quantity of existing item
          const updatedItems = [...existingCart.items];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: Math.min(updatedItems[existingItemIndex].quantity + 1, item.maxQuantity)
          };
          updatedCarts[existingCartIndex] = {
            ...existingCart,
            items: updatedItems,
            subtotal: calculateSubtotal(updatedItems)
          };
        } else {
          // Add new item to existing cart
          const newItem: CartItem = { ...item, quantity: 1 };
          const updatedItems = [...existingCart.items, newItem];
          updatedCarts[existingCartIndex] = {
            ...existingCart,
            items: updatedItems,
            subtotal: calculateSubtotal(updatedItems)
          };
        }
        
        return updatedCarts;
      } else {
        // Create new store cart
        const newItem: CartItem = { ...item, quantity: 1 };
        const newCart: StoreCart = {
          sellerId: item.sellerId,
          sellerName: item.seller,
          items: [newItem],
          subtotal: newItem.price,
          shippingCost: item.freeShipping ? 0 : 25,
          freeShippingThreshold: 200,
          estimatedDelivery: item.estimatedDelivery,
          location: 'Riyadh' // Default location
        };
        
        return [...prevCarts, newCart];
      }
    });
  };

  const removeFromCart = (productId: string, sellerId: string) => {
    setCarts(prevCarts => {
      const updatedCarts = prevCarts.map(cart => {
        if (cart.sellerId === sellerId) {
          const updatedItems = cart.items.filter(item => item.productId !== productId);
          return {
            ...cart,
            items: updatedItems,
            subtotal: calculateSubtotal(updatedItems)
          };
        }
        return cart;
      }).filter(cart => cart.items.length > 0); // Remove empty carts
      
      return updatedCarts;
    });
  };

  const updateQuantity = (productId: string, sellerId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, sellerId);
      return;
    }
    
    setCarts(prevCarts => {
      return prevCarts.map(cart => {
        if (cart.sellerId === sellerId) {
          const updatedItems = cart.items.map(item => {
            if (item.productId === productId) {
              return {
                ...item,
                quantity: Math.min(quantity, item.maxQuantity)
              };
            }
            return item;
          });
          
          return {
            ...cart,
            items: updatedItems,
            subtotal: calculateSubtotal(updatedItems)
          };
        }
        return cart;
      });
    });
  };

  const clearCart = (sellerId?: string) => {
    if (sellerId) {
      setCarts(prevCarts => prevCarts.filter(cart => cart.sellerId !== sellerId));
    } else {
      setCarts([]);
    }
  };

  const getCartBySeller = (sellerId: string) => {
    return carts.find(cart => cart.sellerId === sellerId);
  };

  const calculateSubtotal = (items: CartItem[]) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const totalItems = carts.reduce((total, cart) => 
    total + cart.items.reduce((cartTotal, item) => cartTotal + item.quantity, 0), 0
  );

  const totalAmount = carts.reduce((total, cart) => {
    const shippingCost = cart.subtotal >= cart.freeShippingThreshold ? 0 : cart.shippingCost;
    return total + cart.subtotal + shippingCost;
  }, 0);

  return (
    <CartContext.Provider value={{
      carts,
      totalItems,
      totalAmount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartBySeller
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

const MultiStoreCart: React.FC = () => {
  const { carts, totalItems, totalAmount, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCarts, setSelectedCarts] = useState<string[]>([]);

  const handleSelectCart = (sellerId: string) => {
    setSelectedCarts(prev => 
      prev.includes(sellerId) 
        ? prev.filter(id => id !== sellerId)
        : [...prev, sellerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCarts.length === carts.length) {
      setSelectedCarts([]);
    } else {
      setSelectedCarts(carts.map(cart => cart.sellerId));
    }
  };

  const calculateSelectedTotal = () => {
    return carts
      .filter(cart => selectedCarts.includes(cart.sellerId))
      .reduce((total, cart) => {
        const shippingCost = cart.subtotal >= cart.freeShippingThreshold ? 0 : cart.shippingCost;
        return total + cart.subtotal + shippingCost;
      }, 0);
  };

  const CartItem: React.FC<{ item: CartItem; sellerId: string }> = ({ item, sellerId }) => (
    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
      <img 
        src={item.image} 
        alt={item.name}
        className="w-16 h-16 object-cover rounded-md"
      />
      
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800">{item.name}</h4>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>{item.price} SAR</span>
          {item.originalPrice && (
            <span className="line-through text-gray-400">{item.originalPrice} SAR</span>
          )}
        </div>
        
        {item.specifications && (
          <div className="text-xs text-gray-500 mt-1">
            {Object.entries(item.specifications).slice(0, 2).map(([key, value]) => (
              <span key={key} className="mr-3">{key}: {value}</span>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => updateQuantity(item.productId, sellerId, item.quantity - 1)}
          className="p-1 hover:bg-gray-200 rounded"
          disabled={item.quantity <= 1}
        >
          <Minus className="w-4 h-4" />
        </button>
        
        <span className="font-medium min-w-[2rem] text-center">{item.quantity}</span>
        
        <button
          onClick={() => updateQuantity(item.productId, sellerId, item.quantity + 1)}
          className="p-1 hover:bg-gray-200 rounded"
          disabled={item.quantity >= item.maxQuantity}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      <div className="text-right">
        <div className="font-semibold">{item.price * item.quantity} SAR</div>
        {!item.inStock && (
          <span className="text-red-500 text-xs">Out of Stock</span>
        )}
      </div>
      
      <button
        onClick={() => removeFromCart(item.productId, sellerId)}
        className="p-1 hover:bg-red-100 rounded text-red-500"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );

  const StoreCartSection: React.FC<{ cart: StoreCart }> = ({ cart }) => {
    const isSelected = selectedCarts.includes(cart.sellerId);
    const shippingCost = cart.subtotal >= cart.freeShippingThreshold ? 0 : cart.shippingCost;
    const freeShippingProgress = (cart.subtotal / cart.freeShippingThreshold) * 100;

    return (
      <div className="border border-gray-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleSelectCart(cart.sellerId)}
              className="w-4 h-4 text-orange-600 rounded"
            />
            <div className="flex items-center space-x-2">
              <Store className="w-5 h-5 text-gray-600" />
              <span className="font-semibold">{cart.sellerName}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{cart.location}</span>
            </div>
          </div>
          
          <button
            onClick={() => clearCart(cart.sellerId)}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            Clear Store
          </button>
        </div>
        
        <div className="space-y-2 mb-4">
          {cart.items.map(item => (
            <CartItem key={item.productId} item={item} sellerId={cart.sellerId} />
          ))}
        </div>
        
        {/* Shipping Progress */}
        {cart.freeShippingThreshold > 0 && shippingCost > 0 && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Free shipping progress</span>
              <span className="font-semibold">
                {cart.subtotal} / {cart.freeShippingThreshold} SAR
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(freeShippingProgress, 100)}%` }}
              />
            </div>
            <div className="text-xs text-blue-600 mt-1">
              {cart.freeShippingThreshold - cart.subtotal > 0 
                ? `Add ${cart.freeShippingThreshold - cart.subtotal} SAR more for free shipping`
                : 'Free shipping unlocked!'
              }
            </div>
          </div>
        )}
        
        {/* Store Summary */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center mb-2">
            <span>Subtotal ({cart.items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
            <span className="font-semibold">{cart.subtotal} SAR</span>
          </div>
          
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-1">
              <Truck className="w-4 h-4 text-gray-600" />
              <span>Shipping</span>
            </div>
            <span className={`font-semibold ${shippingCost === 0 ? 'text-green-600' : ''}`}>
              {shippingCost === 0 ? 'Free' : `${shippingCost} SAR`}
            </span>
          </div>
          
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4 text-gray-600" />
              <span>Estimated Delivery</span>
            </div>
            <span className="text-sm text-gray-600">{cart.estimatedDelivery}</span>
          </div>
          
          <div className="flex justify-between items-center text-lg font-bold border-t border-gray-200 pt-2">
            <span>Store Total</span>
            <span>{cart.subtotal + shippingCost} SAR</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Cart Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
      >
        <ShoppingCart className="w-5 h-5" />
        <span>Cart</span>
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>

      {/* Cart Panel */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-bold">Shopping Cart</h2>
                <span className="text-gray-600">({totalItems} items)</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-orange-600 hover:text-orange-800"
                >
                  {selectedCarts.length === carts.length ? 'Deselect All' : 'Select All'}
                </button>
                
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4">
              {carts.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-gray-600">Add some products to get started!</p>
                </div>
              ) : (
                <>
                  {carts.map(cart => (
                    <StoreCartSection key={cart.sellerId} cart={cart} />
                  ))}
                  
                  {/* Order Summary */}
                  <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold">
                        Total ({selectedCarts.length} stores selected)
                      </span>
                      <span className="text-2xl font-bold text-orange-600">
                        {calculateSelectedTotal()} SAR
                      </span>
                    </div>
                    
                    <div className="flex space-x-4">
                      <button
                        onClick={() => clearCart()}
                        className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Clear All
                      </button>
                      
                      <button
                        disabled={selectedCarts.length === 0}
                        className="flex-1 bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        <CreditCard className="w-5 h-5" />
                        <span>Proceed to Checkout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiStoreCart;

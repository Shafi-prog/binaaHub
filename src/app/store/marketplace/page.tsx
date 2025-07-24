'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Badge } from '@/core/shared/components/ui/badge';
import { Button } from '@/core/shared/components/ui/button';
import { Input } from '@/core/shared/components/ui/input';
import { Select } from '@/core/shared/components/ui/select';
import { 

  ShoppingCart, 
  Search, 
  Filter, 
  Star, 
  Heart,
  Plus,
  Minus,
  Eye,
  Package,
  Truck
} from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '@supabase/auth-helpers-react';
import Link from 'next/link';


export const dynamic = 'force-dynamic'
// Force dynamic rendering to avoid SSG auth context issues

interface ProductVariant {
  id: string;
  title: string;
  sku: string;
  inventory_quantity: number;
  prices: Array<{
    amount: number;
    currency_code: string;
  }>;
}

interface Product {
  id: string;
  title: string;
  description: string;
  handle: string;
  status: string;
  variants: ProductVariant[];
  created_at: string;
  updated_at: string;
}

interface CartItem {
  variantId: string;
  productTitle: string;
  variantTitle: string;
  quantity: number;
  price: number;
  currency: string;
}

interface Region {
  id: string;
  name: string;
  currency_code: string;
}

const formatPrice = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount / 100);
};

export default function UserStorefront() {
  const user = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [cart, setCart] = useState<{ [key: string]: CartItem }>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      // Fetch regions
      const regionsResponse = await fetch('/api/store/regions');
      const regionsData = await regionsResponse.json();
      setRegions(regionsData.regions || []);
      
      // Set default region (first one or USD)
      const defaultRegion = regionsData.regions?.find((r: Region) => r.currency_code === 'usd') || regionsData.regions?.[0];
      if (defaultRegion) {
        setSelectedRegion(defaultRegion);
      }

      // Fetch products
      const productsResponse = await fetch('/api/store/products?limit=50');
      const productsData = await productsResponse.json();
      setProducts(productsData.products || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load store data');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (variant: ProductVariant, product: Product) => {
    if (!selectedRegion) {
      toast.error('Please select a region first');
      return;
    }

    const price = variant.prices.find(p => p.currency_code === selectedRegion.currency_code);
    if (!price) {
      toast.error('Price not available for selected region');
      return;
    }

    const cartItem: CartItem = {
      variantId: variant.id,
      productTitle: product.title,
      variantTitle: variant.title,
      quantity: 1,
      price: price.amount,
      currency: price.currency_code,
    };

    setCart(prevCart => {
      const existingItem = prevCart[variant.id];
      if (existingItem) {
        return {
          ...prevCart,
          [variant.id]: {
            ...existingItem,
            quantity: existingItem.quantity + 1,
          },
        };
      } else {
        return {
          ...prevCart,
          [variant.id]: cartItem,
        };
      }
    });

    toast.success(`Added ${product.title} to cart`);
  };

  const updateCartQuantity = (variantId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(variantId);
      return;
    }

    setCart(prevCart => ({
      ...prevCart,
      [variantId]: {
        ...prevCart[variantId],
        quantity: newQuantity,
      },
    }));
  };

  const removeFromCart = (variantId: string) => {
    setCart(prevCart => {
      const newCart = { ...prevCart };
      delete newCart[variantId];
      return newCart;
    });
    toast.success('Item removed from cart');
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prevWishlist => {
      const newWishlist = new Set(prevWishlist);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
        toast.success('Removed from wishlist');
      } else {
        newWishlist.add(productId);
        toast.success('Added to wishlist');
      }
      return newWishlist;
    });
  };

  const getTotalCartItems = () => {
    return Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalCartValue = () => {
    return Object.values(cart).reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getProductCategories = () => {
    const categories = new Set<string>();
    products.forEach(product => {
      // Simple categorization based on product title
      const title = product.title.toLowerCase();
      if (title.includes('helmet') || title.includes('safety')) categories.add('safety');
      if (title.includes('tool') || title.includes('equipment')) categories.add('tools');
      if (title.includes('material') || title.includes('cement') || title.includes('steel')) categories.add('materials');
      if (title.includes('clothing') || title.includes('vest') || title.includes('uniform')) categories.add('clothing');
    });
    return Array.from(categories);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesCategory = true;
    if (selectedCategory !== 'all') {
      const title = product.title.toLowerCase();
      matchesCategory = title.includes(selectedCategory);
    }

    return matchesSearch && matchesCategory && product.status === 'published';
  });

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading store...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Binna Store</h1>
          <p className="text-gray-600">Construction materials and equipment marketplace</p>
        </div>
        
        <div className="flex items-center gap-4">          {/* Region Selector */}
          {regions.length > 0 && (
            <Select
              value={selectedRegion?.id || ''}
              onChange={(e) => {
                const region = regions.find(r => r.id === e.target.value);
                setSelectedRegion(region || null);
              }}
              className="w-32"
            >
              <option value="">Select Region</option>
              {regions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.currency_code.toUpperCase()}
                </option>
              ))}
            </Select>
          )}

          {/* Cart */}
          <Link href="/store/cart">
            <Button variant="outline" className="relative" onClick={() => alert('Button clicked')}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart
              {getTotalCartItems() > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {getTotalCartItems()}
                </Badge>
              )}
            </Button>
          </Link>

          {!user && (
            <Link href="/login">
              <Button onClick={() => alert('Button clicked')}>Sign In</Button>
            </Link>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>        
        <Select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-48"
        >
          <option value="all">All Categories</option>
          {getProductCategories().map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </Select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                  {product.title}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleWishlist(product.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Heart 
                    className={`h-4 w-4 ${wishlist.has(product.id) ? 'fill-red-500 text-red-500' : ''}`} 
                  />
                </Button>
              </div>
              <CardDescription className="text-sm">
                {product.description || 'High-quality construction product'}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Product Info */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Package className="h-4 w-4" />
                <span>{product.variants.length} variant(s) available</span>
              </div>

              {/* Variants */}
              <div className="space-y-2">
                {product.variants.slice(0, 2).map((variant) => {
                  const price = variant.prices.find(p => p.currency_code === (selectedRegion?.currency_code || 'usd'));
                  const cartItem = cart[variant.id];
                  
                  return (
                    <div key={variant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{variant.title}</p>
                        <p className="text-xs text-gray-600">SKU: {variant.sku}</p>
                        {price && (
                          <p className="text-lg font-bold text-blue-600">
                            {formatPrice(price.amount, price.currency_code)}
                          </p>
                        )}
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <Package className="h-3 w-3" />
                          <span>{variant.inventory_quantity} in stock</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {cartItem ? (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateCartQuantity(variant.id, cartItem.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">
                              {cartItem.quantity}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateCartQuantity(variant.id, cartItem.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => addToCart(variant, product)}
                            disabled={variant.inventory_quantity <= 0}
                            className="flex items-center gap-1"
                          >
                            <ShoppingCart className="h-3 w-3" />
                            Add
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* View More Variants */}
              {product.variants.length > 2 && (
                <Button variant="outline" size="sm" className="w-full" onClick={() => alert('Button clicked')}>
                  <Eye className="h-3 w-3 mr-1" />
                  View {product.variants.length - 2} more variant(s)
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Products will appear here when they are added to the store'}
          </p>
        </div>
      )}

      {/* Floating Cart Summary */}
      {getTotalCartItems() > 0 && (
        <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div>
              <p className="font-medium">Cart Summary</p>
              <p className="text-sm text-gray-600">
                {getTotalCartItems()} items • {formatPrice(getTotalCartValue(), selectedRegion?.currency_code)}
              </p>
            </div>
            <Link href="/store/cart">
              <Button size="sm" onClick={() => alert('Button clicked')}>
                View Cart
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}






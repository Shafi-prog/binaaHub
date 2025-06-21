'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Search, Filter, Star, Package, Truck, Shield } from 'lucide-react';
import { toast } from 'sonner';

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

interface ProductsResponse {
  products: Product[];
  count: number;
  offset: number;
  limit: number;
}

const formatPrice = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount / 100);
};

export default function StorefrontPage() {
  console.log('StorefrontPage rendering...');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL + '/store/products');
      const data: ProductsResponse = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (variantId: string, productTitle: string) => {
    setCart(prev => ({
      ...prev,
      [variantId]: (prev[variantId] || 0) + 1
    }));
    toast.success(`Added ${productTitle} to cart`);
  };

  const getTotalCartItems = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };

  const getProductCategories = () => {
    const categories = new Set<string>();
    products.forEach(product => {
      if (product.title.toLowerCase().includes('helmet')) categories.add('helmets');
      if (product.title.toLowerCase().includes('vest')) categories.add('vests');
      if (product.title.toLowerCase().includes('boots')) categories.add('boots');
    });
    return Array.from(categories);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
                           product.title.toLowerCase().includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Package className="h-8 w-8 text-orange-600" />
              <h1 className="text-2xl font-bold text-gray-900">Binna Construction Store</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {getTotalCartItems() > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {getTotalCartItems()}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Professional Construction Equipment</h2>
          <p className="text-xl mb-8">Safety gear and tools for construction professionals</p>
          <div className="flex items-center justify-center space-x-8 text-sm">
            <div className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Safety Certified
            </div>
            <div className="flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              Fast Delivery
            </div>
            <div className="flex items-center">
              <Star className="h-5 w-5 mr-2" />
              Professional Grade
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 bg-white"
            >
              <option value="all">All Categories</option>
              {getProductCategories().map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {product.title}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {product.description}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {product.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {product.variants.map((variant) => (
                    <div key={variant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{variant.title}</p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>SKU: {variant.sku}</span>
                          <span>•</span>
                          <span>Stock: {variant.inventory_quantity}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          {variant.prices.map((price, index) => (
                            <p key={index} className="font-bold text-lg text-orange-600">
                              {formatPrice(price.amount, price.currency_code)}
                            </p>
                          ))}
                        </div>
                        
                        <Button
                          size="sm"
                          onClick={() => addToCart(variant.id, variant.title)}
                          disabled={variant.inventory_quantity === 0}
                          className="bg-orange-600 hover:bg-orange-700"
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            © 2025 Binna Construction Store. Professional construction equipment and safety gear.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Powered by Medusa Commerce • API: {process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}
          </p>
        </div>
      </footer>
    </div>
  );
}

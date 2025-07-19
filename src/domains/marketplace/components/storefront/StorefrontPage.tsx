import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Menu, Star, Filter, Heart } from 'lucide-react';
import { useAuth } from '@/shared/hooks/use-auth';
import { LoadingSpinner } from '@/core/shared/components/ui/loading-spinner';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  seller: string;
  category: string;
  isSponsored?: boolean;
  freeShipping?: boolean;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories: string[];
}

const StorefrontPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Samsung Galaxy S24 Ultra',
          price: 4999,
          originalPrice: 5499,
          image: '/api/placeholder/300/300',
          rating: 4.5,
          reviews: 1234,
          seller: 'TechStore KSA',
          category: 'Electronics',
          isSponsored: true,
          freeShipping: true
        },
        {
          id: '2',
          name: 'Nike Air Max 270',
          price: 450,
          originalPrice: 550,
          image: '/api/placeholder/300/300',
          rating: 4.3,
          reviews: 567,
          seller: 'Sports World',
          category: 'Fashion',
          freeShipping: true
        },
        {
          id: '3',
          name: 'Apple MacBook Pro M3',
          price: 8999,
          image: '/api/placeholder/300/300',
          rating: 4.8,
          reviews: 2345,
          seller: 'Apple Store KSA',
          category: 'Electronics',
          freeShipping: true
        }
      ];
      
      setProducts(mockProducts);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    const mockCategories: Category[] = [
      {
        id: '1',
        name: 'Electronics',
        icon: '📱',
        subcategories: ['Smartphones', 'Laptops', 'Tablets', 'Accessories']
      },
      {
        id: '2',
        name: 'Fashion',
        icon: '👔',
        subcategories: ['Men\'s Clothing', 'Women\'s Clothing', 'Shoes', 'Accessories']
      },
      {
        id: '3',
        name: 'Home & Garden',
        icon: '🏠',
        subcategories: ['Furniture', 'Decor', 'Kitchen', 'Garden']
      },
      {
        id: '4',
        name: 'Sports',
        icon: '⚽',
        subcategories: ['Fitness', 'Outdoor', 'Team Sports', 'Equipment']
      }
    ];
    
    setCategories(mockCategories);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  const addToCart = (productId: string) => {
    setCartCount(prev => prev + 1);
    // Implement add to cart functionality
    console.log('Added to cart:', productId);
  };

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4">
      {product.isSponsored && (
        <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full mb-2 inline-block">
          Sponsored
        </span>
      )}
      
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover rounded-md mb-3"
        />
        <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
          <Heart className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      
      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
      
      <div className="flex items-center mb-2">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
          ))}
        </div>
        <span className="ml-2 text-sm text-gray-600">({product.reviews})</span>
      </div>
      
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <span className="text-xl font-bold text-green-600">{product.price} SAR</span>
          {product.originalPrice && (
            <span className="ml-2 text-sm text-gray-500 line-through">
              {product.originalPrice} SAR
            </span>
          )}
        </div>
        {product.freeShipping && (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
            Free Shipping
          </span>
        )}
      </div>
      
      <p className="text-sm text-gray-600 mb-3">Sold by {product.seller}</p>
      
      <button
        onClick={() => addToCart(product.id)}
        className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors duration-200"
      >
        Add to Cart
      </button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-orange-600">BinnaStore</h1>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <button
                  type="submit"
                  className="absolute right-2 top-1.5 bg-orange-500 text-white px-4 py-1 rounded-md hover:bg-orange-600"
                >
                  Search
                </button>
              </form>
            </div>
            
            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <button className="relative">
                <ShoppingCart className="h-6 w-6 text-gray-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              
              <div className="flex items-center space-x-2">
                <User className="h-6 w-6 text-gray-600" />
                <span className="text-sm text-gray-700">
                  {isAuthenticated ? user?.name : 'Sign In'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 mr-8">
            {/* Categories */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <h3 className="font-semibold mb-4">Categories</h3>
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left p-2 rounded-md hover:bg-gray-50 mb-2 ${
                    selectedCategory === category.id ? 'bg-orange-50 text-orange-600' : ''
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filters</h3>
                <Filter className="h-4 w-4 text-gray-600" />
              </div>
              
              {/* Price Range */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range (SAR)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
              
              {/* Sort By */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">
                {selectedCategory ? `${categories.find(c => c.id === selectedCategory)?.name} Products` : 'All Products'}
              </h2>
              <p className="text-gray-600">{products.length} products found</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorefrontPage;

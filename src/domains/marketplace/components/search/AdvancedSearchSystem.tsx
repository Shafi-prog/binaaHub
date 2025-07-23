import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X, ChevronDown, Star, DollarSign, Truck, MapPin } from 'lucide-react';
import { debounce } from 'lodash';

interface SearchFilters {
  query: string;
  category: string;
  priceRange: { min: number; max: number };
  rating: number;
  seller: string;
  location: string;
  freeShipping: boolean;
  inStock: boolean;
  brand: string;
  sortBy: string;
}

interface SearchResult {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  seller: string;
  category: string;
  brand: string;
  location: string;
  inStock: boolean;
  freeShipping: boolean;
  description: string;
  specifications: Record<string, string>;
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'product' | 'category' | 'brand' | 'seller';
  count?: number;
}

const AdvancedSearchSystem: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    priceRange: { min: 0, max: 10000 },
    rating: 0,
    seller: '',
    location: '',
    freeShipping: false,
    inStock: false,
    brand: '',
    sortBy: 'relevance'
  });

  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Categories and brands data
  const categories = [
    'Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Beauty', 'Books',
    'Automotive', 'Health', 'Toys', 'Food & Beverages'
  ];

  const brands = [
    'Samsung', 'Apple', 'Nike', 'Adidas', 'Sony', 'LG', 'Canon', 'HP',
    'Dell', 'Lenovo', 'Xiaomi', 'Huawei', 'Zara', 'H&M'
  ];

  const sellers = [
    'TechStore KSA', 'Fashion World', 'Sports Central', 'Home Plus',
    'Beauty Corner', 'Book Haven', 'Auto Parts KSA', 'Health Store'
  ];

  const locations = [
    'Riyadh', 'Jeddah', 'Dammam', 'Makkah', 'Medina', 'Khobar',
    'Tabuk', 'Buraidah', 'Khamis Mushait', 'Hail'
  ];

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchFilters: SearchFilters) => {
      performSearch(searchFilters);
    }, 300),
    []
  );

  useEffect(() => {
    if (filters.query.length > 0) {
      debouncedSearch(filters);
      fetchSuggestions(filters.query);
    } else {
      setResults([]);
      setSuggestions([]);
    }
  }, [filters, debouncedSearch]);

  const performSearch = async (searchFilters: SearchFilters) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock search results
      const mockResults: SearchResult[] = [
        {
          id: '1',
          name: 'Samsung Galaxy S24 Ultra 256GB',
          price: 4999,
          originalPrice: 5499,
          image: '/api/placeholder/300/300',
          rating: 4.5,
          reviews: 1234,
          seller: 'TechStore KSA',
          category: 'Electronics',
          brand: 'Samsung',
          location: 'Riyadh',
          inStock: true,
          freeShipping: true,
          description: 'Latest Samsung flagship with advanced AI features and S Pen.',
          specifications: {
            'Screen Size': '6.8 inches',
            'Storage': '256GB',
            'RAM': '12GB',
            'Camera': '200MP Main'
          }
        },
        {
          id: '2',
          name: 'Nike Air Max 270 Running Shoes',
          price: 450,
          originalPrice: 550,
          image: '/api/placeholder/300/300',
          rating: 4.3,
          reviews: 567,
          seller: 'Sports Central',
          category: 'Fashion',
          brand: 'Nike',
          location: 'Jeddah',
          inStock: true,
          freeShipping: true,
          description: 'Comfortable running shoes with air cushioning technology.',
          specifications: {
            'Size': '42',
            'Color': 'Black/White',
            'Material': 'Synthetic leather',
            'Weight': '310g'
          }
        }
      ];
      
      // Apply filters
      let filteredResults = mockResults;
      
      if (searchFilters.query) {
        filteredResults = filteredResults.filter(product =>
          product.name.toLowerCase().includes(searchFilters.query.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchFilters.query.toLowerCase()) ||
          product.category.toLowerCase().includes(searchFilters.query.toLowerCase())
        );
      }
      
      if (searchFilters.category) {
        filteredResults = filteredResults.filter(product => product.category === searchFilters.category);
      }
      
      if (searchFilters.brand) {
        filteredResults = filteredResults.filter(product => product.brand === searchFilters.brand);
      }
      
      if (searchFilters.seller) {
        filteredResults = filteredResults.filter(product => product.seller === searchFilters.seller);
      }
      
      if (searchFilters.location) {
        filteredResults = filteredResults.filter(product => product.location === searchFilters.location);
      }
      
      if (searchFilters.freeShipping) {
        filteredResults = filteredResults.filter(product => product.freeShipping);
      }
      
      if (searchFilters.inStock) {
        filteredResults = filteredResults.filter(product => product.inStock);
      }
      
      if (searchFilters.rating > 0) {
        filteredResults = filteredResults.filter(product => product.rating >= searchFilters.rating);
      }
      
      // Price range filter
      filteredResults = filteredResults.filter(product =>
        product.price >= searchFilters.priceRange.min &&
        product.price <= searchFilters.priceRange.max
      );
      
      // Sort results
      switch (searchFilters.sortBy) {
        case 'price-low':
          filteredResults.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filteredResults.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filteredResults.sort((a, b) => b.rating - a.rating);
          break;
        case 'reviews':
          filteredResults.sort((a, b) => b.reviews - a.reviews);
          break;
        default:
          // Keep relevance order
          break;
      }
      
      setResults(filteredResults);
      updateActiveFilters(searchFilters);
      
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestions = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    
    // Mock suggestions
    const mockSuggestions: SearchSuggestion[] = [
      { id: '1', text: 'Samsung Galaxy', type: 'product', count: 45 },
      { id: '2', text: 'Samsung', type: 'brand', count: 120 },
      { id: '3', text: 'Electronics', type: 'category', count: 2500 },
      { id: '4', text: 'TechStore KSA', type: 'seller', count: 89 }
    ];
    
    const filtered = mockSuggestions.filter(suggestion =>
      suggestion.text.toLowerCase().includes(query.toLowerCase())
    );
    
    setSuggestions(filtered);
  };

  const updateActiveFilters = (searchFilters: SearchFilters) => {
    const active: string[] = [];
    
    if (searchFilters.category) active.push(`Category: ${searchFilters.category}`);
    if (searchFilters.brand) active.push(`Brand: ${searchFilters.brand}`);
    if (searchFilters.seller) active.push(`Seller: ${searchFilters.seller}`);
    if (searchFilters.location) active.push(`Location: ${searchFilters.location}`);
    if (searchFilters.freeShipping) active.push('Free Shipping');
    if (searchFilters.inStock) active.push('In Stock');
    if (searchFilters.rating > 0) active.push(`${searchFilters.rating}+ Stars`);
    if (searchFilters.priceRange.min > 0 || searchFilters.priceRange.max < 10000) {
      active.push(`${searchFilters.priceRange.min} - ${searchFilters.priceRange.max} SAR`);
    }
    
    setActiveFilters(active);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilter = (filterText: string) => {
    const newFilters = { ...filters };
    
    if (filterText.startsWith('Category:')) {
      newFilters.category = '';
    } else if (filterText.startsWith('Brand:')) {
      newFilters.brand = '';
    } else if (filterText.startsWith('Seller:')) {
      newFilters.seller = '';
    } else if (filterText.startsWith('Location:')) {
      newFilters.location = '';
    } else if (filterText === 'Free Shipping') {
      newFilters.freeShipping = false;
    } else if (filterText === 'In Stock') {
      newFilters.inStock = false;
    } else if (filterText.includes('Stars')) {
      newFilters.rating = 0;
    } else if (filterText.includes('SAR')) {
      newFilters.priceRange = { min: 0, max: 10000 };
    }
    
    setFilters(newFilters);
  };

  const clearAllFilters = () => {
    setFilters({
      query: filters.query, // Keep search query
      category: '',
      priceRange: { min: 0, max: 10000 },
      rating: 0,
      seller: '',
      location: '',
      freeShipping: false,
      inStock: false,
      brand: '',
      sortBy: 'relevance'
    });
  };

  const ProductCard: React.FC<{ product: SearchResult }> = ({ product }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover rounded-md mb-3"
        />
        <div className="absolute top-2 right-2 flex flex-col space-y-1">
          {product.freeShipping && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded flex items-center">
              <Truck className="w-3 h-3 mr-1" />
              Free
            </span>
          )}
          {!product.inStock && (
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
              Out of Stock
            </span>
          )}
        </div>
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
      </div>
      
      <div className="flex items-center text-sm text-gray-600 mb-2">
        <MapPin className="w-4 h-4 mr-1" />
        {product.location}
      </div>
      
      <p className="text-sm text-gray-600 mb-3">Sold by {product.seller}</p>
      
      <button className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors duration-200" onClick={() => alert('Button clicked')}>
        Add to Cart
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <form className="relative">
            <input
              type="text"
              placeholder="Search products, brands, categories..."
              value={filters.query}
              onChange={(e) => handleFilterChange('query', e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              className="w-full px-4 py-3 pl-12 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg"
            />
            <Search className="absolute left-4 top-3.5 h-6 w-6 text-gray-400" />
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="absolute right-2 top-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 flex items-center"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </form>
          
          {/* Search Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 mt-1">
              {suggestions.map(suggestion => (
                <button
                  key={suggestion.id}
                  onClick={() => {
                    handleFilterChange('query', suggestion.text);
                    setShowSuggestions(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center justify-between"
                >
                  <span>{suggestion.text}</span>
                  <span className="text-sm text-gray-500">
                    {suggestion.type} {suggestion.count && `(${suggestion.count})`}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700">Active Filters:</span>
            {activeFilters.map((filter, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full flex items-center"
              >
                {filter}
                <button
                  onClick={() => clearFilter(filter)}
                  className="ml-2 hover:text-blue-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button
              onClick={clearAllFilters}
              className="text-sm text-orange-600 hover:text-orange-800 ml-2"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
              <select
                value={filters.brand}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All Brands</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            {/* Seller Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Seller</label>
              <select
                value={filters.seller}
                onChange={(e) => handleFilterChange('seller', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All Sellers</option>
                {sellers.map(seller => (
                  <option key={seller} value={seller}>{seller}</option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (SAR)</label>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  value={filters.priceRange.min}
                  onChange={(e) => handleFilterChange('priceRange', { ...filters.priceRange, min: Number(e.target.value) })}
                  placeholder="Min"
                  className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <span>-</span>
                <input
                  type="number"
                  value={filters.priceRange.max}
                  onChange={(e) => handleFilterChange('priceRange', { ...filters.priceRange, max: Number(e.target.value) })}
                  placeholder="Max"
                  className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
              <select
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value={0}>Any Rating</option>
                <option value={1}>1+ Stars</option>
                <option value={2}>2+ Stars</option>
                <option value={3}>3+ Stars</option>
                <option value={4}>4+ Stars</option>
                <option value={5}>5 Stars</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="relevance">Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="reviews">Most Reviews</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          {/* Additional Options */}
          <div className="mt-4 flex flex-wrap gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.freeShipping}
                onChange={(e) => handleFilterChange('freeShipping', e.target.checked)}
                className="mr-2"
              />
              Free Shipping
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                className="mr-2"
              />
              In Stock Only
            </label>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Search Results</h2>
        <p className="text-gray-600">
          {isLoading ? 'Searching...' : `${results.length} products found`}
        </p>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* No Results */}
      {!isLoading && results.length === 0 && filters.query && (
        <div className="text-center py-12">
          <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search terms or filters
          </p>
          <button
            onClick={clearAllFilters}
            className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearchSystem;

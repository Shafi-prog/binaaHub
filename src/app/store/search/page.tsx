'use client';

import { useState } from 'react';
import { Search, Filter, Grid, List, Sparkles, SortDesc } from 'lucide-react';
import AISearchSuggestions from '@/components/search/AISearchSuggestions';
import SocialSharing from '@/components/social/SocialSharing';

export default function AdvancedSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowSuggestions(false);
    
    // Mock search results
    const mockResults = [
      {
        id: 1,
        name: 'طوب أحمر عالي الجودة',
        price: 0.52,
        image: '/placeholder-product.jpg',
        rating: 4.5,
        store: 'مؤسسة البناء المتقدم',
        location: 'الرياض'
      },
      {
        id: 2,
        name: 'أسمنت بورتلاند',
        price: 24.00,
        image: '/placeholder-product.jpg',
        rating: 4.8,
        store: 'شركة الأسمنت السعودية',
        location: 'جدة'
      }
    ];
    
    setResults(mockResults);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    handleSearch(suggestion);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🔍 البحث المتقدم الذكي</h1>
          <p className="text-gray-600">
            بحث ذكي مدعوم بالذكاء الاصطناعي مع اقتراحات تفاعلية ومشاركة النتائج
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">🤖 الذكاء الاصطناعي</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">🔍 بحث فوري</span>
            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">🏆 Phase 2 - مكتمل</span>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="relative">
            <div className="flex items-center">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="ابحث عن المنتجات... (مثال: طوب، أسمنت، حديد)"
                  className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-right"
                />
                
                {/* AI Search Suggestions */}
                {showSuggestions && (
                  <AISearchSuggestions
                    searchQuery={searchQuery}
                    onSuggestionSelect={handleSuggestionSelect}
                    className="mt-2"
                  />
                )}
              </div>
              
              <button
                onClick={() => handleSearch(searchQuery)}
                className="mr-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                بحث
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Results Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">نتائج البحث</h2>
                  <p className="text-gray-600">تم العثور على {results.length} منتج</p>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* View Mode Toggle */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === 'grid' 
                          ? 'bg-white shadow text-green-600' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === 'list' 
                          ? 'bg-white shadow text-green-600' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Share Results */}
                  <SocialSharing
                    title={`نتائج البحث: ${searchQuery}`}
                    description={`تم العثور على ${results.length} منتج في منصة بنا`}
                    hashtags={['بحث_المنتجات', 'مواد_البناء']}
                    showBinnaWatermark={true}
                  />
                </div>
              </div>
            </div>

            {/* Results Grid/List */}
            <div className="p-6">
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23f3f4f6"/><text x="50%" y="50%" font-size="16" fill="%236b7280" text-anchor="middle" dy=".3em">صورة المنتج</text></svg>';
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                        <p className="text-2xl font-bold text-green-600 mb-2">{product.price} ريال</p>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>⭐ {product.rating}</span>
                          <span>{product.location}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{product.store}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {results.map((product) => (
                    <div key={product.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" fill="%23f3f4f6"/><text x="50%" y="50%" font-size="12" fill="%236b7280" text-anchor="middle" dy=".3em">صورة</text></svg>';
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                        <p className="text-gray-600">{product.store}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-2xl font-bold text-green-600">{product.price} ريال</span>
                          <span className="text-sm text-gray-500">⭐ {product.rating}</span>
                          <span className="text-sm text-gray-500">{product.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* BinnaHub Watermark */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                نتائج البحث مقدمة من <span className="font-semibold text-green-600">BinnaHub AI Search</span>
              </p>
            </div>
          </div>
        )}

        {/* No Results */}
        {searchQuery && results.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">لم نجد أي نتائج</h3>
            <p className="text-gray-600">جرب البحث بكلمات مختلفة أو استخدم الاقتراحات الذكية</p>
          </div>
        )}

        {/* BinnaHub Branding */}
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">
            البحث الذكي مدعوم من <span className="font-semibold text-green-600">BinnaHub AI Technology</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            تقنية متقدمة للبحث والاقتراحات الذكية - Phase 2 مكتمل
          </p>
        </div>
      </div>
    </div>
  );
}

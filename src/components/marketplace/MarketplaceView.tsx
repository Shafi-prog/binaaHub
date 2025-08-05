'use client';

import React, { useState, useEffect } from 'react';
import { useMarketplace } from './MarketplaceProvider';
import { ProductGrid } from './ProductGrid';
import { CategoryFilter } from './CategoryFilter';
import { ProductSearch } from './ProductSearch';
import { ShoppingCart } from './ShoppingCart';
import { useAuth } from '@/hooks/useAuth';

interface MarketplaceViewProps {
  showHeader?: boolean;
  className?: string;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({ 
  showHeader = true,
  className = ''
}) => {
  const { isProjectContext, projectId } = useMarketplace();
  const { user } = useAuth();
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/4">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
            <div className="md:w-3/4">
              <div className="h-12 bg-gray-200 rounded mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`container mx-auto p-4 ${className}`}>
      {showHeader && (
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {isProjectContext ? 'اختيار منتجات للمشروع' : 'المنتجات والخدمات'}
          </h1>
          
          {isProjectContext && user && <ShoppingCart />}
        </div>
      )}
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/4">
          <div className="sticky top-4">
            <CategoryFilter 
              onCategoryChange={setCategory} 
              selectedCategory={category} 
            />
          </div>
        </div>
        
        <div className="lg:w-3/4">
          <div className="mb-6">
            <ProductSearch 
              onSearch={setSearchQuery} 
              value={searchQuery}
              placeholder={isProjectContext ? 'البحث في منتجات المشروع...' : 'البحث في جميع المنتجات...'}
            />
          </div>
          
          <ProductGrid 
            category={category} 
            searchQuery={searchQuery}
            projectContext={isProjectContext}
            projectId={projectId}
          />
        </div>
      </div>
    </div>
  );
};

export default MarketplaceView;

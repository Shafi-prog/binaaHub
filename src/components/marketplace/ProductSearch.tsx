import React, { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface SearchFilters {
  priceRange: {
    min: number;
    max: number;
  };
  inStock: boolean;
  hasWarranty: boolean;
  stores: string[];
}

interface ProductSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters?: SearchFilters;
  onFiltersChange?: (filters: SearchFilters) => void;
  availableStores?: { id: string; name: string }[];
  showFilters?: boolean;
}

export const ProductSearch: React.FC<ProductSearchProps> = ({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  availableStores = [],
  showFilters = true,
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<SearchFilters>(
    filters || {
      priceRange: { min: 0, max: 100000 },
      inStock: false,
      hasWarranty: false,
      stores: [],
    }
  );

  useEffect(() => {
    if (filters) {
      setLocalFilters(filters);
    }
  }, [filters]);

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...localFilters, ...newFilters };
    setLocalFilters(updatedFilters);
    onFiltersChange?.(updatedFilters);
  };

  const clearFilters = () => {
    const defaultFilters: SearchFilters = {
      priceRange: { min: 0, max: 100000 },
      inStock: false,
      hasWarranty: false,
      stores: [],
    };
    setLocalFilters(defaultFilters);
    onFiltersChange?.(defaultFilters);
  };

  const activeFiltersCount = 
    (localFilters.inStock ? 1 : 0) +
    (localFilters.hasWarranty ? 1 : 0) +
    (localFilters.stores.length > 0 ? 1 : 0) +
    (localFilters.priceRange.min > 0 || localFilters.priceRange.max < 100000 ? 1 : 0);

  return (
    <div className="bg-white rounded-lg border p-4 mb-6">
      {/* Search Input */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="ابحث عن المنتجات..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
          <svg 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        {showFilters && (
          <Button
            variant="outline"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
            </svg>
            فلترة
            {activeFiltersCount > 0 && (
              <Badge variant="destructive" className="ml-1">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showFilters && showAdvancedFilters && (
        <div className="border-t pt-4 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">فلاتر متقدمة</h4>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                مسح الفلاتر
              </Button>
            )}
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium mb-2">نطاق السعر (ر.س)</label>
            <div className="flex gap-3 items-center">
              <Input
                type="number"
                placeholder="من"
                value={localFilters.priceRange.min || ''}
                onChange={(e) => handleFilterChange({
                  priceRange: { ...localFilters.priceRange, min: Number(e.target.value) || 0 }
                })}
                className="w-24"
              />
              <span>-</span>
              <Input
                type="number"
                placeholder="إلى"
                value={localFilters.priceRange.max || ''}
                onChange={(e) => handleFilterChange({
                  priceRange: { ...localFilters.priceRange, max: Number(e.target.value) || 100000 }
                })}
                className="w-24"
              />
            </div>
          </div>

          {/* Checkbox Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={localFilters.inStock}
                onChange={(e) => handleFilterChange({ inStock: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm">متوفر في المخزون فقط</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={localFilters.hasWarranty}
                onChange={(e) => handleFilterChange({ hasWarranty: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm">يتضمن ضمان</span>
            </label>
          </div>

          {/* Store Filter */}
          {availableStores.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">المتاجر</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                {availableStores.map((store) => (
                  <label key={store.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={localFilters.stores.includes(store.id)}
                      onChange={(e) => {
                        const newStores = e.target.checked
                          ? [...localFilters.stores, store.id]
                          : localFilters.stores.filter(id => id !== store.id);
                        handleFilterChange({ stores: newStores });
                      }}
                      className="rounded"
                    />
                    <span className="text-sm truncate">{store.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
          {localFilters.inStock && (
            <Badge variant="secondary" className="flex items-center gap-1">
              متوفر في المخزون
              <button onClick={() => handleFilterChange({ inStock: false })}>×</button>
            </Badge>
          )}
          {localFilters.hasWarranty && (
            <Badge variant="secondary" className="flex items-center gap-1">
              يتضمن ضمان
              <button onClick={() => handleFilterChange({ hasWarranty: false })}>×</button>
            </Badge>
          )}
          {(localFilters.priceRange.min > 0 || localFilters.priceRange.max < 100000) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {localFilters.priceRange.min} - {localFilters.priceRange.max} ر.س
              <button onClick={() => handleFilterChange({ priceRange: { min: 0, max: 100000 } })}>×</button>
            </Badge>
          )}
          {localFilters.stores.length > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {localFilters.stores.length} متجر
              <button onClick={() => handleFilterChange({ stores: [] })}>×</button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

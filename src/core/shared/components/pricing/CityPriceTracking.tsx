'use client';

// City Price Tracking Component
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/domains/shared/components/ui/card';
import { Button } from '@/domains/shared/components/ui/button';

interface CityPriceData {
  city: string;
  country: string;
  averagePrice: number;
  currency: string;
  changePercent: number;
  changeDirection: 'up' | 'down' | 'stable';
  lastUpdated: string;
  priceRange: {
    min: number;
    max: number;
  };
  marketTrend: 'bullish' | 'bearish' | 'stable';
}

interface CityPriceTrackingProps {
  category?: string;
  selectedCities?: string[];
  onCitySelect?: (cities: string[]) => void;
}

export function CityPriceTracking({ 
  category = 'real-estate', 
  selectedCities = [],
  onCitySelect 
}: CityPriceTrackingProps) {
  const [priceData, setPriceData] = useState<CityPriceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'city' | 'price' | 'change'>('city');
  const [filterBy, setFilterBy] = useState<'all' | 'bullish' | 'bearish' | 'stable'>('all');

  // Mock data for GCC cities
  const mockPriceData: CityPriceData[] = [
    {
      city: 'Dubai',
      country: 'UAE',
      averagePrice: 1200,
      currency: 'AED',
      changePercent: 5.2,
      changeDirection: 'up',
      lastUpdated: '2024-02-15T10:00:00Z',
      priceRange: { min: 800, max: 2500 },
      marketTrend: 'bullish'
    },
    {
      city: 'Abu Dhabi',
      country: 'UAE',
      averagePrice: 1100,
      currency: 'AED',
      changePercent: 3.1,
      changeDirection: 'up',
      lastUpdated: '2024-02-15T10:00:00Z',
      priceRange: { min: 700, max: 2200 },
      marketTrend: 'bullish'
    },
    {
      city: 'Kuwait City',
      country: 'Kuwait',
      averagePrice: 380,
      currency: 'KWD',
      changePercent: -1.5,
      changeDirection: 'down',
      lastUpdated: '2024-02-15T10:00:00Z',
      priceRange: { min: 250, max: 600 },
      marketTrend: 'bearish'
    },
    {
      city: 'Doha',
      country: 'Qatar',
      averagePrice: 4200,
      currency: 'QAR',
      changePercent: 2.8,
      changeDirection: 'up',
      lastUpdated: '2024-02-15T10:00:00Z',
      priceRange: { min: 3000, max: 7000 },
      marketTrend: 'stable'
    },
    {
      city: 'Riyadh',
      country: 'Saudi Arabia',
      averagePrice: 2800,
      currency: 'SAR',
      changePercent: 4.5,
      changeDirection: 'up',
      lastUpdated: '2024-02-15T10:00:00Z',
      priceRange: { min: 2000, max: 5000 },
      marketTrend: 'bullish'
    },
    {
      city: 'Manama',
      country: 'Bahrain',
      averagePrice: 420,
      currency: 'BHD',
      changePercent: 0.5,
      changeDirection: 'stable',
      lastUpdated: '2024-02-15T10:00:00Z',
      priceRange: { min: 300, max: 700 },
      marketTrend: 'stable'
    }
  ];

  useEffect(() => {
    loadPriceData();
  }, [category]);

  const loadPriceData = async () => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPriceData(mockPriceData);
    } catch (error) {
      console.error('Failed to load price data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCityToggle = (city: string) => {
    const newSelection = selectedCities.includes(city)
      ? selectedCities.filter(c => c !== city)
      : [...selectedCities, city];
    
    onCitySelect?.(newSelection);
  };

  const sortedData = [...priceData].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return b.averagePrice - a.averagePrice;
      case 'change':
        return Math.abs(b.changePercent) - Math.abs(a.changePercent);
      default:
        return a.city.localeCompare(b.city);
    }
  });

  const filteredData = sortedData.filter(item => {
    if (filterBy === 'all') return true;
    return item.marketTrend === filterBy;
  });

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getChangeColor = (direction: string) => {
    switch (direction) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'bullish': return '📈';
      case 'bearish': return '📉';
      default: return '➡️';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading price data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>GCC City Price Tracking</span>
          <Button onClick={loadPriceData} variant="outline" size="sm">
            Refresh
          </Button>
        </CardTitle>
        
        <div className="flex gap-4 mt-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1 border rounded"
          >
            <option value="city">Sort by City</option>
            <option value="price">Sort by Price</option>
            <option value="change">Sort by Change</option>
          </select>
          
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as any)}
            className="px-3 py-1 border rounded"
          >
            <option value="all">All Trends</option>
            <option value="bullish">Bullish</option>
            <option value="bearish">Bearish</option>
            <option value="stable">Stable</option>
          </select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {filteredData.map((cityData) => (
            <div
              key={cityData.city}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedCities.includes(cityData.city)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleCityToggle(cityData.city)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{cityData.city}</h3>
                    <span className="text-sm text-gray-500">{cityData.country}</span>
                    <span className="text-lg">{getTrendIcon(cityData.marketTrend)}</span>
                  </div>
                  
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Average Price:</span>
                      <div className="font-semibold">
                        {formatPrice(cityData.averagePrice, cityData.currency)}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-gray-500">Change:</span>
                      <div className={`font-semibold ${getChangeColor(cityData.changeDirection)}`}>
                        {cityData.changeDirection === 'up' ? '+' : cityData.changeDirection === 'down' ? '-' : ''}
                        {Math.abs(cityData.changePercent)}%
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-gray-500">Range:</span>
                      <div className="font-semibold text-xs">
                        {formatPrice(cityData.priceRange.min, cityData.currency)} - {formatPrice(cityData.priceRange.max, cityData.currency)}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-gray-500">Trend:</span>
                      <div className="font-semibold capitalize">
                        {cityData.marketTrend}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="ml-4">
                  <input
                    type="checkbox"
                    checked={selectedCities.includes(cityData.city)}
                    onChange={() => handleCityToggle(cityData.city)}
                    className="w-5 h-5"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No cities match the current filter criteria.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CityPriceTracking;

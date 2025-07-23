"use client"

import React, { useState, useEffect } from 'react';
import { Typography, EnhancedCard, Button } from '@/core/shared/components/ui/enhanced-components';
import { Search, MapPin, Star, Verified, ArrowRight } from 'lucide-react';

interface Store {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  location: string;
  verified: boolean;
  image: string;
  description: string;
  distance?: number;
}

interface StoreSearchProps {
  onSelect: (store: Store) => void;
  onCancel: () => void;
  selectedStore?: Store | null;
}

export default function StoreSearch({ onSelect, onCancel, selectedStore }: StoreSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [stores, setStores] = useState<Store[]>([]);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock store data - in real app, this would come from API
    const mockStores: Store[] = [
      {
        id: 'store-1',
        name: 'متجر الأدوات الصحية المتقدمة',
        category: 'أدوات صحية',
        rating: 4.8,
        reviews: 342,
        location: 'الرياض، حي الملز',
        verified: true,
        image: '/api/placeholder/100/100',
        description: 'متخصص في الأدوات الصحية عالية الجودة',
        distance: 2.5
      },
      {
        id: 'store-2',
        name: 'معرض التكييف المركزي',
        category: 'تكييف وتبريد',
        rating: 4.6,
        reviews: 189,
        location: 'الرياض، حي النخيل',
        verified: true,
        image: '/api/placeholder/100/100',
        description: 'أنظمة التكييف والتبريد المتطورة',
        distance: 3.2
      },
      {
        id: 'store-3',
        name: 'متجر العدد والأدوات',
        category: 'أدوات كهربائية',
        rating: 4.5,
        reviews: 267,
        location: 'الرياض، حي العليا',
        verified: false,
        image: '/api/placeholder/100/100',
        description: 'جميع أنواع العدد والأدوات الكهربائية',
        distance: 4.1
      },
      {
        id: 'store-4',
        name: 'متجر الإضاءة المتطورة',
        category: 'إضاءة',
        rating: 4.7,
        reviews: 156,
        location: 'الرياض، حي الورود',
        verified: true,
        image: '/api/placeholder/100/100',
        description: 'حلول الإضاءة الحديثة والذكية',
        distance: 1.8
      },
      {
        id: 'store-5',
        name: 'مركز مواد البناء الشامل',
        category: 'مواد بناء',
        rating: 4.4,
        reviews: 423,
        location: 'الرياض، حي الشفا',
        verified: true,
        image: '/api/placeholder/100/100',
        description: 'جميع مواد البناء والتشطيب',
        distance: 5.3
      }
    ];

    setStores(mockStores);
    setFilteredStores(mockStores);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredStores(stores);
    } else {
      const filtered = stores.filter(store =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStores(filtered);
    }
  }, [searchTerm, stores]);

  const handleStoreSelect = (store: Store) => {
    onSelect(store);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <EnhancedCard className="w-full max-w-2xl mx-4 p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">جاري تحميل المتاجر...</p>
          </div>
        </EnhancedCard>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <EnhancedCard className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <Typography variant="heading" size="2xl" weight="bold" className="text-gray-900">
              اختر المتجر
            </Typography>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث عن المتجر بالاسم أو الفئة أو الموقع..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {selectedStore && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Typography variant="body" size="sm" className="text-blue-800 mb-2">
                المتجر المحدد حالياً:
              </Typography>
              <div className="flex items-center gap-3">
                <img
                  src={selectedStore.image}
                  alt={selectedStore.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <Typography variant="subheading" size="lg" weight="semibold" className="text-blue-900">
                    {selectedStore.name}
                  </Typography>
                  <Typography variant="caption" size="sm" className="text-blue-700">
                    {selectedStore.category} • {selectedStore.location}
                  </Typography>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {filteredStores.map((store) => (
              <EnhancedCard 
                key={store.id} 
                className={`p-4 hover:shadow-md transition-shadow cursor-pointer border-2 ${
                  selectedStore?.id === store.id ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:border-gray-200'
                }`}
                onClick={() => handleStoreSelect(store)}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={store.image}
                    alt={store.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Typography variant="subheading" size="lg" weight="semibold" className="text-gray-900">
                        {store.name}
                      </Typography>
                      {store.verified && (
                        <Verified className="w-5 h-5 text-green-500" />
                      )}
                    </div>

                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {store.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{store.rating}</span>
                        <span className="text-sm text-gray-500">({store.reviews})</span>
                      </div>
                      {store.distance && (
                        <span className="text-sm text-gray-500">
                          {store.distance} كم
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <Typography variant="caption" size="sm" className="text-gray-600">
                        {store.location}
                      </Typography>
                    </div>

                    <Typography variant="caption" size="sm" className="text-gray-600">
                      {store.description}
                    </Typography>
                  </div>

                  <Button
                    variant={selectedStore?.id === store.id ? "primary" : "outline"}
                    className={`${
                      selectedStore?.id === store.id 
                        ? 'bg-blue-600 text-white' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                   onClick={() => alert('Button clicked')}>
                    {selectedStore?.id === store.id ? 'محدد' : 'اختر'}
                  </Button>
                </div>
              </EnhancedCard>
            ))}
          </div>

          {filteredStores.length === 0 && (
            <div className="text-center py-12">
              <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-600 mb-2">
                لم يتم العثور على متاجر
              </Typography>
              <Typography variant="body" size="lg" className="text-gray-500">
                جرب البحث بكلمات مختلفة أو تحقق من الكتابة
              </Typography>
            </div>
          )}
        </div>

        {selectedStore && (
          <div className="p-6 border-t bg-gray-50">
            <div className="flex gap-4">
              <Button
                onClick={() => onSelect(selectedStore)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
              >
                تأكيد اختيار المتجر
              </Button>
              <Button
                variant="outline"
                onClick={onCancel}
                className="px-8 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
              >
                إلغاء
              </Button>
            </div>
          </div>
        )}
      </EnhancedCard>
    </div>
  );
}

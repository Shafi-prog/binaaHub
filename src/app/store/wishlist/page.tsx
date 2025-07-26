'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Button } from '@/core/shared/components/ui/button';
import { 
  Heart, 
  ShoppingCart, 
  Eye, 
  Star,
  Filter,
  Grid,
  List,
  Search,
  Package,
  Trash2,
  Share2
} from 'lucide-react';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  inStock: boolean;
  discount?: number;
}

export default function WishlistPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    {
      id: '1',
      name: 'جهاز كمبيوتر محمول HP EliteBook',
      price: 2500,
      originalPrice: 3000,
      rating: 4.5,
      reviews: 124,
      image: '/placeholder-product.jpg',
      category: 'إلكترونيات',
      inStock: true,
      discount: 17
    },
    {
      id: '2',
      name: 'سماعات لاسلكية Sony WH-1000XM4',
      price: 450,
      rating: 4.8,
      reviews: 89,
      image: '/placeholder-product.jpg',
      category: 'إكسسوارات',
      inStock: true
    },
    {
      id: '3',
      name: 'كيبورد ميكانيكي Corsair K95',
      price: 280,
      originalPrice: 350,
      rating: 4.3,
      reviews: 56,
      image: '/placeholder-product.jpg',
      category: 'إكسسوارات',
      inStock: false,
      discount: 20
    },
    {
      id: '4',
      name: 'شاشة 4K Dell UltraSharp',
      price: 1200,
      rating: 4.6,
      reviews: 78,
      image: '/placeholder-product.jpg',
      category: 'شاشات',
      inStock: true
    },
    {
      id: '5',
      name: 'ماوس لوجيتك MX Master 3',
      price: 120,
      originalPrice: 150,
      rating: 4.7,
      reviews: 203,
      image: '/placeholder-product.jpg',
      category: 'إكسسوارات',
      inStock: true,
      discount: 20
    }
  ]);

  const categories = ['all', 'إلكترونيات', 'إكسسوارات', 'شاشات'];

  const removeFromWishlist = (id: string) => {
    setWishlistItems(items => items.filter(item => item.id !== id));
  };

  const filteredItems = wishlistItems.filter(item => 
    selectedCategory === 'all' || item.category === selectedCategory
  );

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const ProductCard = ({ item }: { item: WishlistItem }) => (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="relative mb-4">
          <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center mb-3">
            <Package className="h-12 w-12 text-gray-400" />
          </div>
          
          {item.discount && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
              -{item.discount}%
            </div>
          )}
          
          {!item.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
              <span className="text-white font-medium">غير متوفر</span>
            </div>
          )}

          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex flex-col gap-2">
              <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-white">
                <Eye className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-white">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-600">{item.category}</p>
          <h3 className="font-medium text-gray-900 line-clamp-2">{item.name}</h3>
          
          <div className="flex items-center gap-1">
            {renderStars(item.rating)}
            <span className="text-sm text-gray-600">({item.reviews})</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-blue-600">
              {item.price.toLocaleString()} ريال
            </span>
            {item.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {item.originalPrice.toLocaleString()} ريال
              </span>
            )}
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              className="flex-1"
              disabled={!item.inStock}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {item.inStock ? 'أضف للسلة' : 'غير متوفر'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeFromWishlist(item.id)}
              className="h-10 w-10 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Heart className="h-6 w-6 text-red-500" />
          <h1 className="text-2xl font-bold text-gray-900">قائمة المشتريات المرغوبة من الموردين</h1>
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
            {wishlistItems.length} منتج
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في قائمة المشتريات المرغوبة..."
              className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          
          <div className="flex items-center gap-1 border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8 p-0"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {wishlistItems.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Heart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">قائمة المشتريات المرغوبة فارغة</h3>
            <p className="text-gray-600 mb-6">ابدأ بإضافة المنتجات المرغوبة من الموردين</p>
            <Button>
              <Package className="h-4 w-4 mr-2" />
              تصفح المنتجات
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">تصنيف:</span>
              </div>
              <div className="flex gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category === 'all' ? 'الكل' : category}
                  </Button>
                ))}
              </div>
            </div>

            <div className="text-sm text-gray-600">
              {filteredItems.length} من {wishlistItems.length} منتج
            </div>
          </div>

          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {filteredItems.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-2">شارك قائمة أمنياتك</h3>
                <p className="text-gray-600 mb-4">دع الأصدقاء يعرفون ما تفضله</p>
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  مشاركة القائمة
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

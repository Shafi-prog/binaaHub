// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { StarIcon, PhoneIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

// Simple UI Components defined inline to avoid import issues
const Button = ({ children, className = '', variant = 'default', size = 'default', ...props }: any) => {
  const baseClasses = 'font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const variantClasses: Record<string, string> = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
  };
  const sizeClasses: Record<string, string> = {
    default: 'px-4 py-2 rounded-lg',
    sm: 'px-3 py-1.5 text-sm rounded'
  };
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.default} ${sizeClasses[size] || sizeClasses.default} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input 
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
      {...props} 
    />
  );
};

interface Store {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  reviewCount: number;
  phone: string;
  address: string;
  workingHours: string;
  image: string;
  products: Product[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  image: string;
  category: string;
  inStock: boolean;
}

const dummyStore: Store = {
  id: '1',
  name: 'مؤسسة البناء المتطور',
  description: 'متجر متخصص في مواد البناء والتشطيبات عالية الجودة مع خدمة توصيل سريع',
  category: 'materials',
  rating: 4.8,
  reviewCount: 156,
  phone: '+966-50-123-4567',
  address: 'حي النزهة، شارع الملك عبدالعزيز، الرياض',
  workingHours: 'السبت - الخميس: 8:00 ص - 10:00 م',
  image: '/api/placeholder/800/400',
  products: [
    {
      id: '1',
      name: 'أسمنت بورتلاندي',
      description: 'أسمنت عالي الجودة مناسب لجميع أعمال البناء',
      price: 25,
      unit: 'كيس 50 كيلو',
      image: '/api/placeholder/200/200',
      category: 'cement',
      inStock: true
    },
    {
      id: '2',
      name: 'طوب أحمر',
      description: 'طوب أحمر عالي الجودة للبناء والتشطيب',
      price: 0.5,
      unit: 'حبة',
      image: '/api/placeholder/200/200',
      category: 'bricks',
      inStock: true
    },
    {
      id: '3',
      name: 'حديد تسليح',
      description: 'حديد تسليح درجة 60 للخرسانة المسلحة',
      price: 3500,
      unit: 'طن',
      image: '/api/placeholder/200/200',
      category: 'steel',
      inStock: true
    },
    {
      id: '4',
      name: 'رمل أبيض',
      description: 'رمل أبيض نظيف للبناء والطلاء',
      price: 80,
      unit: 'متر مكعب',
      image: '/api/placeholder/200/200',
      category: 'sand',
      inStock: false
    }
  ]
};

export default function StoreDetailPage() {
  const params = useParams();
  const [store, setStore] = useState<Store | null>(null);
  const [cart, setCart] = useState<{[key: string]: number}>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStore(dummyStore);
      setLoading(false);
    }, 500);
  }, [params.id]);

  const addToCart = (productId: string) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const requestQuote = () => {
    // This will be implemented with the quote system
    alert('سيتم إضافة نظام طلب الأسعار قريباً');
  };

  const filteredProducts = store?.products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const cartTotal = Object.entries(cart).reduce((total, [productId, quantity]) => {
    const product = store?.products.find(p => p.id === productId);
    return total + (product ? product.price * quantity : 0);
  }, 0);

  const cartItemCount = Object.values(cart).reduce((total, quantity) => total + quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل تفاصيل المتجر...</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">متجر غير موجود</h2>
          <p className="text-gray-600 mb-4">المتجر المطلوب غير متوفر</p>
          <Button onClick={() => window.history.back()}>العودة للمتاجر</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Store Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <img
                src={store.image}
                alt={store.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-gray-900">{store.name}</h1>
              <p className="text-gray-600">{store.description}</p>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    i < Math.floor(store.rating) ? (
                      <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                    ) : (
                      <StarOutlineIcon key={i} className="h-5 w-5 text-gray-300" />
                    )
                  ))}
                </div>
                <span className="text-gray-600">({store.reviewCount} تقييم)</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <PhoneIcon className="h-5 w-5" />
                  <span>{store.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPinIcon className="h-5 w-5" />
                  <span>{store.address}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <ClockIcon className="h-5 w-5" />
                  <span>{store.workingHours}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1">اتصل بالمتجر</Button>
                <Button variant="outline" onClick={requestQuote}>
                  طلب أسعار
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">المنتجات المتوفرة</h2>
          {cartItemCount > 0 && (
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg">
              السلة: {cartItemCount} منتج - {cartTotal.toLocaleString()} ريال
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <Input
            placeholder="البحث في المنتجات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
          
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              size="sm"
            >
              جميع المنتجات
            </Button>
            {['cement', 'bricks', 'steel', 'sand'].map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                size="sm"
              >
                {category === 'cement' && 'أسمنت'}
                {category === 'bricks' && 'طوب'}
                {category === 'steel' && 'حديد'}
                {category === 'sand' && 'رمل'}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="p-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-3">{product.description}</p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl font-bold text-blue-600">
                  {product.price.toLocaleString()} ريال
                </span>
                <span className="text-sm text-gray-500">/ {product.unit}</span>
              </div>
              
              {product.inStock ? (
                <div className="space-y-2">
                  {cart[product.id] ? (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeFromCart(product.id)}
                      >
                        -
                      </Button>
                      <span className="px-3 py-1 bg-gray-100 rounded">
                        {cart[product.id]}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => addToCart(product.id)}
                      >
                        +
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => addToCart(product.id)}
                    >
                      إضافة للسلة
                    </Button>
                  )}
                </div>
              ) : (
                <Button variant="outline" disabled className="w-full">
                  غير متوفر
                </Button>
              )}
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">لا توجد منتجات تطابق البحث</p>
          </div>
        )}
      </div>

      {/* Floating Cart Summary */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 bg-white shadow-lg rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">السلة: {cartItemCount} منتج</p>
              <p className="text-blue-600 font-bold">{cartTotal.toLocaleString()} ريال</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCart({})}>
                إفراغ السلة
              </Button>
              <Button>
                إتمام الطلب
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

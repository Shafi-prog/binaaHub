'use client';

<<<<<<< HEAD
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
=======
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, LoadingSpinner, EmptyState } from '@/components/ui';
import { useCart } from '@/contexts/CartContext';
import { AddToCartButton } from '@/components/cart';
import { formatCurrency } from '@/lib/utils';
import {
  MapPin,
  Phone,
  Clock,
  Star,
  ShoppingCart,
  Filter,
  Grid3X3,
  List,
  Search,
  Verified,
  CreditCard,
  Truck,
  Store,
} from 'lucide-react';

interface Store {
  id: string;
  store_name: string;
  description: string | null;
  category: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  region: string | null;
  website: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  rating: number;
  total_reviews: number;
  is_verified: boolean;
  is_active: boolean;
  delivery_areas: string[] | null;
  working_hours: any;
  payment_methods: string[] | null;
  created_at: string;
  updated_at: string;
  map_url?: string | null;
>>>>>>> e0e83bc2e6a4c393009b329773f07bfad211af6b
}

interface Product {
  id: string;
<<<<<<< HEAD
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
=======
  store_id: string;
  name: string;
  description: string | null;
  barcode: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

type ViewMode = 'grid' | 'list';

export default function StorePage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.id as string;
  const supabase = createClientComponentClient();
  const { addItem, getItemQuantity } = useCart();

  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (storeId) {
      fetchStoreData();
    }
  }, [storeId]);

  useEffect(() => {
    // Filter products based on search query
    let filtered = products;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          (product.description && product.description.toLowerCase().includes(query)) ||
          (product.barcode && product.barcode.toLowerCase().includes(query))
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery]);

  const fetchStoreData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch store info
      const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .select('*')
        .eq('id', storeId)
        .eq('is_active', true)
        .single();

      if (storeError) {
        if (storeError.code === 'PGRST116') {
          setError('المتجر غير موجود أو غير متاح');
          return;
        }
        throw storeError;
      }

      setStore(storeData);

      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;

      setProducts(productsData || []);
    } catch (err) {
      console.error('Error fetching store data:', err);
      setError('حدث خطأ في تحميل بيانات المتجر');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem(product, 1, store?.store_name);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
>>>>>>> e0e83bc2e6a4c393009b329773f07bfad211af6b
      </div>
    );
  }

<<<<<<< HEAD
  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">متجر غير موجود</h2>
          <p className="text-gray-600 mb-4">المتجر المطلوب غير متوفر</p>
          <Button onClick={() => window.history.back()}>العودة للمتاجر</Button>
        </div>
=======
  if (error || !store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <EmptyState
          icon={<Store className="w-8 h-8" />}
          title="متجر غير موجود"
          description={error || 'لم يتم العثور على المتجر المطلوب'}
          actionLabel="العودة للمتاجر"
          onAction={() => router.push('/stores')}
        />
>>>>>>> e0e83bc2e6a4c393009b329773f07bfad211af6b
      </div>
    );
  }

  return (
<<<<<<< HEAD
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
=======
    <div className="min-h-screen bg-gray-50">
      {/* Store Header */}
      <div className="bg-white border-b">
        {/* Cover Image */}
        {store.cover_image_url && (
          <div className="h-48 md:h-64 w-full relative overflow-hidden">
            <img
              src={store.cover_image_url}
              alt={store.store_name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Store Logo */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-lg border-4 border-white shadow-lg overflow-hidden -mt-12 md:-mt-16">
                  {store.logo_url ? (
                    <img
                      src={store.logo_url}
                      alt={store.store_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <Store className="w-8 h-8 md:w-12 md:h-12 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* Store Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {store.store_name}
                      </h1>
                      {store.is_verified && <Verified className="w-6 h-6 text-blue-500" />}
                    </div>

                    {store.description && <p className="text-gray-600 mb-4">{store.description}</p>}

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      {store.rating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{store.rating.toFixed(1)}</span>
                          <span>({store.total_reviews} تقييم)</span>
                        </div>
                      )}

                      {store.category && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">التصنيف:</span>
                          <span>{store.category}</span>
                        </div>
                      )}

                      {store.city && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{store.city}</span>
                        </div>
                      )}

                      {store.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          <a href={`tel:${store.phone}`} className="text-blue-600 hover:underline">{store.phone}</a>
                          <a href={`https://wa.me/${store.phone.replace(/[^\d]/g, '')}`} target="_blank" rel="noopener" className="ml-2 text-green-600 hover:underline">واتساب</a>
                        </div>
                      )}
                    </div>

                    {/* Payment Methods & Delivery */}
                    <div className="flex flex-wrap gap-4 mt-4">
                      {store.payment_methods && store.payment_methods.length > 0 && (
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {store.payment_methods.join(', ')}
                          </span>
                        </div>
                      )}

                      {store.delivery_areas && store.delivery_areas.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            توصيل متاح في {store.delivery_areas.length} منطقة
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Store location (map or address) */}
          {store.map_url && (
            <div className="my-4">
              <iframe
                src={store.map_url}
                width="100%"
                height="250"
                style={{ border: 0, borderRadius: '12px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="موقع المتجر على الخريطة"
              />
            </div>
          )}
>>>>>>> e0e83bc2e6a4c393009b329773f07bfad211af6b
        </div>
      </div>

      {/* Products Section */}
<<<<<<< HEAD
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
=======
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="ابحث في المنتجات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${
                    viewMode === 'grid'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${
                    viewMode === 'list'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="w-5 h-5" />
                <span>الفلاتر</span>
              </button>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            {filteredProducts.length} منتج
            {searchQuery && ` من أصل ${products.length}`}
          </div>
        </div>{' '}
        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <EmptyState
            icon={<ShoppingCart className="w-8 h-8" />}
            title={searchQuery ? 'لا توجد منتجات مطابقة' : 'لا توجد منتجات'}
            description={
              searchQuery
                ? 'جرب تعديل كلمات البحث أو إزالة الفلاتر'
                : 'لم يضف هذا المتجر أي منتجات بعد'
            }
          />
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }
          >
            {' '}
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode={viewMode}
                store_name={store?.store_name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  viewMode: ViewMode;
  store_name?: string;
}

function ProductCard({ product, viewMode, store_name }: ProductCardProps) {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock <= 5 && product.stock > 0;

  if (viewMode === 'list') {
    return (
      <Card className="p-4">
        <div className="flex gap-4">
          {/* Product Image */}
          <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <ShoppingCart className="w-8 h-8" />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
            {product.description && (
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
            )}

            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-green-600">
                  {formatCurrency(product.price)}
                </span>
                {isLowStock && (
                  <p className="text-xs text-orange-600 mt-1">{product.stock} متبقي فقط</p>
                )}
                {isOutOfStock && <p className="text-xs text-red-600 mt-1">نفد المخزون</p>}
              </div>{' '}
              <AddToCartButton product={product} variant="default" className="px-4 py-2" />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <div className="aspect-square bg-gray-100 overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <ShoppingCart className="w-12 h-12" />
          </div>
        )}

        {/* Stock Badge */}
        {isOutOfStock && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            نفد المخزون
          </div>
        )}
        {isLowStock && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
            {product.stock} متبقي
>>>>>>> e0e83bc2e6a4c393009b329773f07bfad211af6b
          </div>
        )}
      </div>

<<<<<<< HEAD
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
=======
      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-green-600">{formatCurrency(product.price)}</span>{' '}
          <AddToCartButton product={product} variant="small" className="px-3 py-2 text-sm" />
        </div>
      </div>
    </Card>
>>>>>>> e0e83bc2e6a4c393009b329773f07bfad211af6b
  );
}

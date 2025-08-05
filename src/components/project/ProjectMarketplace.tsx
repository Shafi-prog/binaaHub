import React, { useState, useEffect } from 'react';
import { ProductCard } from '../components/marketplace/ProductCard';
import { CategoryFilter } from '../components/marketplace/CategoryFilter';
import { ProductSearch } from '../components/marketplace/ProductSearch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { toast } from '../components/ui/use-toast';

// Product category type
type Category = 'all' | 'building-materials' | 'fixtures' | 'furniture' | 'appliances' | 'lighting';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  storeName: string;
  storeId: string;
  category: Category;
  stock?: number;
  warranty?: {
    duration: number;
    type: 'years' | 'months';
  };
}

interface ProjectMarketplaceProps {
  projectId: string;
  phaseId?: string;
  onAddToProject?: (productId: string, quantity: number) => void;
  onClose?: () => void;
}

export const ProjectMarketplace: React.FC<ProjectMarketplaceProps> = ({
  projectId,
  phaseId,
  onAddToProject,
  onClose,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [selectedProducts, setSelectedProducts] = useState<Map<string, number>>(new Map());

  // Mock data for demonstration
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'بلاط سيراميك فاخر 60x60',
          description: 'بلاط سيراميك عالي الجودة مناسب للأرضيات والجدران، مقاوم للخدش والماء',
          price: 45,
          imageUrl: '/api/placeholder/300/200',
          storeName: 'متجر البناء الحديث',
          storeId: 'store1',
          category: 'building-materials',
          stock: 150,
          warranty: { duration: 2, type: 'years' }
        },
        {
          id: '2',
          name: 'دهان أكريليك داخلي',
          description: 'دهان أكريليك عالي الجودة للجدران الداخلية، متوفر بألوان متعددة',
          price: 85,
          imageUrl: '/api/placeholder/300/200',
          storeName: 'متجر الدهانات المتميزة',
          storeId: 'store2',
          category: 'building-materials',
          stock: 75,
          warranty: { duration: 6, type: 'months' }
        },
        {
          id: '3',
          name: 'حنفية مطبخ نحاسية',
          description: 'حنفية مطبخ من النحاس المطلي، تصميم عصري ومقاومة للصدأ',
          price: 180,
          imageUrl: '/api/placeholder/300/200',
          storeName: 'أدوات الحمام والمطبخ',
          storeId: 'store3',
          category: 'fixtures',
          stock: 42,
          warranty: { duration: 1, type: 'years' }
        },
        {
          id: '4',
          name: 'مصباح LED سقف دائري',
          description: 'مصباح LED للسقف بتصميم دائري أنيق، إضاءة ناعمة وموفرة للطاقة',
          price: 120,
          imageUrl: '/api/placeholder/300/200',
          storeName: 'متجر الإضاءة المتقدمة',
          storeId: 'store4',
          category: 'lighting',
          stock: 60,
          warranty: { duration: 2, type: 'years' }
        },
        {
          id: '5',
          name: 'خزانة ملابس خشبية',
          description: 'خزانة ملابس من الخشب الطبيعي بتصميم كلاسيكي، 3 أبواب مع أدراج',
          price: 1200,
          imageUrl: '/api/placeholder/300/200',
          storeName: 'أثاث المنزل العصري',
          storeId: 'store5',
          category: 'furniture',
          stock: 15,
          warranty: { duration: 3, type: 'years' }
        },
        {
          id: '6',
          name: 'مكيف هواء سبليت',
          description: 'مكيف هواء سبليت بقدرة 18000 وحدة، موفر للطاقة وهادئ التشغيل',
          price: 1850,
          imageUrl: '/api/placeholder/300/200',
          storeName: 'أجهزة التكييف والتبريد',
          storeId: 'store6',
          category: 'appliances',
          stock: 8,
          warranty: { duration: 2, type: 'years' }
        },
      ];

      setProducts(mockProducts);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Generate categories with counts
  const categories = [
    { id: 'all', name: 'جميع الفئات', count: products.length },
    { id: 'building-materials', name: 'مواد البناء', count: products.filter(p => p.category === 'building-materials').length },
    { id: 'fixtures', name: 'التركيبات', count: products.filter(p => p.category === 'fixtures').length },
    { id: 'lighting', name: 'الإضاءة', count: products.filter(p => p.category === 'lighting').length },
    { id: 'furniture', name: 'الأثاث', count: products.filter(p => p.category === 'furniture').length },
    { id: 'appliances', name: 'الأجهزة', count: products.filter(p => p.category === 'appliances').length },
  ];

  const handleAddToProject = (productId: string) => {
    const quantity = selectedProducts.get(productId) || 1;
    
    // Call the parent callback
    onAddToProject?.(productId, quantity);
    
    // Show success message
    const product = products.find(p => p.id === productId);
    toast({
      title: 'تم إضافة المنتج',
      description: `تم إضافة ${product?.name} إلى المشروع بنجاح`,
    });

    // Remove from selected products
    const newSelected = new Map(selectedProducts);
    newSelected.delete(productId);
    setSelectedProducts(newSelected);
  };

  const updateProductQuantity = (productId: string, quantity: number) => {
    const newSelected = new Map(selectedProducts);
    if (quantity > 0) {
      newSelected.set(productId, quantity);
    } else {
      newSelected.delete(productId);
    }
    setSelectedProducts(newSelected);
  };

  const getTotalSelectedItems = () => {
    return Array.from(selectedProducts.values()).reduce((sum, qty) => sum + qty, 0);
  };

  const getTotalSelectedValue = () => {
    return Array.from(selectedProducts.entries()).reduce((sum, [productId, qty]) => {
      const product = products.find(p => p.id === productId);
      return sum + (product ? product.price * qty : 0);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">إضافة منتجات للمشروع</h1>
              <p className="text-gray-600">رقم المشروع: {projectId}</p>
              {phaseId && <p className="text-gray-600">المرحلة: {phaseId}</p>}
            </div>
            
            {onClose && (
              <Button variant="outline" onClick={onClose}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                إغلاق
              </Button>
            )}
          </div>

          {/* Selection Summary */}
          {selectedProducts.size > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium">المنتجات المحددة: </span>
                  <Badge variant="secondary">{getTotalSelectedItems()} منتج</Badge>
                  <span className="mx-2">•</span>
                  <span className="font-medium">إجمالي القيمة: </span>
                  <span className="font-bold text-blue-600">{getTotalSelectedValue().toLocaleString()} ر.س</span>
                </div>
                <Button
                  onClick={() => {
                    selectedProducts.forEach((quantity, productId) => {
                      handleAddToProject(productId);
                    });
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  إضافة جميع المنتجات المحددة
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Search */}
        <ProductSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          showFilters={false}
        />

        {/* Category Filter */}
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={(category) => setActiveCategory(category as Category)}
        />

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="border rounded-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-300 rounded"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                    <div className="h-8 bg-gray-300 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="relative">
                <ProductCard
                  {...product}
                  onAddToProject={() => handleAddToProject(product.id)}
                  showAddToProject={true}
                />
                
                {/* Quantity Selector */}
                <div className="absolute top-2 right-2 bg-white rounded-md shadow-sm border p-1 flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 w-6 p-0"
                    onClick={() => updateProductQuantity(product.id, (selectedProducts.get(product.id) || 0) - 1)}
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    min="0"
                    value={selectedProducts.get(product.id) || 0}
                    onChange={(e) => updateProductQuantity(product.id, parseInt(e.target.value) || 0)}
                    className="h-6 w-12 text-xs text-center border-0 p-0"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 w-6 p-0"
                    onClick={() => updateProductQuantity(product.id, (selectedProducts.get(product.id) || 0) + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد منتجات</h3>
              <p className="text-gray-500">جرب البحث بكلمات مختلفة أو تصفح فئات أخرى</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

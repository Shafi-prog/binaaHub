import React, { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { LoadingSkeleton } from '../ui/LoadingComponents';
import { useMarketplace, Product } from './MarketplaceProvider';

interface ProductGridProps {
  category?: string;
  searchQuery?: string;
  projectContext?: boolean;
  projectId?: string;
  storeId?: string;
  emptyMessage?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  category = 'all',
  searchQuery = '',
  projectContext = false,
  projectId,
  storeId,
  emptyMessage = 'لا توجد منتجات متاحة',
}) => {
  const { addProductToSelection, isProjectContext } = useMarketplace();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data - Replace with actual Supabase call
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'أسمنت بورتلاندي',
      description: 'أسمنت عالي الجودة مناسب لجميع أنواع البناء',
      price: 45.50,
      category: 'cement',
      subcategory: 'portland',
      storeId: 'store1',
      storeName: 'مؤسسة البناء المتقدم',
      images: ['/api/placeholder/300/200'],
      specifications: {
        'الوزن': '50 كيلو',
        'النوع': 'بورتلاندي',
        'المقاومة': '42.5 MPa'
      },
      warranty: {
        duration: 2,
        type: 'years',
        details: 'ضمان الجودة لمدة سنتين'
      },
      stock: 100,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'حديد تسليح 16mm',
      description: 'حديد تسليح عالي المقاومة',
      price: 3200.00,
      category: 'steel',
      subcategory: 'rebar',
      storeId: 'store2',
      storeName: 'مصنع الحديد الوطني',
      images: ['/api/placeholder/300/200'],
      specifications: {
        'القطر': '16 مم',
        'الطول': '12 متر',
        'المقاومة': '420 MPa'
      },
      warranty: {
        duration: 5,
        type: 'years',
        details: 'ضمان ضد الصدأ لمدة 5 سنوات'
      },
      stock: 50,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let filteredProducts = mockProducts;
      
      // Filter by store if storeId provided
      if (storeId) {
        filteredProducts = filteredProducts.filter(p => p.storeId === storeId);
      }
      
      // Filter by category
      if (category && category !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === category);
      }
      
      // Filter by search query
      if (searchQuery) {
        filteredProducts = filteredProducts.filter(p =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.storeName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      setProducts(filteredProducts);
      setLoading(false);
    };

    fetchProducts();
  }, [category, searchQuery, storeId]);

  const handleAddToProject = (product: Product, quantity: number = 1) => {
    if (isProjectContext) {
      addProductToSelection(product, quantity);
    }
  };
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="border rounded-lg overflow-hidden">
            <LoadingSkeleton height="h-48" />
            <div className="p-4 space-y-3">
              <LoadingSkeleton height="h-4" />
              <LoadingSkeleton height="h-3" width="w-1/2" />
              <LoadingSkeleton height="h-3" />
              <div className="flex justify-between items-center">
                <LoadingSkeleton height="h-4" width="w-20" />
                <LoadingSkeleton height="h-8" width="w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{emptyMessage}</h3>
        <p className="text-gray-500">جرب البحث بكلمات مختلفة أو تصفح فئات أخرى</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          description={product.description}
          price={product.price}
          imageUrl={product.images[0]}
          storeName={product.storeName}
          storeId={product.storeId}
          category={product.category}
          stock={product.stock}
          warranty={product.warranty}
          onAddToProject={(productId) => handleAddToProject(product)}
          onViewStore={(storeId) => console.log('View store:', storeId)}
          onViewProduct={(productId) => console.log('View product:', productId)}
          showAddToProject={isProjectContext}
        />
      ))}
    </div>
  );
};

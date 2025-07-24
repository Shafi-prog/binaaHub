'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Package, Search, Filter, Edit, Trash2, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Button } from '@/core/shared/components/ui/button';
import { Input } from '@/core/shared/components/ui/input';
import { Badge } from '@/core/shared/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/core/shared/components/ui/table';

export const dynamic = 'force-dynamic';

interface ConstructionProduct {
  id: string;
  name_ar: string;
  name_en?: string;
  category: string;
  price: number;
  unit: string;
  stock: number;
  barcode?: string;
  description?: string;
  status: 'active' | 'inactive';
}

interface ConstructionCategory {
  id: string;
  name_ar: string;
  name_en?: string;
  description?: string;
}

// Mock data
const mockCategories: ConstructionCategory[] = [
  { id: 'cat_1', name_ar: 'أسمنت ومواد البناء', name_en: 'Cement & Building Materials' },
  { id: 'cat_2', name_ar: 'الحديد والصلب', name_en: 'Iron & Steel' },
  { id: 'cat_3', name_ar: 'الأدوات والمعدات', name_en: 'Tools & Equipment' },
  { id: 'cat_4', name_ar: 'مواد العزل', name_en: 'Insulation Materials' }
];

const mockProducts: ConstructionProduct[] = [
  {
    id: 'prod_1',
    name_ar: 'أسمنت بورتلاند',
    name_en: 'Portland Cement',
    category: 'cat_1',
    price: 25.50,
    unit: 'كيس 50 كيلو',
    stock: 150,
    barcode: '123456789012',
    status: 'active'
  },
  {
    id: 'prod_2',
    name_ar: 'حديد تسليح 12 مم',
    name_en: 'Rebar 12mm',
    category: 'cat_2',
    price: 3.75,
    unit: 'متر',
    stock: 500,
    barcode: '123456789013',
    status: 'active'
  },
  {
    id: 'prod_3',
    name_ar: 'مثقاب كهربائي',
    name_en: 'Electric Drill',
    category: 'cat_3',
    price: 125.00,
    unit: 'قطعة',
    stock: 25,
    barcode: '123456789014',
    status: 'active'
  }
];

export default function ConstructionProductsPage() {
  const [products] = useState<ConstructionProduct[]>(mockProducts);
  const [categories] = useState<ConstructionCategory[]>(mockCategories);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch = product.name_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (product.name_en && product.name_en.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name_ar || 'غير محدد';
  };

  const totalStats = useMemo(() => {
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const lowStock = products.filter(p => p.stock < 50).length;
    
    return { totalProducts, totalStock, totalValue, lowStock };
  }, [products]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              رجوع
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">منتجات البناء والتشييد</h1>
              <p className="text-gray-600">إدارة منتجات مواد البناء والتشييد</p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              إضافة منتج جديد
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">إجمالي المنتجات</p>
                  <p className="text-2xl font-bold">{totalStats.totalProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-green-600" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">إجمالي المخزون</p>
                  <p className="text-2xl font-bold">{totalStats.totalStock.toLocaleString('ar-SA')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-purple-600" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">قيمة المخزون</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalStats.totalValue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-red-600" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">مخزون منخفض</p>
                  <p className="text-2xl font-bold">{totalStats.lowStock}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="البحث في المنتجات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-48 h-10 px-3 border border-gray-300 rounded-md"
              >
                <option value="all">جميع الفئات</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name_ar}
                  </option>
                ))}
              </select>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                تصدير
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد منتجات</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'لا توجد منتجات تطابق معايير البحث'
                    : 'ابدأ بإضافة منتجات البناء والتشييد'
                  }
                </p>
                <Button>
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة منتج
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المنتج</TableHead>
                    <TableHead>الفئة</TableHead>
                    <TableHead>السعر</TableHead>
                    <TableHead>الوحدة</TableHead>
                    <TableHead>المخزون</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.name_ar}</div>
                          {product.name_en && (
                            <div className="text-sm text-gray-500">{product.name_en}</div>
                          )}
                          {product.barcode && (
                            <div className="text-xs text-gray-400">#{product.barcode}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{getCategoryName(product.category)}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{formatCurrency(product.price)}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{product.unit}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${product.stock < 50 ? 'text-red-600' : 'text-green-600'}`}>
                            {product.stock.toLocaleString('ar-SA')}
                          </span>
                          {product.stock < 50 && (
                            <Badge variant="destructive" className="text-xs">منخفض</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {product.status === 'active' ? 'نشط' : 'غير نشط'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

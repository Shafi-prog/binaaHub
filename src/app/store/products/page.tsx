'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/core/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Badge } from '@/core/shared/components/ui/badge';
import { Input } from '@/core/shared/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/core/shared/components/ui/table';
import { Plus, Search, Package, Eye, Edit, Trash2, ShoppingCart, DollarSign, Layers } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  price: number;
  cost: number;
  stock_quantity: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  description: string;
  unit: string;
  supplier: string;
  created_at: string;
  last_updated: string;
}

// Mock data for products
const mockProducts: Product[] = [
  {
    id: 'prod_1',
    name: 'أسمنت بورتلاندي',
    category: 'إسمنت ومواد لاصقة',
    sku: 'CEM-001',
    price: 25.50,
    cost: 22.00,
    stock_quantity: 150,
    status: 'active',
    description: 'أسمنت بورتلاندي عادي 50 كيلو',
    unit: 'كيس',
    supplier: 'مصنع أسمنت اليمامة',
    created_at: '2024-01-15',
    last_updated: '2024-03-10'
  },
  {
    id: 'prod_2',
    name: 'حديد تسليح 12 ملم',
    category: 'حديد ومعادن',
    sku: 'REB-012',
    price: 3200.00,
    cost: 2800.00,
    stock_quantity: 25,
    status: 'active',
    description: 'حديد تسليح قطر 12 ملم - طن',
    unit: 'طن',
    supplier: 'مصنع حديد الخليج',
    created_at: '2024-01-20',
    last_updated: '2024-03-12'
  },
  {
    id: 'prod_3',
    name: 'رمل أصفر مغسول',
    category: 'مواد خام',
    sku: 'SND-001',
    price: 45.00,
    cost: 35.00,
    stock_quantity: 0,
    status: 'out_of_stock',
    description: 'رمل أصفر مغسول للبناء',
    unit: 'متر مكعب',
    supplier: 'مقالع الرياض',
    created_at: '2024-02-01',
    last_updated: '2024-03-14'
  }
];

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredProducts = useMemo(() => {
    return mockProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const productStats = useMemo(() => {
    return {
      totalProducts: mockProducts.length,
      activeProducts: mockProducts.filter(p => p.status === 'active').length,
      outOfStock: mockProducts.filter(p => p.status === 'out_of_stock').length,
      totalValue: mockProducts.reduce((acc, p) => acc + (p.price * p.stock_quantity), 0)
    };
  }, []);

  const getStatusColor = (status: Product['status']) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      out_of_stock: 'bg-red-100 text-red-800',
    };
    return colors[status];
  };

  const getStatusText = (status: Product['status']) => {
    const statusText = {
      active: 'نشط',
      inactive: 'غير نشط',
      out_of_stock: 'نفذت الكمية',
    };
    return statusText[status];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المنتجات</h1>
          <p className="text-gray-600">إدارة شاملة لمنتجات المتجر والمخزون</p>
        </div>
        <div className="flex gap-3">
          <Link href="/store/products/create">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              إضافة منتج جديد
            </Button>
          </Link>
          <Link href="/store/products/import">
            <Button variant="outline" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              استيراد منتجات
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي المنتجات</p>
                <p className="text-2xl font-bold">{productStats.totalProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-green-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">منتجات نشطة</p>
                <p className="text-2xl font-bold">{productStats.activeProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Layers className="h-8 w-8 text-red-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">نفذت الكمية</p>
                <p className="text-2xl font-bold">{productStats.outOfStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">قيمة المخزون</p>
                <p className="text-2xl font-bold">{formatCurrency(productStats.totalValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>البحث والتصفية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="البحث في المنتجات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">جميع الحالات</option>
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
              <option value="out_of_stock">نفدت الكمية</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة المنتجات ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد منتجات</h3>
              <p className="mt-1 text-sm text-gray-500">ابدأ بإضافة منتج جديد</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المنتج</TableHead>
                  <TableHead>رمز المنتج</TableHead>
                  <TableHead>الفئة</TableHead>
                  <TableHead>السعر</TableHead>
                  <TableHead>المخزون</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>آخر تحديث</TableHead>
                  <TableHead>العمليات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>
                      <span className={`${product.stock_quantity <= 10 ? 'text-red-600' : 'text-gray-900'}`}>
                        {product.stock_quantity} {product.unit}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(product.status)}>
                        {getStatusText(product.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(product.last_updated)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
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
  );
}

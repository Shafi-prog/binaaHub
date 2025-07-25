'use client';

import { useState } from 'react';
import { Button } from '@/core/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Badge } from '@/core/shared/components/ui/badge';
import { Input } from '@/core/shared/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/core/shared/components/ui/table';
import { Plus, Search, Building, Phone, Mail, MapPin, Package, DollarSign } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Supplier {
  id: string;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  status: 'active' | 'inactive';
  products_count: number;
  total_orders: number;
  rating: number;
}

// Mock data for suppliers
const mockSuppliers: Supplier[] = [
  {
    id: 'sup_1',
    name: 'مصنع أسمنت اليمامة',
    contact_person: 'محمد أحمد الخليل',
    email: 'info@yamama-cement.com',
    phone: '+966112345678',
    address: 'المنطقة الصناعية الثالثة',
    city: 'الرياض',
    status: 'active',
    products_count: 15,
    total_orders: 45,
    rating: 4.8
  },
  {
    id: 'sup_2',
    name: 'مصنع حديد الخليج',
    contact_person: 'عبدالرحمن السالم',
    email: 'sales@gulf-steel.com',
    phone: '+966133456789',
    address: 'المنطقة الصناعية الثانية',
    city: 'الدمام',
    status: 'active',
    products_count: 25,
    total_orders: 78,
    rating: 4.6
  },
  {
    id: 'sup_3',
    name: 'مقالع الرياض للرمل',
    contact_person: 'سعد محمد العتيبي',
    email: 'info@riyadh-quarries.com',
    phone: '+966501234567',
    address: 'طريق الدرعية',
    city: 'الرياض',
    status: 'active',
    products_count: 8,
    total_orders: 23,
    rating: 4.2
  }
];

export default function SuppliersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredSuppliers = mockSuppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         supplier.contact_person.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || supplier.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const supplierStats = {
    totalSuppliers: mockSuppliers.length,
    activeSuppliers: mockSuppliers.filter(s => s.status === 'active').length,
    totalProducts: mockSuppliers.reduce((acc, s) => acc + s.products_count, 0),
    totalOrders: mockSuppliers.reduce((acc, s) => acc + s.total_orders, 0)
  };

  const getStatusColor = (status: Supplier['status']) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: Supplier['status']) => {
    return status === 'active' ? 'نشط' : 'غير نشط';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الموردين</h1>
          <p className="text-gray-600">إدارة قاعدة بيانات الموردين والشركاء التجاريين</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          إضافة مورد جديد
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-blue-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي الموردين</p>
                <p className="text-2xl font-bold">{supplierStats.totalSuppliers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-green-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">موردون نشطون</p>
                <p className="text-2xl font-bold">{supplierStats.activeSuppliers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-purple-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي المنتجات</p>
                <p className="text-2xl font-bold">{supplierStats.totalProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-yellow-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي الطلبات</p>
                <p className="text-2xl font-bold">{supplierStats.totalOrders}</p>
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
                  placeholder="البحث في الموردين..."
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
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Suppliers Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الموردين ({filteredSuppliers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSuppliers.length === 0 ? (
            <div className="text-center py-8">
              <Building className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد موردين</h3>
              <p className="mt-1 text-sm text-gray-500">ابدأ بإضافة مورد جديد</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المورد</TableHead>
                  <TableHead>الشخص المسؤول</TableHead>
                  <TableHead>معلومات الاتصال</TableHead>
                  <TableHead>العنوان</TableHead>
                  <TableHead>عدد المنتجات</TableHead>
                  <TableHead>إجمالي الطلبات</TableHead>
                  <TableHead>التقييم</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>العمليات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{supplier.name}</p>
                        <p className="text-sm text-gray-500">#{supplier.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>{supplier.contact_person}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span className="text-xs">{supplier.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span className="text-xs">{supplier.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <div className="text-sm">
                          <p>{supplier.address}</p>
                          <p className="text-gray-500">{supplier.city}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{supplier.products_count} منتج</TableCell>
                    <TableCell>{supplier.total_orders} طلب</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-1">★</span>
                        <span>{supplier.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(supplier.status)}>
                        {getStatusText(supplier.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          عرض
                        </Button>
                        <Button variant="ghost" size="sm">
                          تعديل
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

'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/core/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Badge } from '@/core/shared/components/ui/badge';
import { Input } from '@/core/shared/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/core/shared/components/ui/table';
import { Plus, Search, Users, Eye, Edit, Phone, Mail, MapPin, DollarSign } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  status: 'active' | 'inactive' | 'vip';
  total_orders: number;
  total_spent: number;
  last_order_date?: string;
  created_at: string;
}

// Mock data for customers
const mockCustomers: Customer[] = [
  {
    id: 'cust_1',
    name: 'أحمد محمد علي',
    email: 'ahmed.ali@email.com',
    phone: '+966501234567',
    address: 'شارع الملك فهد، حي النزهة',
    city: 'الرياض',
    status: 'vip',
    total_orders: 12,
    total_spent: 15420,
    last_order_date: '2024-03-15',
    created_at: '2023-08-15'
  },
  {
    id: 'cust_2',
    name: 'فاطمة أحمد السالم',
    email: 'fatima.salem@email.com',
    phone: '+966512345678',
    address: 'شارع الأمير سلطان، حي الصفا',
    city: 'جدة',
    status: 'active',
    total_orders: 5,
    total_spent: 3240,
    last_order_date: '2024-03-14',
    created_at: '2024-01-20'
  },
  {
    id: 'cust_3',
    name: 'محمد عبدالله الشمري',
    email: 'mohammed.shamari@email.com',
    phone: '+966523456789',
    address: 'شارع الخليج، حي الفيصلية',
    city: 'الدمام',
    status: 'active',
    total_orders: 3,
    total_spent: 1890,
    last_order_date: '2024-03-12',
    created_at: '2024-02-10'
  }
];

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredCustomers = useMemo(() => {
    return mockCustomers.filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           customer.phone.includes(searchQuery);
      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const customerStats = useMemo(() => {
    return {
      totalCustomers: mockCustomers.length,
      activeCustomers: mockCustomers.filter(c => c.status === 'active').length,
      vipCustomers: mockCustomers.filter(c => c.status === 'vip').length,
      totalRevenue: mockCustomers.reduce((acc, c) => acc + c.total_spent, 0)
    };
  }, []);

  const getStatusColor = (status: Customer['status']) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      vip: 'bg-purple-100 text-purple-800',
    };
    return colors[status];
  };

  const getStatusText = (status: Customer['status']) => {
    const statusText = {
      active: 'نشط',
      inactive: 'غير نشط',
      vip: 'عميل مميز',
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
          <h1 className="text-2xl font-bold text-gray-900">إدارة العملاء</h1>
          <p className="text-gray-600">إدارة قاعدة بيانات العملاء والمتابعة</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          إضافة عميل جديد
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي العملاء</p>
                <p className="text-2xl font-bold">{customerStats.totalCustomers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">عملاء نشطون</p>
                <p className="text-2xl font-bold">{customerStats.activeCustomers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">عملاء مميزون</p>
                <p className="text-2xl font-bold">{customerStats.vipCustomers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-yellow-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي المبيعات</p>
                <p className="text-2xl font-bold">{formatCurrency(customerStats.totalRevenue)}</p>
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
                  placeholder="البحث في العملاء..."
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
              <option value="vip">عميل مميز</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة العملاء ({filteredCustomers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد عملاء</h3>
              <p className="mt-1 text-sm text-gray-500">ابدأ بإضافة عميل جديد</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>العميل</TableHead>
                  <TableHead>معلومات الاتصال</TableHead>
                  <TableHead>العنوان</TableHead>
                  <TableHead>عدد الطلبات</TableHead>
                  <TableHead>إجمالي المشتريات</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>آخر طلب</TableHead>
                  <TableHead>العمليات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-gray-500">#{customer.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span className="text-xs">{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span className="text-xs">{customer.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <div className="text-sm">
                          <p>{customer.address}</p>
                          <p className="text-gray-500">{customer.city}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{customer.total_orders} طلب</TableCell>
                    <TableCell>{formatCurrency(customer.total_spent)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(customer.status)}>
                        {getStatusText(customer.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {customer.last_order_date ? formatDate(customer.last_order_date) : 'لا يوجد'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
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


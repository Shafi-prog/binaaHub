'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/core/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Badge } from '@/core/shared/components/ui/badge';
import { Input } from '@/core/shared/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/core/shared/components/ui/table';
import { Plus, Search, Users, Phone, Mail, MapPin, Eye, Edit, Trash2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  total_orders: number;
  total_spent: number;
  status: 'active' | 'inactive';
  last_order_date: string;
  customer_group: string;
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
    total_orders: 15,
    total_spent: 25600,
    status: 'active',
    last_order_date: '2024-03-15',
    customer_group: 'عملاء VIP',
    created_at: '2023-06-10'
  },
  {
    id: 'cust_2',
    name: 'فاطمة أحمد السالم',
    email: 'fatima.salem@email.com',
    phone: '+966502345678',
    address: 'طريق العليا، حي العليا',
    city: 'الرياض',
    total_orders: 8,
    total_spent: 12400,
    status: 'active',
    last_order_date: '2024-03-12',
    customer_group: 'عملاء الجملة',
    created_at: '2023-08-22'
  },
  {
    id: 'cust_3',
    name: 'خالد عبدالله المطيري',
    email: 'khalid.mutairi@email.com',
    phone: '+966503456789',
    address: 'شارع التحلية، حي السليمانية',
    city: 'الرياض',
    total_orders: 22,
    total_spent: 45300,
    status: 'active',
    last_order_date: '2024-03-14',
    customer_group: 'عملاء VIP',
    created_at: '2023-04-15'
  },
  {
    id: 'cust_4',
    name: 'نورا سعد الغامدي',
    email: 'nora.ghamdi@email.com',
    phone: '+966504567890',
    address: 'طريق الدمام، حي الصحافة',
    city: 'الرياض',
    total_orders: 5,
    total_spent: 8900,
    status: 'active',
    last_order_date: '2024-03-10',
    customer_group: 'العملاء الجدد',
    created_at: '2024-01-08'
  }
];

export default function CustomersList() {
  const [customers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customers, searchTerm]);

  const customerStats = useMemo(() => {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.status === 'active').length;
    const totalRevenue = customers.reduce((sum, c) => sum + c.total_spent, 0);
    const totalOrders = customers.reduce((sum, c) => sum + c.total_orders, 0);
    
    return { totalCustomers, activeCustomers, totalRevenue, totalOrders };
  }, [customers]);

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
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
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
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
                  <p className="text-sm font-medium text-gray-600">العملاء النشطون</p>
                  <p className="text-2xl font-bold">{customerStats.activeCustomers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-purple-600" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">إجمالي الإيرادات</p>
                  <p className="text-2xl font-bold">{formatCurrency(customerStats.totalRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Phone className="h-8 w-8 text-orange-600" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">إجمالي الطلبات</p>
                  <p className="text-2xl font-bold">{customerStats.totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="البحث في العملاء..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد عملاء</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm 
                    ? 'لا توجد عملاء تطابق معايير البحث'
                    : 'ابدأ بإضافة عملاء جدد'
                  }
                </p>
                <Button>
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة عميل
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم العميل</TableHead>
                    <TableHead>الاتصال</TableHead>
                    <TableHead>العنوان</TableHead>
                    <TableHead>مجموعة العميل</TableHead>
                    <TableHead>الطلبات</TableHead>
                    <TableHead>المبلغ المنفق</TableHead>
                    <TableHead>آخر طلب</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-gray-600">عضو منذ {formatDate(customer.created_at)}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 ml-1 text-gray-400" />
                            {customer.email}
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 ml-1 text-gray-400" />
                            {customer.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{customer.address}</div>
                          <div className="text-gray-600">{customer.city}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{customer.customer_group}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{customer.total_orders}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-green-600">
                          {formatCurrency(customer.total_spent)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatDate(customer.last_order_date)}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {customer.status === 'active' ? 'نشط' : 'غير نشط'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
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
    </div>
  );
}


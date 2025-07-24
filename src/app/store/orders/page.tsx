'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/core/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Badge } from '@/core/shared/components/ui/badge';
import { Input } from '@/core/shared/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/core/shared/components/ui/table';
import { Plus, Search, ShoppingCart, Eye, Edit, Truck, DollarSign, Package, Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  items_count: number;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  created_at: string;
  delivery_date?: string;
  shipping_address: string;
}

// Mock data for orders
const mockOrders: Order[] = [
  {
    id: 'order_1',
    order_number: 'ORD-2024-001',
    customer_name: 'أحمد محمد علي',
    customer_email: 'ahmed.ali@email.com',
    status: 'processing',
    total_amount: 2580,
    items_count: 3,
    payment_status: 'paid',
    created_at: '2024-03-15T10:30:00',
    delivery_date: '2024-03-18',
    shipping_address: 'الرياض، حي النزهة، شارع الملك فهد'
  },
  {
    id: 'order_2',
    order_number: 'ORD-2024-002',
    customer_name: 'فاطمة أحمد السالم',
    customer_email: 'fatima.salem@email.com',
    status: 'shipped',
    total_amount: 1240,
    items_count: 2,
    payment_status: 'paid',
    created_at: '2024-03-14T14:15:00',
    delivery_date: '2024-03-17',
    shipping_address: 'الرياض، حي العليا، طريق العليا'
  },
  {
    id: 'order_3',
    order_number: 'ORD-2024-003',
    customer_name: 'خالد عبدالله المطيري',
    customer_email: 'khalid.mutairi@email.com',
    status: 'delivered',
    total_amount: 4530,
    items_count: 5,
    payment_status: 'paid',
    created_at: '2024-03-12T09:45:00',
    delivery_date: '2024-03-15',
    shipping_address: 'الرياض، حي السليمانية، شارع التحلية'
  },
  {
    id: 'order_4',
    order_number: 'ORD-2024-004',
    customer_name: 'نورا سعد الغامدي',
    customer_email: 'nora.ghamdi@email.com',
    status: 'pending',
    total_amount: 890,
    items_count: 1,
    payment_status: 'pending',
    created_at: '2024-03-16T16:20:00',
    shipping_address: 'الرياض، حي الصحافة، طريق الدمام'
  }
];

export default function OrderList() {
  const [orders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = useMemo(() => {
    return orders.filter(order =>
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [orders, searchTerm]);

  const orderStats = useMemo(() => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.total_amount, 0);
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
    
    return { totalOrders, pendingOrders, totalRevenue, deliveredOrders };
  }, [orders]);

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status];
  };

  const getStatusText = (status: Order['status']) => {
    const statusText = {
      pending: 'في الانتظار',
      processing: 'قيد المعالجة',
      shipped: 'تم الشحن',
      delivered: 'تم التسليم',
      cancelled: 'ملغي',
    };
    return statusText[status];
  };

  const getPaymentStatusColor = (status: Order['payment_status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
    };
    return colors[status];
  };

  const getPaymentStatusText = (status: Order['payment_status']) => {
    const statusText = {
      pending: 'في الانتظار',
      paid: 'مدفوع',
      failed: 'فشل',
      refunded: 'مسترد',
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
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">إدارة الطلبات</h1>
              <p className="text-gray-600">متابعة وإدارة طلبات العملاء</p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              طلب جديد
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
                <ShoppingCart className="h-8 w-8 text-blue-600" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">إجمالي الطلبات</p>
                  <p className="text-2xl font-bold">{orderStats.totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-yellow-600" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">طلبات معلقة</p>
                  <p className="text-2xl font-bold">{orderStats.pendingOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">إجمالي الإيرادات</p>
                  <p className="text-2xl font-bold">{formatCurrency(orderStats.totalRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Truck className="h-8 w-8 text-purple-600" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">طلبات مسلمة</p>
                  <p className="text-2xl font-bold">{orderStats.deliveredOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="البحث في الطلبات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد طلبات</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm 
                    ? 'لا توجد طلبات تطابق معايير البحث'
                    : 'لا توجد طلبات حتى الآن'
                  }
                </p>
                <Button>
                  <Plus className="h-4 w-4 ml-2" />
                  طلب جديد
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>رقم الطلب</TableHead>
                    <TableHead>العميل</TableHead>
                    <TableHead>المبلغ</TableHead>
                    <TableHead>عدد المنتجات</TableHead>
                    <TableHead>حالة الطلب</TableHead>
                    <TableHead>حالة الدفع</TableHead>
                    <TableHead>تاريخ الطلب</TableHead>
                    <TableHead>التسليم</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="font-medium">{order.order_number}</div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customer_name}</div>
                          <div className="text-sm text-gray-600">{order.customer_email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-green-600">
                          {formatCurrency(order.total_amount)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Package className="h-4 w-4 ml-1 text-gray-400" />
                          {order.items_count}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusText(order.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPaymentStatusColor(order.payment_status)}>
                          {getPaymentStatusText(order.payment_status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatDate(order.created_at)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {order.delivery_date ? formatDate(order.delivery_date) : 'غير محدد'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Truck className="h-4 w-4" />
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

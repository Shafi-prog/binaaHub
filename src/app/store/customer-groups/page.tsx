'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/core/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Badge } from '@/core/shared/components/ui/badge';
import { Input } from '@/core/shared/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/core/shared/components/ui/table';
import { Plus, Search, Users, Edit, Trash2, DollarSign } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface CustomerGroup {
  id: string;
  name: string;
  description: string;
  discount_percentage: number;
  customer_count: number;
  status: 'active' | 'inactive';
  created_at: string;
}

// Mock data for customer groups
const mockCustomerGroups: CustomerGroup[] = [
  {
    id: 'group_1',
    name: 'عملاء VIP',
    description: 'العملاء المميزون مع خصومات خاصة',
    discount_percentage: 15,
    customer_count: 45,
    status: 'active',
    created_at: '2024-01-15'
  },
  {
    id: 'group_2',
    name: 'عملاء الجملة',
    description: 'عملاء التجارة والجملة',
    discount_percentage: 10,
    customer_count: 128,
    status: 'active',
    created_at: '2024-02-01'
  },
  {
    id: 'group_3',
    name: 'العملاء الجدد',
    description: 'عملاء جدد لأول 3 أشهر',
    discount_percentage: 5,
    customer_count: 89,
    status: 'active',
    created_at: '2024-03-10'
  },
  {
    id: 'group_4',
    name: 'عملاء الشركات',
    description: 'عملاء شركات ومؤسسات',
    discount_percentage: 12,
    customer_count: 67,
    status: 'active',
    created_at: '2024-01-20'
  }
];

export default function CustomerGroupsList() {
  const [customerGroups] = useState<CustomerGroup[]>(mockCustomerGroups);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGroups = useMemo(() => {
    return customerGroups.filter(group =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customerGroups, searchTerm]);

  const totalStats = useMemo(() => {
    const totalGroups = customerGroups.length;
    const totalCustomers = customerGroups.reduce((sum, group) => sum + group.customer_count, 0);
    const activeGroups = customerGroups.filter(group => group.status === 'active').length;
    const avgDiscount = customerGroups.reduce((sum, group) => sum + group.discount_percentage, 0) / customerGroups.length;
    
    return { totalGroups, totalCustomers, activeGroups, avgDiscount };
  }, [customerGroups]);

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
              <h1 className="text-2xl font-bold text-gray-900">مجموعات العملاء</h1>
              <p className="text-gray-600">إدارة مجموعات العملاء والخصومات</p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              إضافة مجموعة جديدة
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
                  <p className="text-sm font-medium text-gray-600">إجمالي المجموعات</p>
                  <p className="text-2xl font-bold">{totalStats.totalGroups}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">إجمالي العملاء</p>
                  <p className="text-2xl font-bold">{totalStats.totalCustomers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">المجموعات النشطة</p>
                  <p className="text-2xl font-bold">{totalStats.activeGroups}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-orange-600" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">متوسط الخصم</p>
                  <p className="text-2xl font-bold">{totalStats.avgDiscount.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Groups Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="البحث في مجموعات العملاء..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredGroups.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مجموعات عملاء</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm 
                    ? 'لا توجد مجموعات تطابق معايير البحث'
                    : 'ابدأ بإضافة مجموعات عملاء جديدة'
                  }
                </p>
                <Button>
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة مجموعة
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم المجموعة</TableHead>
                    <TableHead>الوصف</TableHead>
                    <TableHead>نسبة الخصم</TableHead>
                    <TableHead>عدد العملاء</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>تاريخ الإنشاء</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGroups.map((group) => (
                    <TableRow key={group.id}>
                      <TableCell>
                        <div className="font-medium">{group.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">{group.description}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          {group.discount_percentage}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{group.customer_count.toLocaleString('ar-SA')}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={group.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {group.status === 'active' ? 'نشطة' : 'غير نشطة'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">{formatDate(group.created_at)}</div>
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



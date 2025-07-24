'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/core/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Badge } from '@/core/shared/components/ui/badge';
import { Input } from '@/core/shared/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/core/shared/components/ui/table';
import { 
  Plus, 
  Search, 
  Calendar, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target,
  Edit,
  Trash2
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Campaign {
  id: string;
  name: string;
  type: 'discount' | 'promotion' | 'seasonal' | 'clearance';
  status: 'active' | 'scheduled' | 'ended' | 'draft';
  discount_value: number;
  discount_type: 'percentage' | 'fixed';
  start_date: string;
  end_date: string;
  usage_count: number;
  usage_limit?: number;
  budget?: number;
  created_at: string;
}

// Mock data for campaigns
const mockCampaigns: Campaign[] = [
  {
    id: 'camp_1',
    name: 'خصم الصيف 2024',
    type: 'seasonal',
    status: 'active',
    discount_value: 25,
    discount_type: 'percentage',
    start_date: '2024-06-01',
    end_date: '2024-08-31',
    usage_count: 156,
    usage_limit: 1000,
    budget: 50000,
    created_at: '2024-05-15'
  },
  {
    id: 'camp_2', 
    name: 'تصفية المخزون',
    type: 'clearance',
    status: 'active',
    discount_value: 500,
    discount_type: 'fixed',
    start_date: '2024-07-01',
    end_date: '2024-07-31',
    usage_count: 89,
    usage_limit: 500,
    budget: 25000,
    created_at: '2024-06-20'
  }
];

export default function CampaignsPage() {
  const [campaigns] = useState<Campaign[]>(mockCampaigns);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(campaign => {
      const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [campaigns, searchTerm, statusFilter]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  const getStatusColor = (status: Campaign['status']) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      scheduled: 'bg-blue-100 text-blue-800', 
      ended: 'bg-gray-100 text-gray-800',
      draft: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status];
  };

  const getStatusText = (status: Campaign['status']) => {
    const texts = {
      active: 'نشطة',
      scheduled: 'مجدولة',
      ended: 'منتهية',
      draft: 'مسودة'
    };
    return texts[status];
  };

  const getTypeText = (type: Campaign['type']) => {
    const texts = {
      discount: 'خصم',
      promotion: 'عرض ترويجي',
      seasonal: 'موسمي',
      clearance: 'تصفية'
    };
    return texts[type];
  };

  const totalStats = useMemo(() => {
    const activeCampaigns = campaigns.filter(c => c.status === 'active');
    const totalUsage = campaigns.reduce((sum, c) => sum + c.usage_count, 0);
    const totalBudget = campaigns.reduce((sum, c) => sum + (c.budget || 0), 0);
    
    return {
      totalCampaigns: campaigns.length,
      activeCampaigns: activeCampaigns.length,
      totalUsage,
      totalBudget
    };
  }, [campaigns]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">الحملات التسويقية</h1>
              <p className="text-gray-600">إدارة العروض والحملات الترويجية</p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              إضافة حملة جديدة
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
                <Target className="h-8 w-8 text-blue-600" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">إجمالي الحملات</p>
                  <p className="text-2xl font-bold">{totalStats.totalCampaigns}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">الحملات النشطة</p>
                  <p className="text-2xl font-bold">{totalStats.activeCampaigns}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">إجمالي الاستخدام</p>
                  <p className="text-2xl font-bold">{totalStats.totalUsage.toLocaleString('ar-SA')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-orange-600" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">إجمالي الميزانية</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalStats.totalBudget)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaigns Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="البحث في الحملات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-48 h-10 px-3 border border-gray-300 rounded-md"
              >
                <option value="all">جميع الحالات</option>
                <option value="active">نشطة</option>
                <option value="scheduled">مجدولة</option>
                <option value="ended">منتهية</option>
                <option value="draft">مسودة</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            {filteredCampaigns.length === 0 ? (
              <div className="text-center py-12">
                <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد حملات</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'لا توجد حملات تطابق معايير البحث'
                    : 'ابدأ بإضافة حملات تسويقية جديدة'
                  }
                </p>
                <Button>
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة حملة
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الحملة</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>الخصم</TableHead>
                    <TableHead>الفترة</TableHead>
                    <TableHead>الاستخدام</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{campaign.name}</div>
                          <div className="text-sm text-gray-500">ID: {campaign.id}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{getTypeText(campaign.type)}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {campaign.discount_type === 'percentage' 
                            ? `${campaign.discount_value}%`
                            : formatCurrency(campaign.discount_value)
                          }
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(campaign.start_date)}
                          </div>
                          <div className="text-gray-500">
                            إلى {formatDate(campaign.end_date)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{campaign.usage_count.toLocaleString('ar-SA')}</div>
                          {campaign.usage_limit && (
                            <div className="text-gray-500">
                              من {campaign.usage_limit.toLocaleString('ar-SA')}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(campaign.status)}>
                          {getStatusText(campaign.status)}
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

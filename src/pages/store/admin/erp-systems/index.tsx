'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/core/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Badge } from '@/core/shared/components/ui/badge';
import { Input } from '@/core/shared/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/core/shared/components/ui/table';
import { Plus, Search, Settings, Database, Cloud, Shield, Activity, CheckCircle, XCircle, Edit, Trash2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface ERPSystem {
  id: string;
  name: string;
  provider: string;
  type: 'cloud' | 'on-premise' | 'hybrid';
  status: 'active' | 'inactive' | 'maintenance' | 'error';
  version: string;
  last_sync: string;
  total_records: number;
  sync_frequency: string;
  api_endpoint?: string;
  created_at: string;
}

// Mock data for ERP systems
const mockERPSystems: ERPSystem[] = [
  {
    id: 'erp_1',
    name: 'نظام SAP الأساسي',
    provider: 'SAP',
    type: 'cloud',
    status: 'active',
    version: '2024.1',
    last_sync: '2024-03-15T14:30:00',
    total_records: 15420,
    sync_frequency: 'كل ساعة',
    api_endpoint: 'https://api.sap.com/v1',
    created_at: '2023-01-15'
  },
  {
    id: 'erp_2',
    name: 'نظام Oracle ERP',
    provider: 'Oracle',
    type: 'on-premise',
    status: 'active',
    version: '23c',
    last_sync: '2024-03-15T13:45:00',
    total_records: 28650,
    sync_frequency: 'كل 4 ساعات',
    created_at: '2023-06-10'
  },
  {
    id: 'erp_3',
    name: 'نظام Microsoft Dynamics',
    provider: 'Microsoft',
    type: 'hybrid',
    status: 'maintenance',
    version: '365',
    last_sync: '2024-03-14T18:20:00',
    total_records: 9840,
    sync_frequency: 'يومياً',
    api_endpoint: 'https://dynamics.microsoft.com/api',
    created_at: '2023-08-22'
  },
  {
    id: 'erp_4',
    name: 'نظام NetSuite',
    provider: 'Oracle NetSuite',
    type: 'cloud',
    status: 'error',
    version: '2024.1.0',
    last_sync: '2024-03-13T10:15:00',
    total_records: 5420,
    sync_frequency: 'كل ساعتين',
    api_endpoint: 'https://api.netsuite.com/v1',
    created_at: '2024-01-08'
  }
];

export default function ERPSystemsPage() {
  const [systems] = useState<ERPSystem[]>(mockERPSystems);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSystems = useMemo(() => {
    return systems.filter(system =>
      system.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      system.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      system.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [systems, searchTerm]);

  const systemStats = useMemo(() => {
    const totalSystems = systems.length;
    const activeSystems = systems.filter(s => s.status === 'active').length;
    const totalRecords = systems.reduce((sum, s) => sum + s.total_records, 0);
    const errorSystems = systems.filter(s => s.status === 'error').length;
    
    return { totalSystems, activeSystems, totalRecords, errorSystems };
  }, [systems]);

  const getStatusColor = (status: ERPSystem['status']) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
    };
    return colors[status];
  };

  const getStatusText = (status: ERPSystem['status']) => {
    const statusText = {
      active: 'نشط',
      inactive: 'غير نشط',
      maintenance: 'صيانة',
      error: 'خطأ',
    };
    return statusText[status];
  };

  const getStatusIcon = (status: ERPSystem['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'maintenance':
        return <Settings className="h-4 w-4 text-yellow-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeColor = (type: ERPSystem['type']) => {
    const colors = {
      cloud: 'bg-blue-100 text-blue-800',
      'on-premise': 'bg-purple-100 text-purple-800',
      hybrid: 'bg-orange-100 text-orange-800',
    };
    return colors[type];
  };

  const getTypeText = (type: ERPSystem['type']) => {
    const typeText = {
      cloud: 'سحابي',
      'on-premise': 'محلي',
      hybrid: 'مختلط',
    };
    return typeText[type];
  };

  const getTypeIcon = (type: ERPSystem['type']) => {
    switch (type) {
      case 'cloud':
        return <Cloud className="h-4 w-4" />;
      case 'on-premise':
        return <Database className="h-4 w-4" />;
      case 'hybrid':
        return <Shield className="h-4 w-4" />;
      default:
        return <Database className="h-4 w-4" />;
    }
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

  const formatRecords = (count: number) => {
    return new Intl.NumberFormat('ar-SA').format(count);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">أنظمة تخطيط موارد المؤسسة (ERP)</h1>
              <p className="text-gray-600">إدارة ومراقبة أنظمة ERP المتكاملة</p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              إضافة نظام ERP جديد
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
                <Database className="h-8 w-8 text-blue-600" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">إجمالي الأنظمة</p>
                  <p className="text-2xl font-bold">{systemStats.totalSystems}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">الأنظمة النشطة</p>
                  <p className="text-2xl font-bold">{systemStats.activeSystems}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-purple-600" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">إجمالي السجلات</p>
                  <p className="text-2xl font-bold">{formatRecords(systemStats.totalRecords)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-red-600" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">أنظمة بأخطاء</p>
                  <p className="text-2xl font-bold">{systemStats.errorSystems}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ERP Systems Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="البحث في أنظمة ERP..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredSystems.length === 0 ? (
              <div className="text-center py-12">
                <Database className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد أنظمة ERP</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm 
                    ? 'لا توجد أنظمة تطابق معايير البحث'
                    : 'ابدأ بإضافة أنظمة ERP جديدة'
                  }
                </p>
                <Button>
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة نظام ERP
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم النظام</TableHead>
                    <TableHead>المزود</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإصدار</TableHead>
                    <TableHead>عدد السجلات</TableHead>
                    <TableHead>تكرار المزامنة</TableHead>
                    <TableHead>آخر مزامنة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSystems.map((system) => (
                    <TableRow key={system.id}>
                      <TableCell>
                        <div className="font-medium">{system.name}</div>
                        {system.api_endpoint && (
                          <div className="text-sm text-gray-600 truncate max-w-xs">
                            {system.api_endpoint}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{system.provider}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getTypeColor(system.type)} flex items-center gap-1 w-fit`}>
                          {getTypeIcon(system.type)}
                          {getTypeText(system.type)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(system.status)} flex items-center gap-1 w-fit`}>
                          {getStatusIcon(system.status)}
                          {getStatusText(system.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{system.version}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{formatRecords(system.total_records)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{system.sync_frequency}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatDate(system.last_sync)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" title="إعدادات المزامنة">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="تعديل">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600" title="حذف">
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">مراقبة الحالة</h3>
                  <p className="text-sm text-gray-600">مراقبة حالة جميع الأنظمة</p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                عرض المراقبة
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Database className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">إعدادات المزامنة</h3>
                  <p className="text-sm text-gray-600">تكوين جداول المزامنة</p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                إدارة المزامنة
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Settings className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">إعدادات الاتصال</h3>
                  <p className="text-sm text-gray-600">تكوين نقاط الاتصال</p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                إدارة الاتصالات
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

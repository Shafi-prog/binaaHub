'use client';

import { useState } from 'react';
import { Button } from '@/core/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Badge } from '@/core/shared/components/ui/badge';
import { Plus, Package, Building } from 'lucide-react';

interface Supplier {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  contact_person: string;
  phone: string;
}

// Mock data for suppliers backup
const mockSuppliers: Supplier[] = [
  { 
    id: 1, 
    name: 'Supplier Alpha (Backup)', 
    email: 'alpha@suppliers.com', 
    status: 'active',
    contact_person: 'Ahmed Ali',
    phone: '+966-123-456-789'
  },
  { 
    id: 2, 
    name: 'Supplier Beta (Backup)', 
    email: 'beta@suppliers.com', 
    status: 'active',
    contact_person: 'Sarah Mohammed',
    phone: '+966-987-654-321'
  }
];

export default function SuppliersPageBackup() {
  const [suppliers] = useState<Supplier[]>(mockSuppliers);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">الموردون (نسخة احتياطية)</h1>
          <p className="text-gray-600">نسخة احتياطية من صفحة إدارة الموردين</p>
        </div>

        <div className="mb-6">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            إضافة مورد جديد
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              قائمة الموردين
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suppliers.map((supplier) => (
                <div key={supplier.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Building className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{supplier.name}</h3>
                      <p className="text-sm text-gray-600">{supplier.email}</p>
                      <p className="text-sm text-gray-500">{supplier.contact_person} - {supplier.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={supplier.status === 'active' ? 'default' : 'secondary'}>
                      {supplier.status === 'active' ? 'نشط' : 'غير نشط'}
                    </Badge>
                    <Button variant="outline" size="sm">
                      تعديل
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {suppliers.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد موردون</h3>
            <p className="text-gray-600 mb-4">ابدأ بإضافة موردين جدد لمتجرك</p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              إضافة مورد
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ProjectReportsPage() {
  return (
    <div className="container mx-auto p-6" dir="rtl">
      <Card className="p-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">تقارير المشروع</h1>
          <p className="text-gray-600">قريباً - ميزة تقارير المشاريع</p>
          <Button variant="outline" onClick={() => alert('Button clicked')}>
            العودة للمشروع
          </Button>
        </div>
      </Card>
    </div>
  );
}

export const dynamic = 'force-dynamic';

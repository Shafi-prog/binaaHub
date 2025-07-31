'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProjectTrackingService } from '@/core/services/projectTrackingService';
import { ConstructionGuidanceService, ConstructionLevel, ProjectLevel } from '@/core/services/constructionGuidanceService';
import LandPurchaseIntegration from '@/core/shared/components/integrations/LandPurchaseIntegration';

// Material type definition
interface MaterialCalculation {
  name: string;
  quantity: number;
  unit: string;
  estimatedCost: number;
  description: string;
}

interface MaterialsMap {
  [key: string]: MaterialCalculation;
}
import ContractorSelectionIntegration from '@/core/shared/components/integrations/ContractorSelectionIntegration';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import { 
  ArrowLeft, 
  Building2, 
  MapPin,
  Users,
  Shield,
  Hammer,
  Truck,
  FileCheck,
  Award,
  ExternalLink,
  CheckCircle,
  Clock,
  DollarSign,
  Globe,
  Download,
  AlertTriangle,
  Lightbulb,
  Target,
  Calendar,
  FileText,
  Calculator,
  Package,
  Ruler,
  Home,
  Trash2,
  Copy,
  Camera,
  Upload,
  Map,
  ShoppingCart,
  BookOpen
} from 'lucide-react';

export default function CreateProjectPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    location: '',
    stage: '',
    projectType: 'residential',
    area: '',
    floorCount: '',
    roomCount: '',
    budget: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectData.name.trim() || !projectData.location.trim() || !projectData.stage.trim()) {
      alert('يرجى تعبئة جميع الحقول المطلوبة.');
      return;
    }
    if (!user?.id) {
      alert('المستخدم غير مسجل الدخول.');
      return;
    }
    setLoading(true);
    try {
      const newProject = {
        name: projectData.name,
        stage: projectData.stage,
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        description: projectData.description || undefined,
        area: projectData.area ? Number(projectData.area) : 0,
        projectType: projectData.projectType as 'residential' | 'commercial' | 'industrial',
        floorCount: projectData.floorCount ? Number(projectData.floorCount) : 1,
        roomCount: projectData.roomCount ? Number(projectData.roomCount) : 1,
        status: 'planning' as 'planning',
        location: projectData.location,
        budget: projectData.budget ? Number(projectData.budget) : undefined,
      };
      await ProjectTrackingService.saveProject(newProject as any, user.id);
      router.push('/user/projects/list');
    } catch (error) {
      alert('حدث خطأ أثناء إنشاء المشروع');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 font-tajawal text-gray-900">
      <div className="max-w-xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-800">إنشاء مشروع جديد</h1>
        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <div>
            <label className="block mb-1 font-medium text-gray-700">اسم المشروع *</label>
            <Input type="text" className="w-full" value={projectData.name} onChange={e => setProjectData(prev => ({ ...prev, name: e.target.value }))} required placeholder="مثال: فيلا العائلة، شقة الرياض..." />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">وصف المشروع</label>
            <Textarea className="w-full" value={projectData.description} onChange={e => setProjectData(prev => ({ ...prev, description: e.target.value }))} placeholder="أدخل وصفاً مختصراً للمشروع (اختياري)" />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">الموقع على الخريطة *</label>
            <Input type="text" className="w-full" value={projectData.location} onChange={e => setProjectData(prev => ({ ...prev, location: e.target.value }))} required placeholder="الصق رابط الخريطة أو العنوان" />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">مرحلة البناء *</label>
            <select className="w-full p-2 rounded border border-gray-300" value={projectData.stage} onChange={e => setProjectData(prev => ({ ...prev, stage: e.target.value }))} required>
              <option value="">اختر المرحلة</option>
              <option value="planning">تخطيط</option>
              <option value="foundation">الأساسات</option>
              <option value="structure">الهيكل</option>
              <option value="finishing">التشطيب</option>
              <option value="completed">مكتمل</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">نوع المشروع</label>
            <select className="w-full p-2 rounded border border-gray-300" value={projectData.projectType} onChange={e => setProjectData(prev => ({ ...prev, projectType: e.target.value }))}>
              <option value="residential">سكني</option>
              <option value="commercial">تجاري</option>
              <option value="industrial">صناعي</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">المساحة (م²)</label>
              <Input type="number" className="w-full" value={projectData.area} onChange={e => setProjectData(prev => ({ ...prev, area: e.target.value }))} placeholder="مثال: 250" />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">عدد الأدوار</label>
              <Input type="number" className="w-full" value={projectData.floorCount} onChange={e => setProjectData(prev => ({ ...prev, floorCount: e.target.value }))} placeholder="مثال: 2" />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">عدد الغرف</label>
              <Input type="number" className="w-full" value={projectData.roomCount} onChange={e => setProjectData(prev => ({ ...prev, roomCount: e.target.value }))} placeholder="مثال: 4" />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">الميزانية (ريال سعودي)</label>
              <Input type="number" className="w-full" value={projectData.budget} onChange={e => setProjectData(prev => ({ ...prev, budget: e.target.value }))} placeholder="مثال: 500000" />
            </div>
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-lg font-bold" disabled={loading}>
            {loading ? 'جاري الحفظ...' : 'حفظ المشروع'}
          </Button>
        </form>
      </div>
    </div>
  );
}

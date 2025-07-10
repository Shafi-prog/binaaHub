'use client';

import React, { useState } from 'react';
import { Typography, EnhancedCard, Button } from '@/domains/shared/components/ui/enhanced-components';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Users,
  FileText,
  Save,
  X,
  Building,
  Home,
  Factory
} from 'lucide-react';

export default function CreateProjectPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    type: 'residential',
    location: '',
    budget: '',
    startDate: '',
    endDate: '',
    description: '',
    contractor: '',
    status: 'planning'
  });

  const projectTypes = [
    { id: 'residential', label: 'سكني', icon: <Home className="w-5 h-5" /> },
    { id: 'commercial', label: 'تجاري', icon: <Building className="w-5 h-5" /> },
    { id: 'industrial', label: 'صناعي', icon: <Factory className="w-5 h-5" /> },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Creating project:', formData);
    // Here you would typically save the project data
    router.push('/user/projects/list');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 font-tajawal">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            رجوع
          </Button>
          <div>
            <Typography variant="heading" size="2xl" weight="bold" className="text-gray-800">
              إنشاء مشروع جديد
            </Typography>
            <Typography variant="body" className="text-gray-600">
              أدخل تفاصيل مشروع البناء الجديد
            </Typography>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <EnhancedCard variant="elevated" className="p-8">
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <div>
                    <Typography variant="subheading" size="lg" weight="semibold" className="text-gray-800 mb-4">
                      المعلومات الأساسية
                    </Typography>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اسم المشروع *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="أدخل اسم المشروع"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نوع المشروع *
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {projectTypes.map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => handleInputChange('type', type.id)}
                          className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors ${
                            formData.type === type.id
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {type.icon}
                          <Typography variant="body" size="sm" weight="medium">
                            {type.label}
                          </Typography>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الموقع *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="أدخل موقع المشروع"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الميزانية المقدرة
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={formData.budget}
                        onChange={(e) => handleInputChange('budget', e.target.value)}
                        className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                      />
                      <div className="absolute left-3 top-3 text-gray-500 text-sm">ر.س</div>
                    </div>
                  </div>
                </div>

                {/* Timeline and Details */}
                <div className="space-y-6">
                  <div>
                    <Typography variant="subheading" size="lg" weight="semibold" className="text-gray-800 mb-4">
                      الجدول الزمني والتفاصيل
                    </Typography>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        تاريخ البدء
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        تاريخ الانتهاء المتوقع
                      </label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المقاول الرئيسي
                    </label>
                    <div className="relative">
                      <Users className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.contractor}
                        onChange={(e) => handleInputChange('contractor', e.target.value)}
                        className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="اسم المقاول أو الشركة"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      حالة المشروع
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="planning">مرحلة التخطيط</option>
                      <option value="design">مرحلة التصميم</option>
                      <option value="permits">استخراج التراخيص</option>
                      <option value="construction">قيد التنفيذ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      وصف المشروع
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="أدخل وصفاً مفصلاً عن المشروع..."
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  variant="filled"
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  إنشاء المشروع
                </Button>
              </div>
            </form>
          </EnhancedCard>
        </div>
      </div>
    </main>
  );
}

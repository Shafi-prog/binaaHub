'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Button } from '@/core/shared/components/ui/button';
import { Input } from '@/core/shared/components/ui/input';
import { Label } from '@/core/shared/components/ui/label';
import { Textarea } from '@/core/shared/components/ui/textarea';

export const dynamic = 'force-dynamic';

interface ProductFormData {
  name_ar: string;
  name_en: string;
  category: string;
  price: number;
  unit: string;
  barcode: string;
  description: string;
  stock: number;
}

const categories = [
  { id: 'cat_1', name_ar: 'أسمنت ومواد البناء' },
  { id: 'cat_2', name_ar: 'الحديد والصلب' },
  { id: 'cat_3', name_ar: 'الأدوات والمعدات' },
  { id: 'cat_4', name_ar: 'مواد العزل' }
];

const units = ['قطعة', 'كيس', 'متر', 'متر مربع', 'متر مكعب', 'كيلو', 'طن'];

export default function NewConstructionProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ProductFormData>({
    name_ar: '',
    name_en: '',
    category: '',
    price: 0,
    unit: '',
    barcode: '',
    description: '',
    stock: 0
  });

  const handleInputChange = (field: keyof ProductFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Mock save functionality
    console.log('Saving product:', formData);
    router.back();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            رجوع
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">إضافة منتج جديد</h1>
            <p className="text-gray-600 mt-2">إضافة منتج جديد لمواد البناء والتشييد</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>معلومات المنتج</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name_ar">اسم المنتج (عربي) *</Label>
                <Input
                  id="name_ar"
                  value={formData.name_ar}
                  onChange={(e) => handleInputChange('name_ar', e.target.value)}
                  placeholder="أدخل اسم المنتج باللغة العربية"
                />
              </div>
              <div>
                <Label htmlFor="name_en">اسم المنتج (إنجليزي)</Label>
                <Input
                  id="name_en"
                  value={formData.name_en}
                  onChange={(e) => handleInputChange('name_en', e.target.value)}
                  placeholder="Enter product name in English"
                />
              </div>
            </div>

            {/* Category and Unit */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">الفئة *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full h-10 px-3 border border-gray-300 rounded-md"
                >
                  <option value="">اختر الفئة</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name_ar}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="unit">الوحدة *</Label>
                <select
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => handleInputChange('unit', e.target.value)}
                  className="w-full h-10 px-3 border border-gray-300 rounded-md"
                >
                  <option value="">اختر الوحدة</option>
                  {units.map(unit => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price and Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">السعر (ريال سعودي) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="stock">الكمية المتوفرة *</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Barcode */}
            <div>
              <Label htmlFor="barcode">الباركود</Label>
              <div className="flex gap-2">
                <Input
                  id="barcode"
                  value={formData.barcode}
                  onChange={(e) => handleInputChange('barcode', e.target.value)}
                  placeholder="أدخل الباركود أو اتركه فارغاً للتوليد التلقائي"
                  className="flex-1"
                />
                <Button variant="outline" type="button" onClick={() => alert('Button clicked')}>
                  مسح باركود
                </Button>
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">الوصف</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="أدخل وصف المنتج (اختياري)"
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t">
              <Button onClick={handleSave} className="flex-1">
                <Save className="h-4 w-4 ml-2" />
                حفظ المنتج
              </Button>
              <Button variant="outline" onClick={() => router.back()} className="flex-1">
                <X className="h-4 w-4 ml-2" />
                إلغاء
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

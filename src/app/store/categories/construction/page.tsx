'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/core/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Badge } from '@/core/shared/components/ui/badge';
import { Input } from '@/core/shared/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/core/shared/components/ui/table';
import { Plus, Search, Folder, Edit, Trash2, FolderOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface ConstructionCategory {
  id: string;
  name_ar: string;
  name_en?: string;
  parent_id?: string;
  sort_order: number;
  is_active: boolean;
  children?: ConstructionCategory[];
  created_at?: string;
  updated_at?: string;
  level?: number;
}

// Mock data for construction categories
const mockCategories: ConstructionCategory[] = [
  {
    id: 'cat_1',
    name_ar: 'مواد البناء الأساسية',
    name_en: 'Basic Construction Materials',
    sort_order: 1,
    is_active: true,
    created_at: '2024-01-15',
    children: [
      {
        id: 'cat_1_1',
        name_ar: 'الإسمنت والخرسانة',
        name_en: 'Cement and Concrete',
        parent_id: 'cat_1',
        sort_order: 1,
        is_active: true,
        created_at: '2024-01-16'
      },
      {
        id: 'cat_1_2',
        name_ar: 'الطوب والبلوك',
        name_en: 'Bricks and Blocks',
        parent_id: 'cat_1',
        sort_order: 2,
        is_active: true,
        created_at: '2024-01-17'
      }
    ]
  },
  {
    id: 'cat_2',
    name_ar: 'مواد التشطيب',
    name_en: 'Finishing Materials',
    sort_order: 2,
    is_active: true,
    created_at: '2024-01-18',
    children: [
      {
        id: 'cat_2_1',
        name_ar: 'البلاط والرخام',
        name_en: 'Tiles and Marble',
        parent_id: 'cat_2',
        sort_order: 1,
        is_active: true,
        created_at: '2024-01-19'
      },
      {
        id: 'cat_2_2',
        name_ar: 'الدهانات والطلاء',
        name_en: 'Paints and Coatings',
        parent_id: 'cat_2',
        sort_order: 2,
        is_active: true,
        created_at: '2024-01-20'
      }
    ]
  },
  {
    id: 'cat_3',
    name_ar: 'الحديد والصلب',
    name_en: 'Iron and Steel',
    sort_order: 3,
    is_active: true,
    created_at: '2024-01-21',
    children: [
      {
        id: 'cat_3_1',
        name_ar: 'حديد التسليح',
        name_en: 'Reinforcement Steel',
        parent_id: 'cat_3',
        sort_order: 1,
        is_active: true,
        created_at: '2024-01-22'
      }
    ]
  }
];

export default function ConstructionCategoriesPage() {
  const [categories] = useState<ConstructionCategory[]>(mockCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const allCategories = useMemo(() => {
    const flattened: ConstructionCategory[] = [];
    const flatten = (cats: ConstructionCategory[], level = 0) => {
      cats.forEach(cat => {
        flattened.push({ ...cat, level });
        if (cat.children) {
          flatten(cat.children, level + 1);
        }
      });
    };
    flatten(categories);
    return flattened;
  }, [categories]);

  const filteredCategories = useMemo(() => {
    return allCategories.filter(category =>
      category.name_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.name_en && category.name_en.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [allCategories, searchTerm]);

  const categoryStats = useMemo(() => {
    const totalCategories = allCategories.length;
    const activeCategories = allCategories.filter(c => c.is_active).length;
    const mainCategories = categories.length;
    const subCategories = allCategories.filter(c => c.parent_id).length;
    
    return { totalCategories, activeCategories, mainCategories, subCategories };
  }, [allCategories, categories]);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  const renderCategoryRow = (category: ConstructionCategory, level = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.id);
    const padding = level * 20;

    return (
      <>
        <TableRow key={category.id}>
          <TableCell>
            <div className="flex items-center" style={{ paddingRight: `${padding}px` }}>
              {hasChildren && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleCategory(category.id)}
                  className="p-0 h-auto mr-2"
                >
                  {isExpanded ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />}
                </Button>
              )}
              {!hasChildren && <div className="w-6 mr-2" />}
              <div>
                <div className="font-medium">{category.name_ar}</div>
                {category.name_en && (
                  <div className="text-sm text-gray-600">{category.name_en}</div>
                )}
              </div>
            </div>
          </TableCell>
          <TableCell>
            <Badge variant="outline">{category.sort_order}</Badge>
          </TableCell>
          <TableCell>
            <Badge className={category.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
              {category.is_active ? 'نشطة' : 'غير نشطة'}
            </Badge>
          </TableCell>
          <TableCell>
            <div className="text-sm">{category.created_at ? formatDate(category.created_at) : 'غير محدد'}</div>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => alert('Button clicked')}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-red-600" onClick={() => alert('Button clicked')}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
        {hasChildren && isExpanded && category.children?.map(child => 
          renderCategoryRow(child, level + 1)
        )}
      </>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">تصنيفات مواد البناء</h1>
            <p className="text-gray-600 mt-2">إدارة تصنيفات وفئات مواد البناء</p>
          </div>
          <Button className="flex items-center gap-2" onClick={() => alert('Button clicked')}>
            <Plus className="h-4 w-4" />
            إضافة تصنيف جديد
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Folder className="h-8 w-8 text-blue-600" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">إجمالي التصنيفات</p>
                  <p className="text-2xl font-bold">{categoryStats.totalCategories}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FolderOpen className="h-8 w-8 text-green-600" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">التصنيفات النشطة</p>
                  <p className="text-2xl font-bold">{categoryStats.activeCategories}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Folder className="h-8 w-8 text-purple-600" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">التصنيفات الرئيسية</p>
                  <p className="text-2xl font-bold">{categoryStats.mainCategories}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Folder className="h-8 w-8 text-orange-600" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">التصنيفات الفرعية</p>
                  <p className="text-2xl font-bold">{categoryStats.subCategories}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Categories Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="البحث في التصنيفات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredCategories.length === 0 ? (
              <div className="text-center py-12">
                <Folder className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد تصنيفات</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm 
                    ? 'لا توجد تصنيفات تطابق معايير البحث'
                    : 'ابدأ بإضافة تصنيفات جديدة'
                  }
                </p>
                <Button onClick={() => alert('Button clicked')}>
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة تصنيف
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم التصنيف</TableHead>
                    <TableHead>ترتيب العرض</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>تاريخ الإنشاء</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map(category => renderCategoryRow(category))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



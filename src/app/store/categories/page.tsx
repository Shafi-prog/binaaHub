'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  FolderTree, 
  Package, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown,
  CheckCircle,
  XCircle,
  Grid,
  List,
  Filter,
  MoreHorizontal
} from 'lucide-react';

interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  parent_name?: string;
  level: number;
  is_active: boolean;
  sort_order: number;
  products_count: number;
  total_stock_value: number;
  icon?: string;
  color?: string;
  created_at: string;
  updated_at: string;
  children?: ProductCategory[];
}

export default function ProductCategoriesManagement() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'tree' | 'list'>('tree');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [user, setUser] = useState<any>(null);

  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    loadCategoriesData();
  }, []);

  useEffect(() => {
    filterCategories();
  }, [categories, searchTerm, statusFilter]);

  const loadCategoriesData = async () => {
    try {
      setLoading(true);

      // Get current user
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      if (userError || !currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);

      // Load mock data (replace with actual Supabase queries when schema is available)
      const mockCategories: ProductCategory[] = [
        {
          id: '1',
          name: 'مواد البناء',
          description: 'جميع مواد البناء الأساسية',
          level: 0,
          is_active: true,
          sort_order: 1,
          products_count: 25,
          total_stock_value: 150000,
          icon: '🏗️',
          color: '#3B82F6',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-15T10:30:00Z'
        },
        {
          id: '11',
          name: 'خرسانة ومونة',
          description: 'جميع أنواع الخرسانة والمونة',
          parent_id: '1',
          parent_name: 'مواد البناء',
          level: 1,
          is_active: true,
          sort_order: 1,
          products_count: 8,
          total_stock_value: 45000,
          icon: '🧱',
          color: '#6B7280',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-15T10:30:00Z'
        },
        {
          id: '12',
          name: 'حديد وصلب',
          description: 'جميع أنواع الحديد ومواد الصلب',
          parent_id: '1',
          parent_name: 'مواد البناء',
          level: 1,
          is_active: true,
          sort_order: 2,
          products_count: 12,
          total_stock_value: 75000,
          icon: '⚙️',
          color: '#EF4444',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-15T10:30:00Z'
        },
        {
          id: '13',
          name: 'طوب وبلوك',
          description: 'جميع أنواع الطوب والبلوك',
          parent_id: '1',
          parent_name: 'مواد البناء',
          level: 1,
          is_active: true,
          sort_order: 3,
          products_count: 5,
          total_stock_value: 30000,
          icon: '🧱',
          color: '#F59E0B',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          name: 'التجهيزات الصحية',
          description: 'جميع التجهيزات والأدوات الصحية',
          level: 0,
          is_active: true,
          sort_order: 2,
          products_count: 18,
          total_stock_value: 85000,
          icon: '🚿',
          color: '#10B981',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-15T10:30:00Z'
        },
        {
          id: '21',
          name: 'أنابيب وتوصيلات',
          description: 'جميع أنواع الأنابيب والتوصيلات',
          parent_id: '2',
          parent_name: 'التجهيزات الصحية',
          level: 1,
          is_active: true,
          sort_order: 1,
          products_count: 10,
          total_stock_value: 35000,
          icon: '🔧',
          color: '#0EA5E9',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-15T10:30:00Z'
        },
        {
          id: '22',
          name: 'مضخات ومحركات',
          description: 'مضخات المياه والمحركات',
          parent_id: '2',
          parent_name: 'التجهيزات الصحية',
          level: 1,
          is_active: true,
          sort_order: 2,
          products_count: 8,
          total_stock_value: 50000,
          icon: '⚡',
          color: '#8B5CF6',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-15T10:30:00Z'
        },
        {
          id: '3',
          name: 'الأدوات الكهربائية',
          description: 'جميع الأدوات والمعدات الكهربائية',
          level: 0,
          is_active: true,
          sort_order: 3,
          products_count: 22,
          total_stock_value: 120000,
          icon: '⚡',
          color: '#F59E0B',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-15T10:30:00Z'
        },
        {
          id: '31',
          name: 'كابلات وأسلاك',
          description: 'جميع أنواع الكابلات والأسلاك الكهربائية',
          parent_id: '3',
          parent_name: 'الأدوات الكهربائية',
          level: 1,
          is_active: true,
          sort_order: 1,
          products_count: 15,
          total_stock_value: 80000,
          icon: '🔌',
          color: '#DC2626',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-15T10:30:00Z'
        },
        {
          id: '32',
          name: 'لوحات ومفاتيح',
          description: 'لوحات التوزيع والمفاتيح الكهربائية',
          parent_id: '3',
          parent_name: 'الأدوات الكهربائية',
          level: 1,
          is_active: true,
          sort_order: 2,
          products_count: 7,
          total_stock_value: 40000,
          icon: '🔘',
          color: '#059669',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-15T10:30:00Z'
        },
        {
          id: '4',
          name: 'الدهانات والطلاء',
          description: 'جميع أنواع الدهانات ومواد الطلاء',
          level: 0,
          is_active: false,
          sort_order: 4,
          products_count: 0,
          total_stock_value: 0,
          icon: '🎨',
          color: '#EC4899',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-15T10:30:00Z'
        }
      ];

      // Build tree structure
      const rootCategories = mockCategories.filter(cat => cat.level === 0);
      const childCategories = mockCategories.filter(cat => cat.level > 0);

      rootCategories.forEach(root => {
        root.children = childCategories.filter(child => child.parent_id === root.id);
      });

      setCategories(mockCategories);
      // Initially expand main categories
      setExpandedCategories(new Set(rootCategories.map(cat => cat.id)));

    } catch (error) {
      console.error('Error loading categories data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCategories = () => {
    let filtered = categories.filter(category => {
      const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && category.is_active) ||
                           (statusFilter === 'inactive' && !category.is_active);

      return matchesSearch && matchesStatus;
    });

    setFilteredCategories(filtered);
  };

  const formatCurrency = (amount: number, currency: string = 'SAR') => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const renderTreeView = () => {
    const rootCategories = filteredCategories.filter(cat => cat.level === 0);
    
    return (
      <div className="space-y-2">
        {rootCategories.map(category => renderCategoryNode(category))}
      </div>
    );
  };

  const renderCategoryNode = (category: ProductCategory) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.id);
    const childrenToShow = hasChildren ? 
      category.children!.filter(child => 
        filteredCategories.some(filtered => filtered.id === child.id)
      ) : [];

    return (
      <div key={category.id} className="border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors">
          <div className="flex items-center flex-1">
            {hasChildren && (
              <button
                onClick={() => toggleCategoryExpansion(category.id)}
                className="ml-2 p-1 text-gray-400 hover:text-gray-600"
              >
                {isExpanded ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              </button>
            )}
            
            <div className="flex items-center ml-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white mr-3"
                style={{ backgroundColor: category.color }}
              >
                <span className="text-sm">{category.icon}</span>
              </div>
              
              <div>
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  {!category.is_active && (
                    <span className="mr-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                      غير نشط
                    </span>
                  )}
                </div>
                {category.description && (
                  <p className="text-sm text-gray-600">{category.description}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="flex items-center text-gray-600">
                <Package className="h-4 w-4 ml-1" />
                <span className="font-medium">{category.products_count}</span>
              </div>
              <div className="text-xs text-gray-500">منتج</div>
            </div>

            <div className="text-center">
              <div className="font-medium text-gray-900">
                {formatCurrency(category.total_stock_value)}
              </div>
              <div className="text-xs text-gray-500">قيمة المخزون</div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedCategory(category);
                  setShowEditModal(true);
                }}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                title="تعديل"
              >
                <Edit className="h-4 w-4" />
              </button>
              
              <button
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                title="حذف"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              
              <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {hasChildren && isExpanded && childrenToShow.length > 0 && (
          <div className="border-t border-gray-200 bg-gray-50">
            <div className="p-4 pr-12">
              {childrenToShow.map(child => (
                <div key={child.id} className="flex items-center justify-between p-3 bg-white rounded-lg mb-2 border border-gray-100">
                  <div className="flex items-center">
                    <div 
                      className="w-6 h-6 rounded flex items-center justify-center text-white mr-3"
                      style={{ backgroundColor: child.color }}
                    >
                      <span className="text-xs">{child.icon}</span>
                    </div>
                    
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium text-gray-900">{child.name}</h4>
                        {!child.is_active && (
                          <span className="mr-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                            غير نشط
                          </span>
                        )}
                      </div>
                      {child.description && (
                        <p className="text-sm text-gray-600">{child.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="flex items-center text-gray-600">
                        <Package className="h-3 w-3 ml-1" />
                        <span className="text-sm font-medium">{child.products_count}</span>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(child.total_stock_value)}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setSelectedCategory(child);
                          setShowEditModal(true);
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="تعديل"
                      >
                        <Edit className="h-3 w-3" />
                      </button>
                      
                      <button
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="حذف"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderListView = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التصنيف
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التصنيف الأساسي
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  عدد المنتجات
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  قيمة المخزون
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCategories.map(category => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white ml-3"
                        style={{ backgroundColor: category.color }}
                      >
                        <span className="text-sm">{category.icon}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                        {category.description && (
                          <div className="text-sm text-gray-500">{category.description}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {category.parent_name || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Package className="h-4 w-4 text-gray-400 ml-1" />
                      <span className="text-sm font-medium text-gray-900">{category.products_count}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(category.total_stock_value)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      category.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {category.is_active ? (
                        <>
                          <CheckCircle className="w-3 h-3 ml-1" />
                          نشط
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 ml-1" />
                          غير نشط
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedCategory(category);
                          setShowEditModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="تعديل"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title="حذف"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل تصنيفات المنتجات...</p>
        </div>
      </div>
    );
  }

  const totalCategories = categories.length;
  const activeCategories = categories.filter(c => c.is_active).length;
  const totalProducts = categories.reduce((sum, c) => sum + c.products_count, 0);
  const totalStockValue = categories.reduce((sum, c) => sum + c.total_stock_value, 0);

  return (
    <div className="min-h-screen bg-gray-50 font-tajawal" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">إدارة تصنيفات المنتجات</h1>
              <p className="mt-1 text-sm text-gray-600">
                تنظيم وإدارة تصنيفات المنتجات والفئات
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowNewCategoryModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                تصنيف جديد
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg ml-4">
                <FolderTree className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي التصنيفات</p>
                <p className="text-2xl font-bold text-gray-900">{totalCategories}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg ml-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">التصنيفات النشطة</p>
                <p className="text-2xl font-bold text-gray-900">{activeCategories}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg ml-4">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي المنتجات</p>
                <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg ml-4">
                <Package className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">قيمة المخزون</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(totalStockValue)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="البحث في التصنيفات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">جميع الحالات</option>
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('tree')}
                className={`px-3 py-1 rounded flex items-center gap-2 transition-colors ${
                  viewMode === 'tree' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FolderTree className="h-4 w-4" />
                شجرة
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded flex items-center gap-2 transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="h-4 w-4" />
                قائمة
              </button>
            </div>
          </div>
        </div>

        {/* Categories Display */}
        {filteredCategories.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <FolderTree className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد تصنيفات</h3>
            <p className="text-gray-500 mb-4">قم بإنشاء تصنيف جديد للبدء في تنظيم المنتجات</p>
            <button
              onClick={() => setShowNewCategoryModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
            >
              <Plus className="h-4 w-4" />
              تصنيف جديد
            </button>
          </div>
        ) : (
          viewMode === 'tree' ? renderTreeView() : renderListView()
        )}
      </div>

      {/* New Category Modal Placeholder */}
      {showNewCategoryModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">تصنيف جديد</h3>
              <button
                onClick={() => setShowNewCategoryModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="text-center py-8">
              <FolderTree className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">قريباً</h3>
              <p className="text-gray-500">سيتم إضافة نموذج إنشاء تصنيف جديد قريباً</p>
              <button
                onClick={() => setShowNewCategoryModal(false)}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                موافق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal Placeholder */}
      {showEditModal && selectedCategory && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">تعديل التصنيف: {selectedCategory.name}</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedCategory(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="text-center py-8">
              <Edit className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">قريباً</h3>
              <p className="text-gray-500">سيتم إضافة نموذج تعديل التصنيف قريباً</p>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedCategory(null);
                }}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                موافق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

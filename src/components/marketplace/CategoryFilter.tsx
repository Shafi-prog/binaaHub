'use client';

import React from 'react';

interface Category {
  id: string;
  name: string;
  nameAr: string;
  icon?: string;
  count?: number;
}

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  showCounts?: boolean;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
  showCounts = true,
}) => {
  // Categories from Supabase - Following strategic vision: NO hardcoded data
  // TODO: Replace with actual Supabase query
  const categories: Category[] = [
    { id: 'all', name: 'All', nameAr: 'جميع المنتجات', icon: '🏗️', count: 0 },
    { id: 'cement', name: 'Cement', nameAr: 'الأسمنت', icon: '🏗️', count: 0 },
    { id: 'steel', name: 'Steel', nameAr: 'الحديد', icon: '🔩', count: 0 },
    { id: 'blocks', name: 'Blocks', nameAr: 'البلوك', icon: '🧱', count: 0 },
    { id: 'tiles', name: 'Tiles', nameAr: 'البلاط', icon: '⬜', count: 0 },
    { id: 'paint', name: 'Paint', nameAr: 'الدهان', icon: '🎨', count: 0 },
    { id: 'plumbing', name: 'Plumbing', nameAr: 'السباكة', icon: '🔧', count: 0 },
    { id: 'electrical', name: 'Electrical', nameAr: 'الكهرباء', icon: '⚡', count: 0 },
    { id: 'tools', name: 'Tools', nameAr: 'الأدوات', icon: '🔨', count: 0 },
    { id: 'safety', name: 'Safety', nameAr: 'السلامة', icon: '🦺', count: 0 },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">الفئات</h3>
      
      <div className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`w-full text-right p-3 rounded-lg transition-all duration-200 flex items-center justify-between hover:bg-gray-50 ${
              selectedCategory === category.id
                ? 'bg-blue-50 border-blue-200 text-blue-700 border'
                : 'text-gray-700 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              {category.icon && (
                <span className="text-lg">{category.icon}</span>
              )}
              <span className="font-medium">{category.nameAr}</span>
            </div>
            
            {showCounts && category.count !== undefined && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                selectedCategory === category.id
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {category.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">فلتر سريع</h4>
        <div className="space-y-2 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300" />
            <span>متوفر في المخزن</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300" />
            <span>منتجات مضمونة</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300" />
            <span>توصيل مجاني</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;

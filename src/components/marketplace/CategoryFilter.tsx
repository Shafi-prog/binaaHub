import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface Category {
  id: string;
  name: string;
  count?: number;
  icon?: string;
}

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  showCounts?: boolean;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
  showCounts = true,
}) => {
  const defaultCategories: Category[] = [
    { id: 'all', name: 'جميع الفئات', icon: '🏪' },
    { id: 'building-materials', name: 'مواد البناء', icon: '🧱' },
    { id: 'fixtures', name: 'التركيبات', icon: '🔧' },
    { id: 'furniture', name: 'الأثاث', icon: '🪑' },
    { id: 'appliances', name: 'الأجهزة', icon: '📱' },
    { id: 'lighting', name: 'الإضاءة', icon: '💡' },
    { id: 'flooring', name: 'الأرضيات', icon: '🏠' },
    { id: 'painting', name: 'الدهانات', icon: '🎨' },
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <div className="bg-white rounded-lg border p-4 mb-6">
      <h3 className="font-semibold text-lg mb-4">تصفح حسب الفئة</h3>
      
      {/* Mobile: Horizontal scroll */}
      <div className="md:hidden">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {displayCategories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => onCategoryChange(category.id)}
              className="whitespace-nowrap flex-shrink-0"
            >
              {category.icon && <span className="mr-1">{category.icon}</span>}
              {category.name}
              {showCounts && category.count !== undefined && (
                <Badge variant="secondary" className="ml-1">
                  {category.count}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Desktop: Grid layout */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-3">
        {displayCategories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? 'default' : 'outline'}
            className="h-auto p-3 flex flex-col items-center justify-center text-center"
            onClick={() => onCategoryChange(category.id)}
          >
            {category.icon && (
              <span className="text-2xl mb-1">{category.icon}</span>
            )}
            <span className="text-sm font-medium">{category.name}</span>
            {showCounts && category.count !== undefined && (
              <Badge variant="secondary" className="mt-1">
                {category.count}
              </Badge>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};

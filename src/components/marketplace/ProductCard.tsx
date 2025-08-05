import React from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  storeName: string;
  storeId: string;
  category?: string;
  stock?: number;
  warranty?: {
    duration: number;
    type: 'years' | 'months';
  };
  onAddToProject?: (productId: string) => void;
  onViewStore?: (storeId: string) => void;
  onViewProduct?: (productId: string) => void;
  showAddToProject?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  description,
  price,
  imageUrl,
  storeName,
  storeId,
  category,
  stock,
  warranty,
  onAddToProject,
  onViewStore,
  onViewProduct,
  showAddToProject = true,
}) => {
  const isOutOfStock = stock !== undefined && stock <= 0;

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="relative h-48 w-full cursor-pointer" onClick={() => onViewProduct?.(id)}>
        <Image
          src={imageUrl || '/placeholder-product.jpg'}
          alt={name}
          fill
          className="object-cover"
        />
        {category && (
          <Badge className="absolute top-2 left-2 bg-blue-100 text-blue-800">
            {category}
          </Badge>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Badge variant="destructive">نفذ المخزون</Badge>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 
          className="font-semibold text-lg mb-1 cursor-pointer hover:text-blue-600 line-clamp-1"
          onClick={() => onViewProduct?.(id)}
        >
          {name}
        </h3>
        
        <p 
          className="text-sm text-gray-600 mb-2 cursor-pointer hover:underline" 
          onClick={() => onViewStore?.(storeId)}
        >
          {storeName}
        </p>
        
        <p className="text-sm text-gray-700 mb-3 line-clamp-2">{description}</p>
        
        {warranty && (
          <div className="flex items-center mb-2">
            <Badge variant="outline" className="text-xs">
              ضمان {warranty.duration} {warranty.type === 'years' ? 'سنة' : 'شهر'}
            </Badge>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div>
            <span className="font-bold text-lg">{price.toLocaleString()} ر.س</span>
            {stock !== undefined && (
              <p className="text-xs text-gray-500">
                متوفر: {stock} قطعة
              </p>
            )}
          </div>
          
          {showAddToProject && (
            <Button 
              onClick={() => onAddToProject?.(id)} 
              variant="outline" 
              size="sm"
              disabled={isOutOfStock}
            >
              إضافة إلى المشروع
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/core/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Badge } from '@/core/shared/components/ui/badge';
import { Input } from '@/core/shared/components/ui/input';
import { Label } from '@/core/shared/components/ui/label';
import { Edit, Package, DollarSign, BarChart3 } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface ProductVariant {
  id: string;
  title: string;
  sku: string;
  price: number;
  inventory_quantity: number;
  manage_inventory: boolean;
  options: Record<string, string>;
  product_id: string;
}

// Mock data for variant (backup version)
const mockVariant: ProductVariant = {
  id: "var_backup_123",
  title: "Backup - Variant",
  sku: "SKU-BACKUP-001",
  price: 99.99,
  inventory_quantity: 10,
  manage_inventory: true,
  options: {
    size: "Standard",
    color: "Default"
  },
  product_id: "prod_backup_123"
};

// Simple skeleton component
const SimpleLoadingSkeleton = () => (
  <div className="min-h-screen bg-gray-50 p-6">
    <div className="max-w-7xl mx-auto">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

export default function ProductVariantDetailBackup() {
  const params = useParams();
  const [variant, setVariant] = useState<ProductVariant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // Set backup data immediately
    setVariant(mockVariant);
    setIsLoading(false);
  }, []);

  if (isLoading || !variant) {
    return <SimpleLoadingSkeleton />;
  }

  if (isError) {
    return <div>Error loading variant (backup)</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Variant Details (Backup)</h1>
          <p className="text-gray-600">Backup version - manage variant information and inventory</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  General Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input value={variant.title} readOnly />
                </div>
                <div>
                  <Label>SKU</Label>
                  <Input value={variant.sku} readOnly />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Size</Label>
                    <Input value={variant.options.size} readOnly />
                  </div>
                  <div>
                    <Label>Color</Label>
                    <Input value={variant.options.color} readOnly />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Inventory */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Inventory
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span>Inventory Quantity</span>
                  <Badge variant="outline">{variant.inventory_quantity} units</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${variant.price}</div>
                <p className="text-sm text-gray-600">Base price</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}



'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Scan, Plus, Search, ShoppingCart } from 'lucide-react';
import { ClientIcon } from '@/components/icons';
import SimpleLayout from '@/components/layouts/SimpleLayout';
import { verifyTempAuth } from '@/lib/temp-auth';
import BarcodeScanner from '@/components/barcode/BarcodeScanner';
import UnifiedBarcodeScanner from '@/components/barcode/UnifiedBarcodeScanner';
import ProductSearch from '@/components/orders/ProductSearch';
import OrderSummary from '@/components/orders/OrderSummary';

interface Product {
  id: string;
  name: string;
  barcode?: string;
  price: number;
  stock: number;
  description?: string;
}

interface OrderItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Customer {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
}

export default function RemovedOrderNewPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-700 mb-4">تم نقل إنشاء الطلبات</h1>
        <p className="mb-2">أصبح إنشاء الطلبات الآن يتم إدارته من خلال لوحة تحكم Medusa.</p>
        <a href="http://localhost:9000/admin/orders" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">اذهب إلى طلبات Medusa</a>
      </div>
    </div>
  );
}

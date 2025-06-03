'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BarcodeScanner from '@/components/BarcodeScanner';
import ExcelImportComponent from '@/components/ExcelImportComponent';
import { useTranslation } from '@/hooks/useTranslation';
import { FileSpreadsheet, Scan } from 'lucide-react';

export default function InventoryManagementPage() {
  const { t, locale } = useTranslation();
  const [activeTab, setActiveTab] = useState('barcode');

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-4 mb-8">
        <h1 className="text-3xl font-bold">
          {locale === 'ar' ? 'إدارة المخزون' : 'Inventory Management'}
        </h1>
        <p className="text-gray-600">
          {locale === 'ar' 
            ? 'مسح الباركود واستيراد البيانات من ملفات Excel وإدارة العناصر.' 
            : 'Scan barcodes, import data from Excel files, and manage items.'}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="barcode" className="flex items-center space-x-2 py-3">
            <Scan className="h-5 w-5" />
            <span>{t('barcode.title')}</span>
          </TabsTrigger>
          <TabsTrigger value="excel" className="flex items-center space-x-2 py-3">
            <FileSpreadsheet className="h-5 w-5" />
            <span>{t('excel.title')}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="barcode" className="mt-6">
          <BarcodeScanner />
        </TabsContent>

        <TabsContent value="excel" className="mt-6">
          <ExcelImportComponent />
        </TabsContent>
      </Tabs>
    </div>
  );
}
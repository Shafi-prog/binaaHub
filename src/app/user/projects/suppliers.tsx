'use client';

import React, { useState } from 'react';
import { Typography, EnhancedCard, Button } from '@/core/shared/components/ui/enhanced-components';
import { Plus, Search, Phone, MessageCircle } from 'lucide-react';

export default function SuppliersPage() {
  const [activeTab, setActiveTab] = useState('supplier');
  const [searchQuery, setSearchQuery] = useState('');

  const suppliers = [
    {
      id: '1',
      name: 'شركة الخليج للمواد',
      specialty: 'مواد البناء',
      phone: '+966501234567',
      whatsapp: '+966501234567'
    },
    {
      id: '2',
      name: 'مؤسسة البناء المتقدم',
      specialty: 'أدوات السباكة',
      phone: '+966507654321',
      whatsapp: '+966507654321'
    }
  ];

  const contractors = [
    {
      id: '1',
      name: 'مقاول محمد العلي',
      specialty: 'البناء العام',
      phone: '+966551234567',
      whatsapp: '+966551234567'
    },
    {
      id: '2',
      name: 'مقاولات الرياض',
      specialty: 'التشطيبات',
      phone: '+966557654321',
      whatsapp: '+966557654321'
    }
  ];

  const currentData = activeTab === 'supplier' ? suppliers : contractors;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 font-tajawal">
      <div className="container mx-auto px-6 py-8">
        <Typography variant="heading" size="2xl" weight="bold" className="text-gray-800 mb-6">
          دليل الموردين
        </Typography>

        {/* Search Bar */}
        <EnhancedCard className="p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="البحث..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </EnhancedCard>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('supplier')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              activeTab === 'supplier'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border hover:bg-gray-50'
            }`}
          >
            مورد
          </button>
          <button
            onClick={() => setActiveTab('contractor')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              activeTab === 'contractor'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border hover:bg-gray-50'
            }`}
          >
            مقاول
          </button>
        </div>

        {/* Add New Button */}
        <div className="mb-6">
          <Button className="bg-green-600 text-white hover:bg-green-700 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {activeTab === 'supplier' ? 'إضافة مورد جديد' : 'إضافة مقاول جديد'}
          </Button>
        </div>

        {/* List */}
        <div className="space-y-4">
          {currentData.map((item) => (
            <EnhancedCard key={item.id} className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <Typography variant="subheading" size="lg" weight="semibold" className="text-gray-800 mb-1">
                    {item.name}
                  </Typography>
                  <Typography variant="body" size="sm" className="text-gray-600">
                    {item.specialty}
                  </Typography>
                </div>
                <div className="flex gap-2">
                  <button className="bg-green-100 text-green-600 p-2 rounded-lg hover:bg-green-200 transition-colors">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="bg-green-100 text-green-600 p-2 rounded-lg hover:bg-green-200 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </EnhancedCard>
          ))}
        </div>
      </div>
    </main>
  );
}

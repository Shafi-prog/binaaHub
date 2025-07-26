"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Calculator, Home, Ruler, DollarSign, Building, Wrench } from 'lucide-react';

export const dynamic = 'force-dynamic';

// Simple UI Components
const Card = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div 
      className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-200/30 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

interface CalculationResult {
  totalArea: number;
  foundationCost: number;
  structureCost: number;
  wallsCost: number;
  roofCost: number;
  finishingCost: number;
  totalCost: number;
  materials: {
    cement: number;
    steel: number;
    bricks: number;
    sand: number;
    gravel: number;
  };
}

export default function HouseConstructionCalculatorPage() {
  const [inputs, setInputs] = useState({
    length: '',
    width: '',
    floors: '1',
    quality: 'standard', // standard, premium, luxury
    hasBasement: false,
    hasGarden: false
  });

  const [result, setResult] = useState<CalculationResult | null>(null);

  const qualityMultipliers = {
    standard: 1.0,
    premium: 1.4,
    luxury: 2.0
  };

  const basePrices = {
    foundation: 120, // per sqm
    structure: 180, // per sqm
    walls: 150, // per sqm
    roof: 100, // per sqm
    finishing: 200 // per sqm
  };

  const materialPrices = {
    cement: 18.5, // per bag 50kg
    steel: 4.2, // per kg
    bricks: 0.35, // per brick
    sand: 45, // per cubic meter
    gravel: 55 // per cubic meter
  };

  const calculateConstruction = () => {
    const length = parseFloat(inputs.length);
    const width = parseFloat(inputs.width);
    const floors = parseInt(inputs.floors);

    if (!length || !width || !floors) {
      alert('يرجى إدخال جميع المقاسات المطلوبة');
      return;
    }

    const totalArea = length * width * floors;
    const multiplier = qualityMultipliers[inputs.quality as keyof typeof qualityMultipliers];
    
    // Calculate costs
    const foundationCost = (length * width) * basePrices.foundation * multiplier;
    const structureCost = totalArea * basePrices.structure * multiplier;
    const wallsCost = totalArea * basePrices.walls * multiplier;
    const roofCost = (length * width) * basePrices.roof * multiplier;
    const finishingCost = totalArea * basePrices.finishing * multiplier;

    // Additional costs
    const basementCost = inputs.hasBasement ? (length * width) * 80 * multiplier : 0;
    const gardenCost = inputs.hasGarden ? 15000 * multiplier : 0;

    const totalCost = foundationCost + structureCost + wallsCost + roofCost + finishingCost + basementCost + gardenCost;

    // Calculate materials
    const materials = {
      cement: Math.ceil((totalArea * 0.4) * multiplier), // bags
      steel: Math.ceil((totalArea * 15) * multiplier), // kg
      bricks: Math.ceil((totalArea * 50) * multiplier), // pieces
      sand: Math.ceil((totalArea * 0.3) * multiplier), // cubic meters
      gravel: Math.ceil((totalArea * 0.25) * multiplier) // cubic meters
    };

    setResult({
      totalArea,
      foundationCost,
      structureCost,
      wallsCost,
      roofCost,
      finishingCost,
      totalCost,
      materials
    });
  };

  const getQualityLabel = (quality: string) => {
    switch (quality) {
      case 'standard': return 'عادي';
      case 'premium': return 'ممتاز';
      case 'luxury': return 'فاخر';
      default: return 'عادي';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-purple-50/30 to-indigo-100/20"></div>
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 25%), 
                          radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.1) 0%, transparent 25%)`
      }}></div>
      
      <div className="relative container mx-auto px-4 max-w-6xl py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
            <Home className="w-8 h-8 text-blue-600" />
            حاسبة تكلفة بناء المنزل
          </h1>
          <p className="text-gray-600 text-lg">احسب التكلفة التقديرية لبناء منزلك بناءً على المساحة ونوع التشطيب</p>
          
          {/* Navigation Links */}
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Link href="/" className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl text-blue-600 hover:text-blue-700 hover:bg-white shadow-lg hover:shadow-xl transition-all border border-purple-200/30">الرئيسية</Link>
            <Link href="/stores-browse" className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl text-blue-600 hover:text-blue-700 hover:bg-white shadow-lg hover:shadow-xl transition-all border border-purple-200/30">تصفح المتاجر</Link>
            <Link href="/calculator" className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl text-blue-600 hover:text-blue-700 hover:bg-white shadow-lg hover:shadow-xl transition-all border border-purple-200/30">حاسبة المواد</Link>
            <Link href="/projects-for-sale" className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl text-blue-600 hover:text-blue-700 hover:bg-white shadow-lg hover:shadow-xl transition-all border border-purple-200/30">مشاريع للبيع</Link>
            <Link href="/auth/login" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl transition-all">تسجيل الدخول</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <Card className="p-6 h-fit">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Ruler className="w-5 h-5 text-blue-600" />
              مواصفات المنزل
            </h3>

            <div className="space-y-6">
              {/* Dimensions */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الطول (متر)</label>
                  <input
                    type="number"
                    value={inputs.length}
                    onChange={(e) => setInputs({...inputs, length: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="مثال: 15"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">العرض (متر)</label>
                  <input
                    type="number"
                    value={inputs.width}
                    onChange={(e) => setInputs({...inputs, width: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="مثال: 12"
                  />
                </div>
              </div>

              {/* Floors */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">عدد الطوابق</label>
                <select
                  value={inputs.floors}
                  onChange={(e) => setInputs({...inputs, floors: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="1">طابق واحد</option>
                  <option value="2">طابقان</option>
                  <option value="3">ثلاثة طوابق</option>
                  <option value="4">أربعة طوابق</option>
                </select>
              </div>

              {/* Quality */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">مستوى التشطيب</label>
                <select
                  value={inputs.quality}
                  onChange={(e) => setInputs({...inputs, quality: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="standard">عادي</option>
                  <option value="premium">ممتاز</option>
                  <option value="luxury">فاخر</option>
                </select>
              </div>

              {/* Additional Options */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="basement"
                    checked={inputs.hasBasement}
                    onChange={(e) => setInputs({...inputs, hasBasement: e.target.checked})}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="basement" className="mr-2 text-sm text-gray-700">
                    يشمل قبو (سرداب)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="garden"
                    checked={inputs.hasGarden}
                    onChange={(e) => setInputs({...inputs, hasGarden: e.target.checked})}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="garden" className="mr-2 text-sm text-gray-700">
                    يشمل تنسيق حديقة
                  </label>
                </div>
              </div>

              {/* Calculate Button */}
              <button
                onClick={calculateConstruction}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-medium flex items-center justify-center gap-2"
              >
                <Calculator className="w-5 h-5" />
                احسب التكلفة
              </button>
            </div>
          </Card>

          {/* Results Panel */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              النتائج والتكاليف
            </h3>

            {result ? (
              <div className="space-y-6">
                {/* Summary */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-3">ملخص المشروع</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">إجمالي المساحة:</span>
                      <div className="font-bold text-lg">{result.totalArea} م²</div>
                    </div>
                    <div>
                      <span className="text-gray-600">مستوى التشطيب:</span>
                      <div className="font-bold text-lg">{getQualityLabel(inputs.quality)}</div>
                    </div>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    تفصيل التكاليف
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span>الأساسات</span>
                      <span className="font-bold">{result.foundationCost.toLocaleString()} ر.س</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span>الهيكل الإنشائي</span>
                      <span className="font-bold">{result.structureCost.toLocaleString()} ر.س</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span>الجدران</span>
                      <span className="font-bold">{result.wallsCost.toLocaleString()} ر.س</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span>السقف</span>
                      <span className="font-bold">{result.roofCost.toLocaleString()} ر.س</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span>التشطيبات</span>
                      <span className="font-bold">{result.finishingCost.toLocaleString()} ر.س</span>
                    </div>
                  </div>
                </div>

                {/* Total Cost */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-green-900">إجمالي التكلفة:</span>
                    <span className="text-2xl font-bold text-green-700">{result.totalCost.toLocaleString()} ر.س</span>
                  </div>
                  <p className="text-sm text-green-600 mt-2">
                    تقريباً {Math.round(result.totalCost / result.totalArea)} ر.س للمتر المربع
                  </p>
                </div>

                {/* Materials */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Wrench className="w-4 h-4" />
                    الكميات المطلوبة
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span>الإسمنت:</span>
                      <span className="font-bold">{result.materials.cement} كيس</span>
                    </div>
                    <div className="flex justify-between">
                      <span>الحديد:</span>
                      <span className="font-bold">{result.materials.steel} كغ</span>
                    </div>
                    <div className="flex justify-between">
                      <span>الطوب:</span>
                      <span className="font-bold">{result.materials.bricks} قطعة</span>
                    </div>
                    <div className="flex justify-between">
                      <span>الرمل:</span>
                      <span className="font-bold">{result.materials.sand} م³</span>
                    </div>
                    <div className="flex justify-between">
                      <span>الحصى:</span>
                      <span className="font-bold">{result.materials.gravel} م³</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Home className="h-16 w-16 mx-auto" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">احسب تكلفة منزلك</h4>
                <p className="text-gray-600">أدخل مواصفات المنزل واضغط على احسب لعرض النتائج</p>
              </div>
            )}
          </Card>
        </div>

        {/* Note */}
        <Card className="p-6 mt-8 bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200/50">
          <h4 className="font-semibold text-yellow-900 mb-2">📋 ملاحظات مهمة:</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• هذه الحسابات تقديرية وقد تختلف حسب نوع المواد والموقع الجغرافي</li>
            <li>• لا تشمل التكاليف أسعار الأرض أو رخص البناء</li>
            <li>• يُنصح بإضافة 10-15% كاحتياطي للتكاليف غير المتوقعة</li>
            <li>• تعتمد الأسعار على متوسط السوق في المملكة العربية السعودية</li>
            <li>• للحصول على تقدير دقيق، استشر مقاول أو مهندس معماري</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

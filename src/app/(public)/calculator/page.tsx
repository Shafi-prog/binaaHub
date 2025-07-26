"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Home, Ruler, DollarSign, Building, Wrench } from 'lucide-react';

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

export default function PublicCalculatorPage() {
  const [activeCalculator, setActiveCalculator] = useState<string>('concrete');
  const [results, setResults] = useState<any>({});

  // Concrete Calculator
  const [concreteInputs, setConcreteInputs] = useState({
    length: '',
    width: '',
    thickness: ''
  });

  // Steel Calculator  
  const [steelInputs, setSteelInputs] = useState({
    length: '',
    width: '',
    floors: '',
    steelRatio: '120'
  });

  // Block Calculator
  const [blockInputs, setBlockInputs] = useState({
    length: '',
    width: '',
    height: '',
    blockSize: '20x20x40'
  });

  // Sand Calculator
  const [sandInputs, setSandInputs] = useState({
    length: '',
    width: '',
    thickness: ''
  });

  // House Construction Calculator
  const [houseInputs, setHouseInputs] = useState({
    length: '',
    width: '',
    floors: '1',
    quality: 'standard',
    hasBasement: false,
    hasGarden: false
  });

  const calculateConcrete = () => {
    const length = parseFloat(concreteInputs.length);
    const width = parseFloat(concreteInputs.width);
    const thickness = parseFloat(concreteInputs.thickness);

    if (length && width && thickness) {
      const volume = (length * width * thickness) / 100; // Convert cm to m
      const cementBags = Math.ceil(volume * 7); // 7 bags per cubic meter
      const sand = volume * 0.5; // 0.5 cubic meters sand
      const gravel = volume * 0.8; // 0.8 cubic meters gravel
      const water = volume * 150; // 150 liters water

      setResults({
        concrete: {
          volume: volume.toFixed(2),
          cement: cementBags,
          sand: sand.toFixed(2),
          gravel: gravel.toFixed(2),
          water: water.toFixed(0)
        }
      });
    }
  };

  const calculateSteel = () => {
    const length = parseFloat(steelInputs.length);
    const width = parseFloat(steelInputs.width);
    const floors = parseFloat(steelInputs.floors);
    const ratio = parseFloat(steelInputs.steelRatio);

    if (length && width && floors && ratio) {
      const area = length * width * floors;
      const steelWeight = (area * ratio) / 1000; // Convert to tons
      const cost = steelWeight * 2800; // Average cost per ton

      setResults({
        steel: {
          area: area.toFixed(2),
          weight: steelWeight.toFixed(2),
          cost: cost.toFixed(0)
        }
      });
    }
  };

  const calculateBlocks = () => {
    const length = parseFloat(blockInputs.length);
    const width = parseFloat(blockInputs.width);
    const height = parseFloat(blockInputs.height);

    if (length && width && height) {
      const wallArea = (length * height * 2) + (width * height * 2);
      
      // Block dimensions based on selection
      const blockDimensions = {
        '20x20x40': { area: 0.08, price: 1.5 },
        '15x20x40': { area: 0.06, price: 1.2 },
        '10x20x40': { area: 0.04, price: 1.0 }
      };

      const selectedBlock = blockDimensions[blockInputs.blockSize as keyof typeof blockDimensions];
      const blocksNeeded = Math.ceil(wallArea / selectedBlock.area);
      const totalCost = blocksNeeded * selectedBlock.price;

      setResults({
        blocks: {
          wallArea: wallArea.toFixed(2),
          blocksNeeded,
          costPerBlock: selectedBlock.price,
          totalCost: totalCost.toFixed(2)
        }
      });
    }
  };

  const calculateSand = () => {
    const length = parseFloat(sandInputs.length);
    const width = parseFloat(sandInputs.width);
    const thickness = parseFloat(sandInputs.thickness);

    if (length && width && thickness) {
      const volume = (length * width * thickness) / 100; // Convert cm to m
      const sandNeeded = volume * 1.3; // Add 30% for compaction
      const cost = sandNeeded * 45; // Average cost per cubic meter

      setResults({
        sand: {
          volume: volume.toFixed(2),
          sandNeeded: sandNeeded.toFixed(2),
          cost: cost.toFixed(0)
        }
      });
    }
  };

  // House Construction Calculator Logic
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

  const calculateHouseConstruction = () => {
    const length = parseFloat(houseInputs.length);
    const width = parseFloat(houseInputs.width);
    const floors = parseInt(houseInputs.floors);

    if (!length || !width || !floors) {
      alert('يرجى إدخال جميع المقاسات المطلوبة');
      return;
    }

    const totalArea = length * width * floors;
    const multiplier = qualityMultipliers[houseInputs.quality as keyof typeof qualityMultipliers];
    
    // Calculate costs
    const foundationCost = (length * width) * basePrices.foundation * multiplier;
    const structureCost = totalArea * basePrices.structure * multiplier;
    const wallsCost = totalArea * basePrices.walls * multiplier;
    const roofCost = (length * width) * basePrices.roof * multiplier;
    const finishingCost = totalArea * basePrices.finishing * multiplier;

    // Additional costs
    const basementCost = houseInputs.hasBasement ? (length * width) * 80 * multiplier : 0;
    const gardenCost = houseInputs.hasGarden ? 15000 * multiplier : 0;

    const totalCost = foundationCost + structureCost + wallsCost + roofCost + finishingCost + basementCost + gardenCost;

    // Calculate materials
    const materials = {
      cement: Math.ceil((totalArea * 0.4) * multiplier), // bags
      steel: Math.ceil((totalArea * 15) * multiplier), // kg
      bricks: Math.ceil((totalArea * 50) * multiplier), // pieces
      sand: Math.ceil((totalArea * 0.3) * multiplier), // cubic meters
      gravel: Math.ceil((totalArea * 0.25) * multiplier) // cubic meters
    };

    setResults({
      house: {
        totalArea,
        foundationCost,
        structureCost,
        wallsCost,
        roofCost,
        finishingCost,
        totalCost,
        materials,
        quality: houseInputs.quality
      }
    });
  };

  const calculators = [
    { id: 'concrete', name: 'حاسبة الخرسانة', icon: '🏗️' },
    { id: 'steel', name: 'حاسبة الحديد', icon: '🔩' },
    { id: 'blocks', name: 'حاسبة البلوك', icon: '🧱' },
    { id: 'sand', name: 'حاسبة الرمل', icon: '⛱️' },
    { id: 'house', name: 'حاسبة تكلفة المنزل', icon: '🏠' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-purple-50/30 to-indigo-100/20"></div>
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 25%), 
                          radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.1) 0%, transparent 25%)`
      }}></div>
      
      <div className="relative container mx-auto px-4 max-w-4xl py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">حاسبة البناء الشاملة</h1>
          <p className="text-gray-600 text-lg">احسب كميات مواد البناء وتكلفة المشاريع بدقة واحترافية</p>
          
          {/* Navigation Links */}
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Link href="/" className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl text-blue-600 hover:text-blue-700 hover:bg-white shadow-lg hover:shadow-xl transition-all border border-purple-200/30">الرئيسية</Link>
            <Link href="/stores-browse" className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl text-blue-600 hover:text-blue-700 hover:bg-white shadow-lg hover:shadow-xl transition-all border border-purple-200/30">تصفح المتاجر</Link>
            <Link href="/storefront" className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl text-blue-600 hover:text-blue-700 hover:bg-white shadow-lg hover:shadow-xl transition-all border border-purple-200/30">جميع المنتجات</Link>
            <Link href="/projects-for-sale" className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl text-blue-600 hover:text-blue-700 hover:bg-white shadow-lg hover:shadow-xl transition-all border border-purple-200/30">مشاريع للبيع</Link>
            <Link href="/login" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl transition-all">تسجيل الدخول</Link>
          </div>
        </div>

        {/* Calculator Tabs */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {calculators.map((calc) => (
              <button
                key={calc.id}
                onClick={() => setActiveCalculator(calc.id)}
                className={`p-4 rounded-xl text-center transition-all hover:scale-105 ${
                  activeCalculator === calc.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'bg-gray-100/70 text-gray-700 hover:bg-gray-200/70 shadow-md hover:shadow-lg'
                }`}
              >
                <div className="text-2xl mb-2">{calc.icon}</div>
                <div className="text-sm font-medium">{calc.name}</div>
              </button>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {calculators.find(c => c.id === activeCalculator)?.name}
            </h3>

            {/* Concrete Calculator */}
            {activeCalculator === 'concrete' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الطول (متر)
                  </label>
                  <input
                    type="number"
                    value={concreteInputs.length}
                    onChange={(e) => setConcreteInputs({...concreteInputs, length: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="أدخل الطول"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    العرض (متر)
                  </label>
                  <input
                    type="number"
                    value={concreteInputs.width}
                    onChange={(e) => setConcreteInputs({...concreteInputs, width: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="أدخل العرض"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    السماكة (سم)
                  </label>
                  <input
                    type="number"
                    value={concreteInputs.thickness}
                    onChange={(e) => setConcreteInputs({...concreteInputs, thickness: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="أدخل السماكة"
                  />
                </div>
                <button
                  onClick={calculateConcrete}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  احسب كمية الخرسانة
                </button>
              </div>
            )}

            {/* Steel Calculator */}
            {activeCalculator === 'steel' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    طول المبنى (متر)
                  </label>
                  <input
                    type="number"
                    value={steelInputs.length}
                    onChange={(e) => setSteelInputs({...steelInputs, length: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="أدخل طول المبنى"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    عرض المبنى (متر)
                  </label>
                  <input
                    type="number"
                    value={steelInputs.width}
                    onChange={(e) => setSteelInputs({...steelInputs, width: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="أدخل عرض المبنى"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    عدد الأدوار
                  </label>
                  <input
                    type="number"
                    value={steelInputs.floors}
                    onChange={(e) => setSteelInputs({...steelInputs, floors: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="أدخل عدد الأدوار"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    معدل الحديد (كجم/م²)
                  </label>
                  <select
                    value={steelInputs.steelRatio}
                    onChange={(e) => setSteelInputs({...steelInputs, steelRatio: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="100">100 كجم/م² - خفيف</option>
                    <option value="120">120 كجم/م² - متوسط</option>
                    <option value="150">150 كجم/م² - ثقيل</option>
                  </select>
                </div>
                <button
                  onClick={calculateSteel}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  احسب كمية الحديد
                </button>
              </div>
            )}

            {/* Block Calculator */}
            {activeCalculator === 'blocks' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    طول الجدار (متر)
                  </label>
                  <input
                    type="number"
                    value={blockInputs.length}
                    onChange={(e) => setBlockInputs({...blockInputs, length: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="أدخل طول الجدار"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    عرض الجدار (متر)
                  </label>
                  <input
                    type="number"
                    value={blockInputs.width}
                    onChange={(e) => setBlockInputs({...blockInputs, width: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="أدخل عرض الجدار"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ارتفاع الجدار (متر)
                  </label>
                  <input
                    type="number"
                    value={blockInputs.height}
                    onChange={(e) => setBlockInputs({...blockInputs, height: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="أدخل ارتفاع الجدار"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    مقاس البلوك
                  </label>
                  <select
                    value={blockInputs.blockSize}
                    onChange={(e) => setBlockInputs({...blockInputs, blockSize: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="20x20x40">20x20x40 سم</option>
                    <option value="15x20x40">15x20x40 سم</option>
                    <option value="10x20x40">10x20x40 سم</option>
                  </select>
                </div>
                <button
                  onClick={calculateBlocks}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  احسب كمية البلوك
                </button>
              </div>
            )}

            {/* Sand Calculator */}
            {activeCalculator === 'sand' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الطول (متر)
                  </label>
                  <input
                    type="number"
                    value={sandInputs.length}
                    onChange={(e) => setSandInputs({...sandInputs, length: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="أدخل الطول"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    العرض (متر)
                  </label>
                  <input
                    type="number"
                    value={sandInputs.width}
                    onChange={(e) => setSandInputs({...sandInputs, width: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="أدخل العرض"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    العمق (سم)
                  </label>
                  <input
                    type="number"
                    value={sandInputs.thickness}
                    onChange={(e) => setSandInputs({...sandInputs, thickness: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="أدخل العمق"
                  />
                </div>
                <button
                  onClick={calculateSand}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  احسب كمية الرمل
                </button>
              </div>
            )}

            {/* House Construction Calculator */}
            {activeCalculator === 'house' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الطول (متر)</label>
                    <input
                      type="number"
                      value={houseInputs.length}
                      onChange={(e) => setHouseInputs({...houseInputs, length: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="مثال: 15"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">العرض (متر)</label>
                    <input
                      type="number"
                      value={houseInputs.width}
                      onChange={(e) => setHouseInputs({...houseInputs, width: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="مثال: 12"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">عدد الطوابق</label>
                  <select
                    value={houseInputs.floors}
                    onChange={(e) => setHouseInputs({...houseInputs, floors: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1">طابق واحد</option>
                    <option value="2">طابقان</option>
                    <option value="3">ثلاثة طوابق</option>
                    <option value="4">أربعة طوابق</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">مستوى التشطيب</label>
                  <select
                    value={houseInputs.quality}
                    onChange={(e) => setHouseInputs({...houseInputs, quality: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="standard">عادي</option>
                    <option value="premium">ممتاز</option>
                    <option value="luxury">فاخر</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="basement"
                      checked={houseInputs.hasBasement}
                      onChange={(e) => setHouseInputs({...houseInputs, hasBasement: e.target.checked})}
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
                      checked={houseInputs.hasGarden}
                      onChange={(e) => setHouseInputs({...houseInputs, hasGarden: e.target.checked})}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="garden" className="mr-2 text-sm text-gray-700">
                      يشمل تنسيق حديقة
                    </label>
                  </div>
                </div>

                <button
                  onClick={calculateHouseConstruction}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  احسب تكلفة البناء
                </button>
              </div>
            )}
          </Card>

          {/* Results Panel */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">النتائج</h3>

            {results.concrete && activeCalculator === 'concrete' && (
              <div className="space-y-3">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">حجم الخرسانة</h4>
                  <p className="text-blue-800">{results.concrete.volume} متر مكعب</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>أكياس الأسمنت:</span>
                    <strong>{results.concrete.cement} كيس</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>الرمل:</span>
                    <strong>{results.concrete.sand} م³</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>الحصى:</span>
                    <strong>{results.concrete.gravel} م³</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>الماء:</span>
                    <strong>{results.concrete.water} لتر</strong>
                  </div>
                </div>
              </div>
            )}

            {results.steel && activeCalculator === 'steel' && (
              <div className="space-y-3">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-900 mb-2">المساحة الإجمالية</h4>
                  <p className="text-red-800">{results.steel.area} متر مربع</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>وزن الحديد:</span>
                    <strong>{results.steel.weight} طن</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>التكلفة التقريبية:</span>
                    <strong>{results.steel.cost} ريال</strong>
                  </div>
                </div>
              </div>
            )}

            {results.blocks && activeCalculator === 'blocks' && (
              <div className="space-y-3">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-2">مساحة الجدار</h4>
                  <p className="text-orange-800">{results.blocks.wallArea} متر مربع</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>عدد البلوك:</span>
                    <strong>{results.blocks.blocksNeeded} قطعة</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>سعر القطعة:</span>
                    <strong>{results.blocks.costPerBlock} ريال</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>التكلفة الإجمالية:</span>
                    <strong>{results.blocks.totalCost} ريال</strong>
                  </div>
                </div>
              </div>
            )}

            {results.sand && activeCalculator === 'sand' && (
              <div className="space-y-3">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-2">الحجم الأساسي</h4>
                  <p className="text-yellow-800">{results.sand.volume} متر مكعب</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>الكمية المطلوبة:</span>
                    <strong>{results.sand.sandNeeded} م³</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>التكلفة التقريبية:</span>
                    <strong>{results.sand.cost} ريال</strong>
                  </div>
                </div>
              </div>
            )}

            {results.house && activeCalculator === 'house' && (
              <div className="space-y-4">
                {/* Summary */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-3">ملخص المشروع</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">إجمالي المساحة:</span>
                      <div className="font-bold text-lg">{results.house.totalArea} م²</div>
                    </div>
                    <div>
                      <span className="text-gray-600">مستوى التشطيب:</span>
                      <div className="font-bold text-lg">
                        {results.house.quality === 'standard' ? 'عادي' : 
                         results.house.quality === 'premium' ? 'ممتاز' : 'فاخر'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    تفصيل التكاليف
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-1 border-b border-gray-200">
                      <span>الأساسات</span>
                      <span className="font-bold">{results.house.foundationCost.toLocaleString()} ر.س</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-gray-200">
                      <span>الهيكل الإنشائي</span>
                      <span className="font-bold">{results.house.structureCost.toLocaleString()} ر.س</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-gray-200">
                      <span>الجدران</span>
                      <span className="font-bold">{results.house.wallsCost.toLocaleString()} ر.س</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-gray-200">
                      <span>السقف</span>
                      <span className="font-bold">{results.house.roofCost.toLocaleString()} ر.س</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-gray-200">
                      <span>التشطيبات</span>
                      <span className="font-bold">{results.house.finishingCost.toLocaleString()} ر.س</span>
                    </div>
                  </div>
                </div>

                {/* Total Cost */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-green-900">إجمالي التكلفة:</span>
                    <span className="text-xl font-bold text-green-700">{results.house.totalCost.toLocaleString()} ر.س</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    تقريباً {Math.round(results.house.totalCost / results.house.totalArea)} ر.س للمتر المربع
                  </p>
                </div>

                {/* Materials */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Wrench className="w-4 h-4" />
                    الكميات المطلوبة
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>الإسمنت:</span>
                      <span className="font-bold">{results.house.materials.cement} كيس</span>
                    </div>
                    <div className="flex justify-between">
                      <span>الحديد:</span>
                      <span className="font-bold">{results.house.materials.steel} كغ</span>
                    </div>
                    <div className="flex justify-between">
                      <span>الطوب:</span>
                      <span className="font-bold">{results.house.materials.bricks} قطعة</span>
                    </div>
                    <div className="flex justify-between">
                      <span>الرمل:</span>
                      <span className="font-bold">{results.house.materials.sand} م³</span>
                    </div>
                    <div className="flex justify-between">
                      <span>الحصى:</span>
                      <span className="font-bold">{results.house.materials.gravel} م³</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!results.concrete && !results.steel && !results.blocks && !results.sand && !results.house && (
              <div className="text-center text-gray-500 py-8">
                <div className="text-4xl mb-2">🧮</div>
                <p>أدخل القياسات واضغط على احسب لعرض النتائج</p>
              </div>
            )}
          </Card>
        </div>

        {/* Note */}
        <Card className="p-6 mt-6 bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200/50">
          <p className="text-sm text-yellow-800">
            <strong>ملاحظة:</strong> هذه الحسابات تقديرية وقد تختلف حسب نوع المواد والظروف المحلية. 
            يُنصح بإضافة 5-10% للكميات كاحتياطي.
          </p>
        </Card>
      </div>
    </div>
  );
}

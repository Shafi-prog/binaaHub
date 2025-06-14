import { NextRequest, NextResponse } from 'next/server';

interface ExtractedData {
  rooms: Array<{
    name: string;
    width: number;
    length: number;
    height?: number;
    area: number;
  }>;
  totalArea: number;
  dimensions: {
    plotWidth?: number;
    plotLength?: number;
    floors?: number;
  };
  specifications: {
    foundationType?: string;
    wallType?: string;
    roofType?: string;
    finishLevel?: string;
  };
  quantities: {
    walls: number;
    doors: number;
    windows: number;
    electricalPoints: number;
    plumbingFixtures: number;
  };
  confidence: number;
}

interface CostCalculationRequest {
  extractedData: ExtractedData;
  location: string;
  finishLevel: string;
}

// Saudi Arabia construction cost database (2025 prices)
const CONSTRUCTION_COSTS = {
  // Base costs per square meter in SAR
  baseCosts: {
    foundation: 180, // per m²
    structure: 320, // per m²
    walls: 150, // per m²
    roofing: 200, // per m²
    electrical: 80, // per m²
    plumbing: 120, // per m²
    finishing: 250, // per m²
  },
  
  // Material costs in SAR
  materials: {
    concrete: { price: 450, unit: 'm³' },
    steel: { price: 3.2, unit: 'kg' },
    bricks: { price: 0.45, unit: 'piece' },
    cement: { price: 15, unit: 'bag' },
    sand: { price: 35, unit: 'm³' },
    tiles: { price: 25, unit: 'm²' },
    paint: { price: 8, unit: 'liter' },
    doors: { price: 800, unit: 'piece' },
    windows: { price: 600, unit: 'piece' },
    electrical_points: { price: 150, unit: 'point' },
    plumbing_fixtures: { price: 1200, unit: 'fixture' }
  },

  // Labor rates per day in SAR
  labor: {
    mason: 200,
    carpenter: 220,
    electrician: 250,
    plumber: 240,
    painter: 180,
    helper: 120
  },

  // Location multipliers
  locationMultipliers: {
    'الرياض': 1.0,
    'جدة': 1.05,
    'الدمام': 0.95,
    'مكة المكرمة': 1.03,
    'المدينة المنورة': 0.98,
    'الطائف': 0.92,
    'تبوك': 0.88,
    'أبها': 0.85
  },

  // Finish level multipliers
  finishMultipliers: {
    'basic': 0.8,
    'standard': 1.0,
    'premium': 1.4,
    'luxury': 1.8,
    'super_luxury': 2.5
  }
};

function calculateMaterialQuantities(data: ExtractedData) {
  const { totalArea, quantities, dimensions } = data;
  const floors = dimensions.floors || 1;
  
  // Calculate material quantities based on extracted data
  const materials = [
    {
      name: 'خرسانة مسلحة',
      quantity: Math.round(totalArea * 0.3 * floors), // 0.3 m³ per m²
      unit: 'm³',
      unitPrice: CONSTRUCTION_COSTS.materials.concrete.price,
      totalPrice: 0
    },
    {
      name: 'حديد التسليح',
      quantity: Math.round(totalArea * 25 * floors), // 25 kg per m²
      unit: 'kg',
      unitPrice: CONSTRUCTION_COSTS.materials.steel.price,
      totalPrice: 0
    },
    {
      name: 'طوب أحمر',
      quantity: Math.round(quantities.walls * 65), // 65 bricks per linear meter
      unit: 'piece',
      unitPrice: CONSTRUCTION_COSTS.materials.bricks.price,
      totalPrice: 0
    },
    {
      name: 'أكياس الأسمنت',
      quantity: Math.round(totalArea * 2.5), // 2.5 bags per m²
      unit: 'bag',
      unitPrice: CONSTRUCTION_COSTS.materials.cement.price,
      totalPrice: 0
    },
    {
      name: 'رمل',
      quantity: Math.round(totalArea * 0.4), // 0.4 m³ per m²
      unit: 'm³',
      unitPrice: CONSTRUCTION_COSTS.materials.sand.price,
      totalPrice: 0
    },
    {
      name: 'بلاط السيراميك',
      quantity: Math.round(totalArea * 1.1), // 10% extra for waste
      unit: 'm²',
      unitPrice: CONSTRUCTION_COSTS.materials.tiles.price,
      totalPrice: 0
    },
    {
      name: 'دهان',
      quantity: Math.round(totalArea * 0.5), // 0.5 liter per m²
      unit: 'liter',
      unitPrice: CONSTRUCTION_COSTS.materials.paint.price,
      totalPrice: 0
    },
    {
      name: 'أبواب',
      quantity: quantities.doors,
      unit: 'piece',
      unitPrice: CONSTRUCTION_COSTS.materials.doors.price,
      totalPrice: 0
    },
    {
      name: 'نوافذ',
      quantity: quantities.windows,
      unit: 'piece',
      unitPrice: CONSTRUCTION_COSTS.materials.windows.price,
      totalPrice: 0
    },
    {
      name: 'نقاط كهربائية',
      quantity: quantities.electricalPoints,
      unit: 'point',
      unitPrice: CONSTRUCTION_COSTS.materials.electrical_points.price,
      totalPrice: 0
    },
    {
      name: 'تجهيزات السباكة',
      quantity: quantities.plumbingFixtures,
      unit: 'fixture',
      unitPrice: CONSTRUCTION_COSTS.materials.plumbing_fixtures.price,
      totalPrice: 0
    }
  ];

  // Calculate total price for each material
  materials.forEach(material => {
    material.totalPrice = material.quantity * material.unitPrice;
  });

  return materials;
}

function calculateLaborCosts(data: ExtractedData, totalArea: number) {
  // Estimate labor days based on area and complexity
  const baseDays = Math.ceil(totalArea / 10); // 10 m² per day base rate
  
  return {
    mason: baseDays * 3 * CONSTRUCTION_COSTS.labor.mason,
    carpenter: baseDays * 2 * CONSTRUCTION_COSTS.labor.carpenter,
    electrician: baseDays * 1.5 * CONSTRUCTION_COSTS.labor.electrician,
    plumber: baseDays * 1.5 * CONSTRUCTION_COSTS.labor.plumber,
    painter: baseDays * 1 * CONSTRUCTION_COSTS.labor.painter,
    helper: baseDays * 4 * CONSTRUCTION_COSTS.labor.helper
  };
}

function calculateTimeline(totalArea: number, complexity: number = 1) {
  // Base timeline calculation
  const baseMonths = Math.ceil(totalArea / 50); // 50 m² per month
  const estimatedDuration = Math.max(3, baseMonths * complexity);
  
  const phases = [
    { name: 'الأساسات والحفر', duration: Math.ceil(estimatedDuration * 0.15), cost: 0 },
    { name: 'الهيكل الإنشائي', duration: Math.ceil(estimatedDuration * 0.25), cost: 0 },
    { name: 'الجدران والسقف', duration: Math.ceil(estimatedDuration * 0.2), cost: 0 },
    { name: 'الكهرباء والسباكة', duration: Math.ceil(estimatedDuration * 0.15), cost: 0 },
    { name: 'التشطيبات الداخلية', duration: Math.ceil(estimatedDuration * 0.15), cost: 0 },
    { name: 'التشطيبات الخارجية', duration: Math.ceil(estimatedDuration * 0.1), cost: 0 }
  ];

  return {
    estimated_duration: estimatedDuration,
    phases
  };
}

function generateRecommendations(data: ExtractedData, totalCost: number): string[] {
  const recommendations = [];
  
  if (data.confidence < 85) {
    recommendations.push('دقة استخراج البيانات أقل من 85%. يُنصح بمراجعة البيانات المستخرجة يدوياً.');
  }
  
  if (data.totalArea > 200) {
    recommendations.push('المساحة كبيرة. فكر في تقسيم المشروع إلى مراحل لتوزيع التكاليف.');
  }
  
  if (data.quantities.electricalPoints / data.totalArea < 0.2) {
    recommendations.push('عدد النقاط الكهربائية قليل نسبياً. فكر في إضافة المزيد من المنافذ.');
  }
  
  recommendations.push('احصل على عروض أسعار من 3 مقاولين على الأقل للمقارنة.');
  recommendations.push('اطلب ضمانات على المواد والعمالة لمدة لا تقل عن سنتين.');
  recommendations.push('تأكد من حصولك على جميع التراخيص اللازمة قبل البدء.');
  
  if (totalCost > 500000) {
    recommendations.push('التكلفة مرتفعة. فكر في مراجعة المواصفات أو البحث عن بدائل أقل تكلفة.');
  }

  return recommendations;
}

function generateAlternatives(materials: any[], totalCost: number) {
  const alternatives = [];
  
  // Suggest alternative materials
  alternatives.push({
    description: 'استخدام الطوب الإسمنتي بدلاً من الطوب الأحمر',
    savings: Math.round(totalCost * 0.08),
    impact: 'توفير في التكلفة مع الحفاظ على الجودة'
  });
  
  alternatives.push({
    description: 'استخدام الدهانات المحلية بدلاً من المستوردة',
    savings: Math.round(totalCost * 0.03),
    impact: 'توفير بسيط مع جودة مقبولة'
  });
  
  alternatives.push({
    description: 'تنفيذ المشروع على مراحل متعددة',
    savings: Math.round(totalCost * 0.05),
    impact: 'تقليل الضغط المالي وتحسين إدارة التدفق النقدي'
  });

  return alternatives;
}

export async function POST(request: NextRequest) {
  try {
    const body: CostCalculationRequest = await request.json();
    const { extractedData, location, finishLevel } = body;

    if (!extractedData || !extractedData.totalArea) {
      return NextResponse.json(
        { error: 'بيانات المخطط المستخرجة غير صالحة' },
        { status: 400 }
      );
    }

    console.log('💰 [Blueprint Cost Calculator] Calculating costs for:', {
      area: extractedData.totalArea,
      location,
      finishLevel,
      rooms: extractedData.rooms.length
    });

    // Get multipliers
    const locationMultiplier = CONSTRUCTION_COSTS.locationMultipliers[location as keyof typeof CONSTRUCTION_COSTS.locationMultipliers] || 1.0;
    const finishMultiplier = CONSTRUCTION_COSTS.finishMultipliers[finishLevel as keyof typeof CONSTRUCTION_COSTS.finishMultipliers] || 1.0;

    // Calculate material quantities and costs
    const materials = calculateMaterialQuantities(extractedData);
    
    // Calculate cost breakdown
    const { totalArea } = extractedData;
    const breakdown = {
      foundation: Math.round(totalArea * CONSTRUCTION_COSTS.baseCosts.foundation * locationMultiplier),
      structure: Math.round(totalArea * CONSTRUCTION_COSTS.baseCosts.structure * locationMultiplier),
      walls: Math.round(totalArea * CONSTRUCTION_COSTS.baseCosts.walls * locationMultiplier),
      roofing: Math.round(totalArea * CONSTRUCTION_COSTS.baseCosts.roofing * locationMultiplier),
      electrical: Math.round(totalArea * CONSTRUCTION_COSTS.baseCosts.electrical * locationMultiplier),
      plumbing: Math.round(totalArea * CONSTRUCTION_COSTS.baseCosts.plumbing * locationMultiplier),
      finishing: Math.round(totalArea * CONSTRUCTION_COSTS.baseCosts.finishing * finishMultiplier * locationMultiplier),
      labor: 0
    };

    // Calculate labor costs
    const laborCosts = calculateLaborCosts(extractedData, totalArea);
    breakdown.labor = Object.values(laborCosts).reduce((sum, cost) => sum + cost, 0);

    // Calculate total cost
    const materialsCost = materials.reduce((sum, material) => sum + material.totalPrice, 0);
    const constructionCost = Object.values(breakdown).reduce((sum, cost) => sum + cost, 0);
    const totalCost = Math.round((materialsCost + constructionCost) * locationMultiplier * finishMultiplier);

    // Generate timeline
    const timeline = calculateTimeline(totalArea);
    
    // Distribute costs across phases
    const phaseMultipliers = [0.15, 0.25, 0.2, 0.15, 0.15, 0.1];
    timeline.phases.forEach((phase, index) => {
      phase.cost = Math.round(totalCost * phaseMultipliers[index]);
    });

    // Generate recommendations and alternatives
    const recommendations = generateRecommendations(extractedData, totalCost);
    const alternatives = generateAlternatives(materials, totalCost);

    const estimate = {
      totalCost,
      breakdown,
      materials,
      timeline,
      recommendations,
      alternatives,
      locationMultiplier,
      finishMultiplier,
      calculationDate: new Date().toISOString(),
      disclaimer: 'التكاليف تقديرية وقد تختلف حسب ظروف السوق والمقاول المختار'
    };

    console.log('✅ [Blueprint Cost Calculator] Calculation complete:', {
      totalCost,
      materialsCost,
      location,
      finishLevel
    });

    return NextResponse.json({
      success: true,
      message: 'تم حساب التكاليف بنجاح',
      estimate,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ [Blueprint Cost Calculator] Error:', error);
    
    return NextResponse.json(
      { 
        error: 'حدث خطأ أثناء حساب التكاليف',
        details: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    );
  }
}

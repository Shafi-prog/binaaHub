import { NextRequest, NextResponse } from 'next/server';

// Mock construction cost calculation with AI
interface ProjectSpecs {
  projectType: string;
  area: number;
  floors: number;
  location: string;
  finishLevel: string;
  timeline: string;
}

interface MaterialData {
  material: string;
  baseQuantityPerSqm: number;
  basePrice: number;
  unit: string;
  suppliers: string[];
  alternatives: Array<{
    material: string;
    priceReduction: number;
  }>;
}

// Construction materials database (in production, this would be from a real database)
const materialsDatabase: Record<string, MaterialData[]> = {
  villa: [
    {
      material: "خرسانة مسلحة",
      baseQuantityPerSqm: 0.3,
      basePrice: 450,
      unit: "متر مكعب",
      suppliers: ["شركة الخرسانة المتطورة", "مصنع الرياض للخرسانة"],
      alternatives: [
        { material: "خرسانة عادية", priceReduction: 80 },
        { material: "خرسانة خفيفة", priceReduction: 50 }
      ]
    },
    {
      material: "حديد التسليح",
      baseQuantityPerSqm: 25,
      basePrice: 3.2,
      unit: "كيلوجرام",
      suppliers: ["حديد الراجحي", "مصانع اليمامة"],
      alternatives: [
        { material: "حديد محلي", priceReduction: 0.5 },
        { material: "حديد مستورد عالي الجودة", priceReduction: -0.8 }
      ]
    },
    {
      material: "طوب أحمر",
      baseQuantityPerSqm: 65,
      basePrice: 0.45,
      unit: "حبة",
      suppliers: ["مصنع الطوب السعودي", "طوب القصيم"],
      alternatives: [
        { material: "بلوك خرساني", priceReduction: 0.15 },
        { material: "طوب حراري", priceReduction: -0.25 }
      ]
    },
    {
      material: "أسمنت بورتلاند",
      baseQuantityPerSqm: 8,
      basePrice: 15,
      unit: "كيس 50 كيلو",
      suppliers: ["أسمنت اليمامة", "الشركة السعودية للأسمنت"],
      alternatives: [
        { material: "أسمنت مقاوم للكبريتات", priceReduction: -3 },
        { material: "أسمنت سريع التصلب", priceReduction: -5 }
      ]
    },
    {
      material: "رمل غسيل",
      baseQuantityPerSqm: 0.5,
      basePrice: 35,
      unit: "متر مكعب",
      suppliers: ["مقالع الرياض", "رمال الخرج"],
      alternatives: [
        { material: "رمل عادي", priceReduction: 10 },
        { material: "رمل مكسر", priceReduction: 5 }
      ]
    },
    {
      material: "بلاط سيراميك",
      baseQuantityPerSqm: 1.1,
      basePrice: 25,
      unit: "متر مربع",
      suppliers: ["سيراميكا السعودية", "الجوهرة للسيراميك"],
      alternatives: [
        { material: "بلاط محلي", priceReduction: 10 },
        { material: "بورسلين مستورد", priceReduction: -15 }
      ]
    }
  ],
  apartment: [
    // Apartment materials (similar structure but different quantities)
    {
      material: "خرسانة مسلحة",
      baseQuantityPerSqm: 0.25,
      basePrice: 450,
      unit: "متر مكعب",
      suppliers: ["شركة الخرسانة المتطورة"],
      alternatives: []
    }
    // ... more materials
  ],
  commercial: [
    // Commercial building materials
    {
      material: "هيكل معدني",
      baseQuantityPerSqm: 35,
      basePrice: 8.5,
      unit: "كيلوجرام",
      suppliers: ["الحديد والصلب السعودية"],
      alternatives: []
    }
    // ... more materials
  ]
};

// Location-based price multipliers
const locationMultipliers: Record<string, number> = {
  riyadh: 1.0,
  jeddah: 1.1,
  dammam: 1.05,
  mecca: 1.15,
  medina: 1.1,
  other: 0.9
};

// Finish level multipliers
const finishMultipliers: Record<string, number> = {
  basic: 1.0,
  standard: 1.3,
  luxury: 1.8,
  super_luxury: 2.5
};

// Timeline multipliers (rush jobs cost more)
const timelineMultipliers: Record<string, number> = {
  fast: 1.25,
  normal: 1.0,
  slow: 0.95
};

async function calculateConstructionCost(projectSpecs: ProjectSpecs): Promise<any> {
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 3000));

  const materials = materialsDatabase[projectSpecs.projectType] || materialsDatabase.villa;
  const locationMultiplier = locationMultipliers[projectSpecs.location] || 1.0;
  const finishMultiplier = finishMultipliers[projectSpecs.finishLevel] || 1.0;
  const timelineMultiplier = timelineMultipliers[projectSpecs.timeline] || 1.0;

  // Calculate materials with AI optimization
  const materialsBreakdown = materials.map(material => {
    const baseQuantity = material.baseQuantityPerSqm * projectSpecs.area * projectSpecs.floors;
    const adjustedPrice = material.basePrice * locationMultiplier * finishMultiplier;
    const totalPrice = baseQuantity * adjustedPrice;

    // AI suggests alternatives to save costs
    const alternatives = material.alternatives.map(alt => ({
      material: alt.material,
      price: (adjustedPrice + alt.priceReduction) * baseQuantity,
      savings: totalPrice - ((adjustedPrice + alt.priceReduction) * baseQuantity)
    })).filter(alt => alt.savings > 0);

    return {
      material: material.material,
      quantity: Math.round(baseQuantity * 100) / 100,
      unit: material.unit,
      unitPrice: Math.round(adjustedPrice * 100) / 100,
      totalPrice: Math.round(totalPrice * 100) / 100,
      supplier: material.suppliers[0],
      alternatives: alternatives.slice(0, 2) // Top 2 alternatives
    };
  });

  const materialsCost = materialsBreakdown.reduce((sum, item) => sum + item.totalPrice, 0);

  // Labor cost calculation (AI-enhanced)
  const baseLaborCostPerSqm = getBaseLaborCost(projectSpecs.projectType);
  const laborCost = baseLaborCostPerSqm * projectSpecs.area * projectSpecs.floors * 
                   locationMultiplier * finishMultiplier * timelineMultiplier;

  // AI risk assessment
  const riskFactor = calculateRiskFactor(projectSpecs);
  
  // Total cost with AI adjustments
  const subtotal = materialsCost + laborCost;
  const totalCost = subtotal * (1 + riskFactor);

  // AI-generated recommendations
  const recommendations = generateAIRecommendations(projectSpecs, materialsBreakdown, riskFactor);

  // Timeline estimation
  const timelineEstimate = estimateTimeline(projectSpecs);

  return {
    totalCost: Math.round(totalCost),
    materialsBreakdown,
    laborCost: Math.round(laborCost),
    riskFactor,
    confidenceScore: calculateConfidenceScore(projectSpecs),
    recommendations,
    timelineEstimate,
    priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('ar-SA')
  };
}

function getBaseLaborCost(projectType: string): number {
  const laborCosts: Record<string, number> = {
    villa: 280,
    apartment: 220,
    commercial: 320,
    warehouse: 180,
    mosque: 350
  };
  return laborCosts[projectType] || 250;
}

function calculateRiskFactor(specs: ProjectSpecs): number {
  let risk = 0.05; // Base 5% risk

  // Timeline risk
  if (specs.timeline === 'fast') risk += 0.08;
  else if (specs.timeline === 'slow') risk -= 0.02;

  // Location risk
  if (specs.location === 'other') risk += 0.03;

  // Project complexity risk
  if (specs.floors > 3) risk += 0.03;
  if (specs.area > 500) risk += 0.02;

  // Finish level risk
  if (specs.finishLevel === 'luxury' || specs.finishLevel === 'super_luxury') {
    risk += 0.05;
  }

  return Math.min(risk, 0.25); // Cap at 25%
}

function generateAIRecommendations(specs: ProjectSpecs, materials: any[], riskFactor: number): string[] {
  const recommendations = [];

  // Cost optimization recommendations
  const totalSavings = materials.reduce((sum, material) => {
    return sum + (material.alternatives?.reduce((altSum: number, alt: any) => altSum + alt.savings, 0) || 0);
  }, 0);

  if (totalSavings > 50000) {
    recommendations.push(`يمكن توفير ${Math.round(totalSavings).toLocaleString()} ريال باستخدام البدائل المقترحة`);
  }

  // Timeline recommendations
  if (specs.timeline === 'fast') {
    recommendations.push('التنفيذ السريع يزيد التكلفة 25% - فكر في تمديد المدة لتوفير التكاليف');
  }

  // Risk mitigation
  if (riskFactor > 0.15) {
    recommendations.push('مخاطر المشروع عالية - يُنصح بزيادة الميزانية الاحتياطية بنسبة 10%');
  }

  // Material recommendations
  if (specs.area > 300) {
    recommendations.push('للمشاريع الكبيرة: فكر في الشراء بالجملة للحصول على خصومات أفضل');
  }

  // Location-specific advice
  if (specs.location === 'jeddah' || specs.location === 'mecca') {
    recommendations.push('أسعار المواد في هذه المنطقة أعلى بـ 10-15% - فكر في الشراء من الرياض');
  }

  // Quality recommendations
  if (specs.finishLevel === 'basic') {
    recommendations.push('التشطيب الأساسي قد يؤثر على قيمة العقار - فكر في الترقية للتشطيب العادي');
  }

  return recommendations.slice(0, 5); // Top 5 recommendations
}

function estimateTimeline(specs: ProjectSpecs): string {
  let months = 6; // Base timeline

  // Adjust for area
  months += Math.floor(specs.area / 100);

  // Adjust for floors
  months += (specs.floors - 1) * 2;

  // Adjust for finish level
  if (specs.finishLevel === 'luxury') months += 3;
  else if (specs.finishLevel === 'super_luxury') months += 6;

  // Adjust for timeline preference
  if (specs.timeline === 'fast') months *= 0.7;
  else if (specs.timeline === 'slow') months *= 1.3;

  return `${Math.round(months)} شهر`;
}

function calculateConfidenceScore(specs: ProjectSpecs): number {
  let confidence = 0.85; // Base confidence

  // More complete specs = higher confidence
  if (specs.location) confidence += 0.05;
  if (specs.finishLevel) confidence += 0.05;
  if (specs.timeline) confidence += 0.03;

  // Standard project types have higher confidence
  if (['villa', 'apartment'].includes(specs.projectType)) confidence += 0.02;

  return Math.min(confidence, 0.98);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, projectSpecs, timestamp } = body;

    if (!userId || !projectSpecs) {
      return NextResponse.json(
        { error: 'بيانات المشروع غير مكتملة' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!projectSpecs.projectType || !projectSpecs.area) {
      return NextResponse.json(
        { error: 'يرجى تحديد نوع المشروع والمساحة على الأقل' },
        { status: 400 }
      );
    }

    // Calculate with AI
    const estimate = await calculateConstructionCost(projectSpecs);

    // Log calculation for analytics
    console.log('Construction cost calculated:', {
      userId,
      projectSpecs,
      totalCost: estimate.totalCost,
      timestamp
    });

    return NextResponse.json({
      success: true,
      estimate,
      message: 'تم حساب التكلفة بنجاح'
    });

  } catch (error) {
    console.error('Construction cost calculation error:', error);
    return NextResponse.json(
      { error: 'فشل في حساب تكلفة البناء' },
      { status: 500 }
    );
  }
}

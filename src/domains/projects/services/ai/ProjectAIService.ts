'use client';

export interface InvoiceData {
  vendorName: string;
  invoiceNumber: string;
  date: string;
  totalAmount: number;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  taxAmount?: number;
  dueDate?: string;
}

export interface WarrantyData {
  productName: string;
  manufacturer: string;
  warrantyPeriod: string;
  startDate: string;
  endDate: string;
  coverage: string[];
  serialNumber?: string;
  modelNumber?: string;
}

export interface ConstructionAdvice {
  stage: string;
  recommendations: string[];
  safetyTips: string[];
  estimatedDuration: string;
  requiredMaterials: string[];
  commonIssues: string[];
}

export interface BudgetAnalysis {
  projectId: string;
  totalBudget: number;
  spentAmount: number;
  remainingBudget: number;
  categories: Array<{
    name: string;
    budgeted: number;
    spent: number;
    variance: number;
  }>;
  recommendations: string[];
  alerts: Array<{
    type: 'warning' | 'error' | 'info';
    message: string;
  }>;
}

export class ProjectAIService {
  async extractInvoiceData(file: File): Promise<InvoiceData> {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock invoice data extraction
    return {
      vendorName: 'Construction Materials Co.',
      invoiceNumber: 'INV-2025-001',
      date: new Date().toISOString().split('T')[0],
      totalAmount: 2500.00,
      items: [
        {
          description: 'Concrete Mix - 50 bags',
          quantity: 50,
          unitPrice: 12.00,
          totalPrice: 600.00
        },
        {
          description: 'Steel Rebar - 20 pieces',
          quantity: 20,
          unitPrice: 95.00,
          totalPrice: 1900.00
        }
      ],
      taxAmount: 200.00,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
  }

  async recognizeWarrantyInfo(file: File): Promise<WarrantyData> {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock warranty data extraction
    return {
      productName: 'High-Grade Concrete Mixer',
      manufacturer: 'BuildTech Industries',
      warrantyPeriod: '2 years',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      coverage: [
        'Manufacturing defects',
        'Motor replacement',
        'Parts and labor',
        'On-site service'
      ],
      serialNumber: 'CM-2025-789456',
      modelNumber: 'BT-MX-500'
    };
  }

  async generateConstructionAdvice(projectType: string, stage: string): Promise<ConstructionAdvice> {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock construction advice generation
    const adviceMap: Record<string, ConstructionAdvice> = {
      foundation: {
        stage: 'Foundation',
        recommendations: [
          'Ensure proper soil testing before excavation',
          'Use high-quality concrete mix for foundation',
          'Install proper drainage systems',
          'Allow adequate curing time (minimum 7 days)'
        ],
        safetyTips: [
          'Always use safety harnesses when working at height',
          'Ensure proper ventilation in enclosed spaces',
          'Use appropriate PPE including hard hats and safety boots',
          'Keep emergency contact numbers readily available'
        ],
        estimatedDuration: '7-10 days',
        requiredMaterials: [
          'Concrete mix',
          'Steel reinforcement',
          'Waterproofing membrane',
          'Drainage pipes'
        ],
        commonIssues: [
          'Poor soil conditions',
          'Water infiltration',
          'Incorrect reinforcement placement',
          'Inadequate curing'
        ]
      },
      framing: {
        stage: 'Framing',
        recommendations: [
          'Use kiln-dried lumber to prevent warping',
          'Follow local building codes for spacing',
          'Install proper structural connections',
          'Check for square and level throughout process'
        ],
        safetyTips: [
          'Use nail guns with safety features',
          'Install temporary bracing during construction',
          'Be aware of electrical lines when using metal tools',
          'Use proper lifting techniques for heavy materials'
        ],
        estimatedDuration: '14-21 days',
        requiredMaterials: [
          'Dimensional lumber',
          'Metal connectors',
          'Fasteners and nails',
          'Temporary bracing materials'
        ],
        commonIssues: [
          'Lumber defects',
          'Incorrect measurements',
          'Poor quality fasteners',
          'Weather delays'
        ]
      }
    };

    return adviceMap[stage] || adviceMap.foundation;
  }

  async analyzeBudgetVariance(projectId: string): Promise<BudgetAnalysis> {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock budget analysis
    return {
      projectId,
      totalBudget: 150000,
      spentAmount: 85000,
      remainingBudget: 65000,
      categories: [
        {
          name: 'Materials',
          budgeted: 60000,
          spent: 42000,
          variance: 18000
        },
        {
          name: 'Labor',
          budgeted: 50000,
          spent: 28000,
          variance: 22000
        },
        {
          name: 'Equipment',
          budgeted: 25000,
          spent: 15000,
          variance: 10000
        },
        {
          name: 'Permits & Fees',
          budgeted: 15000,
          spent: 0,
          variance: 15000
        }
      ],
      recommendations: [
        'Consider bulk purchasing for materials to reduce costs',
        'Schedule permits and inspections to avoid delays',
        'Monitor labor hours closely to stay within budget',
        'Review equipment rental vs. purchase decisions'
      ],
      alerts: [
        {
          type: 'info',
          message: 'Project is currently 10% under budget'
        },
        {
          type: 'warning',
          message: 'Permits and fees category shows no spending - ensure compliance'
        }
      ]
    };
  }
}

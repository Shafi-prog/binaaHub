// Construction Guidance Service
// Based on Saudi Building Code (SBC) and MOMAH requirements

export interface ConstructionPhase {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  order: number;
  duration: number; // days
  dependencies: string[]; // phase IDs that must be completed first
  documents: ConstructionDocument[];
  checkpoints: QualityCheckpoint[];
  materials: PhaseMaterial[];
  regulations: RegulationReference[];
  tips: string[];
  warnings: string[];
}

export interface ConstructionDocument {
  id: string;
  name: string;
  type: 'permit' | 'inspection' | 'certificate' | 'plan' | 'report';
  required: boolean;
  authority: string; // MOMAH, Municipality, etc.
  downloadUrl?: string;
  templateUrl?: string;
}

export interface QualityCheckpoint {
  id: string;
  name: string;
  description: string;
  inspectionType: 'self' | 'supervisor' | 'authority';
  criteria: string[];
  photos: boolean; // requires photo documentation
  mandatory: boolean;
}

export interface PhaseMaterial {
  materialId: string;
  name: string;
  quantity: number;
  unit: string;
  specifications: string[];
  sbcCompliant: boolean;
  suppliers: string[];
}

export interface RegulationReference {
  id: string;
  code: string; // SBC-201, MOMAH-2024, etc.
  section: string;
  description: string;
  requirement: string;
  documentUrl: string;
}

export interface ProjectGuidanceSettings {
  projectType: 'villa' | 'apartment' | 'commercial' | 'warehouse' | 'office';
  area: number;
  floors: number;
  compliance: 'basic' | 'enhanced' | 'premium';
  supervision: 'self' | 'engineer' | 'contractor';
  location: string; // city/region for specific regulations
}

export class ConstructionGuidanceService {
  private static phases: ConstructionPhase[] = [
    {
      id: 'planning',
      name: 'التخطيط والتصميم',
      nameEn: 'Planning and Design',
      description: 'مرحلة التخطيط الأولي والحصول على التراخيص',
      order: 1,
      duration: 30,
      dependencies: [],
      documents: [
        {
          id: 'building_permit',
          name: 'رخصة البناء',
          type: 'permit',
          required: true,
          authority: 'أمانة المنطقة',
          templateUrl: 'https://momah.gov.sa/building-permit-form'
        },
        {
          id: 'structural_plans',
          name: 'المخططات الإنشائية',
          type: 'plan',
          required: true,
          authority: 'مكتب هندسي مرخص'
        }
      ],
      checkpoints: [
        {
          id: 'site_survey',
          name: 'مسح الموقع',
          description: 'التأكد من حدود الأرض ومطابقة المخططات',
          inspectionType: 'supervisor',
          criteria: ['حدود الأرض واضحة', 'عدم وجود تعديات', 'صالحية التربة'],
          photos: true,
          mandatory: true
        }
      ],
      materials: [],
      regulations: [
        {
          id: 'sbc_201_planning',
          code: 'SBC-201',
          section: 'الفصل الثالث',
          description: 'متطلبات التخطيط والتصميم',
          requirement: 'يجب الحصول على رخصة بناء قبل البدء',
          documentUrl: 'https://sbc.gov.sa/ar/BC/Documents/tableofcontent2024/SBC%20201/SBC201_AR2024.pdf'
        }
      ],
      tips: [
        'احرص على الحصول على جميع التراخيص قبل البدء',
        'تأكد من مطابقة المخططات للوائح البناء',
        'استعن بمهندس مرخص لمراجعة التصاميم'
      ],
      warnings: [
        'البناء بدون ترخيص يعرضك للغرامات والهدم',
        'عدم مطابقة المخططات قد يؤخر المشروع'
      ]
    },
    {
      id: 'excavation',
      name: 'أعمال الحفر والأساسات',
      nameEn: 'Excavation and Foundation',
      description: 'حفر الأساسات وصب القواعد حسب المواصفات',
      order: 2,
      duration: 14,
      dependencies: ['planning'],
      documents: [
        {
          id: 'soil_test',
          name: 'فحص التربة',
          type: 'report',
          required: true,
          authority: 'مختبر معتمد'
        }
      ],
      checkpoints: [
        {
          id: 'excavation_depth',
          name: 'عمق الحفر',
          description: 'التأكد من عمق الحفر حسب المخططات',
          inspectionType: 'supervisor',
          criteria: ['العمق مطابق للمخططات', 'نظافة قاع الحفرة', 'عدم وجود مياه'],
          photos: true,
          mandatory: true
        },
        {
          id: 'reinforcement',
          name: 'حديد التسليح',
          description: 'فحص حديد التسليح قبل الصب',
          inspectionType: 'authority',
          criteria: ['قطر الحديد مطابق', 'المسافات صحيحة', 'الربط محكم'],
          photos: true,
          mandatory: true
        }
      ],
      materials: [
        {
          materialId: 'concrete_c25',
          name: 'خرسانة جاهزة C25',
          quantity: 150,
          unit: 'متر مكعب',
          specifications: ['مقاومة 25 نيوتن/مم²', 'هبوط 8-12 سم'],
          sbcCompliant: true,
          suppliers: ['شركة الخرسانة الجاهزة', 'مصنع البناء']
        }
      ],
      regulations: [
        {
          id: 'sbc_201_foundation',
          code: 'SBC-201',
          section: 'الفصل الخامس',
          description: 'متطلبات الأساسات',
          requirement: 'يجب فحص التربة قبل تصميم الأساسات',
          documentUrl: 'https://sbc.gov.sa/ar/BC/Documents/tableofcontent2024/SBC%20201/SBC201_AR2024.pdf'
        }
      ],
      tips: [
        'تأكد من جفاف الحفرة قبل الصب',
        'استخدم خرسانة جاهزة لضمان الجودة',
        'اتبع فترة المعالجة المطلوبة'
      ],
      warnings: [
        'الصب في الطقس الحار يتطلب عناية خاصة',
        'عدم المعالجة الصحيحة يضعف الخرسانة'
      ]
    },
    {
      id: 'structure',
      name: 'الهيكل الإنشائي',
      nameEn: 'Structural Work',
      description: 'بناء الجدران والأعمدة والسقف',
      order: 3,
      duration: 45,
      dependencies: ['excavation'],
      documents: [],
      checkpoints: [
        {
          id: 'wall_height',
          name: 'ارتفاع الجدران',
          description: 'التأكد من ارتفاع الجدران حسب المخططات',
          inspectionType: 'self',
          criteria: ['الارتفاع مطابق', 'الجدران عمودية', 'المقاسات صحيحة'],
          photos: true,
          mandatory: true
        }
      ],
      materials: [
        {
          materialId: 'concrete_blocks',
          name: 'بلوك خرساني',
          quantity: 2000,
          unit: 'قطعة',
          specifications: ['20×20×40 سم', 'كثافة 1800 كج/م³'],
          sbcCompliant: true,
          suppliers: ['مصنع البلوك المتطور', 'شركة مواد البناء']
        }
      ],
      regulations: [],
      tips: [
        'استخدم خيط الشاقول للتأكد من استقامة الجدران',
        'تأكد من تطابق الفتحات مع المخططات'
      ],
      warnings: [
        'عدم دقة المقاسات يصعب أعمال التشطيب'
      ]
    },
    {
      id: 'utilities',
      name: 'الأعمال الكهربائية والصحية',
      nameEn: 'MEP Work',
      description: 'تمديد الكهرباء والسباكة والتكييف',
      order: 4,
      duration: 21,
      dependencies: ['structure'],
      documents: [
        {
          id: 'electrical_certificate',
          name: 'شهادة الأعمال الكهربائية',
          type: 'certificate',
          required: true,
          authority: 'كهربائي مرخص'
        }
      ],
      checkpoints: [
        {
          id: 'electrical_safety',
          name: 'سلامة الكهرباء',
          description: 'فحص التمديدات الكهربائية',
          inspectionType: 'authority',
          criteria: ['مطابقة للمعايير', 'عزل جيد', 'لوحة رئيسية آمنة'],
          photos: true,
          mandatory: true
        }
      ],
      materials: [],
      regulations: [
        {
          id: 'electrical_code',
          code: 'الكود الكهربائي السعودي',
          section: 'معايير السلامة',
          description: 'متطلبات التمديدات الكهربائية',
          requirement: 'يجب تنفيذ الأعمال بواسطة كهربائي مرخص',
          documentUrl: 'https://sbc.gov.sa'
        }
      ],
      tips: [
        'خطط لمواقع المقابس والمفاتيح مسبقاً',
        'استخدم مواد كهربائية معتمدة'
      ],
      warnings: [
        'الأعمال الكهربائية الخاطئة خطر على السلامة'
      ]
    },
    {
      id: 'finishing',
      name: 'أعمال التشطيب',
      nameEn: 'Finishing Work',
      description: 'الدهان والأرضيات والتشطيبات النهائية',
      order: 5,
      duration: 30,
      dependencies: ['utilities'],
      documents: [],
      checkpoints: [
        {
          id: 'final_inspection',
          name: 'الفحص النهائي',
          description: 'فحص شامل لجميع الأعمال',
          inspectionType: 'authority',
          criteria: ['مطابقة المخططات', 'جودة التشطيب', 'سلامة المرافق'],
          photos: true,
          mandatory: true
        }
      ],
      materials: [],
      regulations: [],
      tips: [
        'تأكد من جفاف الجدران قبل الدهان',
        'استخدم مواد تشطيب عالية الجودة'
      ],
      warnings: [
        'التسرع في التشطيب يؤثر على الجودة'
      ]
    }
  ];

  static getProjectPhases(settings: ProjectGuidanceSettings): ConstructionPhase[] {
    // Filter and customize phases based on project settings
    let phases = [...this.phases];
    
    // Adjust phases based on project type
    if (settings.projectType === 'apartment') {
      phases = phases.filter(phase => phase.id !== 'excavation'); // Apartments might not need excavation
    }
    
    // Adjust durations based on project size
    phases = phases.map(phase => ({
      ...phase,
      duration: Math.ceil(phase.duration * (settings.area / 200)) // Scale based on area
    }));
    
    return phases;
  }

  static getPhaseById(phaseId: string): ConstructionPhase | null {
    return this.phases.find(phase => phase.id === phaseId) || null;
  }

  static getNextPhase(currentPhaseId: string, projectPhases: ConstructionPhase[]): ConstructionPhase | null {
    const currentIndex = projectPhases.findIndex(phase => phase.id === currentPhaseId);
    if (currentIndex !== -1 && currentIndex < projectPhases.length - 1) {
      return projectPhases[currentIndex + 1];
    }
    return null;
  }

  static calculateProjectTimeline(settings: ProjectGuidanceSettings): {
    totalDuration: number;
    phases: { id: string; startDay: number; duration: number }[];
  } {
    const phases = this.getProjectPhases(settings);
    let currentDay = 0;
    const timeline = phases.map(phase => {
      const phaseTimeline = {
        id: phase.id,
        startDay: currentDay,
        duration: phase.duration
      };
      currentDay += phase.duration;
      return phaseTimeline;
    });

    return {
      totalDuration: currentDay,
      phases: timeline
    };
  }

  static getComplianceChecklist(projectType: string): {
    category: string;
    items: { id: string; description: string; completed: boolean; required: boolean }[];
  }[] {
    return [
      {
        category: 'التراخيص والموافقات',
        items: [
          { id: 'building_permit', description: 'رخصة البناء', completed: false, required: true },
          { id: 'civil_defense', description: 'موافقة الدفاع المدني', completed: false, required: true },
          { id: 'municipality', description: 'موافقة الأمانة', completed: false, required: true }
        ]
      },
      {
        category: 'المواصفات الفنية',
        items: [
          { id: 'sbc_compliance', description: 'مطابقة الكود السعودي للبناء', completed: false, required: true },
          { id: 'structural_calc', description: 'الحسابات الإنشائية', completed: false, required: true },
          { id: 'architectural_plans', description: 'المخططات المعمارية', completed: false, required: true }
        ]
      },
      {
        category: 'السلامة والأمان',
        items: [
          { id: 'fire_safety', description: 'أنظمة مكافحة الحريق', completed: false, required: true },
          { id: 'electrical_safety', description: 'السلامة الكهربائية', completed: false, required: true },
          { id: 'structural_safety', description: 'السلامة الإنشائية', completed: false, required: true }
        ]
      }
    ];
  }
}

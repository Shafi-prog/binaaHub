'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Button } from '@/core/shared/components/ui/button';
import { Input } from '@/core/shared/components/ui/input';
import { Select } from '@/core/shared/components/ui/select';
import { Textarea } from '@/core/shared/components/ui/textarea';
import { Badge } from '@/core/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/shared/components/ui/tabs';
import { Progress } from '@/core/shared/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/core/shared/components/ui/dialog';
import { ProjectTrackingService } from '@/core/services/projectTrackingService';
import { Project, ProjectEstimation, MaterialEstimation, LightingEstimation } from '@/core/shared/types/types';
import { 
  Calculator, 
  FileText, 
  Lightbulb, 
  Home, 
  Hammer,
  Package,
  PaintBucket,
  Zap,
  Upload,
  Download,
  Eye,
  Grid,
  Ruler,
  Target,
  CheckCircle,
  AlertTriangle,
  Info,
  Save,
  Plus
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Material {
  id: string;
  name: string;
  nameEn: string;
  unit: string;
  category: string;
  standardQuantity: number; // per square meter
  price: number; // SAR per unit
  specifications: string[];
  suppliers: string[];
}

interface LightCalculation {
  roomType: string;
  roomName: string;
  length: number;
  width: number;
  area: number;
  requiredLux: number;
  rowCount: number;
  hiddenLighting: boolean;
  hiddenLightDistance: number;
  firstRowLights: {
    widthCount: number;
    lengthCount: number;
    widthSpacing: number;
    lengthSpacing: number;
    product: string;
  };
  secondRowLights: {
    widthCount: number;
    lengthCount: number;
    widthSpacing: number;
    lengthSpacing: number;
    product: string;
  };
}

interface PDFAnalysis {
  fileName: string;
  extractedData: {
    projectType: string;
    totalArea: number;
    rooms: Array<{
      name: string;
      area: number;
      type: string;
    }>;
    specifications: string[];
    materials: string[];
  };
  calculations: {
    [key: string]: {
      quantity: number;
      unit: string;
      totalCost: number;
    };
  };
}

export default function ComprehensiveConstructionCalculator() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectId = searchParams?.get('projectId');
  
  const [activeTab, setActiveTab] = useState('materials');
  const [projectArea, setProjectArea] = useState<number>(200);
  const [projectType, setProjectType] = useState<string>('villa');
  const [floorCount, setFloorCount] = useState<number>(1);
  const [roomCount, setRoomCount] = useState<number>(4);
  
  // Project and estimation data
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  
  // Light Distribution States
  const [lightCalc, setLightCalc] = useState<LightCalculation>({
    roomType: 'living',
    roomName: '',
    length: 5,
    width: 4,
    area: 20,
    requiredLux: 150,
    rowCount: 2,
    hiddenLighting: false,
    hiddenLightDistance: 30,
    firstRowLights: {
      widthCount: 0,
      lengthCount: 0,
      widthSpacing: 0,
      lengthSpacing: 0,
      product: 'LED-18W'
    },
    secondRowLights: {
      widthCount: 0,
      lengthCount: 0,
      widthSpacing: 0,
      lengthSpacing: 0,
      product: 'LED-24W'
    }
  });

  // PDF Analysis States
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfAnalysis, setPdfAnalysis] = useState<PDFAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);

  // Materials Database
  const [materials] = useState<Material[]>([
    {
      id: 'cement',
      name: 'أسمنت بورتلاند',
      nameEn: 'Portland Cement',
      unit: 'كيس 50كغ',
      category: 'خرسانة',
      standardQuantity: 0.8, // bags per sqm
      price: 18,
      specifications: ['مقاومة 42.5N/mm²', 'مطابق للمواصفات السعودية', 'سريع التصلب'],
      suppliers: ['شركة أسمنت الرياض', 'أسمنت اليمامة', 'أسمنت الشرقية']
    },
    {
      id: 'steel',
      name: 'حديد التسليح',
      nameEn: 'Reinforcement Steel',
      unit: 'طن',
      category: 'حديد',
      standardQuantity: 0.12, // tons per sqm
      price: 2800,
      specifications: ['درجة 60', 'قطر 8-32 مم', 'مقاوم للصدأ'],
      suppliers: ['حديد السعودية', 'الراجحي للحديد', 'صناعات الحديد المتطورة']
    },
    {
      id: 'blocks',
      name: 'بلوك خرساني',
      nameEn: 'Concrete Blocks',
      unit: 'قطعة',
      category: 'بناء',
      standardQuantity: 12, // pieces per sqm
      price: 2.5,
      specifications: ['20×20×40 سم', 'مقاومة ضغط 5N/mm²', 'عازل حراري'],
      suppliers: ['مصنع البلوك الحديث', 'شركة الخرسانة السعودية', 'مصانع البناء المتقدمة']
    },
    {
      id: 'tiles',
      name: 'بلاط سيراميك',
      nameEn: 'Ceramic Tiles',
      unit: 'متر مربع',
      category: 'تشطيبات',
      standardQuantity: 1.1, // sqm per sqm (including waste)
      price: 45,
      specifications: ['60×60 سم', 'مقاوم للماء', 'مضاد للانزلاق'],
      suppliers: ['الجوهرة للسيراميك', 'شركة السيراميك السعودية', 'مصانع الفخار الحديثة']
    },
    {
      id: 'paint',
      name: 'دهان أكريليك',
      nameEn: 'Acrylic Paint',
      unit: 'جالون 4 لتر',
      category: 'دهانات',
      standardQuantity: 0.15, // gallons per sqm
      price: 120,
      specifications: ['مقاوم للطقس', 'سهل التنظيف', 'متوفر بجميع الألوان'],
      suppliers: ['دهانات الجزيرة', 'شركة الدهانات السعودية', 'بويات ناشيونال']
    },
    {
      id: 'sand',
      name: 'رمل بناء',
      nameEn: 'Construction Sand',
      unit: 'متر مكعب',
      category: 'خرسانة',
      standardQuantity: 0.5, // cubic meters per sqm
      price: 35,
      specifications: ['مغسول ومنخل', 'خالي من الشوائب', 'حبيبات متوسطة'],
      suppliers: ['محاجر الرياض', 'شركة الرمل المتخصصة', 'مقاولو الحفر والردم']
    },
    {
      id: 'gravel',
      name: 'حصى مدرج',
      nameEn: 'Graded Gravel',
      unit: 'متر مكعب',
      category: 'خرسانة',
      standardQuantity: 0.7, // cubic meters per sqm
      price: 40,
      specifications: ['مدرج 5-20 مم', 'نظيف ومغسول', 'مقاوم للتآكل'],
      suppliers: ['محاجر الشرقية', 'شركة الحصى السعودية', 'مصانع الخرسانة الجاهزة']
    },
    {
      id: 'insulation',
      name: 'عازل حراري',
      nameEn: 'Thermal Insulation',
      unit: 'متر مربع',
      category: 'عزل',
      standardQuantity: 1.0, // sqm per sqm
      price: 25,
      specifications: ['سماكة 5 سم', 'مقاوم للحريق', 'صديق للبيئة'],
      suppliers: ['شركة العزل المتطور', 'مصانع العزل الحراري', 'تقنيات البناء الحديثة']
    }
  ]);

  const [calculatedMaterials, setCalculatedMaterials] = useState<any[]>([]);
  const [totalCost, setTotalCost] = useState<number>(0);

  // Room types for lighting
  const roomTypes = [
    { value: 'living', label: 'صالة معيشة', lux: 150 },
    { value: 'bedroom', label: 'غرفة نوم', lux: 100 },
    { value: 'kitchen', label: 'مطبخ', lux: 300 },
    { value: 'bathroom', label: 'حمام', lux: 200 },
    { value: 'office', label: 'مكتب', lux: 500 },
    { value: 'dining', label: 'غرفة طعام', lux: 150 },
    { value: 'corridor', label: 'ممر', lux: 75 }
  ];

  const lightProducts = [
    { value: 'LED-9W', label: 'LED 9W - 900 لومن', lumens: 900, price: 45 },
    { value: 'LED-12W', label: 'LED 12W - 1200 لومن', lumens: 1200, price: 60 },
    { value: 'LED-18W', label: 'LED 18W - 1800 لومن', lumens: 1800, price: 85 },
    { value: 'LED-24W', label: 'LED 24W - 2400 لومن', lumens: 2400, price: 110 },
    { value: 'LED-36W', label: 'LED 36W - 3600 لومن', lumens: 3600, price: 150 }
  ];

  // Calculate material quantities
  const calculateMaterials = () => {
    const calculated = materials.map(material => {
      const quantity = Math.ceil(projectArea * floorCount * material.standardQuantity);
      const totalMaterialCost = quantity * material.price;
      
      return {
        ...material,
        calculatedQuantity: quantity,
        totalCost: totalMaterialCost,
        formattedCost: totalMaterialCost.toLocaleString()
      };
    });

    setCalculatedMaterials(calculated);
    setTotalCost(calculated.reduce((sum, material) => sum + material.totalCost, 0));
  };

  // Calculate lighting distribution
  const calculateLighting = () => {
    const area = lightCalc.length * lightCalc.width;
    const roomTypeData = roomTypes.find(rt => rt.value === lightCalc.roomType);
    const requiredLux = roomTypeData?.lux || 150;
    
    // Get light product data
    const firstRowProduct = lightProducts.find(p => p.value === lightCalc.firstRowLights.product);
    const secondRowProduct = lightProducts.find(p => p.value === lightCalc.secondRowLights.product);
    
    // Calculate total lumens needed
    const totalLumensNeeded = area * requiredLux;
    
    // Calculate number of lights for each row
    const firstRowLumens = firstRowProduct?.lumens || 1800;
    const secondRowLumens = secondRowProduct?.lumens || 2400;
    
    // Simple distribution calculation
    const firstRowCount = Math.ceil(totalLumensNeeded * 0.6 / firstRowLumens);
    const secondRowCount = Math.ceil(totalLumensNeeded * 0.4 / secondRowLumens);
    
    // Calculate spacing
    const firstRowWidthCount = Math.ceil(Math.sqrt(firstRowCount * (lightCalc.width / lightCalc.length)));
    const firstRowLengthCount = Math.ceil(firstRowCount / firstRowWidthCount);
    const firstRowWidthSpacing = lightCalc.width / (firstRowWidthCount + 1);
    const firstRowLengthSpacing = lightCalc.length / (firstRowLengthCount + 1);
    
    const secondRowWidthCount = Math.ceil(Math.sqrt(secondRowCount * (lightCalc.width / lightCalc.length)));
    const secondRowLengthCount = Math.ceil(secondRowCount / secondRowWidthCount);
    const secondRowWidthSpacing = lightCalc.width / (secondRowWidthCount + 1);
    const secondRowLengthSpacing = lightCalc.length / (secondRowLengthCount + 1);

    setLightCalc(prev => ({
      ...prev,
      area,
      requiredLux,
      firstRowLights: {
        ...prev.firstRowLights,
        widthCount: firstRowWidthCount,
        lengthCount: firstRowLengthCount,
        widthSpacing: Number(firstRowWidthSpacing.toFixed(2)),
        lengthSpacing: Number(firstRowLengthSpacing.toFixed(2))
      },
      secondRowLights: {
        ...prev.secondRowLights,
        widthCount: secondRowWidthCount,
        lengthCount: secondRowLengthCount,
        widthSpacing: Number(secondRowWidthSpacing.toFixed(2)),
        lengthSpacing: Number(secondRowLengthSpacing.toFixed(2))
      }
    }));
  };

  // Simulate PDF analysis
  const analyzePDF = async (file: File) => {
    setAnalyzing(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock PDF analysis results
    const mockAnalysis: PDFAnalysis = {
      fileName: file.name,
      extractedData: {
        projectType: 'فيلا سكنية',
        totalArea: 350,
        rooms: [
          { name: 'صالة رئيسية', area: 60, type: 'living' },
          { name: 'غرفة نوم ماستر', area: 40, type: 'bedroom' },
          { name: 'غرفة نوم أطفال', area: 25, type: 'bedroom' },
          { name: 'مطبخ', area: 20, type: 'kitchen' },
          { name: 'حمام رئيسي', area: 12, type: 'bathroom' }
        ],
        specifications: [
          'أساسات خرسانية مسلحة',
          'جدران بلوك خرساني',
          'عزل حراري ومائي',
          'تشطيبات راقية'
        ],
        materials: [
          'خرسانة مسلحة للأساسات',
          'بلوك خرساني للجدران',
          'حديد تسليح درجة 60',
          'عوازل حرارية ومائية',
          'بلاط سيراميك للأرضيات',
          'دهانات أكريليك للجدران'
        ]
      },
      calculations: {
        'أسمنت بورتلاند': { quantity: 280, unit: 'كيس 50كغ', totalCost: 5040 },
        'حديد التسليح': { quantity: 42, unit: 'طن', totalCost: 117600 },
        'بلوك خرساني': { quantity: 4200, unit: 'قطعة', totalCost: 10500 },
        'بلاط سيراميك': { quantity: 385, unit: 'متر مربع', totalCost: 17325 },
        'دهان أكريليك': { quantity: 53, unit: 'جالون 4 لتر', totalCost: 6360 }
      }
    };
    
    setPdfAnalysis(mockAnalysis);
    setAnalyzing(false);
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      analyzePDF(file);
    }
  };

  useEffect(() => {
    calculateMaterials();
  }, [projectArea, floorCount, projectType]);

  useEffect(() => {
    if (lightCalc.length > 0 && lightCalc.width > 0) {
      calculateLighting();
    }
  }, [lightCalc.length, lightCalc.width, lightCalc.roomType, lightCalc.firstRowLights.product, lightCalc.secondRowLights.product]);

  // Load project data if projectId is provided
  useEffect(() => {
    const loadProject = async () => {
      if (projectId) {
        const project = await ProjectTrackingService.getProjectById(projectId);
        if (project) {
          setCurrentProject(project);
          setProjectArea(project.area);
          setProjectType(project.projectType);
          setFloorCount(project.floorCount);
          setRoomCount(project.roomCount);
          setProjectName(project.name);
          setProjectDescription(project.description || '');
        }
      }
    };
    
    loadProject();
  }, [projectId]);

  // Save estimation to project
  const saveEstimationToProject = async () => {
    try {
      let targetProjectId = projectId;
      
      // If no project exists, create a new one
      if (!projectId && projectName) {
        const newProject: Project = {
          id: Date.now().toString(),
          name: projectName,
          description: projectDescription,
          area: projectArea,
          projectType,
          floorCount,
          roomCount,
          stage: 'تخطيط',
          progress: 0,
          status: 'planning',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        await ProjectTrackingService.saveProject(newProject);
        setCurrentProject(newProject);
        targetProjectId = newProject.id;
      }

      if (!targetProjectId) {
        alert('يرجى إدخال اسم المشروع');
        return;
      }

      // Convert calculated materials to estimation format
      const materialEstimations: MaterialEstimation[] = calculatedMaterials.map(material => ({
        materialId: material.id,
        materialName: material.name,
        materialNameEn: material.nameEn,
        category: material.category,
        estimatedQuantity: material.calculatedQuantity,
        unit: material.unit,
        pricePerUnit: material.price,
        totalCost: material.totalCost,
        specifications: material.specifications,
        suppliers: material.suppliers,
        priority: 'medium',
        phase: getCategoryPhase(material.category)
      }));

      // Convert lighting calculations to estimation format (if lighting is calculated)
      const lightingEstimations: LightingEstimation[] = [];
      if (lightCalc.length > 0 && lightCalc.width > 0) {
        const area = lightCalc.length * lightCalc.width;
        const roomTypeData = roomTypes.find(rt => rt.value === lightCalc.roomType);
        const firstRowProduct = lightProducts.find(p => p.value === lightCalc.firstRowLights.product);
        const secondRowProduct = lightProducts.find(p => p.value === lightCalc.secondRowLights.product);
        
        const lightingEstimation: LightingEstimation = {
          roomName: lightCalc.roomName || 'غرفة',
          roomType: lightCalc.roomType,
          area: area,
          requiredLux: roomTypeData?.lux || 150,
          fixtures: [
            {
              type: lightCalc.firstRowLights.product,
              quantity: lightCalc.firstRowLights.widthCount * lightCalc.firstRowLights.lengthCount,
              pricePerUnit: firstRowProduct?.price || 0,
              totalCost: (lightCalc.firstRowLights.widthCount * lightCalc.firstRowLights.lengthCount) * (firstRowProduct?.price || 0)
            },
            {
              type: lightCalc.secondRowLights.product,
              quantity: lightCalc.secondRowLights.widthCount * lightCalc.secondRowLights.lengthCount,
              pricePerUnit: secondRowProduct?.price || 0,
              totalCost: (lightCalc.secondRowLights.widthCount * lightCalc.secondRowLights.lengthCount) * (secondRowProduct?.price || 0)
            }
          ],
          totalCost: 0 // Will be calculated below
        };
        
        // Calculate total cost
        lightingEstimation.totalCost = lightingEstimation.fixtures.reduce((sum, fixture) => sum + fixture.totalCost, 0);
        lightingEstimations.push(lightingEstimation);
      }

      const totalLightingCost = lightingEstimations.reduce((sum, lighting) => sum + lighting.totalCost, 0);

      // Create estimation
      const estimation: ProjectEstimation = {
        id: Date.now().toString(),
        projectId: targetProjectId,
        calculatorType: 'comprehensive',
        createdAt: new Date().toISOString(),
        materials: materialEstimations,
        lighting: lightingEstimations,
        totalCost: totalCost + totalLightingCost,
        phases: {
          foundation: materialEstimations.filter(m => m.phase === 'foundation').reduce((sum, m) => sum + m.totalCost, 0),
          structure: materialEstimations.filter(m => m.phase === 'structure').reduce((sum, m) => sum + m.totalCost, 0),
          finishing: materialEstimations.filter(m => m.phase === 'finishing').reduce((sum, m) => sum + m.totalCost, 0),
          electrical: materialEstimations.filter(m => m.phase === 'electrical').reduce((sum, m) => sum + m.totalCost, 0) + totalLightingCost,
          plumbing: materialEstimations.filter(m => m.phase === 'plumbing').reduce((sum, m) => sum + m.totalCost, 0)
        }
      };

      await ProjectTrackingService.saveEstimation(estimation);
      
      alert('تم حفظ التقدير بنجاح!');
      setShowSaveDialog(false);
      
      // Navigate to project detail page
      router.push(`/user/projects/${targetProjectId}`);
      
    } catch (error) {
      console.error('Error saving estimation:', error);
      alert('حدث خطأ أثناء حفظ التقدير');
    }
  };

  // Helper function to determine phase based on material category
  const getCategoryPhase = (category: string): 'foundation' | 'structure' | 'finishing' | 'electrical' | 'plumbing' => {
    switch (category) {
      case 'خرسانة':
      case 'حديد':
        return 'foundation';
      case 'بناء':
        return 'structure';
      case 'تشطيبات':
      case 'دهانات':
        return 'finishing';
      case 'كهرباء':
      case 'إضاءة':
        return 'electrical';
      case 'سباكة':
        return 'plumbing';
      default:
        return 'structure';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6" dir="rtl">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Calculator className="w-12 h-12 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">الحاسبة الشاملة للبناء والإنارة</h1>
            </div>
            <p className="text-xl text-gray-600">
              نظام ذكي متكامل لحساب المواد وتوزيع الإنارة وتحليل المخططات
            </p>
            {currentProject && (
              <div className="mt-2">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  مشروع: {currentProject.name}
                </Badge>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => setShowSaveDialog(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4" />
              حفظ التقدير
            </Button>
            {!projectId && (
              <Button
                variant="outline"
                onClick={() => router.push('/user/projects/list')}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                مشاريعي
              </Button>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="materials" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              حساب المواد
            </TabsTrigger>
            <TabsTrigger value="lighting" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              توزيع الإنارة
            </TabsTrigger>
            <TabsTrigger value="pdf-analysis" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              تحليل المخططات
            </TabsTrigger>
            <TabsTrigger value="comprehensive" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              التقرير الشامل
            </TabsTrigger>
          </TabsList>

          {/* Materials Calculator Tab */}
          <TabsContent value="materials">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Project Input */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    مواصفات المشروع
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">نوع المشروع</label>
                    <Select 
                      value={projectType} 
                      onChange={(e) => setProjectType(e.target.value)}
                      options={[
                        { value: 'villa', label: 'فيلا سكنية' },
                        { value: 'apartment', label: 'شقة سكنية' },
                        { value: 'commercial', label: 'مبنى تجاري' },
                        { value: 'warehouse', label: 'مستودع' }
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">المساحة الإجمالية (م²)</label>
                    <Input 
                      type="number" 
                      value={projectArea} 
                      onChange={(e) => setProjectArea(Number(e.target.value))}
                      placeholder="200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">عدد الأدوار</label>
                    <Input 
                      type="number" 
                      value={floorCount} 
                      onChange={(e) => setFloorCount(Number(e.target.value))}
                      placeholder="2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">عدد الغرف</label>
                    <Input 
                      type="number" 
                      value={roomCount} 
                      onChange={(e) => setRoomCount(Number(e.target.value))}
                      placeholder="4"
                    />
                  </div>
                  <Button onClick={calculateMaterials} className="w-full">
                    احسب المواد المطلوبة
                  </Button>
                </CardContent>
              </Card>

              {/* Materials Results */}
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      قائمة المواد المطلوبة
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {calculatedMaterials.map((material) => (
                        <div key={material.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold">{material.name}</h4>
                              <p className="text-sm text-gray-600">{material.nameEn}</p>
                            </div>
                            <Badge variant="secondary">{material.category}</Badge>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>الكمية المطلوبة:</span>
                              <span className="font-semibold">{material.calculatedQuantity} {material.unit}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>سعر الوحدة:</span>
                              <span>{material.price} ر.س</span>
                            </div>
                            <div className="flex justify-between border-t pt-2">
                              <span>التكلفة الإجمالية:</span>
                              <span className="font-bold text-green-600">{material.formattedCost} ر.س</span>
                            </div>
                          </div>

                          <div className="mt-3 space-y-1">
                            <p className="text-xs font-medium text-gray-700">المواصفات:</p>
                            {material.specifications.map((spec: string, idx: number) => (
                              <p key={idx} className="text-xs text-gray-600">• {spec}</p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold">إجمالي تكلفة المواد:</span>
                        <span className="text-2xl font-bold text-blue-600">{totalCost.toLocaleString()} ر.س</span>
                      </div>
                      <p className="text-sm text-blue-700 mt-2">
                        * الأسعار تقديرية وقد تختلف حسب الموردين والسوق
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Lighting Distribution Tab */}
          <TabsContent value="lighting">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Lighting Input */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    حاسبة توزيع الإنارة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">نوع الغرفة</label>
                    <Select 
                      value={lightCalc.roomType} 
                      onChange={(e) => setLightCalc(prev => ({...prev, roomType: e.target.value}))}
                      options={roomTypes.map(rt => ({ value: rt.value, label: rt.label }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">اسم الغرفة</label>
                    <Input 
                      value={lightCalc.roomName} 
                      onChange={(e) => setLightCalc(prev => ({...prev, roomName: e.target.value}))}
                      placeholder="صالة المعيشة الرئيسية"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">الطول (م)</label>
                      <Input 
                        type="number" 
                        value={lightCalc.length} 
                        onChange={(e) => setLightCalc(prev => ({...prev, length: Number(e.target.value)}))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">العرض (م)</label>
                      <Input 
                        type="number" 
                        value={lightCalc.width} 
                        onChange={(e) => setLightCalc(prev => ({...prev, width: Number(e.target.value)}))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">عدد الصفوف</label>
                    <Select 
                      value={lightCalc.rowCount.toString()} 
                      onChange={(e) => setLightCalc(prev => ({...prev, rowCount: Number(e.target.value)}))}
                      options={[
                        { value: '1', label: 'صف واحد' },
                        { value: '2', label: 'صفان' }
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">منتج الصف الأول</label>
                    <Select 
                      value={lightCalc.firstRowLights.product} 
                      onChange={(e) => setLightCalc(prev => ({
                        ...prev, 
                        firstRowLights: {...prev.firstRowLights, product: e.target.value}
                      }))}
                      options={lightProducts.map(lp => ({ value: lp.value, label: lp.label }))}
                    />
                  </div>
                  {lightCalc.rowCount === 2 && (
                    <div>
                      <label className="block text-sm font-medium mb-2">منتج الصف الثاني</label>
                      <Select 
                        value={lightCalc.secondRowLights.product} 
                        onChange={(e) => setLightCalc(prev => ({
                          ...prev, 
                          secondRowLights: {...prev.secondRowLights, product: e.target.value}
                        }))}
                        options={lightProducts.map(lp => ({ value: lp.value, label: lp.label }))}
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="hiddenLighting"
                      checked={lightCalc.hiddenLighting}
                      onChange={(e) => setLightCalc(prev => ({...prev, hiddenLighting: e.target.checked}))}
                    />
                    <label htmlFor="hiddenLighting" className="text-sm font-medium">إنارة مخفية</label>
                  </div>
                  {lightCalc.hiddenLighting && (
                    <div>
                      <label className="block text-sm font-medium mb-2">بعد الإنارة المخفية عن الجدار (سم)</label>
                      <Input 
                        type="number" 
                        value={lightCalc.hiddenLightDistance} 
                        onChange={(e) => setLightCalc(prev => ({...prev, hiddenLightDistance: Number(e.target.value)}))}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Lighting Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Grid className="w-5 h-5" />
                    نتائج توزيع الإنارة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <span className="block font-medium">مساحة الغرفة</span>
                        <span className="text-lg font-bold">{lightCalc.area} م²</span>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <span className="block font-medium">اللوكس المطلوب</span>
                        <span className="text-lg font-bold">{lightCalc.requiredLux}</span>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-3">الصف الأول - {lightCalc.firstRowLights.product}</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">عدد اللمبات بالعرض:</span>
                          <span className="float-left font-semibold">{lightCalc.firstRowLights.widthCount}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">عدد اللمبات بالطول:</span>
                          <span className="float-left font-semibold">{lightCalc.firstRowLights.lengthCount}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">مسافة اللمبات بالعرض:</span>
                          <span className="float-left font-semibold">{lightCalc.firstRowLights.widthSpacing} م</span>
                        </div>
                        <div>
                          <span className="text-gray-600">مسافة اللمبات بالطول:</span>
                          <span className="float-left font-semibold">{lightCalc.firstRowLights.lengthSpacing} م</span>
                        </div>
                      </div>
                    </div>

                    {lightCalc.rowCount === 2 && (
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-3">الصف الثاني - {lightCalc.secondRowLights.product}</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">عدد اللمبات بالعرض:</span>
                            <span className="float-left font-semibold">{lightCalc.secondRowLights.widthCount}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">عدد اللمبات بالطول:</span>
                            <span className="float-left font-semibold">{lightCalc.secondRowLights.lengthCount}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">مسافة اللمبات بالعرض:</span>
                            <span className="float-left font-semibold">{lightCalc.secondRowLights.widthSpacing} م</span>
                          </div>
                          <div>
                            <span className="text-gray-600">مسافة اللمبات بالطول:</span>
                            <span className="float-left font-semibold">{lightCalc.secondRowLights.lengthSpacing} م</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="w-4 h-4 text-yellow-600" />
                        <span className="font-medium text-yellow-800">ملاحظات مهمة</span>
                      </div>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• تأكد من توزيع الإنارة بشكل متوازن</li>
                        <li>• راعي موقع الأثاث عند التركيب</li>
                        <li>• استخدم مفاتيح منفصلة لكل صف</li>
                        <li>• فحص الإنارة قبل التشطيب النهائي</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* PDF Analysis Tab */}
          <TabsContent value="pdf-analysis">
            <div className="space-y-6">
              {/* File Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    رفع ملف المخططات (PDF)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="pdf-upload"
                    />
                    <label htmlFor="pdf-upload" className="cursor-pointer">
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-700 mb-2">
                        اسحب ملف PDF هنا أو اضغط للاختيار
                      </p>
                      <p className="text-sm text-gray-500">
                        سيتم تحليل المخططات تلقائياً وحساب كميات المواد المطلوبة
                      </p>
                    </label>
                  </div>
                  
                  {pdfFile && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">الملف المرفوع: {pdfFile.name}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Analysis Results */}
              {analyzing && (
                <Card>
                  <CardContent className="text-center py-12">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">جاري تحليل المخططات...</h3>
                    <p className="text-gray-500">الذكاء الاصطناعي يحلل الملف ويحسب الكميات المطلوبة</p>
                  </CardContent>
                </Card>
              )}

              {pdfAnalysis && !analyzing && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Project Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="w-5 h-5" />
                        تفاصيل المشروع المستخرجة
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <span className="font-medium">نوع المشروع:</span>
                          <span className="float-left">{pdfAnalysis.extractedData.projectType}</span>
                        </div>
                        <div>
                          <span className="font-medium">المساحة الإجمالية:</span>
                          <span className="float-left">{pdfAnalysis.extractedData.totalArea} م²</span>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">الغرف المكتشفة:</h4>
                          <div className="space-y-2">
                            {pdfAnalysis.extractedData.rooms.map((room, idx) => (
                              <div key={idx} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                                <span>{room.name}</span>
                                <span>{room.area} م²</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">المواصفات:</h4>
                          <ul className="text-sm space-y-1">
                            {pdfAnalysis.extractedData.specifications.map((spec, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                                {spec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Calculated Materials */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calculator className="w-5 h-5" />
                        الكميات المحسوبة
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(pdfAnalysis.calculations).map(([material, calc]) => (
                          <div key={material} className="border rounded-lg p-3">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold">{material}</h4>
                              <Badge variant="outline">{calc.unit}</Badge>
                            </div>
                            <div className="text-sm space-y-1">
                              <div className="flex justify-between">
                                <span>الكمية:</span>
                                <span className="font-medium">{calc.quantity.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>التكلفة:</span>
                                <span className="font-bold text-green-600">{calc.totalCost.toLocaleString()} ر.س</span>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        <div className="border-t pt-4">
                          <div className="flex justify-between text-lg font-bold">
                            <span>إجمالي التكلفة:</span>
                            <span className="text-blue-600">
                              {Object.values(pdfAnalysis.calculations)
                                .reduce((sum, calc) => sum + calc.totalCost, 0)
                                .toLocaleString()} ر.س
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Comprehensive Report Tab */}
          <TabsContent value="comprehensive">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    التقرير الشامل للمشروع
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                      <Package className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-blue-800">تكلفة المواد</h3>
                      <p className="text-3xl font-bold text-blue-600 mt-2">
                        {totalCost.toLocaleString()} ر.س
                      </p>
                      <p className="text-sm text-blue-700 mt-2">شاملة جميع المواد الأساسية</p>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                      <Lightbulb className="w-12 h-12 text-green-600 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-green-800">الإنارة</h3>
                      <p className="text-3xl font-bold text-green-600 mt-2">
                        {(lightCalc.firstRowLights.widthCount * lightCalc.firstRowLights.lengthCount) + 
                         (lightCalc.secondRowLights.widthCount * lightCalc.secondRowLights.lengthCount)} وحدة
                      </p>
                      <p className="text-sm text-green-700 mt-2">إجمالي وحدات الإنارة</p>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
                      <FileText className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-purple-800">التحليل الذكي</h3>
                      <p className="text-3xl font-bold text-purple-600 mt-2">
                        {pdfAnalysis ? 'مكتمل' : 'متاح'}
                      </p>
                      <p className="text-sm text-purple-700 mt-2">تحليل المخططات بالذكاء الاصطناعي</p>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-4 justify-center">
                    <Button className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      تحميل التقرير الشامل
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      معاينة التقرير
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Save Estimation Dialog */}
        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>حفظ تقدير المشروع</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {!projectId && (
                <>
                  <div>
                    <label className="text-sm font-medium">اسم المشروع</label>
                    <Input
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="اسم المشروع..."
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">وصف المشروع</label>
                    <Textarea
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="وصف المشروع..."
                      rows={3}
                    />
                  </div>
                </>
              )}

              <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                <h4 className="font-semibold text-blue-800">ملخص التقدير</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>المساحة:</span>
                    <span>{projectArea} متر مربع</span>
                  </div>
                  <div className="flex justify-between">
                    <span>عدد الأدوار:</span>
                    <span>{floorCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>تكلفة المواد:</span>
                    <span>{totalCost.toLocaleString()} ريال</span>
                  </div>
                  <div className="flex justify-between">
                    <span>عدد المواد:</span>
                    <span>{calculatedMaterials.length} مادة</span>
                  </div>
                </div>
              </div>

              {projectId && currentProject && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-700">
                    سيتم تحديث تقدير مشروع: <strong>{currentProject.name}</strong>
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  onClick={saveEstimationToProject}
                  disabled={!projectId && !projectName.trim()}
                  className="flex-1"
                >
                  <Save className="w-4 h-4 ml-2" />
                  حفظ التقدير
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowSaveDialog(false)}
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

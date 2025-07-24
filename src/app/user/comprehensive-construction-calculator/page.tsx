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
import ProjectPurchasesWarranties from '@/core/shared/components/ui/ProjectPurchasesWarranties';
import { ProjectTrackingService } from '@/core/services/projectTrackingService';
import { Project, ProjectEstimation, MaterialEstimation, LightingEstimation } from '@/core/shared/types/types';
import { formatNumber, formatCurrency, formatDate, formatPercentage } from '@/core/shared/utils/formatting';
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
  Plus,
  DollarSign,
  Clock,
  TrendingUp,
  Trash2,
  Edit,
  Building,
  MapPin,
  Users,
  Calendar,
  Award,
  Globe,
  Shield,
  ShoppingCart
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
  
  const [activeTab, setActiveTab] = useState(projectId ? 'overview' : 'materials');
  const [projectArea, setProjectArea] = useState<number>(200);
  const [projectType, setProjectType] = useState<string>('villa');
  const [floorCount, setFloorCount] = useState<number>(1);
  const [roomCount, setRoomCount] = useState<number>(4);
  const [isClient, setIsClient] = useState(false);
  
  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load project data if projectId is provided
  useEffect(() => {
    if (projectId) {
      loadProjectData();
    }
  }, [projectId]);

  const loadProjectData = async () => {
    if (!projectId) return;
    
    try {
      const project = await ProjectTrackingService.getProjectById(projectId);
      if (project) {
        setCurrentProject(project);
        setProjectArea(project.area);
        setProjectType(project.projectType || 'villa');
        setFloorCount(project.floorCount || 1);
        setRoomCount(project.roomCount || 4);
        setProjectName(project.name);
        setProjectDescription(project.description || '');
        
        // Populate edit form data
        setEditProjectData({
          name: project.name,
          description: project.description || '',
          area: project.area,
          projectType: project.projectType || 'residential',
          floorCount: project.floorCount || 1,
          roomCount: project.roomCount || 4,
          location: project.location || ''
        });
        
        // Load project summary
        const summary = await ProjectTrackingService.calculateProjectSummary(projectId);
        if (summary) {
          setProjectSummary(summary);
        }
      }
    } catch (error) {
      console.error('Error loading project:', error);
    }
  };
  
  // Project and estimation data
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projectSummary, setProjectSummary] = useState<any>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  
  // Edit project information state
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [editProjectData, setEditProjectData] = useState({
    name: '',
    description: '',
    area: 0,
    projectType: 'residential',
    floorCount: 1,
    roomCount: 4,
    location: ''
  });
  
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

  // Saved rooms for lighting
  const [savedRooms, setSavedRooms] = useState<LightCalculation[]>([]);

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
      standardQuantity: 7.5, // bags per sqm (more realistic for construction)
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
      standardQuantity: 0.18, // tons per sqm (increased for realistic construction)
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
      standardQuantity: 15, // pieces per sqm (increased)
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

// Material calculation interface
interface UnifiedMaterial {
  id: string;
  name: string;
  nameEn: string;
  quantity: number;
  unit: string;
  category: string;
  categoryAr: string;
  description: string;
  totalCost: number;
  purchased?: number;
  remaining?: number;
  remainingCost?: number;
}

interface UnifiedMaterialsMap {
  [key: string]: UnifiedMaterial;
}

  // Unified Materials Calculation - CONSISTENT ACROSS ALL CALCULATIONS
  const calculateUnifiedMaterials = (area: number, projectType: string = 'residential', floorCount: number = 1): UnifiedMaterialsMap => {
    // Base calculations per square meter (standardized formulas)
    const baseCalculations = {
      'concrete': {
        name: 'خرسانة',
        nameEn: 'concrete',
        quantityPerSqm: 0.3, // 0.3 cubic meters per sqm
        unitPrice: 350, // SAR per cubic meter
        unit: 'متر مكعب',
        category: 'foundation',
        categoryAr: 'أساسات',
        description: 'خرسانة للأساسات والأعمدة والسقف'
      },
      'steel': {
        name: 'حديد التسليح',
        nameEn: 'steel',
        quantityPerSqm: 120, // 120 kg per sqm
        unitPrice: 4.5, // SAR per kg
        unit: 'كيلوجرام',
        category: 'structure',
        categoryAr: 'هيكل',
        description: 'حديد التسليح للمنشأ'
      },
      'cement': {
        name: 'إسمنت بورتلاند',
        nameEn: 'cement',
        quantityPerSqm: 2, // 2 bags per sqm
        unitPrice: 18, // SAR per 50kg bag
        unit: 'كيس 50كغ',
        category: 'foundation',
        categoryAr: 'أساسات',
        description: 'إسمنت بورتلاندي للبناء'
      },
      'blocks': {
        name: 'بلوك خرساني',
        nameEn: 'blocks',
        quantityPerSqm: 45, // 45 blocks per sqm
        unitPrice: 3.5, // SAR per block
        unit: 'قطعة',
        category: 'structure',
        categoryAr: 'بناء',
        description: 'بلوك خرساني للجدران'
      },
      'sand': {
        name: 'رمل بناء',
        nameEn: 'sand',
        quantityPerSqm: 0.5, // 0.5 cubic meters per sqm
        unitPrice: 80, // SAR per cubic meter
        unit: 'متر مكعب',
        category: 'foundation',
        categoryAr: 'خرسانة',
        description: 'رمل للملاط والخرسانة'
      },
      'gravel': {
        name: 'حصى مدرج',
        nameEn: 'gravel',
        quantityPerSqm: 0.4, // 0.4 cubic meters per sqm
        unitPrice: 90, // SAR per cubic meter
        unit: 'متر مكعب',
        category: 'foundation',
        categoryAr: 'خرسانة',
        description: 'حصى للخرسانة والأساسات'
      },
      'tiles': {
        name: 'بلاط سيراميك',
        nameEn: 'tiles',
        quantityPerSqm: 1.1, // 1.1 sqm per sqm (waste factor)
        unitPrice: 45, // SAR per sqm
        unit: 'متر مربع',
        category: 'finishing',
        categoryAr: 'تشطيبات',
        description: 'بلاط للأرضيات'
      },
      'paint': {
        name: 'دهان أكريليك',
        nameEn: 'paint',
        quantityPerSqm: 0.5, // 0.5 gallons per sqm of wall area
        unitPrice: 80, // SAR per 4L gallon
        unit: 'جالون 4 لتر',
        category: 'finishing',
        categoryAr: 'دهانات',
        description: 'دهان للجدران الداخلية والخارجية'
      }
    };

    // Calculate total quantities based on area and floors
    const calculatedMaterials: UnifiedMaterialsMap = {};
    
    Object.entries(baseCalculations).forEach(([key, material]) => {
      let quantity = Math.ceil(area * material.quantityPerSqm);
      
      // Apply floor multiplier for certain materials
      if (['concrete', 'steel', 'cement'].includes(key)) {
        quantity = quantity * floorCount;
      }
      
      // Apply project type multiplier
      let typeMultiplier = 1;
      if (projectType === 'commercial') {
        typeMultiplier = 1.3;
      } else if (projectType === 'industrial') {
        typeMultiplier = 1.5;
      }
      
      quantity = Math.ceil(quantity * typeMultiplier);
      const totalCost = quantity * material.unitPrice;
      
      calculatedMaterials[key] = {
        id: key,
        name: material.name,
        nameEn: material.nameEn,
        quantity: quantity,
        unit: material.unit,
        category: material.category,
        categoryAr: material.categoryAr,
        description: material.description,
        totalCost: totalCost,
        purchased: 0,
        remaining: quantity,
        remainingCost: totalCost
      };
    });

    return calculatedMaterials;
  };

  // Calculate material quantities - UNIFIED with project creation
  const calculateMaterials = () => {
    const area = projectArea || 0;
    const type = projectType;
    const floors = floorCount || 1;
    
    // Use unified calculation
    const unifiedMaterialsData = calculateUnifiedMaterials(area, type, floors);
    
    // Convert to format expected by the UI
    const calculated = Object.values(unifiedMaterialsData).map((material, index) => ({
      ...materials[index], // Keep original material properties if they exist
      id: material.id,
      name: material.name,
      calculatedQuantity: material.quantity,
      totalCost: material.totalCost,
      formattedCost: formatNumber(material.totalCost),
      unit: material.unit,
      category: material.category,
      description: material.description
    }));

    setCalculatedMaterials(calculated);
    setTotalCost(calculated.reduce((sum, material) => sum + (material.totalCost || 0), 0));
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

  // Save current room calculation
  const saveCurrentRoom = () => {
    if (!lightCalc.roomName.trim()) {
      alert('يرجى إدخال اسم الغرفة');
      return;
    }

    // Check if room with same name already exists
    const existingRoomIndex = savedRooms.findIndex(room => room.roomName === lightCalc.roomName);
    
    if (existingRoomIndex !== -1) {
      // Update existing room
      const updatedRooms = [...savedRooms];
      updatedRooms[existingRoomIndex] = { ...lightCalc };
      setSavedRooms(updatedRooms);
      alert('تم تحديث بيانات الغرفة بنجاح');
    } else {
      // Add new room
      setSavedRooms(prev => [...prev, { ...lightCalc }]);
      alert('تم حفظ الغرفة بنجاح');
    }
    
    // Reset form for new room
    setLightCalc(prev => ({
      ...prev,
      roomName: '',
      length: 5,
      width: 4
    }));
  };

  // Delete saved room
  const deleteSavedRoom = (roomName: string) => {
    setSavedRooms(prev => prev.filter(room => room.roomName !== roomName));
    alert('تم حذف الغرفة بنجاح');
  };

  // Load saved room for editing
  const loadSavedRoom = (room: LightCalculation) => {
    setLightCalc({ ...room });
  };

  // Calculate total lighting cost for all saved rooms
  const getTotalLightingCost = () => {
    return savedRooms.reduce((total, room) => {
      const firstRowProduct = lightProducts.find(p => p.value === room.firstRowLights.product);
      const secondRowProduct = lightProducts.find(p => p.value === room.secondRowLights.product);
      
      const firstRowCost = (room.firstRowLights.widthCount * room.firstRowLights.lengthCount) * (firstRowProduct?.price || 0);
      const secondRowCost = (room.secondRowLights.widthCount * room.secondRowLights.lengthCount) * (secondRowProduct?.price || 0);
      
      return total + firstRowCost + secondRowCost;
    }, 0);
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

  // Handle save project edits
  const handleSaveProject = async () => {
    if (!currentProject) return;
    
    try {
      const updatedProject = {
        ...currentProject,
        name: editProjectData.name,
        description: editProjectData.description,
        area: editProjectData.area,
        projectType: editProjectData.projectType,
        floorCount: editProjectData.floorCount,
        roomCount: editProjectData.roomCount,
        location: editProjectData.location,
        updatedAt: new Date().toISOString()
      };
      
      await ProjectTrackingService.saveProject(updatedProject);
      setCurrentProject(updatedProject);
      setProjectName(editProjectData.name);
      setProjectDescription(editProjectData.description);
      setProjectArea(editProjectData.area);
      setProjectType(editProjectData.projectType);
      setFloorCount(editProjectData.floorCount);
      setRoomCount(editProjectData.roomCount);
      setIsEditingProject(false);
      
      alert('تم حفظ التغييرات بنجاح');
    } catch (error) {
      console.error('Error updating project:', error);
      alert('حدث خطأ أثناء حفظ التغييرات');
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
      
      // Navigate to project list page since we're already in the unified interface
      router.push('/user/projects/list');
      
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

  // Generate and download PDF report
  const generateAndDownloadPDF = () => {
    try {
      // Create report data
      const reportData = {
        projectInfo: {
          name: projectName || `مشروع ${projectType}`,
          area: projectArea,
          type: projectType,
          floors: floorCount,
          rooms: roomCount,
          date: new Date().toLocaleDateString('en-US')
        },
        materials: calculatedMaterials,
        totalCost,
        lightingCalculation: lightCalc,
        pdfAnalysis
      };

      // Create blob with report content
      const reportContent = JSON.stringify(reportData, null, 2);
      const blob = new Blob([reportContent], { type: 'application/json' });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `تقرير-مشروع-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert('تم تحميل التقرير بنجاح!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('حدث خطأ في إنشاء التقرير');
    }
  };

  // Preview report in new window
  const previewReport = () => {
    try {
      const reportData = {
        projectInfo: {
          name: projectName || `مشروع ${projectType}`,
          area: projectArea,
          type: projectType,
          floors: floorCount,
          rooms: roomCount,
          date: new Date().toLocaleDateString('en-US')
        },
        materials: calculatedMaterials,
        totalCost,
        lightingCalculation: lightCalc,
        pdfAnalysis
      };

      // Create HTML content for preview
      const htmlContent = `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <title>معاينة تقرير المشروع</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; direction: rtl; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; }
            .cost { color: #059669; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; border: 1px solid #ddd; text-align: right; }
            th { background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>تقرير المشروع الشامل</h1>
            <p>تاريخ الإنشاء: ${new Date().toLocaleDateString('en-US')}</p>
          </div>
          
          <div class="section">
            <h2>معلومات المشروع</h2>
            <p><strong>اسم المشروع:</strong> ${reportData.projectInfo.name}</p>
            <p><strong>المساحة:</strong> ${reportData.projectInfo.area} متر مربع</p>
            <p><strong>نوع المشروع:</strong> ${reportData.projectInfo.type}</p>
            <p><strong>عدد الطوابق:</strong> ${reportData.projectInfo.floors}</p>
            <p><strong>عدد الغرف:</strong> ${reportData.projectInfo.rooms}</p>
          </div>

          <div class="section">
            <h2>تفاصيل المواد والتكاليف</h2>
            <table>
              <thead>
                <tr>
                  <th>المادة</th>
                  <th>الكمية</th>
                  <th>الوحدة</th>
                  <th>التكلفة الإجمالية</th>
                </tr>
              </thead>
              <tbody>
                ${calculatedMaterials.map(material => `
                  <tr>
                    <td>${material.name}</td>
                    <td>${material.calculatedQuantity}</td>
                    <td>${material.unit}</td>
                    <td class="cost">${material.formattedCost} ريال</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <p style="text-align: center; font-size: 18px; margin-top: 20px;">
              <strong>إجمالي التكلفة: <span class="cost">${formatNumber(totalCost)} ريال سعودي</span></strong>
            </p>
          </div>
        </body>
        </html>
      `;

      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(htmlContent);
        newWindow.document.close();
      } else {
        alert('يرجى السماح بفتح النوافذ المنبثقة لعرض التقرير');
      }
    } catch (error) {
      console.error('Error previewing report:', error);
      alert('حدث خطأ في معاينة التقرير');
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
            {projectId && (
              <Button
                variant="outline"
                onClick={() => {
                  if (confirm(`هل أنت متأكد من حذف المشروع "${currentProject?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.`)) {
                    ProjectTrackingService.deleteProject(projectId).then(() => {
                      router.push('/user/projects/list');
                    }).catch((error) => {
                      console.error('Error deleting project:', error);
                      alert('حدث خطأ في حذف المشروع');
                    });
                  }
                }}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
                حذف المشروع
              </Button>
            )}
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
          <TabsList className={`grid w-full ${projectId ? 'grid-cols-7' : 'grid-cols-3'} mb-8`}>
            {projectId && (
              <>
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  نظرة عامة
                </TabsTrigger>
                <TabsTrigger value="expenses" className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  المصروفات والمشتريات
                </TabsTrigger>
                <TabsTrigger value="advice" className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  النصائح والتوصيات
                </TabsTrigger>
                <TabsTrigger value="purchases" className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  المشتريات والضمانات
                </TabsTrigger>
              </>
            )}
            <TabsTrigger value="materials" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              حاسبة المواد الذكية
            </TabsTrigger>
            <TabsTrigger value="lighting" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              توزيع الإنارة
            </TabsTrigger>
            <TabsTrigger value="comprehensive" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              التقرير الشامل
            </TabsTrigger>
          </TabsList>

          {/* Project Overview Tab - only shown when projectId exists */}
          {projectId && (
            <TabsContent value="overview">
              <div className="space-y-6">
                {/* Project Header */}
                {currentProject && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-2xl">{currentProject.name}</CardTitle>
                          <p className="text-gray-600 mt-1">{currentProject.description}</p>
                        </div>
                        <Badge variant="secondary">
                          {currentProject.status === 'planning' && 'تخطيط'}
                          {currentProject.status === 'in-progress' && 'جاري التنفيذ'}
                          {currentProject.status === 'completed' && 'مكتمل'}
                          {currentProject.status === 'on-hold' && 'متوقف'}
                        </Badge>
                      </div>
                    </CardHeader>
                  </Card>
                )}

                {/* Quick Stats */}
                {projectSummary && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">التكلفة المقدرة</p>
                            <p className="text-2xl font-bold text-blue-600">
                              {projectSummary.totalEstimatedCost?.toLocaleString('en-US') || '0'} ريال
                            </p>
                          </div>
                          <DollarSign className="w-8 h-8 text-blue-500" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">المنفق فعلياً</p>
                            <p className="text-2xl font-bold text-green-600">
                              {projectSummary.totalSpentCost?.toLocaleString('en-US') || '0'} ريال
                            </p>
                          </div>
                          <Hammer className="w-8 h-8 text-green-500" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">المتبقي</p>
                            <p className="text-2xl font-bold text-orange-600">
                              {projectSummary.remainingCost?.toLocaleString('en-US') || '0'} ريال
                            </p>
                          </div>
                          <Clock className="w-8 h-8 text-orange-500" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">نسبة الإكمال</p>
                            <p className="text-2xl font-bold text-purple-600">
                              {projectSummary.completionPercentage || 0}%
                            </p>
                          </div>
                          <TrendingUp className="w-8 h-8 text-purple-500" />
                        </div>
                        <Progress value={projectSummary.completionPercentage || 0} className="mt-2" />
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Project Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {currentProject && (
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            معلومات المشروع
                          </CardTitle>
                          <button
                            onClick={() => router.push(`/user/projects/create?editId=${projectId}`)}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            <Edit size={16} />
                            تعديل المشروع
                          </button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm text-gray-600">المساحة</label>
                            <p className="font-semibold">{currentProject.area} متر مربع</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">نوع المشروع</label>
                            <p className="font-semibold">
                              {currentProject.projectType === 'residential' && 'سكني'}
                              {currentProject.projectType === 'commercial' && 'تجاري'}
                              {currentProject.projectType === 'industrial' && 'صناعي'}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">عدد الأدوار</label>
                            <p className="font-semibold">{currentProject.floorCount}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">عدد الغرف</label>
                            <p className="font-semibold">{currentProject.roomCount}</p>
                          </div>
                        </div>
                        <div className="pt-4 border-t">
                          <label className="text-sm text-gray-600">الموقع</label>
                          <p className="font-semibold">{currentProject.location || 'غير محدد'}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Material Categories Progress */}
                  {projectSummary?.materialProgress && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Package className="w-5 h-5" />
                          تقدم فئات المواد
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {Object.entries(projectSummary.materialProgress).map(([category, progress]: [string, any]) => {
                          const completionPercent = progress.estimatedCost > 0 
                            ? Math.round((progress.spentCost / progress.estimatedCost) * 100)
                            : 0;
                          
                          return (
                            <div key={category} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">{category}</span>
                                <span className="text-sm text-gray-600">{completionPercent}%</span>
                              </div>
                              <Progress value={completionPercent} />
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>منفق: {progress.spentCost?.toLocaleString('en-US') || '0'} ريال</span>
                                <span>مقدر: {progress.estimatedCost?.toLocaleString('en-US') || '0'} ريال</span>
                              </div>
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>
          )}

          {/* Expenses and Purchases Tab */}
          {projectId && (
            <TabsContent value="expenses">
              <div className="space-y-6">
                {/* Materials List Header */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      قائمة المواد المقدرة
                    </CardTitle>
                  </CardHeader>
                </Card>

                {/* Unified Materials List */}
                <div className="space-y-4">
                  {(() => {
                    const area = projectArea || 0;
                    const type = projectType;
                    const floors = floorCount || 1;
                    const unifiedMaterials = calculateUnifiedMaterials(area, type, floors);
                    
                    return Object.values(unifiedMaterials).map((material: UnifiedMaterial) => (
                      <Card key={material.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-6">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Material Info */}
                            <div>
                              <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                  <Package className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold">{material.name}</h3>
                                  <p className="text-sm text-gray-600">{material.categoryAr}</p>
                                </div>
                              </div>
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-600 mb-1">{material.category}</p>
                                <div className="flex items-center gap-2">
                                  <ShoppingCart className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm font-medium">شراء</span>
                                </div>
                              </div>
                            </div>

                            {/* Purchase Details */}
                            <div className="space-y-4">
                              {/* Estimated */}
                              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                <span className="text-sm font-medium">مقدر:</span>
                                <span className="font-bold text-blue-800">
                                  {material.quantity.toLocaleString('en-US')} {material.unit}
                                </span>
                              </div>

                              {/* Purchased */}
                              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm font-medium">مشترى:</span>
                                <span className="font-bold text-gray-800">
                                  {(material.purchased ?? 0).toLocaleString('en-US')} {material.unit}
                                </span>
                              </div>

                              {/* Remaining */}
                              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                                <span className="text-sm font-medium">متبقي:</span>
                                <span className="font-bold text-orange-800">
                                  {(material.remaining ?? 0).toLocaleString('en-US')} {material.unit}
                                </span>
                              </div>

                              {/* Remaining Cost */}
                              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                                <span className="text-sm font-medium">التكلفة المتبقية:</span>
                                <span className="text-lg font-bold text-red-700">
                                  {(material.remainingCost ?? 0).toLocaleString('en-US')} ريال
                                </span>
                              </div>

                              {/* Add Purchase Button */}
                              <Button 
                                className="w-full bg-green-600 hover:bg-green-700"
                                onClick={() => {
                                  // TODO: Implement add purchase functionality
                                  alert('سيتم إضافة مشتريات قريباً');
                                }}
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                إضافة مشترى
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ));
                  })()}
                </div>

                {/* Purchase Summary */}
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4">ملخص المشتريات</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {(() => {
                        const area = projectArea || 0;
                        const type = projectType;
                        const floors = floorCount || 1;
                        const unifiedMaterials = calculateUnifiedMaterials(area, type, floors);
                        const totalEstimated = Object.values(unifiedMaterials).reduce((sum: number, material: UnifiedMaterial) => sum + material.totalCost, 0);
                        const totalPurchased = 0; // Since no purchases yet
                        const totalRemaining = totalEstimated - totalPurchased;
                        
                        return [
                          {
                            label: 'إجمالي التقدير',
                            value: `${totalEstimated.toLocaleString('en-US')} ريال`,
                            color: 'text-blue-600'
                          },
                          {
                            label: 'المشترى فعلياً',
                            value: `${totalPurchased.toLocaleString('en-US')} ريال`,
                            color: 'text-green-600'
                          },
                          {
                            label: 'المتبقي للشراء',
                            value: `${totalRemaining.toLocaleString('en-US')} ريال`,
                            color: 'text-orange-600'
                          },
                          {
                            label: 'نسبة الإكمال',
                            value: `${Math.round((totalPurchased / totalEstimated) * 100) || 0}%`,
                            color: 'text-purple-600'
                          }
                        ].map((item, index) => (
                          <div key={index} className="text-center">
                            <p className="text-sm text-gray-600">{item.label}</p>
                            <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
                          </div>
                        ));
                      })()}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}

          {/* Advice and Recommendations Tab */}
          {projectId && (
            <TabsContent value="advice">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-600" />
                      نصائح وتوصيات المشروع
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* AI-Powered Recommendations */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Lightbulb className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-blue-800">توصيات ذكية من بِنَّا</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-white rounded-lg p-4 border-l-4 border-l-green-500">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <h4 className="font-semibold text-green-800">توفير في التكلفة</h4>
                          </div>
                          <p className="text-sm text-gray-700">
                            يمكن توفير 15% من تكلفة الخرسانة عبر شراء دفعة واحدة بدلاً من دفعات متعددة. 
                            الكمية المتبقية (30 م³) يمكن شراؤها مع الطلبية القادمة لتوفير 4,500 ريال.
                          </p>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 border-l-4 border-l-blue-500">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <h4 className="font-semibold text-blue-800">جدولة التوريد</h4>
                          </div>
                          <p className="text-sm text-gray-700">
                            بناءً على تقدم المشروع، ننصح بطلب الدهانات خلال الأسبوعين القادمين لتجنب التأخير. 
                            مواد التشطيب الحالية تكفي لـ 3 أسابيع إضافية.
                          </p>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 border-l-4 border-l-orange-500">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-orange-600" />
                            <h4 className="font-semibold text-orange-800">تحذير مواد</h4>
                          </div>
                          <p className="text-sm text-gray-700">
                            معدل استهلاك الإسمنت أعلى من المتوقع بنسبة 8%. ننصح بمراجعة جودة الخلط 
                            وطلب 20 كيس إضافي لتجنب نقص المواد.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Expert Tips */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="border-l-4 border-l-purple-500">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-purple-800">
                            <Award className="w-5 h-5" />
                            نصائح من الخبراء
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-sm">
                              <strong>جودة الخرسانة:</strong> تأكد من اختبار مقاومة الخرسانة كل 50 م³ 
                              للحفاظ على جودة البناء وسلامة المنشأ.
                            </p>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-sm">
                              <strong>تخزين المواد:</strong> احتفظ بالإسمنت في مكان جاف ومرتفع عن الأرض 
                              لمنع التكتل وفقدان الفعالية.
                            </p>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-sm">
                              <strong>توقيت الدهان:</strong> تجنب الدهان في الأجواء الرطبة أو شديدة الحرارة 
                              لضمان التصاق مثالي ولمعان دائم.
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-green-500">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-green-800">
                            <DollarSign className="w-5 h-5" />
                            توفير المال
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-sm">
                              <strong>الشراء بالجملة:</strong> اطلب كميات كبيرة من نفس المورد 
                              للحصول على خصومات تصل إلى 12%.
                            </p>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-sm">
                              <strong>مقارنة الأسعار:</strong> قارن أسعار 3 موردين على الأقل 
                              لكل مادة لضمان أفضل سعر وجودة.
                            </p>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-sm">
                              <strong>التفاوض على التسليم:</strong> اطلب توصيل مجاني للطلبيات 
                              الكبيرة لتوفير تكاليف النقل.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Weather Recommendations */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Globe className="w-5 h-5 text-blue-600" />
                          توصيات الطقس والموسم
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-blue-800 mb-2">هذا الأسبوع</h4>
                            <p className="text-sm text-gray-700">
                              درجة الحرارة معتدلة (28°م) - مثالية لأعمال الخرسانة والبناء. 
                              لا توجد أمطار متوقعة.
                            </p>
                          </div>
                          <div className="bg-orange-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-orange-800 mb-2">الأسبوع القادم</h4>
                            <p className="text-sm text-gray-700">
                              ارتفاع في درجة الحرارة (35°م) - ننصح بالعمل في الصباح الباكر 
                              وتجنب صب الخرسانة ظهراً.
                            </p>
                          </div>
                          <div className="bg-yellow-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-yellow-800 mb-2">نصائح موسمية</h4>
                            <p className="text-sm text-gray-700">
                              فصل الصيف يتطلب حماية إضافية للخرسانة الطازجة. 
                              استخدم المشمع والرش المستمر بالماء.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quality Assurance Tips */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="w-5 h-5 text-red-600" />
                          ضمان الجودة والسلامة
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-start gap-4">
                            <div className="p-2 bg-red-100 rounded-lg">
                              <Shield className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold mb-1">فحص دوري للمواد</h4>
                              <p className="text-sm text-gray-700">
                                تأكد من فحص جودة المواد عند التسليم ورفض أي مواد لا تطابق المواصفات. 
                                احتفظ بعينات للاختبار إذا لزم الأمر.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4">
                            <div className="p-2 bg-red-100 rounded-lg">
                              <AlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold mb-1">معايير السلامة</h4>
                              <p className="text-sm text-gray-700">
                                تأكد من ارتداء معدات الحماية الشخصية وتوفير بيئة عمل آمنة. 
                                راجع إرشادات السلامة مع فريق العمل أسبوعياً.
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}

          {/* Purchases & Warranties Tab */}
          {projectId && (
            <TabsContent value="purchases">
              <ProjectPurchasesWarranties 
                projectId={projectId} 
                projectName={currentProject?.name || 'المشروع الحالي'} 
              />
            </TabsContent>
          )}

          {/* Smart Materials Calculator Tab */}
          <TabsContent value="materials">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Input Methods */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    طرق إدخال البيانات
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Method 1: Manual Entry */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Home className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold">الطريقة الأولى: الإدخال اليدوي</h3>
                    </div>
                    
                    <div className="space-y-4">
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
                      
                      <Button 
                        onClick={() => {
                          console.log('Calculate materials button clicked');
                          calculateMaterials();
                        }} 
                        className="w-full"
                      >
                        احسب المواد المطلوبة
                      </Button>
                    </div>
                  </div>

                  {/* Method 2: PDF Analysis */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold">الطريقة الثانية: تحليل المخططات</h3>
                    </div>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="pdf-upload"
                      />
                      <label htmlFor="pdf-upload" className="cursor-pointer">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          ارفع مخططات المشروع (PDF)
                        </p>
                        <p className="text-xs text-gray-500">
                          سيتم تحليلها تلقائياً وحساب المواد
                        </p>
                      </label>
                    </div>
                    
                    {pdfFile && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium">{pdfFile.name}</span>
                        </div>
                      </div>
                    )}

                    {analyzing && (
                      <div className="mt-4 text-center py-6">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                        <p className="text-sm text-gray-600">جاري تحليل المخططات...</p>
                      </div>
                    )}

                    {pdfAnalysis && !analyzing && (
                      <div className="mt-4">
                        <Button 
                          onClick={() => {
                            // Auto-fill manual inputs from PDF analysis
                            setProjectArea(pdfAnalysis.extractedData.totalArea);
                            setProjectType('villa');
                            setFloorCount(1);
                            setRoomCount(pdfAnalysis.extractedData.rooms.length);
                            
                            // Trigger calculation with PDF data
                            calculateMaterials();
                          }}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          استخدم بيانات المخططات
                        </Button>
                        <p className="text-xs text-green-600 mt-2 text-center">
                          تم استخراج: {pdfAnalysis.extractedData.totalArea} م² • {pdfAnalysis.extractedData.rooms.length} غرفة
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Method 3: Quick Templates */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Target className="w-5 h-5 text-purple-600" />
                      <h3 className="font-semibold">الطريقة الثالثة: القوالب الجاهزة</h3>
                    </div>
                    
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setProjectArea(150);
                          setProjectType('apartment');
                          setFloorCount(1);
                          setRoomCount(3);
                          calculateMaterials();
                        }}
                        className="w-full text-left justify-start"
                      >
                        شقة صغيرة (150م² • 3 غرف)
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setProjectArea(300);
                          setProjectType('villa');
                          setFloorCount(2);
                          setRoomCount(5);
                          calculateMaterials();
                        }}
                        className="w-full text-left justify-start"
                      >
                        فيلا متوسطة (300م² • 5 غرف)
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setProjectArea(500);
                          setProjectType('villa');
                          setFloorCount(2);
                          setRoomCount(8);
                          calculateMaterials();
                        }}
                        className="w-full text-left justify-start"
                      >
                        فيلا كبيرة (500م² • 8 غرف)
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Materials Results */}
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      قائمة المواد المطلوبة
                      {pdfAnalysis && (
                        <Badge variant="secondary" className="ml-2">
                          <FileText className="w-3 h-3 mr-1" />
                          من تحليل المخططات
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Project Summary */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <p className="text-gray-600">المساحة</p>
                          <p className="font-semibold">{projectArea} م²</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600">النوع</p>
                          <p className="font-semibold">
                            {projectType === 'villa' ? 'فيلا' : 
                             projectType === 'apartment' ? 'شقة' : 
                             projectType === 'commercial' ? 'تجاري' : 'مستودع'}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600">الأدوار</p>
                          <p className="font-semibold">{floorCount}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600">الغرف</p>
                          <p className="font-semibold">{roomCount}</p>
                        </div>
                      </div>
                      
                      {pdfAnalysis && (
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="font-medium mb-2">الغرف المستخرجة من المخططات:</h4>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {pdfAnalysis.extractedData.rooms.map((room, idx) => (
                              <div key={idx} className="flex justify-between bg-white p-2 rounded">
                                <span>{room.name}</span>
                                <span>{room.area} م²</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
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
                        <span className="text-2xl font-bold text-blue-600">{formatNumber(totalCost)} ر.س</span>
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                  
                  <div className="pt-4 border-t">
                    <Button 
                      onClick={saveCurrentRoom}
                      className="w-full flex items-center gap-2 bg-green-600 hover:bg-green-700"
                      disabled={!lightCalc.roomName.trim()}
                    >
                      <Plus className="w-4 h-4" />
                      حفظ الغرفة
                    </Button>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      يجب إدخال اسم الغرفة قبل الحفظ
                    </p>
                  </div>
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

                    {/* Current Room Lighting Cost */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold mb-2 text-blue-800">تكلفة إنارة الغرفة الحالية</h4>
                      <div className="text-sm space-y-1">
                        {(() => {
                          const firstRowProduct = lightProducts.find(p => p.value === lightCalc.firstRowLights.product);
                          const secondRowProduct = lightProducts.find(p => p.value === lightCalc.secondRowLights.product);
                          const firstRowTotal = (lightCalc.firstRowLights.widthCount * lightCalc.firstRowLights.lengthCount);
                          const secondRowTotal = (lightCalc.secondRowLights.widthCount * lightCalc.secondRowLights.lengthCount);
                          const firstRowCost = firstRowTotal * (firstRowProduct?.price || 0);
                          const secondRowCost = secondRowTotal * (secondRowProduct?.price || 0);
                          const totalCost = firstRowCost + secondRowCost;
                          
                          return (
                            <>
                              <div className="flex justify-between">
                                <span>الصف الأول ({firstRowTotal} وحدة):</span>
                                <span className="font-medium">{formatNumber(firstRowCost)} ر.س</span>
                              </div>
                              {lightCalc.rowCount === 2 && (
                                <div className="flex justify-between">
                                  <span>الصف الثاني ({secondRowTotal} وحدة):</span>
                                  <span className="font-medium">{formatNumber(secondRowCost)} ر.س</span>
                                </div>
                              )}
                              <div className="flex justify-between border-t pt-2 font-bold text-blue-600">
                                <span>إجمالي التكلفة:</span>
                                <span>{formatNumber(totalCost)} ر.س</span>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Saved Rooms */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    الغرف المحفوظة ({savedRooms.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {savedRooms.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>لم يتم حفظ أي غرف بعد</p>
                      <p className="text-sm">احسب إنارة غرفة واحفظها لرؤيتها هنا</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {savedRooms.map((room, index) => {
                        const roomTypeLabel = roomTypes.find(rt => rt.value === room.roomType)?.label || room.roomType;
                        const firstRowProduct = lightProducts.find(p => p.value === room.firstRowLights.product);
                        const secondRowProduct = lightProducts.find(p => p.value === room.secondRowLights.product);
                        const firstRowTotal = (room.firstRowLights.widthCount * room.firstRowLights.lengthCount);
                        const secondRowTotal = (room.secondRowLights.widthCount * room.secondRowLights.lengthCount);
                        const firstRowCost = firstRowTotal * (firstRowProduct?.price || 0);
                        const secondRowCost = secondRowTotal * (secondRowProduct?.price || 0);
                        const totalRoomCost = firstRowCost + secondRowCost;
                        
                        return (
                          <div key={index} className="border rounded-lg p-4 bg-gray-50">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-semibold text-gray-900">{room.roomName}</h4>
                                <p className="text-sm text-gray-600">{roomTypeLabel} • {room.area} م²</p>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => loadSavedRoom(room)}
                                  className="text-xs"
                                >
                                  تعديل
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => deleteSavedRoom(room.roomName)}
                                  className="text-xs"
                                >
                                  حذف
                                </Button>
                              </div>
                            </div>
                            
                            <div className="text-sm space-y-1">
                              <div className="flex justify-between">
                                <span>الأبعاد:</span>
                                <span>{room.length}م × {room.width}م</span>
                              </div>
                              <div className="flex justify-between">
                                <span>إجمالي الوحدات:</span>
                                <span>{firstRowTotal + secondRowTotal} وحدة</span>
                              </div>
                              <div className="flex justify-between">
                                <span>التكلفة:</span>
                                <span className="font-semibold text-green-600">{formatNumber(totalRoomCost)} ر.س</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* Total Lighting Cost Summary */}
                      <div className="border-t pt-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h4 className="font-semibold mb-2 text-green-800">ملخص تكلفة الإنارة</h4>
                          <div className="text-sm space-y-1">
                            <div className="flex justify-between">
                              <span>عدد الغرف:</span>
                              <span>{savedRooms.length} غرفة</span>
                            </div>
                            <div className="flex justify-between">
                              <span>إجمالي الوحدات:</span>
                              <span>{savedRooms.reduce((total, room) => {
                                const firstRowTotal = room.firstRowLights.widthCount * room.firstRowLights.lengthCount;
                                const secondRowTotal = room.secondRowLights.widthCount * room.secondRowLights.lengthCount;
                                return total + firstRowTotal + secondRowTotal;
                              }, 0)} وحدة</span>
                            </div>
                            <div className="flex justify-between border-t pt-2 font-bold text-green-600">
                              <span>إجمالي التكلفة:</span>
                              <span>{formatNumber(getTotalLightingCost())} ر.س</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
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
                        {formatNumber(totalCost)} ر.س
                      </p>
                      <p className="text-sm text-blue-700 mt-2">شاملة جميع المواد الأساسية</p>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                      <Lightbulb className="w-12 h-12 text-green-600 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-green-800">الإنارة</h3>
                      <p className="text-3xl font-bold text-green-600 mt-2">
                        {formatNumber(getTotalLightingCost())} ر.س
                      </p>
                      <p className="text-sm text-green-700 mt-2">
                        {savedRooms.length} غرفة • {savedRooms.reduce((total, room) => {
                          const firstRowTotal = room.firstRowLights.widthCount * room.firstRowLights.lengthCount;
                          const secondRowTotal = room.secondRowLights.widthCount * room.secondRowLights.lengthCount;
                          return total + firstRowTotal + secondRowTotal;
                        }, 0)} وحدة إنارة
                      </p>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
                      <FileText className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-purple-800">التحليل الذكي</h3>
                      <p className="text-3xl font-bold text-purple-600 mt-2">
                        {pdfAnalysis ? 'مكتمل' : 'متاح'}
                      </p>
                      <p className="text-sm text-purple-700 mt-2">
                        {pdfAnalysis ? 
                          `تم تحليل: ${pdfAnalysis.extractedData.rooms.length} غرفة` : 
                          'ارفع المخططات للتحليل الذكي'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-4 justify-center">
                    <Button 
                      className="flex items-center gap-2"
                      onClick={() => generateAndDownloadPDF()}
                    >
                      <Download className="w-4 h-4" />
                      تحميل التقرير الشامل
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={() => previewReport()}
                    >
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
                    <span>{formatNumber(totalCost)} ريال</span>
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

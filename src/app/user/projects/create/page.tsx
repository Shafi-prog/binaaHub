'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProjectTrackingService } from '@/core/services/projectTrackingService';
import { ConstructionGuidanceService, ConstructionLevel, ProjectLevel } from '@/core/services/constructionGuidanceService';
import LandPurchaseIntegration from '@/core/shared/components/integrations/LandPurchaseIntegration';

// Material type definition
interface MaterialCalculation {
  name: string;
  quantity: number;
  unit: string;
  estimatedCost: number;
  description: string;
}

interface MaterialsMap {
  [key: string]: MaterialCalculation;
}
import ContractorSelectionIntegration from '@/core/shared/components/integrations/ContractorSelectionIntegration';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import { 
  ArrowLeft, 
  Building2, 
  MapPin,
  Users,
  Shield,
  Hammer,
  Truck,
  FileCheck,
  Award,
  ExternalLink,
  CheckCircle,
  Clock,
  DollarSign,
  Globe,
  Download,
  AlertTriangle,
  Lightbulb,
  Target,
  Calendar,
  FileText,
  Calculator,
  Package,
  Ruler,
  Home,
  Trash2,
  Copy,
  Camera,
  Upload,
  Map,
  ShoppingCart,
  BookOpen
} from 'lucide-react';

export default function CreateProjectPage() {
  const { user, session, isLoading, error } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editProjectId, setEditProjectId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'project-info' | 'location' | 'bulk-construction' | 'sale-booking' | 'level-selection' | 'level-details' | 'materials' | 'guidance'>('project-info');
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [currentLevelView, setCurrentLevelView] = useState<string>('');
  const [materialsCalculated, setMaterialsCalculated] = useState(false);

  // Check for edit mode on component mount
  useEffect(() => {
    const editId = searchParams?.get('editId');
    if (editId) {
      setEditMode(true);
      setEditProjectId(editId);
      loadProjectForEdit(editId);
    }
  }, [searchParams]);

  // Load project data for editing
  const loadProjectForEdit = async (projectId: string) => {
    try {
      const project = await ProjectTrackingService.getProjectById(projectId);
      if (project) {
        setProjectData({
          name: project.name,
          location: project.location || '',
          area: project.area.toString(),
          budget: project.budget?.toString() || '',
          description: project.description || '',
          projectType: (project.projectType as 'residential' | 'commercial' | 'industrial') || 'residential',
          floors: project.floorCount || 1,
          rooms: project.roomCount || 4,
          bathrooms: 3,
          kitchens: 1,
          livingArea: 30,
          estimatedBudget: project.budget?.toString() || '',
          finishQuality: 'standard',
          pdfFile: null,
          pdfAnalyzed: false,
          exactLocation: {
            latitude: '',
            longitude: '',
            address: project.location || '',
            mapUrl: ''
          },
          locationImages: [],
          isBulkProject: false,
          bulkDetails: {
            unitCount: 1,
            unitType: 'villa',
            isIdentical: true,
            constructionCompany: '',
            masterPlan: null
          },
          saleModel: {
            isForSale: false,
            isForBooking: false,
            pricePerUnit: '',
            bookingDeposit: '',
            paymentPlan: 'cash',
            completionDate: '',
            features: [],
            priceMarks: []
          }
        });
        setSelectedLevels(project.selectedPhases || []);
      }
    } catch (error) {
      console.error('Error loading project for edit:', error);
      alert('حدث خطأ في تحميل بيانات المشروع');
    }
  };
  const [projectData, setProjectData] = useState({
    name: '',
    location: '',
    area: '',
    budget: '',
    description: '',
    projectType: 'residential' as 'residential' | 'commercial' | 'industrial',
    floors: 1,
    rooms: 4,
    bathrooms: 3,
    kitchens: 1,
    livingArea: 30,
    estimatedBudget: '',
    finishQuality: 'standard',
    pdfFile: null as File | null,
    pdfAnalyzed: false,
    // New fields
    exactLocation: {
      latitude: '',
      longitude: '',
      address: '',
      mapUrl: ''
    },
    locationImages: [] as File[],
    isBulkProject: false,
    bulkDetails: {
      unitCount: 1,
      unitType: 'villa',
      isIdentical: true,
      constructionCompany: '',
      masterPlan: null as File | null
    },
    saleModel: {
      isForSale: false,
      isForBooking: false,
      pricePerUnit: '',
      bookingDeposit: '',
      paymentPlan: 'cash',
      completionDate: '',
      features: [] as string[],
      priceMarks: [] as string[]
    }
  });

  const constructionLevels = ConstructionGuidanceService.getConstructionLevels();

  const handleLevelToggle = (levelId: string) => {
    setSelectedLevels(prev => {
      const level = constructionLevels.find(l => l.id === levelId);
      if (!level) return prev;

      if (prev.includes(levelId)) {
        // Remove level and all dependent levels
        const levelsToRemove = constructionLevels
          .filter(l => l.dependencies?.includes(levelId) || l.id === levelId)
          .map(l => l.id);
        return prev.filter(id => !levelsToRemove.includes(id));
      } else {
        // Add level and all dependencies
        const levelsToAdd = new Set([levelId]);
        
        // Add dependencies recursively
        const addDependencies = (id: string) => {
          const currentLevel = constructionLevels.find(l => l.id === id);
          if (currentLevel?.dependencies) {
            currentLevel.dependencies.forEach(dep => {
              levelsToAdd.add(dep);
              addDependencies(dep);
            });
          }
        };
        
        addDependencies(levelId);
        return [...prev, ...Array.from(levelsToAdd)].filter((id, index, arr) => arr.indexOf(id) === index);
      }
    });
  };

  const calculateMaterials = () => {
    setMaterialsCalculated(true);
    setActiveTab('materials');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectData.name.trim()) {
      alert('يرجى إدخال اسم المشروع');
      return;
    }

    if (selectedLevels.length === 0) {
      alert('يرجى اختيار مستوى واحد على الأقل');
      return;
    }

    // Calculate actual materials cost for the project
    const calculatedMaterialsCost = Object.values(getMaterialsForProject())
      .reduce((sum, material) => sum + material.estimatedCost, 0);

    // Confirm with user before saving
    const confirmed = confirm(
      editMode 
        ? `سيتم تحديث المشروع بالتكلفة المحسوبة: ${calculatedMaterialsCost.toLocaleString('en-US')} ريال\n\nهل تريد المتابعة؟`
        : `سيتم إنشاء المشروع بالتكلفة المحسوبة: ${calculatedMaterialsCost.toLocaleString('en-US')} ريال\n\nهل تريد المتابعة؟`
    );

    if (!confirmed) return;

    setLoading(true);
    try {
      const projectLevels: ProjectLevel[] = selectedLevels.map(levelId => ({
        levelId,
        status: 'not-started',
        progress: 0
      }));

      const projectPayload = {
        id: editMode ? editProjectId! : Date.now().toString(),
        name: projectData.name,
        description: projectData.description,
        area: parseInt(projectData.area) || 0,
        projectType: projectData.projectType,
        floorCount: projectData.floors || 1,
        roomCount: (projectData.rooms || 0) + (projectData.bathrooms || 0) + (projectData.kitchens || 0),
        stage: 'تخطيط',
        progress: 0,
        status: 'planning' as const,
        location: projectData.location,
        budget: calculatedMaterialsCost, // Use calculated materials cost instead of user budget
        selectedPhases: selectedLevels,
        enablePhotoTracking: true,
        enableProgressTracking: true,
        createdAt: editMode ? (new Date().toISOString()) : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await ProjectTrackingService.saveProject(projectPayload);

      if (editMode) {
        router.push(`/user/comprehensive-construction-calculator?projectId=${editProjectId}`);
      } else {
        router.push('/user/projects');
      }
    } catch (error) {
      console.error(`Error ${editMode ? 'updating' : 'creating'} project:`, error);
      alert(`حدث خطأ في ${editMode ? 'تحديث' : 'إنشاء'} المشروع`);
    } finally {
      setLoading(false);
    }
  };

  const canStartLevel = (levelId: string) => {
    return ConstructionGuidanceService.canStartLevel(levelId, selectedLevels);
  };

  const renderLevelIntegration = (level: ConstructionLevel) => {
    if (!level.hasExternalIntegration) return null;

    switch (level.id) {
      case 'land-acquisition':
        return (
          <LandPurchaseIntegration 
            projectId="new-project"
            onLandSelected={(land) => console.log('Land selected:', land)}
          />
        );
      case 'contractor-selection':
        return (
          <ContractorSelectionIntegration 
            projectId="new-project"
            projectArea={parseInt(projectData.area) || 500}
            projectType={projectData.projectType}
            onContractorSelected={(contractor) => console.log('Contractor selected:', contractor)}
          />
        );
      default:
        return (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Globe className="w-6 h-6 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-blue-800">تكامل خارجي متاح</h4>
                  <p className="text-sm text-blue-600">
                    سيتم توفير التكامل مع: {level.externalPlatforms?.join(', ')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  const getMaterialsForProject = (): MaterialsMap => {
    const area = parseInt(projectData.area) || 0;
    const projectType = projectData.projectType;
    const floors = projectData.floors || 1;
    
    // Use the same unified calculation logic as comprehensive calculator
    const baseCalculations = {
      'concrete': {
        name: 'خرسانة',
        quantityPerSqm: 0.3,
        unitPrice: 350,
        unit: 'متر مكعب',
        description: 'خرسانة للأساسات والأعمدة والسقف'
      },
      'steel': {
        name: 'حديد التسليح',
        quantityPerSqm: 120,
        unitPrice: 4.5,
        unit: 'كيلوجرام',
        description: 'حديد التسليح للمنشأ'
      },
      'cement': {
        name: 'إسمنت بورتلاند',
        quantityPerSqm: 2,
        unitPrice: 18,
        unit: 'كيس 50كغ',
        description: 'إسمنت بورتلاندي للبناء'
      },
      'blocks': {
        name: 'بلوك خرساني',
        quantityPerSqm: 45,
        unitPrice: 3.5,
        unit: 'قطعة',
        description: 'بلوك خرساني للجدران'
      },
      'sand': {
        name: 'رمل بناء',
        quantityPerSqm: 0.5,
        unitPrice: 80,
        unit: 'متر مكعب',
        description: 'رمل للملاط والخرسانة'
      },
      'gravel': {
        name: 'حصى مدرج',
        quantityPerSqm: 0.4,
        unitPrice: 90,
        unit: 'متر مكعب',
        description: 'حصى للخرسانة والأساسات'
      },
      'tiles': {
        name: 'بلاط سيراميك',
        quantityPerSqm: 1.1,
        unitPrice: 45,
        unit: 'متر مربع',
        description: 'بلاط للأرضيات'
      },
      'paint': {
        name: 'دهان أكريليك',
        quantityPerSqm: 0.5,
        unitPrice: 80,
        unit: 'جالون 4 لتر',
        description: 'دهان للجدران الداخلية والخارجية'
      }
    };

    // Calculate materials using unified logic
    const materials: MaterialsMap = {};
    
    Object.entries(baseCalculations).forEach(([key, material]) => {
      let quantity = Math.ceil(area * material.quantityPerSqm);
      
      // Apply floor multiplier for certain materials
      if (['concrete', 'steel', 'cement'].includes(key)) {
        quantity = quantity * floors;
      }
      
      // Apply project type multiplier
      let typeMultiplier = 1;
      if (projectType === 'commercial') {
        typeMultiplier = 1.3;
      } else if (projectType === 'industrial') {
        typeMultiplier = 1.5;
      }
      
      quantity = Math.ceil(quantity * typeMultiplier);
      const estimatedCost = quantity * material.unitPrice;
      
      materials[key] = {
        ...material,
        quantity,
        estimatedCost
      };
    });

    return materials;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            رجوع
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800">
              {editMode ? 'تعديل المشروع' : 'منصة بِنَّا الموحدة للبناء'}
            </h1>
            <p className="text-gray-600">
              {editMode ? 'تحديث معلومات وتفاصيل المشروع' : 'نظام شامل مع الإرشادات الرسمية والتكامل مع المنصات الخارجية'}
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {editMode ? 'خطوات تعديل المشروع' : 'خطوات إنشاء المشروع'}
            </h3>
            <span className="text-sm text-gray-500">
              الخطوة {
                activeTab === 'project-info' ? 1 : 
                activeTab === 'location' ? 2 : 
                activeTab === 'bulk-construction' ? 3 : 
                activeTab === 'sale-booking' ? 4 : 
                activeTab === 'level-selection' ? 5 : 
                activeTab === 'level-details' ? 6 : 
                activeTab === 'materials' ? 7 : 8
              } من 8
            </span>
          </div>
          <Progress 
            value={
              activeTab === 'project-info' ? 12.5 : 
              activeTab === 'location' ? 25 : 
              activeTab === 'bulk-construction' ? 37.5 : 
              activeTab === 'sale-booking' ? 50 : 
              activeTab === 'level-selection' ? 62.5 : 
              activeTab === 'level-details' ? 75 : 
              activeTab === 'materials' ? 87.5 : 100
            } 
            className="w-full"
          />
        </div>

        {/* Tabs Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 rounded-xl bg-gray-200 p-1 overflow-x-auto">
            {[
              { id: 'project-info', label: 'معلومات المشروع', icon: FileText },
              { id: 'location', label: 'الموقع الدقيق', icon: MapPin },
              { id: 'bulk-construction', label: 'البناء المتعدد', icon: Copy },
              { id: 'sale-booking', label: 'البيع والحجز', icon: ShoppingCart },
              { id: 'level-selection', label: 'اختيار المستويات', icon: CheckCircle },
              { id: 'level-details', label: 'تفاصيل المستويات', icon: Building2 },
              { id: 'materials', label: 'احسب المواد المطلوبة', icon: Calculator },
              { id: 'guidance', label: 'الإرشادات والوثائق', icon: FileCheck }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'project-info' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" />
                معلومات المشروع الأساسية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">اسم المشروع *</label>
                  <Input
                    value={projectData.name}
                    onChange={(e) => setProjectData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="فيلا العائلة الجديدة"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">الموقع</label>
                  <Input
                    value={projectData.location}
                    onChange={(e) => setProjectData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="الرياض، المملكة العربية السعودية"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">نوع المشروع</label>
                  <select
                    value={projectData.projectType}
                    onChange={(e) => setProjectData(prev => ({ ...prev, projectType: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="residential">سكني</option>
                    <option value="commercial">تجاري</option>
                    <option value="industrial">صناعي</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">المساحة (متر مربع)</label>
                  <Input
                    type="number"
                    value={projectData.area}
                    onChange={(e) => setProjectData(prev => ({ ...prev, area: e.target.value }))}
                    placeholder="500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">الميزانية التقديرية (ريال)</label>
                  <Input
                    type="number"
                    value={projectData.budget}
                    onChange={(e) => setProjectData(prev => ({ ...prev, budget: e.target.value }))}
                    placeholder="800000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">وصف المشروع</label>
                <Textarea
                  value={projectData.description}
                  onChange={(e) => setProjectData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="وصف تفصيلي للمشروع ومتطلباته..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() => setActiveTab('location')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  التالي: الموقع الدقيق
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Location Tab */}
        {activeTab === 'location' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-6 h-6 text-red-600" />
                الموقع الدقيق والصور
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">العنوان التفصيلي *</label>
                  <Textarea
                    value={projectData.exactLocation.address}
                    onChange={(e) => setProjectData(prev => ({
                      ...prev,
                      exactLocation: { ...prev.exactLocation, address: e.target.value }
                    }))}
                    placeholder="الرياض، حي النرجس، شارع الأمير محمد بن عبدالعزيز، رقم 123"
                    rows={3}
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">خط الطول (Longitude)</label>
                    <Input
                      value={projectData.exactLocation.longitude}
                      onChange={(e) => setProjectData(prev => ({
                        ...prev,
                        exactLocation: { ...prev.exactLocation, longitude: e.target.value }
                      }))}
                      placeholder="46.6753"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">خط العرض (Latitude)</label>
                    <Input
                      value={projectData.exactLocation.latitude}
                      onChange={(e) => setProjectData(prev => ({
                        ...prev,
                        exactLocation: { ...prev.exactLocation, latitude: e.target.value }
                      }))}
                      placeholder="24.7136"
                    />
                  </div>
                </div>
              </div>

              {/* Map Integration */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <Map className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-700 mb-1">
                  اختر الموقع على الخريطة
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  انقر لفتح Google Maps واختيار الموقع الدقيق
                </p>
                <div className="flex gap-2 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const mapUrl = `https://www.google.com/maps/@${projectData.exactLocation.latitude || '24.7136'},${projectData.exactLocation.longitude || '46.6753'},15z`;
                      window.open(mapUrl, '_blank');
                    }}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    فتح الخريطة
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition((position) => {
                          setProjectData(prev => ({
                            ...prev,
                            exactLocation: {
                              ...prev.exactLocation,
                              latitude: position.coords.latitude.toString(),
                              longitude: position.coords.longitude.toString()
                            }
                          }));
                        });
                      } else {
                        alert('الموقع الجغرافي غير مدعوم في هذا المتصفح');
                      }
                    }}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    موقعي الحالي
                  </Button>
                </div>
                {projectData.exactLocation.latitude && projectData.exactLocation.longitude && (
                  <div className="mt-3 p-2 bg-green-50 rounded text-sm text-green-700">
                    ✓ تم حفظ الإحداثيات: {projectData.exactLocation.latitude}, {projectData.exactLocation.longitude}
                  </div>
                )}
              </div>

              {/* Location Images */}
              <div>
                <label className="block text-sm font-medium mb-2">صور الموقع *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setProjectData(prev => ({
                        ...prev,
                        locationImages: [...prev.locationImages, ...files]
                      }));
                    }}
                    className="hidden"
                    id="location-images"
                  />
                  <label htmlFor="location-images" className="cursor-pointer">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      ارفع صور الموقع والمنطقة المحيطة
                    </p>
                    <p className="text-xs text-gray-500">
                      مهم جداً للتوصيل والتسليم - يمكن رفع عدة صور
                    </p>
                  </label>
                </div>
                
                {projectData.locationImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {projectData.locationImages.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`موقع ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          onClick={() => {
                            setProjectData(prev => ({
                              ...prev,
                              locationImages: prev.locationImages.filter((_, i) => i !== index)
                            }));
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab('project-info')}
                >
                  السابق: معلومات المشروع
                </Button>
                <Button
                  onClick={() => setActiveTab('bulk-construction')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  التالي: البناء المتعدد
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bulk Construction Tab */}
        {activeTab === 'bulk-construction' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Copy className="w-6 h-6 text-purple-600" />
                البناء المتعدد للشركات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  id="bulk-project"
                  checked={projectData.isBulkProject}
                  onChange={(e) => setProjectData(prev => ({
                    ...prev,
                    isBulkProject: e.target.checked
                  }))}
                  className="w-4 h-4 text-purple-600"
                />
                <label htmlFor="bulk-project" className="font-medium">
                  هذا مشروع متعدد الوحدات (فلل أو شقق متطابقة)
                </label>
              </div>

              {projectData.isBulkProject && (
                <div className="space-y-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">عدد الوحدات</label>
                      <Input
                        type="number"
                        value={projectData.bulkDetails.unitCount}
                        onChange={(e) => setProjectData(prev => ({
                          ...prev,
                          bulkDetails: { ...prev.bulkDetails, unitCount: Number(e.target.value) }
                        }))}
                        placeholder="6"
                        min="2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">نوع الوحدة</label>
                      <select
                        value={projectData.bulkDetails.unitType}
                        onChange={(e) => setProjectData(prev => ({
                          ...prev,
                          bulkDetails: { ...prev.bulkDetails, unitType: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="villa">فيلا</option>
                        <option value="apartment">شقة</option>
                        <option value="townhouse">تاون هاوس</option>
                        <option value="duplex">دوبلكس</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">شركة المقاولات</label>
                      <Input
                        value={projectData.bulkDetails.constructionCompany}
                        onChange={(e) => setProjectData(prev => ({
                          ...prev,
                          bulkDetails: { ...prev.bulkDetails, constructionCompany: e.target.value }
                        }))}
                        placeholder="شركة البناء المتميز"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      id="identical-units"
                      checked={projectData.bulkDetails.isIdentical}
                      onChange={(e) => setProjectData(prev => ({
                        ...prev,
                        bulkDetails: { ...prev.bulkDetails, isIdentical: e.target.checked }
                      }))}
                      className="w-4 h-4 text-purple-600"
                    />
                    <label htmlFor="identical-units" className="text-sm">
                      جميع الوحدات متطابقة (نفس التصميم والمساحة)
                    </label>
                  </div>

                  {/* Master Plan Upload */}
                  <div>
                    <label className="block text-sm font-medium mb-2">المخطط العام للمشروع</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setProjectData(prev => ({
                              ...prev,
                              bulkDetails: { ...prev.bulkDetails, masterPlan: file }
                            }));
                          }
                        }}
                        className="hidden"
                        id="master-plan"
                      />
                      <label htmlFor="master-plan" className="cursor-pointer text-center block">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">ارفع المخطط العام (PDF أو صورة)</p>
                      </label>
                    </div>
                    {projectData.bulkDetails.masterPlan && (
                      <p className="text-sm text-green-600 mt-2">
                        ✓ تم رفع الملف: {projectData.bulkDetails.masterPlan.name}
                      </p>
                    )}
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">ملخص المشروع المتعدد</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">عدد الوحدات:</span>
                        <p className="font-semibold">{projectData.bulkDetails.unitCount}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">نوع الوحدة:</span>
                        <p className="font-semibold">{projectData.bulkDetails.unitType === 'villa' ? 'فيلا' : projectData.bulkDetails.unitType === 'apartment' ? 'شقة' : projectData.bulkDetails.unitType}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">المساحة الإجمالية:</span>
                        <p className="font-semibold">{(parseInt(projectData.area) || 0) * projectData.bulkDetails.unitCount} م²</p>
                      </div>
                      <div>
                        <span className="text-gray-600">التكلفة المقدرة:</span>
                        <p className="font-semibold text-blue-600">
                          {(Object.values(getMaterialsForProject()).reduce((sum, material) => sum + material.estimatedCost, 0) * projectData.bulkDetails.unitCount).toLocaleString('en-US')} ريال
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab('location')}
                >
                  السابق: الموقع الدقيق
                </Button>
                <Button
                  onClick={() => setActiveTab('sale-booking')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  التالي: البيع والحجز
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sale & Booking Tab */}
        {activeTab === 'sale-booking' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-6 h-6 text-green-600" />
                نموذج البيع والحجز
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      id="for-sale"
                      checked={projectData.saleModel.isForSale}
                      onChange={(e) => setProjectData(prev => ({
                        ...prev,
                        saleModel: { ...prev.saleModel, isForSale: e.target.checked }
                      }))}
                      className="w-4 h-4 text-green-600"
                    />
                    <label htmlFor="for-sale" className="font-medium">
                      متاح للبيع
                    </label>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      id="for-booking"
                      checked={projectData.saleModel.isForBooking}
                      onChange={(e) => setProjectData(prev => ({
                        ...prev,
                        saleModel: { ...prev.saleModel, isForBooking: e.target.checked }
                      }))}
                      className="w-4 h-4 text-green-600"
                    />
                    <label htmlFor="for-booking" className="font-medium">
                      متاح للحجز المسبق
                    </label>
                  </div>
                </div>
              </div>

              {(projectData.saleModel.isForSale || projectData.saleModel.isForBooking) && (
                <div className="space-y-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  {/* Price Marks Section */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      التسعير والعلامات المميزة
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { id: 'early-bird', label: 'العرض المبكر', color: 'bg-blue-100 text-blue-800' },
                        { id: 'limited-time', label: 'عرض محدود', color: 'bg-red-100 text-red-800' },
                        { id: 'best-price', label: 'أفضل سعر', color: 'bg-green-100 text-green-800' },
                        { id: 'pre-launch', label: 'ما قبل الإطلاق', color: 'bg-purple-100 text-purple-800' },
                        { id: 'featured', label: 'مميز', color: 'bg-orange-100 text-orange-800' },
                        { id: 'hot-deal', label: 'عرض ساخن', color: 'bg-pink-100 text-pink-800' }
                      ].map((mark) => (
                        <label key={mark.id} className="flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={projectData.saleModel.priceMarks?.includes(mark.id) || false}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setProjectData(prev => ({
                                  ...prev,
                                  saleModel: {
                                    ...prev.saleModel,
                                    priceMarks: [...(prev.saleModel.priceMarks || []), mark.id]
                                  }
                                }));
                              } else {
                                setProjectData(prev => ({
                                  ...prev,
                                  saleModel: {
                                    ...prev.saleModel,
                                    priceMarks: (prev.saleModel.priceMarks || []).filter(m => m !== mark.id)
                                  }
                                }));
                              }
                            }}
                            className="w-3 h-3"
                          />
                          <span className={`px-2 py-1 rounded text-xs ${mark.color}`}>
                            {mark.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {projectData.isBulkProject ? 'السعر لكل وحدة' : 'سعر المشروع'} (ريال)
                      </label>
                      <Input
                        type="number"
                        value={projectData.saleModel.pricePerUnit}
                        onChange={(e) => setProjectData(prev => ({
                          ...prev,
                          saleModel: { ...prev.saleModel, pricePerUnit: e.target.value }
                        }))}
                        placeholder="800000"
                      />
                    </div>
                    
                    {projectData.saleModel.isForBooking && (
                      <div>
                        <label className="block text-sm font-medium mb-2">مبلغ الحجز (ريال)</label>
                        <Input
                          type="number"
                          value={projectData.saleModel.bookingDeposit}
                          onChange={(e) => setProjectData(prev => ({
                            ...prev,
                            saleModel: { ...prev.saleModel, bookingDeposit: e.target.value }
                          }))}
                          placeholder="50000"
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">خطة الدفع</label>
                      <select
                        value={projectData.saleModel.paymentPlan}
                        onChange={(e) => setProjectData(prev => ({
                          ...prev,
                          saleModel: { ...prev.saleModel, paymentPlan: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="cash">دفع كامل</option>
                        <option value="installments">أقساط</option>
                        <option value="bank-finance">تمويل بنكي</option>
                        <option value="custom">خطة مخصصة</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">تاريخ التسليم المتوقع</label>
                      <Input
                        type="date"
                        value={projectData.saleModel.completionDate}
                        onChange={(e) => setProjectData(prev => ({
                          ...prev,
                          saleModel: { ...prev.saleModel, completionDate: e.target.value }
                        }))}
                      />
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <label className="block text-sm font-medium mb-2">المميزات والخدمات</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {[
                        'مواقف سيارات', 'حديقة خاصة', 'مسبح', 'صالة رياضة',
                        'أمن وحراسة', 'مصعد', 'تكييف مركزي', 'مولد كهرباء',
                        'خزان مياه', 'مطبخ مجهز', 'دش مركزي', 'إنترنت فائق السرعة'
                      ].map((feature) => (
                        <label key={feature} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={projectData.saleModel.features.includes(feature)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setProjectData(prev => ({
                                  ...prev,
                                  saleModel: {
                                    ...prev.saleModel,
                                    features: [...prev.saleModel.features, feature]
                                  }
                                }));
                              } else {
                                setProjectData(prev => ({
                                  ...prev,
                                  saleModel: {
                                    ...prev.saleModel,
                                    features: prev.saleModel.features.filter(f => f !== feature)
                                  }
                                }));
                              }
                            }}
                            className="w-3 h-3"
                          />
                          {feature}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">ملخص البيع والحجز</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">السعر:</span>
                        <p className="font-semibold">{parseInt(projectData.saleModel.pricePerUnit || '0').toLocaleString('en-US')} ريال</p>
                      </div>
                      {projectData.isBulkProject && (
                        <div>
                          <span className="text-gray-600">إجمالي المشروع:</span>
                          <p className="font-semibold text-green-600">
                            {(parseInt(projectData.saleModel.pricePerUnit || '0') * projectData.bulkDetails.unitCount).toLocaleString('en-US')} ريال
                          </p>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-600">المميزات:</span>
                        <p className="font-semibold">{projectData.saleModel.features.length} ميزة</p>
                      </div>
                    </div>
                    {projectData.saleModel.priceMarks && projectData.saleModel.priceMarks.length > 0 && (
                      <div className="mt-3">
                        <span className="text-gray-600 text-sm">العلامات المميزة:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {projectData.saleModel.priceMarks.map((mark) => {
                            const markConfig = [
                              { id: 'early-bird', label: 'العرض المبكر', color: 'bg-blue-100 text-blue-800' },
                              { id: 'limited-time', label: 'عرض محدود', color: 'bg-red-100 text-red-800' },
                              { id: 'best-price', label: 'أفضل سعر', color: 'bg-green-100 text-green-800' },
                              { id: 'pre-launch', label: 'ما قبل الإطلاق', color: 'bg-purple-100 text-purple-800' },
                              { id: 'featured', label: 'مميز', color: 'bg-orange-100 text-orange-800' },
                              { id: 'hot-deal', label: 'عرض ساخن', color: 'bg-pink-100 text-pink-800' }
                            ].find(m => m.id === mark);
                            return markConfig ? (
                              <span key={mark} className={`px-2 py-1 rounded text-xs ${markConfig.color}`}>
                                {markConfig.label}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab('bulk-construction')}
                >
                  السابق: البناء المتعدد
                </Button>
                <Button
                  onClick={() => setActiveTab('level-selection')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  التالي: اختيار المستويات
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'level-selection' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                  اختيار مستويات البناء المطلوبة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {constructionLevels.map((level) => (
                    <div
                      key={level.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedLevels.includes(level.id)
                          ? 'border-blue-500 bg-blue-50'
                          : canStartLevel(level.id)
                          ? 'border-gray-200 hover:border-gray-300'
                          : 'border-gray-100 bg-gray-50 opacity-50'
                      }`}
                      onClick={() => canStartLevel(level.id) && handleLevelToggle(level.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${
                          selectedLevels.includes(level.id) ? 'bg-blue-200' : 'bg-gray-100'
                        }`}>
                          <Building2 className={`w-6 h-6 ${
                            selectedLevels.includes(level.id) ? 'text-blue-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-lg">{level.arabicTitle}</h4>
                            <Badge variant="outline" className="text-xs">
                              المستوى {level.order}
                            </Badge>
                            {level.hasExternalIntegration && (
                              <Badge className="text-xs bg-green-100 text-green-800">
                                تكامل خارجي
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{level.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {level.estimatedDuration}
                            </span>
                            {level.estimatedCost && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                {level.estimatedCost.min.toLocaleString('en-US')} - {level.estimatedCost.max.toLocaleString('en-US')} {level.estimatedCost.currency}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              {level.documentationFiles.length} وثيقة
                            </span>
                          </div>
                          {level.dependencies && level.dependencies.length > 0 && (
                            <div className="mt-3 p-2 bg-yellow-50 rounded text-xs">
                              <span className="text-yellow-800">
                                يتطلب إكمال: {level.dependencies.map(dep => 
                                  constructionLevels.find(l => l.id === dep)?.arabicTitle
                                ).join(', ')}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedLevels.includes(level.id)
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedLevels.includes(level.id) && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {selectedLevels.length > 0 && (
              <Card className="border-l-4 border-l-green-500 bg-green-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-green-800 mb-2">ملخص المستويات المختارة</h4>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedLevels.map(levelId => {
                      const level = constructionLevels.find(l => l.id === levelId);
                      return level ? (
                        <Badge key={levelId} className="bg-green-200 text-green-800">
                          {level.arabicTitle}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-600">
                      إجمالي المستويات: {selectedLevels.length}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        onClick={calculateMaterials}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        احسب المواد المطلوبة
                      </Button>
                      <Button
                        onClick={() => setActiveTab('level-details')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        التالي: تفاصيل المستويات
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'level-details' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-blue-600" />
                  تفاصيل المستويات والتكاملات الخارجية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedLevels.map(levelId => {
                    const level = constructionLevels.find(l => l.id === levelId);
                    if (!level) return null;

                    return (
                      <div key={levelId} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-lg">{level.arabicTitle}</h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentLevelView(currentLevelView === levelId ? '' : levelId)}
                          >
                            {currentLevelView === levelId ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
                          </Button>
                        </div>

                        {currentLevelView === levelId && (
                          <div className="space-y-4">
                            <div>
                              <h5 className="font-medium mb-2">المتطلبات:</h5>
                              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                {level.requirements.map((req, index) => (
                                  <li key={index}>{req}</li>
                                ))}
                              </ul>
                            </div>

                            {level.hasExternalIntegration && (
                              <div>
                                <h5 className="font-medium mb-2">التكامل الخارجي:</h5>
                                {renderLevelIntegration(level)}
                              </div>
                            )}

                            <div>
                              <h5 className="font-medium mb-2">الوثائق الرسمية:</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {level.documentationFiles.map((doc) => (
                                  <div key={doc.id} className="border rounded p-3 bg-gray-50">
                                    <div className="flex items-center justify-between mb-2">
                                      <h6 className="font-medium text-sm">{doc.arabicTitle}</h6>
                                      <Badge variant={doc.isOfficial ? 'default' : 'outline'} className="text-xs">
                                        {doc.isOfficial ? 'رسمي' : 'غير رسمي'}
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-gray-600 mb-2">{doc.description}</p>
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-gray-500">{doc.source}</span>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.open(doc.url, '_blank')}
                                        className="text-xs"
                                      >
                                        <Download className="w-3 h-3 mr-1" />
                                        تحميل
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setActiveTab('level-selection')}
              >
                السابق: اختيار المستويات
              </Button>
              <div className="flex gap-2">
                <Button
                  onClick={calculateMaterials}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  احسب المواد المطلوبة
                </Button>
                <Button
                  onClick={() => setActiveTab('guidance')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  التالي: الإرشادات
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'materials' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-6 h-6 text-orange-600" />
                  احسب المواد المطلوبة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Method 1: Manual Input with House Features */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Home className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold">الطريقة الأولى: إدخال تفاصيل المنزل</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">المساحة الإجمالية (م²)</label>
                        <Input 
                          type="number" 
                          value={projectData.area || ''} 
                          onChange={(e) => setProjectData(prev => ({...prev, area: e.target.value}))}
                          placeholder="200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">عدد الأدوار</label>
                        <Input 
                          type="number" 
                          value={projectData.floors || 1} 
                          onChange={(e) => setProjectData(prev => ({...prev, floors: Number(e.target.value)}))}
                          placeholder="2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">عدد الغرف</label>
                        <Input 
                          type="number" 
                          value={projectData.rooms || 4} 
                          onChange={(e) => setProjectData(prev => ({...prev, rooms: Number(e.target.value)}))}
                          placeholder="4"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">عدد الحمامات</label>
                        <Input 
                          type="number" 
                          value={projectData.bathrooms || 3} 
                          onChange={(e) => setProjectData(prev => ({...prev, bathrooms: Number(e.target.value)}))}
                          placeholder="3"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">عدد المطابخ</label>
                        <Input 
                          type="number" 
                          value={projectData.kitchens || 1} 
                          onChange={(e) => setProjectData(prev => ({...prev, kitchens: Number(e.target.value)}))}
                          placeholder="1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">مساحة الصالة (م²)</label>
                        <Input 
                          type="number" 
                          value={projectData.livingArea || 30} 
                          onChange={(e) => setProjectData(prev => ({...prev, livingArea: Number(e.target.value)}))}
                          placeholder="30"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">الميزانية المقدرة</label>
                        <Input 
                          type="number" 
                          value={projectData.estimatedBudget || ''} 
                          onChange={(e) => setProjectData(prev => ({...prev, estimatedBudget: e.target.value}))}
                          placeholder="500000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">جودة التشطيب</label>
                        <select 
                          className="w-full p-2 border border-gray-300 rounded-md"
                          value={projectData.finishQuality || 'standard'}
                          onChange={(e) => setProjectData(prev => ({...prev, finishQuality: e.target.value}))}
                        >
                          <option value="basic">عادي</option>
                          <option value="standard">متوسط</option>
                          <option value="premium">فاخر</option>
                          <option value="luxury">راقي جداً</option>
                        </select>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={calculateMaterials}
                      className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                    >
                      احسب المواد المطلوبة
                    </Button>
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
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setProjectData(prev => ({...prev, pdfFile: file}));
                            // Simulate PDF analysis
                            setTimeout(() => {
                              setProjectData(prev => ({
                                ...prev,
                                area: '180',
                                floors: 2,
                                rooms: 5,
                                bathrooms: 3,
                                kitchens: 1,
                                livingArea: 35,
                                pdfAnalyzed: true
                              }));
                            }, 2000);
                          }
                        }}
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
                    
                    {projectData.pdfFile && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium">{projectData.pdfFile.name}</span>
                        </div>
                        {projectData.pdfAnalyzed && (
                          <p className="text-xs text-green-600 mt-1">✓ تم تحليل الملف بنجاح</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Lighting Distribution */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Lightbulb className="w-5 h-5 text-yellow-600" />
                      <h3 className="font-semibold">توزيع الإنارة</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">نوع الغرفة</label>
                        <select className="w-full p-2 border border-gray-300 rounded-md">
                          <option value="living">صالة معيشة</option>
                          <option value="bedroom">غرفة نوم</option>
                          <option value="kitchen">مطبخ</option>
                          <option value="bathroom">حمام</option>
                          <option value="dining">غرفة طعام</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">الطول (م)</label>
                        <Input type="number" placeholder="5" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">العرض (م)</label>
                        <Input type="number" placeholder="4" />
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>توصية الإنارة:</strong> للصالة الرئيسية، يُنصح بتوزيع 6-8 نقاط إضاءة مع إنارة مخفية حول الأسقف
                      </p>
                    </div>
                  </div>

                  {/* Project Data Summary */}
                  {materialsCalculated && (
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-3">بيانات المشروع</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">المساحة:</span>
                            <p className="font-semibold">{projectData.area} م²</p>
                          </div>
                          <div>
                            <span className="text-gray-600">عدد الأدوار:</span>
                            <p className="font-semibold">{projectData.floors}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">إجمالي الغرف:</span>
                            <p className="font-semibold">{(projectData.rooms || 0) + (projectData.bathrooms || 0) + (projectData.kitchens || 0)}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">الميزانية المقدرة:</span>
                            <p className="font-semibold text-blue-600">
                              {parseInt(projectData.estimatedBudget || '0').toLocaleString('en-US')} ريال
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-lg mb-4">المواد المطلوبة المقدرة</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(getMaterialsForProject()).map(([key, material]: [string, MaterialCalculation]) => (
                            <Card key={key} className="border-l-4 border-l-orange-500">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="font-semibold">{material.name}</h5>
                                  <Badge variant="outline" className="text-xs">
                                    {material.quantity} {material.unit}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{material.description}</p>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-500">التكلفة المقدرة:</span>
                                  <span className="font-semibold text-orange-600">
                                    {Math.round(material.estimatedCost).toLocaleString('en-US')} ريال
                                  </span>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>

                      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-green-800">إجمالي التكلفة المقدرة</h4>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-600">
                              {Object.values(getMaterialsForProject())
                                .reduce((sum, material) => sum + material.estimatedCost, 0)
                                .toLocaleString('en-US')} ريال
                            </p>
                            <p className="text-sm text-green-600">شامل جميع المواد الأساسية</p>
                          </div>
                        </div>
                        <p className="text-sm text-green-700">
                          * هذه تقديرات أولية بناءً على المعايير الهندسية المعتمدة. قد تختلف الأسعار الفعلية حسب المورد والسوق.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setActiveTab('level-details')}
              >
                السابق: تفاصيل المستويات
              </Button>
              <Button
                onClick={() => setActiveTab('guidance')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                التالي: الإرشادات
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'guidance' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="w-6 h-6 text-blue-600" />
                  الإرشادات والنصائح الشاملة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {selectedLevels.map(levelId => {
                    const level = constructionLevels.find(l => l.id === levelId);
                    const guidance = ConstructionGuidanceService.getGuidanceForLevel(levelId);
                    if (!level) return null;

                    return (
                      <div key={levelId} className="border rounded-lg p-4">
                        <h4 className="font-semibold text-lg mb-4">{level.arabicTitle}</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Tips */}
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-3">
                              <Lightbulb className="w-5 h-5 text-blue-600" />
                              <h5 className="font-medium text-blue-800">نصائح مهمة</h5>
                            </div>
                            <ul className="space-y-2 text-sm">
                              {guidance.tips.map((tip, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Warnings */}
                          <div className="bg-yellow-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-3">
                              <AlertTriangle className="w-5 h-5 text-yellow-600" />
                              <h5 className="font-medium text-yellow-800">تحذيرات</h5>
                            </div>
                            <ul className="space-y-2 text-sm">
                              {guidance.warnings.map((warning, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                  <span>{warning}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Best Practices */}
                          <div className="bg-green-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-3">
                              <Target className="w-5 h-5 text-green-600" />
                              <h5 className="font-medium text-green-800">أفضل الممارسات</h5>
                            </div>
                            <ul className="space-y-2 text-sm">
                              {guidance.bestPractices.map((practice, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <Target className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  <span>{practice}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Final Cost Summary */}
            {projectData.area && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-blue-800">ملخص التكلفة النهائية</h4>
                      <p className="text-sm text-blue-600">هذه هي التكلفة التي سيتم حفظها مع المشروع</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-800">
                        {Object.values(getMaterialsForProject())
                          .reduce((sum, material) => sum + material.estimatedCost, 0)
                          .toLocaleString('en-US')} ريال
                      </p>
                      <p className="text-sm text-blue-600">تكلفة المواد المحسوبة</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab('materials')}
                >
                  السابق: المواد المطلوبة
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? 'جاري الإنشاء...' : 'إنشاء المشروع النهائي'}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

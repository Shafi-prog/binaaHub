'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Button } from '@/core/shared/components/ui/button';
import { Input } from '@/core/shared/components/ui/input';
import { Select } from '@/core/shared/components/ui/select';
import { Badge } from '@/core/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/shared/components/ui/tabs';
import { Progress } from '@/core/shared/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/core/shared/components/ui/dialog';
import { ProjectTrackingService } from '@/core/services/projectTrackingService';
import ConstructionGuidance from '@/core/shared/components/ConstructionGuidance';
import { 
  Project, 
  ProjectSummary, 
  ProjectPurchase, 
  MaterialEstimation,
  ProjectEstimation 
} from '@/core/shared/types/types';
import { 
  ArrowLeft, 
  Calculator, 
  ShoppingCart, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Eye,
  Plus,
  Download,
  Edit,
  Trash2,
  Package,
  DollarSign,
  BarChart3,
  FileText,
  Home,
  Hammer,
  PaintBucket,
  Zap,
  Settings
} from 'lucide-react';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [estimation, setEstimation] = useState<ProjectEstimation | null>(null);
  const [purchases, setPurchases] = useState<ProjectPurchase[]>([]);
  const [summary, setSummary] = useState<ProjectSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialEstimation | null>(null);

  // بيانات الشراء الجديد
  const [newPurchase, setNewPurchase] = useState<Partial<ProjectPurchase>>({
    purchasedQuantity: 0,
    pricePerUnit: 0,
    supplier: '',
    status: 'ordered',
    notes: ''
  });

  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  const loadProjectData = async () => {
    try {
      setLoading(true);
      const [projectData, estimationData, purchasesData, summaryData] = await Promise.all([
        ProjectTrackingService.getProjectById(projectId),
        ProjectTrackingService.getEstimationByProjectId(projectId),
        ProjectTrackingService.getPurchasesByProjectId(projectId),
        ProjectTrackingService.calculateProjectSummary(projectId)
      ]);

      setProject(projectData);
      setEstimation(estimationData);
      setPurchases(purchasesData);
      setSummary(summaryData);
    } catch (error) {
      console.error('Error loading project data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPurchase = async () => {
    if (!selectedMaterial || !project) return;

    const purchase: ProjectPurchase = {
      id: Date.now().toString(),
      projectId: project.id,
      materialId: selectedMaterial.materialId,
      materialName: selectedMaterial.materialName,
      purchasedQuantity: newPurchase.purchasedQuantity || 0,
      unit: selectedMaterial.unit,
      pricePerUnit: newPurchase.pricePerUnit || 0,
      totalCost: (newPurchase.purchasedQuantity || 0) * (newPurchase.pricePerUnit || 0),
      purchaseDate: new Date().toISOString(),
      supplier: newPurchase.supplier || '',
      status: newPurchase.status as any || 'ordered',
      notes: newPurchase.notes
    };

    await ProjectTrackingService.savePurchase(purchase);
    await loadProjectData();
    setShowPurchaseDialog(false);
    setSelectedMaterial(null);
    setNewPurchase({
      purchasedQuantity: 0,
      pricePerUnit: 0,
      supplier: '',
      status: 'ordered',
      notes: ''
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in-progress': return 'secondary';
      case 'planning': return 'outline';
      case 'on-hold': return 'destructive';
      default: return 'outline';
    }
  };

  const getPurchaseStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'received': return 'default';
      case 'installed': return 'default';
      case 'ordered': return 'secondary';
      case 'returned': return 'destructive';
      default: return 'outline';
    }
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'foundation': return <Home className="w-4 h-4" />;
      case 'structure': return <Hammer className="w-4 h-4" />;
      case 'finishing': return <PaintBucket className="w-4 h-4" />;
      case 'electrical': return <Zap className="w-4 h-4" />;
      case 'plumbing': return <Settings className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 font-tajawal">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">جاري تحميل بيانات المشروع...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 font-tajawal">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">المشروع غير موجود</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 font-tajawal">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              رجوع
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-800">{project.name}</h1>
                <Badge variant={getStatusBadgeVariant(project.status)}>
                  {project.status === 'planning' && 'تخطيط'}
                  {project.status === 'in-progress' && 'جاري التنفيذ'}
                  {project.status === 'completed' && 'مكتمل'}
                  {project.status === 'on-hold' && 'متوقف'}
                </Badge>
              </div>
              <p className="text-gray-600 mt-1">{project.description}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/user/comprehensive-construction-calculator?projectId=${projectId}`)}
              className="flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              إضافة تقدير
            </Button>
            <Button
              variant="outline"
              onClick={() => ProjectTrackingService.exportProjectData(projectId)}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              تصدير
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">التكلفة المقدرة</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {summary.totalEstimatedCost.toLocaleString()} ريال
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
                      {summary.totalSpentCost.toLocaleString()} ريال
                    </p>
                  </div>
                  <ShoppingCart className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">المتبقي</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {summary.remainingCost.toLocaleString()} ريال
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
                      {summary.completionPercentage}%
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-500" />
                </div>
                <Progress value={summary.completionPercentage} className="mt-2" />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="materials">المواد</TabsTrigger>
            <TabsTrigger value="purchases">المشتريات</TabsTrigger>
            <TabsTrigger value="phases">المراحل</TabsTrigger>
            <TabsTrigger value="guidance">دليل البناء</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Project Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    معلومات المشروع
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">المساحة</label>
                      <p className="font-semibold">{project.area} متر مربع</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">نوع المشروع</label>
                      <p className="font-semibold">
                        {project.projectType === 'villa' && 'فيلا'}
                        {project.projectType === 'apartment' && 'شقة'}
                        {project.projectType === 'commercial' && 'تجاري'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">عدد الأدوار</label>
                      <p className="font-semibold">{project.floorCount}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">عدد الغرف</label>
                      <p className="font-semibold">{project.roomCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Material Categories Progress */}
              {summary && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      تقدم فئات المواد
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(summary.materialProgress).map(([category, progress]) => {
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
                            <span>منفق: {progress.spentCost.toLocaleString()} ريال</span>
                            <span>مقدر: {progress.estimatedCost.toLocaleString()} ريال</span>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Materials Tab */}
          <TabsContent value="materials" className="space-y-6">
            {estimation && estimation.materials && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    قائمة المواد المقدرة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {estimation.materials.map((material, index) => {
                      const materialPurchases = purchases.filter(p => p.materialId === material.materialId);
                      const purchasedQuantity = materialPurchases.reduce((sum, p) => sum + p.purchasedQuantity, 0);
                      const remainingQuantity = material.estimatedQuantity - purchasedQuantity;
                      const purchasedCost = materialPurchases.reduce((sum, p) => sum + p.totalCost, 0);
                      const remainingCost = material.totalCost - purchasedCost;

                      return (
                        <div key={index} className="border rounded-lg p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{material.materialName}</h4>
                              <p className="text-sm text-gray-600">{material.category}</p>
                              <div className="flex items-center gap-2 mt-1">
                                {getPhaseIcon(material.phase)}
                                <span className="text-sm text-gray-500">{material.phase}</span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedMaterial(material);
                                setShowPurchaseDialog(true);
                              }}
                              className="flex items-center gap-1"
                            >
                              <Plus className="w-4 h-4" />
                              شراء
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">مقدر:</span>
                              <p className="font-semibold">{material.estimatedQuantity} {material.unit}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">مشترى:</span>
                              <p className="font-semibold text-green-600">{purchasedQuantity} {material.unit}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">متبقي:</span>
                              <p className="font-semibold text-orange-600">{remainingQuantity} {material.unit}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">التكلفة المتبقية:</span>
                              <p className="font-semibold">{remainingCost.toLocaleString()} ريال</p>
                            </div>
                          </div>

                          <Progress 
                            value={material.estimatedQuantity > 0 
                              ? (purchasedQuantity / material.estimatedQuantity) * 100 
                              : 0
                            } 
                            className="h-2"
                          />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Purchases Tab */}
          <TabsContent value="purchases" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  سجل المشتريات
                </CardTitle>
              </CardHeader>
              <CardContent>
                {purchases.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    لا توجد مشتريات مسجلة بعد
                  </div>
                ) : (
                  <div className="space-y-4">
                    {purchases.map((purchase) => (
                      <div key={purchase.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold">{purchase.materialName}</h4>
                            <p className="text-sm text-gray-600">
                              {purchase.purchasedQuantity} {purchase.unit} - {purchase.supplier}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(purchase.purchaseDate).toLocaleDateString('ar-SA')}
                            </p>
                          </div>
                          <div className="text-left">
                            <Badge variant={getPurchaseStatusBadgeVariant(purchase.status)}>
                              {purchase.status === 'ordered' && 'مطلوب'}
                              {purchase.status === 'received' && 'مستلم'}
                              {purchase.status === 'installed' && 'مركب'}
                              {purchase.status === 'returned' && 'مرتجع'}
                            </Badge>
                            <p className="text-lg font-bold text-green-600 mt-1">
                              {purchase.totalCost.toLocaleString()} ريال
                            </p>
                          </div>
                        </div>
                        {purchase.notes && (
                          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                            {purchase.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Phases Tab */}
          <TabsContent value="phases" className="space-y-6">
            {summary && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(summary.phaseProgress).map(([phase, progress]) => (
                  <Card key={phase}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {getPhaseIcon(phase)}
                        {phase === 'foundation' && 'الأساسات'}
                        {phase === 'structure' && 'العظم'}
                        {phase === 'finishing' && 'التشطيبات'}
                        {phase === 'electrical' && 'الكهرباء'}
                        {phase === 'plumbing' && 'السباكة'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600 mb-2">
                            {progress.completion}%
                          </div>
                          <Progress value={progress.completion} className="h-3" />
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">مقدر:</span>
                            <span className="font-semibold">{progress.estimated.toLocaleString()} ريال</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">منفق:</span>
                            <span className="font-semibold text-green-600">{progress.spent.toLocaleString()} ريال</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">متبقي:</span>
                            <span className="font-semibold text-orange-600">
                              {(progress.estimated - progress.spent).toLocaleString()} ريال
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Construction Guidance Tab */}
          <TabsContent value="guidance" className="space-y-6">
            <ConstructionGuidance 
              project={project}
              onPhaseUpdate={(phaseId, completed) => {
                // Update project phase progress
                console.log(`Phase ${phaseId} completed: ${completed}`);
              }}
            />
          </TabsContent>
        </Tabs>

        {/* Purchase Dialog */}
        <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>تسجيل شراء جديد</DialogTitle>
            </DialogHeader>
            {selectedMaterial && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">المادة</label>
                  <p className="text-lg font-semibold">{selectedMaterial.materialName}</p>
                  <p className="text-sm text-gray-600">
                    مطلوب: {selectedMaterial.estimatedQuantity} {selectedMaterial.unit}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium">الكمية المشتراة</label>
                  <Input
                    type="number"
                    value={newPurchase.purchasedQuantity}
                    onChange={(e) => setNewPurchase(prev => ({
                      ...prev,
                      purchasedQuantity: parseFloat(e.target.value) || 0
                    }))}
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">سعر الوحدة (ريال)</label>
                  <Input
                    type="number"
                    value={newPurchase.pricePerUnit}
                    onChange={(e) => setNewPurchase(prev => ({
                      ...prev,
                      pricePerUnit: parseFloat(e.target.value) || 0
                    }))}
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">المورد</label>
                  <Input
                    value={newPurchase.supplier}
                    onChange={(e) => setNewPurchase(prev => ({
                      ...prev,
                      supplier: e.target.value
                    }))}
                    placeholder="اسم المورد"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">الحالة</label>
                  <select
                    value={newPurchase.status}
                    onChange={(e) => setNewPurchase(prev => ({
                      ...prev,
                      status: e.target.value as any
                    }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ordered">مطلوب</option>
                    <option value="received">مستلم</option>
                    <option value="installed">مركب</option>
                    <option value="returned">مرتجع</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">ملاحظات</label>
                  <Input
                    value={newPurchase.notes}
                    onChange={(e) => setNewPurchase(prev => ({
                      ...prev,
                      notes: e.target.value
                    }))}
                    placeholder="ملاحظات إضافية..."
                  />
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">إجمالي التكلفة:</span>
                    <span className="text-lg font-bold text-blue-600">
                      {((newPurchase.purchasedQuantity || 0) * (newPurchase.pricePerUnit || 0)).toLocaleString()} ريال
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleAddPurchase}
                    disabled={!newPurchase.purchasedQuantity || !newPurchase.pricePerUnit}
                    className="flex-1"
                  >
                    حفظ الشراء
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowPurchaseDialog(false)}
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

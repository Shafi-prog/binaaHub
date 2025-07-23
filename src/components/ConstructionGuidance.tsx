'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/core/shared/components/ui/dialog';
import { 
  ConstructionGuidanceService, 
  ConstructionPhase, 
  ProjectGuidanceSettings,
  QualityCheckpoint 
} from '@/core/services/constructionGuidanceService';
import { Project } from '@/core/shared/types/types';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Camera, 
  ExternalLink,
  Play,
  Pause,
  SkipForward,
  Info,
  Shield,
  BookOpen,
  Calendar,
  Package,
  Upload,
  MapPin,
  Users,
  Settings,
  Download,
  Eye,
  Hammer
} from 'lucide-react';

interface ConstructionGuidanceProps {
  project: Project;
  onPhaseUpdate?: (phaseId: string, completed: boolean) => void;
}

export default function ConstructionGuidance({ project, onPhaseUpdate }: ConstructionGuidanceProps) {
  const [currentPhase, setCurrentPhase] = useState<string>('planning');
  const [completedPhases, setCompletedPhases] = useState<string[]>([]);
  const [projectPhases, setProjectPhases] = useState<ConstructionPhase[]>([]);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<QualityCheckpoint | null>(null);
  const [complianceChecklist, setComplianceChecklist] = useState<any[]>([]);
  const [uploadedDocuments, setUploadedDocuments] = useState<{[key: string]: File[]}>({});

  // Handle compliance item completion
  const handleComplianceToggle = (categoryIndex: number, itemId: string) => {
    console.log('Toggling compliance item:', categoryIndex, itemId); // Debug log
    setComplianceChecklist(prev => {
      const updated = prev.map((category, catIdx) => 
        catIdx === categoryIndex 
          ? {
              ...category,
              items: category.items.map((item: any) => 
                item.id === itemId 
                  ? { ...item, completed: !item.completed }
                  : item
              )
            }
          : category
      );
      console.log('Updated checklist:', updated); // Debug log
      return updated;
    });
  };

  // Handle document upload
  const handleDocumentUpload = (itemId: string, files: FileList | null) => {
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setUploadedDocuments(prev => ({
        ...prev,
        [itemId]: [...(prev[itemId] || []), ...fileArray]
      }));
    }
  };

  // Remove uploaded document
  const removeDocument = (itemId: string, fileIndex: number) => {
    setUploadedDocuments(prev => ({
      ...prev,
      [itemId]: prev[itemId]?.filter((_, index) => index !== fileIndex) || []
    }));
  };

  useEffect(() => {
    const settings: ProjectGuidanceSettings = {
      projectType: project.projectType as any,
      area: project.area,
      floors: project.floorCount,
      compliance: 'enhanced',
      supervision: 'engineer',
      location: 'الرياض'
    };

    const phases = ConstructionGuidanceService.getProjectPhases(settings);
    setProjectPhases(phases);

    const checklist = ConstructionGuidanceService.getComplianceChecklist(project.projectType);
    console.log('Loaded compliance checklist:', checklist); // Debug log
    
    // Ensure we have data, provide fallback if needed
    if (checklist && checklist.length > 0) {
      setComplianceChecklist(checklist);
    } else {
      // Provide default compliance checklist if service fails
      const defaultChecklist = [
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
      setComplianceChecklist(defaultChecklist);
    }
  }, [project]);

  const timeline = ConstructionGuidanceService.calculateProjectTimeline({
    projectType: project.projectType as any,
    area: project.area,
    floors: project.floorCount,
    compliance: 'enhanced',
    supervision: 'engineer',
    location: 'الرياض'
  });

  const handlePhaseComplete = (phaseId: string) => {
    if (!completedPhases.includes(phaseId)) {
      setCompletedPhases([...completedPhases, phaseId]);
      onPhaseUpdate?.(phaseId, true);
      
      // Move to next phase
      const nextPhase = ConstructionGuidanceService.getNextPhase(phaseId, projectPhases);
      if (nextPhase) {
        setCurrentPhase(nextPhase.id);
      }
    }
  };

  const getPhaseStatus = (phase: ConstructionPhase) => {
    if (completedPhases.includes(phase.id)) {
      return { status: 'completed', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" /> };
    } else if (phase.id === currentPhase) {
      return { status: 'active', color: 'bg-blue-100 text-blue-800', icon: <Play className="w-4 h-4" /> };
    } else {
      return { status: 'pending', color: 'bg-gray-100 text-gray-600', icon: <Clock className="w-4 h-4" /> };
    }
  };

  const currentPhaseData = projectPhases.find(p => p.id === currentPhase);
  const overallProgress = (completedPhases.length / projectPhases.length) * 100;

  return (
    <div className="space-y-6">
      {/* Project Timeline Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              خطة تنفيذ المشروع
            </CardTitle>
            <Badge className="bg-blue-100 text-blue-800">
              المدة المتوقعة: {timeline.totalDuration} يوم
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>التقدم الإجمالي</span>
                <span>{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projectPhases.map((phase) => {
                const status = getPhaseStatus(phase);
                return (
                  <Card 
                    key={phase.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      phase.id === currentPhase ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setCurrentPhase(phase.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg ${status.color}`}>
                          {status.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{phase.name}</h4>
                          <p className="text-xs text-gray-500">{phase.duration} يوم</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        المرحلة {phase.order}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Phase Details */}
      {currentPhaseData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hammer className="w-5 h-5" />
              {currentPhaseData.name}
            </CardTitle>
            <p className="text-gray-600">{currentPhaseData.description}</p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Info className="w-4 h-4" />
                  <span className="hidden sm:inline">نظرة عامة</span>
                  <span className="sm:hidden">عامة</span>
                </TabsTrigger>
                <TabsTrigger value="documents" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">المستندات</span>
                  <span className="sm:hidden">مستندات</span>
                </TabsTrigger>
                <TabsTrigger value="checkpoints" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">نقاط الفحص</span>
                  <span className="sm:hidden">فحص</span>
                </TabsTrigger>
                <TabsTrigger value="materials" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Package className="w-4 h-4" />
                  <span className="hidden sm:inline">المواد</span>
                  <span className="sm:hidden">مواد</span>
                </TabsTrigger>
                <TabsTrigger value="regulations" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:inline">اللوائح</span>
                  <span className="sm:hidden">لوائح</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      نصائح مهمة
                    </h4>
                    <ul className="space-y-2">
                      {currentPhaseData.tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      تحذيرات مهمة
                    </h4>
                    <ul className="space-y-2">
                      {currentPhaseData.warnings.map((warning, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span>{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6">
                  <Button 
                    onClick={() => handlePhaseComplete(currentPhaseData.id)}
                    disabled={completedPhases.includes(currentPhaseData.id)}
                    className="w-full"
                  >
                    {completedPhases.includes(currentPhaseData.id) ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        تم إكمال هذه المرحلة
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        إكمال هذه المرحلة
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="space-y-4">
                <div className="grid gap-4">
                  {currentPhaseData.documents.map((doc) => (
                    <Card key={doc.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-500" />
                          <div>
                            <h5 className="font-medium">{doc.name}</h5>
                            <p className="text-sm text-gray-600">{doc.authority}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {doc.required && (
                            <Badge variant="destructive" className="text-xs">مطلوب</Badge>
                          )}
                          {doc.templateUrl && (
                            <Button variant="outline" size="sm" onClick={() => alert('Button clicked')}>
                              <Download className="w-4 h-4 mr-1" />
                              تحميل
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="checkpoints" className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                  <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    نقاط الفحص والجودة
                  </h3>
                  <p className="text-sm text-blue-700">
                    هذه نقاط الفحص المطلوبة لضمان جودة البناء والامتثال للمعايير. اضغط على "عرض التفاصيل" لمعرفة المعايير المطلوبة.
                  </p>
                </div>
                <div className="grid gap-4">
                  {currentPhaseData.checkpoints.map((checkpoint, index) => (
                    <Card key={checkpoint.id} className="hover:shadow-md transition-shadow border-l-4 border-l-blue-400">
                      <div className="flex items-center justify-between p-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                              {index + 1}
                            </div>
                            <h5 className="font-semibold text-lg">{checkpoint.name}</h5>
                            {checkpoint.mandatory && (
                              <Badge variant="destructive" className="text-xs">إجباري</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3 mr-11">{checkpoint.description}</p>
                          <div className="flex items-center gap-4 mr-11">
                            <Badge variant="outline" className="text-xs">
                              {checkpoint.inspectionType === 'self' ? '🔍 فحص ذاتي' : 
                               checkpoint.inspectionType === 'supervisor' ? '👷 فحص مشرف' : '🏛️ فحص رسمي'}
                            </Badge>
                            {checkpoint.photos && (
                              <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                                📷 توثيق مطلوب
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setSelectedCheckpoint(checkpoint)}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700 h-9 px-4">
                            <Eye className="w-4 h-4 ml-1" />
                            عرض التفاصيل
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Dialog for checkpoint details */}
                <Dialog 
                  open={selectedCheckpoint !== null} 
                  onOpenChange={(open) => {
                    if (!open) setSelectedCheckpoint(null);
                  }}>
                  {selectedCheckpoint && (
                    <DialogContent className="max-w-2xl">
                      <DialogHeader className="relative">
                        <DialogTitle className="text-xl font-bold text-right">{selectedCheckpoint.name}</DialogTitle>
                        <button 
                          onClick={() => setSelectedCheckpoint(null)}
                          className="absolute left-0 top-0 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
                          aria-label="إغلاق"
                        >
                          ✕
                        </button>
                      </DialogHeader>
                      <div className="space-y-6 mt-4">
                        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                          <p className="text-gray-800">{selectedCheckpoint.description}</p>
                        </div>
                        
                        <div className="bg-white border rounded-lg p-4">
                          <h6 className="font-semibold mb-3 text-gray-800 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            معايير الفحص المطلوبة:
                          </h6>
                          <ul className="space-y-2">
                            {selectedCheckpoint.criteria.map((criterion, index) => (
                              <li key={index} className="flex items-start gap-3 text-sm">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-gray-700">{criterion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {selectedCheckpoint.photos && (
                          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                            <div className="flex items-center gap-2 text-yellow-800 mb-2">
                              <Camera className="w-5 h-5" />
                              <span className="font-medium">توثيق مطلوب</span>
                            </div>
                            <p className="text-sm text-yellow-700">
                              يجب توثيق هذه المرحلة بالصور للمراجعة والمتابعة
                            </p>
                          </div>
                        )}

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-700">نوع الفحص:</span>
                            <Badge variant="outline" className="bg-white">
                              {selectedCheckpoint.inspectionType === 'self' ? 'فحص ذاتي' : 
                               selectedCheckpoint.inspectionType === 'supervisor' ? 'فحص مشرف' : 'فحص جهة رسمية'}
                            </Badge>
                          </div>
                          {selectedCheckpoint.mandatory && (
                            <div className="flex items-center gap-2 mt-2">
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                              <span className="text-sm text-red-600 font-medium">هذا الفحص إجباري ولا يمكن تجاوزه</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  )}
                </Dialog>
              </TabsContent>

              <TabsContent value="materials" className="space-y-4">
                <div className="grid gap-4">
                  {currentPhaseData.materials.map((material) => (
                    <Card key={material.materialId} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium">{material.name}</h5>
                        <div className="flex items-center gap-2">
                          {material.sbcCompliant && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              <Shield className="w-3 h-3 mr-1" />
                              معتمد SBC
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        الكمية: {material.quantity.toLocaleString()} {material.unit}
                      </p>
                      <div className="text-xs text-gray-500">
                        <p>المواصفات: {material.specifications.join(', ')}</p>
                        <p>الموردين: {material.suppliers.join(', ')}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="regulations" className="space-y-4">
                <div className="grid gap-4">
                  {currentPhaseData.regulations.map((regulation) => (
                    <Card key={regulation.id} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-blue-500" />
                          <h5 className="font-medium">{regulation.code}</h5>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(regulation.documentUrl, '_blank', 'noopener,noreferrer')}
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          عرض المستند
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{regulation.section}</p>
                      <p className="text-sm">{regulation.description}</p>
                      <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-700">
                        {regulation.requirement}
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Compliance Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            قائمة مراجعة الامتثال
          </CardTitle>
          <p className="text-sm text-gray-600">تأكد من استيفاء جميع المتطلبات القانونية ورفع الوثائق المطلوبة</p>
        </CardHeader>
        <CardContent>
          {complianceChecklist.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">جاري تحميل قائمة مراجعة الامتثال...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {complianceChecklist.map((category, categoryIndex) => (
                <div key={categoryIndex} className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  {category.category}
                </h4>
                <div className="space-y-4">
                  {category.items.map((item: any) => (
                    <div key={item.id} className="bg-white border rounded-lg p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            checked={item.completed}
                            className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                            onChange={() => handleComplianceToggle(categoryIndex, item.id)}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`font-medium ${item.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                              {item.description}
                            </span>
                            {item.required && (
                              <Badge variant="destructive" className="text-xs">مطلوب</Badge>
                            )}
                            {item.completed && (
                              <Badge variant="default" className="text-xs bg-green-100 text-green-800">مكتمل</Badge>
                            )}
                          </div>
                          
                          {/* Document Upload Section */}
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center gap-2">
                              <label 
                                htmlFor={`upload-${item.id}`}
                                className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                              >
                                <Upload className="w-4 h-4" />
                                رفع مستند
                              </label>
                              <input
                                id={`upload-${item.id}`}
                                type="file"
                                multiple
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                className="hidden"
                                onChange={(e) => handleDocumentUpload(item.id, e.target.files)}
                              />
                              <span className="text-xs text-gray-500">
                                PDF, صور, أو مستندات Word
                              </span>
                            </div>
                            
                            {/* Uploaded Documents List */}
                            {uploadedDocuments[item.id] && uploadedDocuments[item.id].length > 0 && (
                              <div className="bg-gray-50 p-3 rounded-md">
                                <h6 className="text-sm font-medium text-gray-700 mb-2">المستندات المرفوعة:</h6>
                                <div className="space-y-1">
                                  {uploadedDocuments[item.id].map((file, fileIndex) => (
                                    <div key={fileIndex} className="flex items-center justify-between text-sm">
                                      <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-blue-500" />
                                        <span className="text-gray-700">{file.name}</span>
                                        <span className="text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                                      </div>
                                      <button
                                        onClick={() => removeDocument(item.id, fileIndex)}
                                        className="text-red-500 hover:text-red-700 transition-colors"
                                        title="حذف المستند"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Progress Summary */}
            {complianceChecklist.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-medium text-blue-800 mb-2">ملخص التقدم</h5>
                {complianceChecklist.map((category, categoryIndex) => {
                  const totalItems = category.items.length;
                  const completedItems = category.items.filter((item: any) => item.completed).length;
                  const progress = (completedItems / totalItems) * 100;
                  
                  return (
                    <div key={categoryIndex} className="mb-3 last:mb-0">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-blue-700">{category.category}</span>
                        <span className="text-blue-600">{completedItems}/{totalItems}</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

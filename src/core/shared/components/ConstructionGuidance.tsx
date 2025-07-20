'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Button } from '@/core/shared/components/ui/button';
import { Badge } from '@/core/shared/components/ui/badge';
import { Progress } from '@/core/shared/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/shared/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/core/shared/components/ui/dialog';
import ConstructionPhotoUploader from '@/core/shared/components/ConstructionPhotoUploader';
import { 
  ConstructionGuidanceService, 
  ConstructionPhase, 
  ProjectGuidanceSettings,
  QualityCheckpoint 
} from '@/core/services/constructionGuidanceService';
import { Project, ProjectImage } from '@/core/shared/types/types';
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
    setComplianceChecklist(checklist);
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
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                <TabsTrigger value="photos">الصور</TabsTrigger>
                <TabsTrigger value="documents">المستندات</TabsTrigger>
                <TabsTrigger value="checkpoints">نقاط الفحص</TabsTrigger>
                <TabsTrigger value="materials">المواد</TabsTrigger>
                <TabsTrigger value="regulations">اللوائح</TabsTrigger>
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

              <TabsContent value="photos" className="space-y-4">
                <ConstructionPhotoUploader
                  projectId={project.id}
                  phaseId={currentPhaseData.id}
                  existingImages={project.images?.filter(img => img.phaseId === currentPhaseData.id) || []}
                  onImageUpload={(images) => {
                    // Handle image upload - update project
                    console.log('Images uploaded:', images);
                  }}
                  onImageDelete={(imageId) => {
                    // Handle image deletion
                    console.log('Image deleted:', imageId);
                  }}
                  allowPublicToggle={true}
                />
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
                            <Button variant="outline" size="sm">
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
                <div className="grid gap-4">
                  {currentPhaseData.checkpoints.map((checkpoint) => (
                    <Card key={checkpoint.id} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium">{checkpoint.name}</h5>
                        <div className="flex items-center gap-2">
                          {checkpoint.mandatory && (
                            <Badge variant="destructive" className="text-xs">إجباري</Badge>
                          )}
                          <Dialog>
                            <DialogTrigger>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-1" />
                                التفاصيل
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>{checkpoint.name}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <p>{checkpoint.description}</p>
                                <div>
                                  <h6 className="font-medium mb-2">معايير الفحص:</h6>
                                  <ul className="space-y-1">
                                    {checkpoint.criteria.map((criterion, index) => (
                                      <li key={index} className="flex items-center gap-2 text-sm">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        {criterion}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                {checkpoint.photos && (
                                  <div className="bg-yellow-50 p-3 rounded-lg">
                                    <div className="flex items-center gap-2 text-yellow-700">
                                      <Camera className="w-4 h-4" />
                                      <span className="text-sm">مطلوب توثيق بالصور</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{checkpoint.description}</p>
                      <Badge variant="outline" className="text-xs">
                        نوع الفحص: {checkpoint.inspectionType === 'self' ? 'ذاتي' : 
                                    checkpoint.inspectionType === 'supervisor' ? 'مشرف' : 'جهة رسمية'}
                      </Badge>
                    </Card>
                  ))}
                </div>
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
                        <a 
                          href={regulation.documentUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                          <ExternalLink className="w-4 h-4" />
                          عرض المستند
                        </a>
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
          <p className="text-sm text-gray-600">تأكد من استيفاء جميع المتطلبات القانونية</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {complianceChecklist.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h4 className="font-medium text-gray-800 mb-3">{category.category}</h4>
                <div className="space-y-2">
                  {category.items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <input 
                        type="checkbox" 
                        checked={item.completed}
                        className="rounded border-gray-300"
                        onChange={() => {
                          // Handle checkbox change
                        }}
                      />
                      <div className="flex-1">
                        <span className={item.completed ? 'line-through text-gray-500' : ''}>
                          {item.description}
                        </span>
                        {item.required && (
                          <Badge variant="destructive" className="ml-2 text-xs">مطلوب</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

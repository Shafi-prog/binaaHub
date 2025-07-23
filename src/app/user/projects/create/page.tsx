'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';
import { ConstructionGuidanceService } from '@/core/services/constructionGuidanceService';
import { ProjectTrackingService } from '@/core/services/projectTrackingService';
import { Project } from '@/core/shared/types/types';
import { 
  ArrowLeft, 
  Home, 
  Building, 
  Calculator, 
  Save,
  Camera,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Hammer,
  Clock,
  FileText,
  Settings
} from 'lucide-react';

export default function CreateProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    area: '',
    projectType: 'villa',
    floorCount: 1,
    roomCount: 4,
    selectedPhases: [] as string[],
    enablePhotoTracking: true,
    enableProgressTracking: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectData.name.trim()) {
      alert('يرجى إدخال اسم المشروع');
      return;
    }

    const area = parseFloat(projectData.area);
    if (!area || area <= 0) {
      alert('يرجى إدخال مساحة صحيحة للمشروع');
      return;
    }

    try {
      setLoading(true);
      
      const newProject: Project = {
        id: Date.now().toString(),
        name: projectData.name.trim(),
        description: projectData.description.trim(),
        area: area,
        projectType: projectData.projectType,
        floorCount: projectData.floorCount,
        roomCount: projectData.roomCount,
        stage: 'تخطيط',
        progress: 0,
        status: 'planning',
        selectedPhases: projectData.selectedPhases,
        enablePhotoTracking: projectData.enablePhotoTracking,
        enableProgressTracking: projectData.enableProgressTracking,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await ProjectTrackingService.saveProject(newProject);
      
      // Navigate to the new project
      router.push(`/user/projects/${newProject.id}`);
      
    } catch (error) {
      console.error('Error creating project:', error);
      alert('حدث خطأ أثناء إنشاء المشروع');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWithCalculator = async () => {
    if (!projectData.name.trim()) {
      alert('يرجى إدخال اسم المشروع');
      return;
    }

    const area = parseFloat(projectData.area);
    if (!area || area <= 0) {
      alert('يرجى إدخال مساحة صحيحة للمشروع');
      return;
    }

    try {
      setLoading(true);
      
      const newProject: Project = {
        id: Date.now().toString(),
        name: projectData.name.trim(),
        description: projectData.description.trim(),
        area: area,
        projectType: projectData.projectType,
        floorCount: projectData.floorCount,
        roomCount: projectData.roomCount,
        stage: 'تخطيط',
        progress: 0,
        status: 'planning',
        selectedPhases: projectData.selectedPhases,
        enablePhotoTracking: projectData.enablePhotoTracking,
        enableProgressTracking: projectData.enableProgressTracking,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await ProjectTrackingService.saveProject(newProject);
      
      // Navigate to calculator with project ID
      router.push(`/user/comprehensive-construction-calculator?projectId=${newProject.id}`);
      
    } catch (error) {
      console.error('Error creating project:', error);
      alert('حدث خطأ أثناء إنشاء المشروع');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 font-tajawal">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
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
            <h1 className="text-3xl font-bold text-gray-800">إنشاء مشروع جديد</h1>
            <p className="text-gray-600">ابدأ مشروع البناء الخاص بك وتتبع التقديرات والمشتريات</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                معلومات المشروع
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Project Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    اسم المشروع *
                  </label>
                  <Input
                    value={projectData.name}
                    onChange={(e) => setProjectData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="مثل: فيلا العائلة، شقة الرياض، مشروع تجاري..."
                    required
                  />
                </div>

                {/* Project Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    وصف المشروع
                  </label>
                  <Textarea
                    value={projectData.description}
                    onChange={(e) => setProjectData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="وصف مختصر للمشروع، الموقع، الأهداف..."
                    rows={3}
                  />
                </div>

                {/* Project Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    نوع المشروع *
                  </label>
                  <select
                    value={projectData.projectType}
                    onChange={(e) => setProjectData(prev => ({ ...prev, projectType: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="villa">فيلا سكنية</option>
                    <option value="apartment">شقة سكنية</option>
                    <option value="commercial">مبنى تجاري</option>
                    <option value="warehouse">مستودع</option>
                    <option value="office">مكتب</option>
                    <option value="other">أخرى</option>
                  </select>
                </div>

                {/* Project Area */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    مساحة المشروع (متر مربع) *
                  </label>
                  <Input
                    type="number"
                    value={projectData.area}
                    onChange={(e) => setProjectData(prev => ({ ...prev, area: e.target.value }))}
                    placeholder="200"
                    min="1"
                    required
                  />
                </div>

                {/* Floor Count */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    عدد الأدوار
                  </label>
                  <select
                    value={projectData.floorCount.toString()}
                    onChange={(e) => setProjectData(prev => ({ ...prev, floorCount: parseInt(e.target.value) }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1">دور واحد</option>
                    <option value="2">دورين</option>
                    <option value="3">3 أدوار</option>
                    <option value="4">4 أدوار</option>
                    <option value="5">5 أدوار</option>
                    <option value="6">6 أدوار أو أكثر</option>
                  </select>
                </div>

                {/* Room Count */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    عدد الغرف الرئيسية
                  </label>
                  <Input
                    type="number"
                    value={projectData.roomCount}
                    onChange={(e) => setProjectData(prev => ({ ...prev, roomCount: parseInt(e.target.value) || 1 }))}
                    placeholder="4"
                    min="1"
                  />
                </div>

                {/* Summary Card */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">ملخص المشروع</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">النوع:</span>
                      <p className="font-medium">
                        {projectData.projectType === 'villa' && 'فيلا سكنية'}
                        {projectData.projectType === 'apartment' && 'شقة سكنية'}
                        {projectData.projectType === 'commercial' && 'مبنى تجاري'}
                        {projectData.projectType === 'warehouse' && 'مستودع'}
                        {projectData.projectType === 'office' && 'مكتب'}
                        {projectData.projectType === 'other' && 'أخرى'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">المساحة:</span>
                      <p className="font-medium">{projectData.area || 0} م²</p>
                    </div>
                    <div>
                      <span className="text-gray-600">عدد الأدوار:</span>
                      <p className="font-medium">{projectData.floorCount}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">عدد الغرف:</span>
                      <p className="font-medium">{projectData.roomCount}</p>
                    </div>
                  </div>
                </div>

                {/* Construction Phases Selection */}
                <Card className="shadow-sm mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hammer className="w-5 h-5" />
                    اختيار مراحل البناء للتتبع
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    اختر المراحل التي تريد تتبعها في مشروعك مع إمكانية رفع الصور وتوثيق التقدم
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(() => {
                    const phases = ConstructionGuidanceService.getProjectPhases({
                      projectType: projectData.projectType as any,
                      area: Number(projectData.area) || 200,
                      floors: projectData.floorCount,
                      compliance: 'enhanced',
                      supervision: 'engineer',
                      location: 'الرياض'
                    });

                    return phases.map((phase) => (
                      <div key={phase.id} className="flex items-center space-x-3 space-x-reverse p-3 border rounded-lg hover:bg-gray-50">
                        <Checkbox 
                          id={phase.id}
                          checked={projectData.selectedPhases.includes(phase.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setProjectData(prev => ({
                                ...prev,
                                selectedPhases: [...prev.selectedPhases, phase.id]
                              }));
                            } else {
                              setProjectData(prev => ({
                                ...prev,
                                selectedPhases: prev.selectedPhases.filter(id => id !== phase.id)
                              }));
                            }
                          }}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <label htmlFor={phase.id} className="font-medium cursor-pointer">
                              {phase.name}
                            </label>
                            <Badge variant="outline" className="text-xs">
                              {phase.duration} يوم
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{phase.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              {phase.documents.length} وثيقة
                            </span>
                            <span className="flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              {phase.checkpoints.length} نقطة فحص
                            </span>
                          </div>
                        </div>
                      </div>
                    ));
                  })()}

                  {/* Quick Selection */}
                  <div className="border-t pt-4">
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const allPhases = ConstructionGuidanceService.getProjectPhases({
                            projectType: projectData.projectType as any,
                            area: Number(projectData.area) || 200,
                            floors: projectData.floorCount,
                            compliance: 'enhanced',
                            supervision: 'engineer',
                            location: 'الرياض'
                          });
                          setProjectData(prev => ({
                            ...prev,
                            selectedPhases: allPhases.map(p => p.id)
                          }));
                        }}
                      >
                        تحديد الكل
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setProjectData(prev => ({
                            ...prev,
                            selectedPhases: []
                          }));
                        }}
                      >
                        إلغاء التحديد
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setProjectData(prev => ({
                            ...prev,
                            selectedPhases: ['planning', 'structure', 'finishing']
                          }));
                        }}
                      >
                        المراحل الأساسية
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Project Tracking Options */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    خيارات التتبع والتوثيق
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <Checkbox 
                      id="enablePhotoTracking"
                      checked={projectData.enablePhotoTracking}
                      onCheckedChange={(checked) => {
                        setProjectData(prev => ({
                          ...prev,
                          enablePhotoTracking: !!checked
                        }));
                      }}
                    />
                    <div className="flex-1">
                      <label htmlFor="enablePhotoTracking" className="flex items-center gap-2 font-medium cursor-pointer">
                        <Camera className="w-4 h-4 text-green-500" />
                        تفعيل التوثيق بالصور
                      </label>
                      <p className="text-sm text-gray-600">
                        إمكانية رفع وتنظيم صور لكل مرحلة من مراحل البناء
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 space-x-reverse">
                    <Checkbox 
                      id="enableProgressTracking"
                      checked={projectData.enableProgressTracking}
                      onCheckedChange={(checked) => {
                        setProjectData(prev => ({
                          ...prev,
                          enableProgressTracking: !!checked
                        }));
                      }}
                    />
                    <div className="flex-1">
                      <label htmlFor="enableProgressTracking" className="flex items-center gap-2 font-medium cursor-pointer">
                        <BarChart3 className="w-4 h-4 text-blue-500" />
                        تتبع التقدم والمعالم
                      </label>
                      <p className="text-sm text-gray-600">
                        مراقبة تقدم العمل والمهام مع تحديثات آلية
                      </p>
                    </div>
                  </div>

                  {projectData.selectedPhases.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-green-800">
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-medium">جاهز للبدء!</span>
                      </div>
                      <p className="text-sm text-green-700 mt-1">
                        تم اختيار {projectData.selectedPhases.length} مرحلة للتتبع. 
                        ستتمكن من رفع الصور وتوثيق التقدم لكل مرحلة.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card className="shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      disabled={loading || !projectData.name.trim() || !projectData.area || parseFloat(projectData.area) <= 0}
                      className="flex-1 flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {loading ? 'جاري الإنشاء...' : 'إنشاء المشروع'}
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCreateWithCalculator}
                      disabled={loading || !projectData.name.trim() || !projectData.area || parseFloat(projectData.area) <= 0}
                      className="flex-1 flex items-center gap-2"
                    >
                      <Calculator className="w-4 h-4" />
                      إنشاء + حاسبة
                    </Button>
                  </div>

                  <div className="text-center mt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => router.push('/user/projects/list')}
                      className="flex items-center gap-2"
                    >
                      <Home className="w-4 h-4" />
                      العودة للمشاريع
                    </Button>
                  </div>
                </CardContent>
              </Card>
              </form>
            </CardContent>
          </Card>

          {/* Help Card */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">نصائح لإنشاء مشروع ناجح</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                  <p>استخدم اسماً واضحاً ومميزاً لمشروعك يساعدك على تذكره لاحقاً</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                  <p>احرص على دقة المساحة المدخلة لضمان دقة التقديرات</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                  <p>يمكنك استخدام "إنشاء + حاسبة" للبدء مباشرة في حساب التقديرات</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                  <p>ستتمكن من تسجيل المشتريات وتتبع التقدم بمجرد إنشاء المشروع</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

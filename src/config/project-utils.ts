// @ts-nocheck
// Shared project utilities for consistent logic across the application

export interface ProjectStatus {
  status: string;
  is_active?: boolean;
}

// Helper: determine if a project is active (in progress)
export function isProjectActive(project: ProjectStatus): boolean {
  const status = (project.status || '').toString().trim().toLowerCase();
  // Only 'completed' and 'on_hold' are considered inactive
  // All other statuses are active projects
  return (
    !['completed', 'on_hold'].includes(status) &&
    project.is_active !== false
  );
}

// Get localized status label
export function getStatusLabel(status: string): string {
  switch ((status || '').toLowerCase()) {
    case 'planning': return 'التخطيط';
    case 'design': return 'التصميم';
    case 'permits': return 'التراخيص';
    case 'site_preparation': return 'تجهيز الموقع';
    case 'foundation': return 'الأساسات';
    case 'structure': return 'الهيكل الإنشائي';
    case 'roofing': return 'السقف';
    case 'plumbing': return 'السباكة';
    case 'electrical': return 'الكهرباء';
    case 'insulation': return 'العزل';
    case 'drywall': return 'الجدران الجافة';
    case 'flooring': return 'الأرضيات';
    case 'painting': return 'الدهان';
    case 'fixtures': return 'التركيبات';
    case 'landscaping': return 'تنسيق الحدائق';
    case 'final_inspection': return 'الفحص النهائي';
    case 'completed': return 'مكتمل';
    case 'on_hold': return 'متوقف';
    // Legacy statuses for backward compatibility
    case 'construction': return 'قيد الإنشاء';
    case 'finishing': return 'التشطيبات';
    case 'in_progress': return 'قيد التنفيذ';
    case 'active': return 'نشط';
    default: return status;
  }
}

// Get progress percentage based on status
export function getProgressFromStatus(status: string): number {
  switch ((status || '').toLowerCase()) {
    case 'planning': return 5;
    case 'design': return 10;
    case 'permits': return 15;
    case 'site_preparation': return 20;
    case 'foundation': return 30;
    case 'structure': return 45;
    case 'roofing': return 55;
    case 'plumbing': return 65;
    case 'electrical': return 70;
    case 'insulation': return 75;
    case 'drywall': return 80;
    case 'flooring': return 85;
    case 'painting': return 90;
    case 'fixtures': return 95;
    case 'landscaping': return 98;
    case 'final_inspection': return 99;
    case 'completed': return 100;
    case 'on_hold': return 0;
    // Legacy statuses for backward compatibility
    case 'construction': return 70;
    case 'finishing': return 90;
    case 'in_progress': return 50;
    case 'active': return 50;
    default: return 0;
  }
}

// Get status color for UI
export function getStatusColor(status: string): string {
  switch ((status || '').toLowerCase()) {
    case 'planning': return 'bg-yellow-100 text-yellow-800';
    case 'design': return 'bg-blue-100 text-blue-800';
    case 'permits': return 'bg-purple-100 text-purple-800';
    case 'site_preparation': return 'bg-orange-100 text-orange-800';
    case 'foundation': return 'bg-red-100 text-red-800';
    case 'structure': return 'bg-indigo-100 text-indigo-800';
    case 'roofing': return 'bg-pink-100 text-pink-800';
    case 'plumbing': return 'bg-cyan-100 text-cyan-800';
    case 'electrical': return 'bg-amber-100 text-amber-800';
    case 'insulation': return 'bg-lime-100 text-lime-800';
    case 'drywall': return 'bg-emerald-100 text-emerald-800';
    case 'flooring': return 'bg-teal-100 text-teal-800';
    case 'painting': return 'bg-violet-100 text-violet-800';
    case 'fixtures': return 'bg-rose-100 text-rose-800';
    case 'landscaping': return 'bg-green-100 text-green-800';
    case 'final_inspection': return 'bg-slate-100 text-slate-800';
    case 'completed': return 'bg-green-100 text-green-800';
    case 'on_hold': return 'bg-red-100 text-red-800';
    // Legacy statuses for backward compatibility
    case 'construction': 
    case 'finishing':
    case 'in_progress':
    case 'active': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

// Calculate project progress (with fallback to status-based progress)
export function calculateProjectProgress(project: { progress_percentage?: number; status: string }): number {
  return project.progress_percentage || getProgressFromStatus(project.status);
}

// Get project type label (for better UI display)
export function getProjectTypeLabel(projectType: string): string {
  switch ((projectType || '').toLowerCase()) {
    case 'residential': return 'سكني';
    case 'commercial': return 'تجاري';
    case 'industrial': return 'صناعي';
    case 'infrastructure': return 'بنية تحتية';
    case 'renovation': return 'تجديد';
    case 'web_development': return 'تطوير ويب';
    case 'mobile_development': return 'تطوير تطبيقات';
    case 'software_development': return 'تطوير برمجيات';
    default: return projectType || 'غير محدد';
  }
}

// Get all available project statuses for dropdowns
export function getAllProjectStatuses(): Array<{ value: string; label: string; progress: number }> {
  return [
    { value: 'planning', label: 'التخطيط', progress: 5 },
    { value: 'design', label: 'التصميم', progress: 10 },
    { value: 'permits', label: 'التراخيص', progress: 15 },
    { value: 'site_preparation', label: 'تجهيز الموقع', progress: 20 },
    { value: 'foundation', label: 'الأساسات', progress: 30 },
    { value: 'structure', label: 'الهيكل الإنشائي', progress: 45 },
    { value: 'roofing', label: 'السقف', progress: 55 },
    { value: 'plumbing', label: 'السباكة', progress: 65 },
    { value: 'electrical', label: 'الكهرباء', progress: 70 },
    { value: 'insulation', label: 'العزل', progress: 75 },
    { value: 'drywall', label: 'الجدران الجافة', progress: 80 },
    { value: 'flooring', label: 'الأرضيات', progress: 85 },
    { value: 'painting', label: 'الدهان', progress: 90 },
    { value: 'fixtures', label: 'التركيبات', progress: 95 },
    { value: 'landscaping', label: 'تنسيق الحدائق', progress: 98 },
    { value: 'final_inspection', label: 'الفحص النهائي', progress: 99 },
    { value: 'completed', label: 'مكتمل', progress: 100 },
    { value: 'on_hold', label: 'متوقف', progress: 0 },
  ];
}

// Check if project can be set for sale (only completed projects)
export function canProjectBeForSale(project: { status: string }): boolean {
  return (project.status || '').toLowerCase() === 'completed';
}

// Get building phase category for grouping
export function getBuildingPhase(status: string): string {
  const statusLower = (status || '').toLowerCase();
  
  if (['planning', 'design', 'permits'].includes(statusLower)) {
    return 'pre_construction';
  }
  
  if (['site_preparation', 'foundation', 'structure'].includes(statusLower)) {
    return 'early_construction';
  }
  
  if (['roofing', 'plumbing', 'electrical', 'insulation'].includes(statusLower)) {
    return 'mid_construction';
  }
  
  if (['drywall', 'flooring', 'painting', 'fixtures'].includes(statusLower)) {
    return 'finishing';
  }
  
  if (['landscaping', 'final_inspection'].includes(statusLower)) {
    return 'completion';
  }
  
  if (statusLower === 'completed') {
    return 'completed';
  }
  
  return 'other';
}

// Get phase label in Arabic
export function getPhaseLabel(phase: string): string {
  switch (phase) {
    case 'pre_construction': return 'ما قبل البناء';
    case 'early_construction': return 'بداية البناء';
    case 'mid_construction': return 'منتصف البناء';
    case 'finishing': return 'التشطيبات';
    case 'completion': return 'الإنجاز';
    case 'completed': return 'مكتمل';
    default: return 'أخرى';
  }
}



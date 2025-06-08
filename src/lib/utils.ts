<<<<<<< HEAD
// Utility functions placeholder
export function formatCurrency(value: number) { return value.toString(); }
export function formatDate(date: string | Date) { return date.toString(); }
export function translateStatus(status: string) { return status; }
=======
// Utility functions for dashboard functionality
import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Format currency
export function formatCurrency(amount: number, currency: string = 'SAR'): string {
  const formatter = new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(amount);
}

// Format numbers
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ar-SA').format(num);
}

// Format dates
export function formatDate(date: string | Date, locale: string = 'ar-SA'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

export function formatShortDate(date: string | Date, locale: string = 'ar-SA'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat(locale, {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  }).format(dateObj);
}

export function formatRelativeTime(date: string | Date, locale: string = 'ar-SA'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = (now.getTime() - dateObj.getTime()) / 1000;

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (diffInSeconds < 60) {
    return rtf.format(-Math.floor(diffInSeconds), 'second');
  }

  const diffInMinutes = diffInSeconds / 60;
  if (diffInMinutes < 60) {
    return rtf.format(-Math.floor(diffInMinutes), 'minute');
  }

  const diffInHours = diffInMinutes / 60;
  if (diffInHours < 24) {
    return rtf.format(-Math.floor(diffInHours), 'hour');
  }

  const diffInDays = diffInHours / 24;
  if (diffInDays < 30) {
    return rtf.format(-Math.floor(diffInDays), 'day');
  }

  const diffInMonths = diffInDays / 30;
  if (diffInMonths < 12) {
    return rtf.format(-Math.floor(diffInMonths), 'month');
  }

  const diffInYears = diffInMonths / 12;
  return rtf.format(-Math.floor(diffInYears), 'year');
}

// Get days until date
export function getDaysUntil(date: string | Date): number {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = targetDate.getTime() - now.getTime();
  return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
}

// Check if warranty is expiring soon (within 30 days)
export function isWarrantyExpiringSoon(endDate: string | Date, threshold: number = 30): boolean {
  const daysUntil = getDaysUntil(endDate);
  return daysUntil > 0 && daysUntil <= threshold;
}

// Check if warranty is expired
export function isWarrantyExpired(endDate: string | Date): boolean {
  return getDaysUntil(endDate) < 0;
}

// Calculate project progress percentage
export function calculateProjectProgress(project: any): number {
  if (project.status === 'completed') return 100;
  if (project.progress_percentage) return project.progress_percentage;

  // Calculate based on phases if available
  if (project.phases && project.phases.length > 0) {
    const totalPhases = project.phases.length;
    const completedPhases = project.phases.filter(
      (phase: any) => phase.status === 'completed'
    ).length;
    return Math.round((completedPhases / totalPhases) * 100);
  }

  // Calculate based on status
  const statusProgress: Record<string, number> = {
    planning: 10,
    design: 25,
    permits: 35,
    construction: 70,
    finishing: 90,
    completed: 100,
    on_hold: 0,
  };

  return statusProgress[project.status] || 0;
}

// Get status color
export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    // Project statuses
    planning: 'bg-yellow-100 text-yellow-800',
    design: 'bg-blue-100 text-blue-800',
    permits: 'bg-purple-100 text-purple-800',
    construction: 'bg-orange-100 text-orange-800',
    finishing: 'bg-indigo-100 text-indigo-800',
    completed: 'bg-green-100 text-green-800',
    on_hold: 'bg-gray-100 text-gray-800',

    // Order statuses
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    returned: 'bg-orange-100 text-orange-800',

    // Payment statuses
    paid: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-orange-100 text-orange-800',
    partial: 'bg-yellow-100 text-yellow-800',

    // Warranty statuses
    active: 'bg-green-100 text-green-800',
    expired: 'bg-red-100 text-red-800',
    claimed: 'bg-blue-100 text-blue-800',
    void: 'bg-gray-100 text-gray-800',
    transferred: 'bg-purple-100 text-purple-800',

    // Priority levels
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
  };

  return statusColors[status] || 'bg-gray-100 text-gray-800';
}

// Get progress bar color
export function getProgressColor(percentage: number): string {
  if (percentage >= 80) return 'bg-green-500';
  if (percentage >= 60) return 'bg-blue-500';
  if (percentage >= 40) return 'bg-yellow-500';
  if (percentage >= 20) return 'bg-orange-500';
  return 'bg-red-500';
}

// Get project status in Arabic
export function getProjectStatusAr(status: string): string {
  const statusMap: Record<string, string> = {
    planning: 'التخطيط',
    design: 'التصميم',
    permits: 'التصاريح',
    construction: 'قيد الإنشاء',
    finishing: 'اللمسات الأخيرة',
    completed: 'مكتمل',
    on_hold: 'متوقف مؤقتاً',
  };

  return statusMap[status] || status;
}

// Get order status in Arabic
export function getOrderStatusAr(status: string): string {
  const statusMap: Record<string, string> = {
    pending: 'في الانتظار',
    confirmed: 'مؤكد',
    processing: 'قيد المعالجة',
    shipped: 'تم الشحن',
    delivered: 'تم التسليم',
    cancelled: 'ملغي',
    returned: 'مُرتجع',
  };

  return statusMap[status] || status;
}

// Get warranty status in Arabic
export function getWarrantyStatusAr(status: string): string {
  const statusMap: Record<string, string> = {
    active: 'نشط',
    expired: 'منتهي الصلاحية',
    claimed: 'تم المطالبة',
    void: 'ملغي',
    transferred: 'محول',
  };
  return statusMap[status] || status;
}

// General translate status function - handles all status types
export function translateStatus(status: string, type?: 'project' | 'order' | 'warranty'): string {
  // If type is specified, use specific function
  if (type === 'project') return getProjectStatusAr(status);
  if (type === 'order') return getOrderStatusAr(status);
  if (type === 'warranty') return getWarrantyStatusAr(status);

  // Combined status mapping for general use
  const statusMap: Record<string, string> = {
    // Project statuses
    planning: 'التخطيط',
    design: 'التصميم',
    permits: 'التصاريح',
    construction: 'قيد الإنشاء',
    finishing: 'اللمسات الأخيرة',
    completed: 'مكتمل',
    on_hold: 'متوقف مؤقتاً',

    // Order statuses
    pending: 'في الانتظار',
    confirmed: 'مؤكد',
    processing: 'قيد المعالجة',
    shipped: 'تم الشحن',
    delivered: 'تم التسليم',
    cancelled: 'ملغي',
    returned: 'مُرتجع',

    // Warranty statuses
    active: 'نشط',
    expired: 'منتهي الصلاحية',
    claimed: 'تم المطالبة',
    void: 'ملغي',
    transferred: 'محول',

    // Payment statuses
    paid: 'مدفوع',
    failed: 'فشل',
    refunded: 'مُسترد',
    partial: 'جزئي',
  };

  return statusMap[status] || status;
}
>>>>>>> e0e83bc2e6a4c393009b329773f07bfad211af6b

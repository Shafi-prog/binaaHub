export const dynamic = 'force-dynamic';

// Only import types and server-safe utilities at the top
import { Card, LoadingSpinner, StatusBadge, ProgressBar } from '@/components/ui';
import { formatCurrency, formatDate, translateStatus } from '@/lib/utils';
import type { Project } from '@/types/dashboard';
import { MapPicker } from '@/components/maps/MapPicker';
import dynamicImport from 'next/dynamic';

// Advice for each stage
const STAGE_ADVICE: Record<string, string> = {
  planning: 'تأكد من جمع كل التصاريح اللازمة وتحديد الميزانية واختيار المقاول المناسب قبل الانتقال للمرحلة التالية.',
  design: 'راجع التصاميم مع المهندس وتأكد من مطابقتها للاحتياجات، وابدأ في تجهيز مستندات الرخص.',
  permits: 'تأكد من استكمال جميع الأوراق الرسمية والحصول على الرخص اللازمة قبل بدء التنفيذ.',
  construction: 'تابع تقدم العمل مع المقاول، واحتفظ بسجلات المصروفات، وراقب الجودة بشكل دوري.',
  finishing: 'اختر مواد التشطيب بعناية، ونسق مع الموردين لضمان التسليم في الوقت المناسب.',
  completed: 'راجع جميع الأعمال المنجزة، واحتفظ بنسخ من الضمانات والفواتير، واحتفل بإنجاز المشروع!',
  on_hold: 'تابع الإجراءات المطلوبة لإعادة تفعيل المشروع أو حل المشكلات العالقة.'
};

const ProjectDetailClient = dynamicImport(() => import('./ProjectDetailClient'), { ssr: false });

export default function ProjectDetailPageWrapper() {
  return <ProjectDetailClient />;
}

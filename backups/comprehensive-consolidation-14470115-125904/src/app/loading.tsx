// @ts-nocheck
import { EnhancedLoading } from '@/domains/shared/components/ui/enhanced-loading';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <EnhancedLoading 
        title="جارٍ تحميل البيانات..."
        subtitle="يرجى الانتظار قليلاً"
        showLogo={true}
        fullScreen={true}
      />
    </div>
  );
}



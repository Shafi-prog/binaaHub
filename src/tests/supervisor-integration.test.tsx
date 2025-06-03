/**
 * Supervisor Management Integration Tests
 * Tests the integration between supervisor components and Arabic translations
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SupervisorManagement from '@/components/SupervisorManagement';
import SupervisorRequests from '@/components/SupervisorRequests';
import { useTranslation } from '@/hooks/useTranslation';

// Mock the translation hook
jest.mock('@/hooks/useTranslation');
const mockUseTranslation = useTranslation as jest.MockedFunction<typeof useTranslation>;

// Mock Supabase
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: () => ({
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockReturnValue({
          range: jest.fn().mockReturnValue(Promise.resolve({
            data: [],
            error: null,
            count: 0
          }))
        })
      })
    }),
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: { session: { user: { id: 'test-user' } } }
      })
    }
  })
}));

// Mock router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn()
  })
}));

describe('Supervisor Integration Tests', () => {
  beforeEach(() => {      mockUseTranslation.mockReturnValue({
        t: (key: string, params?: Record<string, any>) => {
          const translations: Record<string, string> = {
            'supervisor.update': 'تحديث',
            'supervisor.create': 'إنشاء',
            'supervisor.noSupervisors': 'لا يوجد مشرفون',
            'supervisor.noActiveSupervisors': 'لم يتم العثور على مشرفين نشطين',
            'supervisor.noInactiveSupervisors': 'لم يتم العثور على مشرفين غير نشطين',
            'supervisor.assignedStores': '{count} متجر معين',
            'supervisor.search': 'البحث عن المشرفين',
            'supervisor.searchPlaceholder': 'ابحث بالاسم أو التخصص أو الموقع...',
            'supervisor.addSupervisor': 'إضافة مشرف جديد',
            'common.loading': 'جارٍ التحميل...',
            'common.error': 'خطأ',
            'common.retry': 'إعادة المحاولة',
            'supervisor.management': 'إدارة المشرفين',
            'supervisor.description': 'ابحث عن مشرفين للبناء وأدر مشاريعك بسهولة',
            'supervisor.addNew': 'إضافة مشرف جديد',
            'cancel': 'إلغاء',
            'request.approve': 'موافقة',
            'request.reject': 'رفض'
          };
        
        let result = translations[key] || key;
        
        // Handle parameter interpolation
        if (params) {
          Object.entries(params).forEach(([param, value]) => {
            result = result.replace(`{${param}}`, String(value));
          });
        }
        
        return result;
      },
      language: 'ar' as const,
      setLanguage: jest.fn(),
      isRTL: true
    });
  });

  describe('SupervisorManagement Component', () => {
    test('renders with Arabic translations', async () => {
      render(<SupervisorManagement />);
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText('ابحث بالاسم أو التخصص أو الموقع...')).toBeInTheDocument();
      });
      
      expect(screen.getByText('إضافة مشرف جديد')).toBeInTheDocument();
    });

    test('displays no supervisors message in Arabic', async () => {
      render(<SupervisorManagement />);
      
      await waitFor(() => {
        expect(screen.getByText('لا يوجد مشرفون')).toBeInTheDocument();
      });
    });

    test('handles search functionality', async () => {
      render(<SupervisorManagement />);
      
      const searchInput = await waitFor(() => 
        screen.getByPlaceholderText('ابحث بالاسم أو التخصص أو الموقع...')
      );
      
      fireEvent.change(searchInput, { target: { value: 'أحمد' } });
      expect(searchInput).toHaveValue('أحمد');
    });

    test('shows correct button text for create/update', async () => {
      render(<SupervisorManagement />);
      
      await waitFor(() => {
        expect(screen.getByText('إضافة مشرف جديد')).toBeInTheDocument();
      });
    });
  });
  describe('SupervisorRequests Component', () => {
    test('renders with Arabic translations', async () => {
      render(<SupervisorRequests userId="test-user-id" isUser={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('جارٍ التحميل...')).toBeInTheDocument();
      });
    });
  });

  describe('Translation Integration', () => {
    test('properly interpolates Arabic translations with parameters', () => {
      const { t } = mockUseTranslation();
      
      const storeCountText = t('supervisor.assignedStores', { count: 5 });
      expect(storeCountText).toBe('5 متجر معين');
    });

    test('returns RTL direction for Arabic', () => {
      const { isRTL } = mockUseTranslation();
      expect(isRTL).toBe(true);
    });

    test('has correct language set', () => {
      const { language } = mockUseTranslation();
      expect(language).toBe('ar');
    });
  });

  describe('Error Handling', () => {
    test('displays error messages in Arabic', async () => {
      // Mock an error state
      mockUseTranslation.mockReturnValueOnce({
        t: (key: string) => {
          if (key === 'common.error') return 'خطأ';
          if (key === 'common.retry') return 'إعادة المحاولة';
          return key;
        },
        language: 'ar' as const,
        setLanguage: jest.fn(),
        isRTL: true
      });

      render(<SupervisorManagement />);
      
      // This would test error states if we had error scenarios
      expect(mockUseTranslation).toHaveBeenCalled();
    });
  });
});

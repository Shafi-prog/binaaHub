// @ts-nocheck
'use client'

// Force dynamic rendering to avoid SSG auth context issues
import { useState, useEffect } from "react"
import { Button, EnhancedCard, Typography } from "@/core/shared/components/ui/enhanced-components"
import { Settings } from "lucide-react"


export const dynamic = 'force-dynamic'
// Force dynamic rendering to avoid static generation issues with QueryClient

export default function StoreSettings() {
  const [store, setStore] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Simulate loading store data
    const loadStoreData = async () => {
      try {
        // Mock store data
        const mockStoreData = {
          id: "default",
          name: "Binna Store",
          default_currency_code: "USD",
          default_sales_channel_id: "default_channel",
          default_region_id: "default_region",
          created_at: new Date().toISOString(),
        }
        
        setStore(mockStoreData)
        setIsLoading(false)
      } catch (err) {
        setError(err)
        setIsLoading(false)
      }
    }

    loadStoreData()
  }, [])

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">
          Error loading store settings: {error.message}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 font-tajawal" dir="rtl">
      <div className="flex justify-between items-start">
        <div>
          <Typography variant="heading" size="3xl" weight="bold" className="text-gray-900 mb-2">
            إعدادات المتجر
          </Typography>
          <Typography variant="body" size="lg" className="text-gray-600">
            إدارة تكوين متجرك وتفضيلاته
          </Typography>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EnhancedCard variant="elevated">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="h-6 w-6 text-blue-600" />
              <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-900">
                الإعدادات العامة
              </Typography>
            </div>
            <Typography variant="body" size="sm" className="text-gray-600 mb-6">
              معلومات المتجر الأساسية والتكوين
            </Typography>
            
            <div className="space-y-4">
              <div>
                <Typography variant="caption" size="sm" className="text-gray-700 font-medium">
                  اسم المتجر
                </Typography>
                <Typography variant="body" size="lg" className="text-gray-900">
                  {store?.name || 'متجر بِنّا'}
                </Typography>
              </div>
              <div>
                <Typography variant="caption" size="sm" className="text-gray-700 font-medium">
                  العملة الافتراضية
                </Typography>
                <Typography variant="body" size="lg" className="text-gray-900">
                  {store?.default_currency_code || 'ر.س (SAR)'}
                </Typography>
              </div>
              <Button className="w-full" variant="primary">
                تعديل إعدادات المتجر
              </Button>
            </div>
          </div>
        </EnhancedCard>

        <EnhancedCard variant="elevated">
          <div className="p-6">
            <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-900 mb-2">
              حالة المتجر
            </Typography>
            <Typography variant="body" size="sm" className="text-gray-600 mb-6">
              حالة المتجر التشغيلية الحالية
            </Typography>
            
            <div className="space-y-4">
              <div>
                <Typography variant="caption" size="sm" className="text-gray-700 font-medium">
                  الحالة
                </Typography>
                <Typography variant="body" size="lg" className="text-green-600 font-semibold">
                  نشط
                </Typography>
              </div>
              <div>
                <Typography variant="caption" size="sm" className="text-gray-700 font-medium">
                  تاريخ الإنشاء
                </Typography>
                <Typography variant="body" size="lg" className="text-gray-900">
                  {store?.created_at ? new Date(store.created_at).toLocaleDateString('ar-SA') : 'غير متوفر'}
                </Typography>
              </div>
              <Button variant="outline" className="w-full">
                عرض تحليلات المتجر
              </Button>
            </div>
          </div>
        </EnhancedCard>
      </div>
    </div>
  )
}



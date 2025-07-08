// @ts-nocheck
/**
 * PWA Manager - Handles Progressive Web App functionality
 * Including service worker registration, installation prompts, and offline handling
 */

'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export interface PWAInstallPrompt {
  prompt: () => Promise<void>
  outcome: 'accepted' | 'dismissed'
}

export interface PWAUpdateAvailable {
  waitingWorker: ServiceWorker
  showReload: boolean
}

class PWAManager {
  private static instance: PWAManager
  private registration: ServiceWorkerRegistration | null = null
  private deferredPrompt: any = null
  private updateAvailable = false
  private isInstalled = false
  private installPromptShown = false

  private constructor() {
    this.initializePWA()
  }

  static getInstance(): PWAManager {
    if (!PWAManager.instance) {
      PWAManager.instance = new PWAManager()
    }
    return PWAManager.instance
  }

  private async initializePWA() {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      console.log('PWA: Service Workers not supported')
      return
    }

    try {
      // Register service worker
      await this.registerServiceWorker()
      
      // Set up install prompt
      this.setupInstallPrompt()
      
      // Set up update handling
      this.setupUpdateHandling()
      
      // Check if already installed
      this.checkInstallStatus()
      
      // Set up push notifications
      this.setupPushNotifications()
      
      console.log('✅ PWA Manager initialized successfully')
    } catch (error) {
      console.error('❌ Failed to initialize PWA:', error)
    }
  }

  private async registerServiceWorker(): Promise<void> {
    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })

      console.log('✅ Service Worker registered:', this.registration.scope)

      // Listen for updates
      this.registration.addEventListener('updatefound', () => {
        console.log('🔄 Service Worker update found')
        this.handleServiceWorkerUpdate()
      })

      // Check for existing update
      if (this.registration.waiting) {
        this.handleServiceWorkerUpdate()
      }

    } catch (error) {
      console.error('❌ Service Worker registration failed:', error)
      throw error
    }
  }

  private setupInstallPrompt(): void {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      this.deferredPrompt = e
      console.log('📱 Install prompt available')
      
      // Show install prompt after delay if not already shown
      if (!this.installPromptShown && !this.isInstalled) {
        setTimeout(() => this.showInstallPrompt(), 30000) // 30 seconds delay
      }
    })

    window.addEventListener('appinstalled', () => {
      console.log('✅ PWA installed successfully')
      this.isInstalled = true
      this.deferredPrompt = null
      toast.success('تم تثبيت التطبيق بنجاح!', {
        description: 'يمكنك الآن الوصول للتطبيق من الشاشة الرئيسية'
      })
    })
  }

  private setupUpdateHandling(): void {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('🔄 Service Worker controller changed')
      window.location.reload()
    })

    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      const { type, data } = event.data
      
      switch (type) {
        case 'SYNC_SUCCESS':
          toast.success('تمت المزامنة بنجاح', {
            description: `تم مزامنة ${data.type} بنجاح`
          })
          break
          
        case 'SYNC_FAILED':
          toast.error('فشل في المزامنة', {
            description: `فشل في مزامنة ${data.type}: ${data.error}`
          })
          break
          
        case 'CACHE_UPDATED':
          console.log('📦 Cache updated:', data)
          break
      }
    })
  }

  private handleServiceWorkerUpdate(): void {
    if (!this.registration?.waiting) return

    this.updateAvailable = true
    
    toast.info('تحديث متاح', {
      description: 'يتوفر إصدار جديد من التطبيق',
      action: {
        label: 'تحديث',
        onClick: () => this.applyUpdate()
      },
      duration: 10000
    })
  }

  private checkInstallStatus(): void {
    // Check if running in standalone mode (installed)
    this.isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                      (window.navigator as any).standalone === true

    console.log('📱 PWA install status:', this.isInstalled ? 'Installed' : 'Not installed')
  }

  private async setupPushNotifications(): Promise<void> {
    if (!('Notification' in window) || !('PushManager' in window)) {
      console.log('🔔 Push notifications not supported')
      return
    }

    // Check current permission
    const permission = Notification.permission
    console.log('🔔 Notification permission:', permission)

    if (permission === 'default') {
      // Will request permission when needed
      return
    }

    if (permission === 'granted' && this.registration) {
      try {
        const subscription = await this.registration.pushManager.getSubscription()
        if (subscription) {
          console.log('🔔 Push subscription active')
        }
      } catch (error) {
        console.error('❌ Failed to get push subscription:', error)
      }
    }
  }

  // Public methods
  async showInstallPrompt(): Promise<boolean> {
    if (!this.deferredPrompt || this.isInstalled) {
      return false
    }

    try {
      this.installPromptShown = true
      await this.deferredPrompt.prompt()
      
      const { outcome } = await this.deferredPrompt.userChoice
      console.log('📱 Install prompt outcome:', outcome)
      
      if (outcome === 'accepted') {
        toast.success('جاري تثبيت التطبيق...', {
          description: 'سيتم تثبيت التطبيق قريباً'
        })
        return true
      } else {
        toast.info('تم تجاهل التثبيت', {
          description: 'يمكنك تثبيت التطبيق لاحقاً من قائمة المتصفح'
        })
        return false
      }
    } catch (error) {
      console.error('❌ Install prompt failed:', error)
      return false
    } finally {
      this.deferredPrompt = null
    }
  }

  async applyUpdate(): Promise<void> {
    if (!this.registration?.waiting) {
      console.log('⚠️ No service worker waiting')
      return
    }

    // Tell the waiting service worker to skip waiting
    this.registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    
    toast.loading('جاري تحديث التطبيق...', {
      description: 'سيتم إعادة تحميل الصفحة تلقائياً'
    })
  }

  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('Notifications not supported')
    }

    const permission = await Notification.requestPermission()
    console.log('🔔 Notification permission result:', permission)
    
    if (permission === 'granted') {
      toast.success('تم تفعيل الإشعارات', {
        description: 'ستتلقى إشعارات الطلبات والتحديثات'
      })
      
      // Subscribe to push notifications
      await this.subscribeToPushNotifications()
    } else {
      toast.error('تم رفض الإشعارات', {
        description: 'لن تتلقى إشعارات الطلبات'
      })
    }

    return permission
  }

  private async subscribeToPushNotifications(): Promise<void> {
    if (!this.registration) {
      throw new Error('Service worker not registered')
    }

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
        )
      })

      console.log('🔔 Push subscription created:', subscription.endpoint)

      // Send subscription to server
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription)
      })

      console.log('✅ Push subscription registered with server')
    } catch (error) {
      console.error('❌ Failed to subscribe to push notifications:', error)
      throw error
    }
  }

  async registerBackgroundSync(tag: string): Promise<void> {
    if (!this.registration?.sync) {
      console.log('⚠️ Background sync not supported')
      return
    }

    try {
      await this.registration.sync.register(tag)
      console.log('✅ Background sync registered:', tag)
    } catch (error) {
      console.error('❌ Failed to register background sync:', error)
      throw error
    }
  }

  async updateCache(urls: string[]): Promise<void> {
    if (!this.registration?.active) {
      console.log('⚠️ No active service worker')
      return
    }

    this.registration.active.postMessage({
      type: 'CACHE_UPDATE',
      data: { urls }
    })
  }

  // Utility function
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  // Getters
  get canInstall(): boolean {
    return !!this.deferredPrompt && !this.isInstalled
  }

  get isAppInstalled(): boolean {
    return this.isInstalled
  }

  get hasUpdate(): boolean {
    return this.updateAvailable
  }

  get isOnline(): boolean {
    return navigator.onLine
  }
}

// React hook for PWA functionality
export function usePWA() {
  const [pwaManager] = useState(() => PWAManager.getInstance())
  const [canInstall, setCanInstall] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [hasUpdate, setHasUpdate] = useState(false)
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Update state periodically
    const updateState = () => {
      setCanInstall(pwaManager.canInstall)
      setIsInstalled(pwaManager.isAppInstalled)
      setHasUpdate(pwaManager.hasUpdate)
      setIsOnline(pwaManager.isOnline)
    }

    updateState()
    const interval = setInterval(updateState, 1000)

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      clearInterval(interval)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [pwaManager])

  return {
    pwaManager,
    canInstall,
    isInstalled,
    hasUpdate,
    isOnline,
    showInstallPrompt: () => pwaManager.showInstallPrompt(),
    applyUpdate: () => pwaManager.applyUpdate(),
    requestNotificationPermission: () => pwaManager.requestNotificationPermission(),
    registerBackgroundSync: (tag: string) => pwaManager.registerBackgroundSync(tag),
    updateCache: (urls: string[]) => pwaManager.updateCache(urls)
  }
}

export default PWAManager



// @ts-nocheck
'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { Notification } from '@/components/store/NotificationSystem'

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  removeNotification: (id: string) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearAll: () => void
  unreadCount: number
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

interface NotificationProviderProps {
  children: React.ReactNode
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false
    }
    
    setNotifications(prev => [newNotification, ...prev])
    
    // Optional: Auto-remove notifications after a certain time for non-critical ones
    if (notification.type === 'success' || notification.type === 'info') {
      setTimeout(() => {
        removeNotification(newNotification.id)
      }, 30000) // Remove after 30 seconds
    }
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }, [])

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    )
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  // Initialize with some demo notifications for testing
  useEffect(() => {
    const demoNotifications: Notification[] = [
      {
        id: 'demo-1',
        type: 'warning',
        title: 'Low Stock Alert',
        message: 'Product "Samsung Galaxy S24" has only 3 units left in stock.',
        timestamp: new Date(Date.now() - 5 * 60000),
        read: false,
        action: {
          label: 'Restock',
          onClick: () => console.log('Navigate to restock')
        }
      },
      {
        id: 'demo-2',
        type: 'success',
        title: 'Invoice Generated',
        message: 'Invoice #INV-2024-001 has been successfully generated.',
        timestamp: new Date(Date.now() - 15 * 60000),
        read: false
      }
    ]
    setNotifications(demoNotifications)
  }, [])

  // Simulate real-time notifications (in production, this would be WebSocket or Server-Sent Events)
  useEffect(() => {
    const interval = setInterval(() => {
      const randomEvents = [
        { type: 'info' as const, title: 'New Order', message: 'Order #ORD-2024-046 received.' },
        { type: 'warning' as const, title: 'Stock Alert', message: 'iPhone 15 Pro running low on stock.' },
        { type: 'success' as const, title: 'Payment Received', message: 'Payment for order #ORD-2024-045 confirmed.' }
      ]
      
      const randomEvent = randomEvents[Math.floor(Math.random() * randomEvents.length)]
      
      if (Math.random() > 0.7) { // 30% chance every 30 seconds
        addNotification(randomEvent)
      }
    }, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [addNotification])

  const value: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    unreadCount
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

// Utility hooks for common notification patterns
export const useNotificationActions = () => {
  const { addNotification } = useNotifications()

  const notifySuccess = useCallback((title: string, message: string, action?: Notification['action']) => {
    addNotification({ type: 'success', title, message, action })
  }, [addNotification])

  const notifyError = useCallback((title: string, message: string, action?: Notification['action']) => {
    addNotification({ type: 'error', title, message, action })
  }, [addNotification])

  const notifyWarning = useCallback((title: string, message: string, action?: Notification['action']) => {
    addNotification({ type: 'warning', title, message, action })
  }, [addNotification])

  const notifyInfo = useCallback((title: string, message: string, action?: Notification['action']) => {
    addNotification({ type: 'info', title, message, action })
  }, [addNotification])

  return {
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo
  }
}

export default NotificationProvider



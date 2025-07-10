// @ts-nocheck
'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
  BellIcon
} from '@heroicons/react/24/outline'
import { useNotifications } from '@/contexts/NotificationContext'

export interface Notification {
  id: string
  type: 'success' | 'warning' | 'info' | 'error'
  title: string
  message: string
  timestamp: Date
  read: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

const NotificationSystem: React.FC = () => {
  const { 
    notifications, 
    removeNotification: removeNotif, 
    markAsRead: markNotifAsRead, 
    markAllAsRead: markAllNotifAsRead, 
    unreadCount 
  } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />
      case 'warning':
        return <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />
      case 'error':
        return <XCircleIcon className="h-6 w-6 text-red-500" />
      default:
        return <InformationCircleIcon className="h-6 w-6 text-blue-500" />
    }
  }

  const getBorderColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500'
      case 'warning':
        return 'border-l-yellow-500'
      case 'error':
        return 'border-l-red-500'
      default:
        return 'border-l-blue-500'
    }
  }

  const formatTime = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Notifications ({notifications.length})
              </h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotifAsRead}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  <BellIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      layout
                      className={`px-4 py-4 hover:bg-gray-50 cursor-pointer border-l-4 ${getBorderColor(notification.type)} ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => markNotifAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium ${
                              !notification.read ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                removeNotif(notification.id)
                              }}
                              className="text-gray-400 hover:text-gray-600 p-1"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </div>
                          <p className={`text-sm mt-1 ${
                            !notification.read ? 'text-gray-700' : 'text-gray-500'
                          }`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-400">
                              {formatTime(notification.timestamp)}
                            </span>
                            {notification.action && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  notification.action!.onClick()
                                }}
                                className="text-xs font-medium text-blue-600 hover:text-blue-700 px-2 py-1 rounded bg-blue-50 hover:bg-blue-100"
                              >
                                {notification.action.label}
                              </button>
                            )}
                          </div>
                          {!notification.read && (
                            <div className="absolute right-4 top-4">
                              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                <button className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 py-1">
                  View All Notifications
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NotificationSystem



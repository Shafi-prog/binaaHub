// Real-time notifications system
import { supabase } from './supabase';
import type { Notification } from '@/types/dashboard';

export class NotificationService {
  private static instance: NotificationService;
  private listeners: Map<string, (notification: Notification) => void> = new Map();
  private subscription: any = null;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Subscribe to real-time notifications for a user
  subscribeToNotifications(userId: string, callback: (notification: Notification) => void) {
    this.listeners.set(userId, callback);

    if (!this.subscription) {
      this.subscription = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`,
          },
          (payload: any) => {
            const notification = payload.new as Notification;
            const listener = this.listeners.get(userId);
            if (listener) {
              listener(notification);
              this.showBrowserNotification(notification);
            }
          }
        )
        .subscribe();
    }
  }

  // Unsubscribe from notifications
  unsubscribeFromNotifications(userId: string) {
    this.listeners.delete(userId);

    if (this.listeners.size === 0 && this.subscription) {
      supabase.removeChannel(this.subscription);
      this.subscription = null;
    }
  }

  // Show browser notification
  private showBrowserNotification(notification: Notification) {
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/logo.png',
        tag: notification.id,
      });
    }
  }

  // Request browser notification permission
  static async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  // Create a new notification
  static async createNotification(
    notification: Omit<Notification, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Notification | null> {
    try {
<<<<<<< HEAD
      // Validate required fields
      if (!notification.user_id || !notification.title || !notification.message) {
        console.error('[createNotification] Missing required fields:', {
          user_id: notification.user_id,
          title: notification.title,
          message: notification.message
        });
        throw new Error('Missing required notification fields (user_id, title, message)');
      }
      // Map and filter fields to match DB schema
      const dbNotification: any = {
        user_id: notification.user_id,
        title: notification.title,
        message: notification.message,
        notification_type: notification.type, // DB uses notification_type
        is_read: notification.is_read ?? false,
        link: notification.action_url ?? null, // DB uses link
      };
      // Remove undefined/null fields
      Object.keys(dbNotification).forEach(
        (k) => (dbNotification[k] === undefined ? delete dbNotification[k] : null)
      );
      console.log('[createNotification] Payload to insert:', dbNotification);
      const { data, error } = await supabase
        .from('notifications')
        .insert([dbNotification])
        .select()
        .single();
      if (error) {
        console.error('[createNotification] Supabase error:', error, 'Payload:', dbNotification);
        throw error;
      }
=======
      const { data, error } = await supabase
        .from('notifications')
        .insert([notification])
        .select()
        .single();

      if (error) throw error;
>>>>>>> e0e83bc2e6a4c393009b329773f07bfad211af6b
      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId);

      return !error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  // Mark all notifications as read for a user
  static async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('is_read', false);

      return !error;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  }

  // Delete notification
  static async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('notifications').delete().eq('id', notificationId);

      return !error;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }

  // Get unread count
  static async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }
}

// Notification types for different events
export const NotificationTypes = {
  PROJECT_UPDATED: 'project_updated',
  ORDER_STATUS_CHANGED: 'order_status_changed',
  WARRANTY_EXPIRING: 'warranty_expiring',
  PAYMENT_DUE: 'payment_due',
  DELIVERY_SCHEDULED: 'delivery_scheduled',
  SYSTEM_ANNOUNCEMENT: 'system_announcement',
  PROMOTION: 'promotion',
} as const;

// Helper function to create typed notifications
export const createTypedNotification = {
  projectUpdated: (userId: string, projectName: string, status: string) =>
    NotificationService.createNotification({
      user_id: userId,
      type: NotificationTypes.PROJECT_UPDATED,
      title: 'تحديث حالة المشروع',
      message: `تم تحديث حالة مشروع "${projectName}" إلى ${status}`,
      data: { projectName, status },
      is_read: false,
      priority: 'normal',
      channel: 'app',
      sent_at: new Date().toISOString(),
    }),
  orderStatusChanged: (userId: string, orderNumber: string, status: string) =>
    NotificationService.createNotification({
      user_id: userId,
      type: NotificationTypes.ORDER_STATUS_CHANGED,
      title: 'تغيير حالة الطلب',
      message: `تم تغيير حالة الطلب رقم ${orderNumber} إلى ${status}`,
      data: { orderNumber, status },
      is_read: false,
      priority: 'normal',
      channel: 'app',
      sent_at: new Date().toISOString(),
    }),
  warrantyExpiring: (userId: string, productName: string, daysLeft: number) =>
    NotificationService.createNotification({
      user_id: userId,
      type: NotificationTypes.WARRANTY_EXPIRING,
      title: 'انتهاء صلاحية الضمان قريباً',
      message: `ضمان ${productName} سينتهي خلال ${daysLeft} يوم`,
      data: { productName, daysLeft },
      is_read: false,
      priority: 'high',
      channel: 'app',
      sent_at: new Date().toISOString(),
    }),
  paymentDue: (userId: string, amount: number, dueDate: string) =>
    NotificationService.createNotification({
      user_id: userId,
      type: NotificationTypes.PAYMENT_DUE,
      title: 'استحقاق دفعة',
      message: `لديك دفعة مستحقة بقيمة ${amount} ر.س بتاريخ ${dueDate}`,
      data: { amount, dueDate },
      is_read: false,
      priority: 'high',
      channel: 'app',
      sent_at: new Date().toISOString(),
    }),
  deliveryScheduled: (userId: string, orderNumber: string, deliveryDate: string) =>
    NotificationService.createNotification({
      user_id: userId,
      type: NotificationTypes.DELIVERY_SCHEDULED,
      title: 'جدولة التسليم',
      message: `تم جدولة تسليم الطلب رقم ${orderNumber} في ${deliveryDate}`,
      data: { orderNumber, deliveryDate },
      is_read: false,
      priority: 'normal',
      channel: 'app',
      sent_at: new Date().toISOString(),
    }),
  systemAnnouncement: (userId: string, title: string, message: string) =>
    NotificationService.createNotification({
      user_id: userId,
      type: NotificationTypes.SYSTEM_ANNOUNCEMENT,
      title,
      message,
      data: {},
      is_read: false,
      priority: 'low',
      channel: 'app',
      sent_at: new Date().toISOString(),
    }),
  promotion: (userId: string, title: string, message: string, promotionData?: any) =>
    NotificationService.createNotification({
      user_id: userId,
      type: NotificationTypes.PROMOTION,
      title,
      message,
      data: promotionData || {},
      is_read: false,
      priority: 'low',
      channel: 'app',
      sent_at: new Date().toISOString(),
    }),
};

// React hook for notifications
import { useState, useEffect } from 'react';
import { useUser } from '@supabase/auth-helpers-react';

export function useNotifications() {
  const user = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadNotifications();
      setupRealtimeSubscription();

      // Request notification permission
      NotificationService.requestNotificationPermission();
    }

    return () => {
      if (user?.id) {
        NotificationService.getInstance().unsubscribeFromNotifications(user.id);
      }
    };
  }, [user]);

  const loadNotifications = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setNotifications(data || []);

      const unreadCount = await NotificationService.getUnreadCount(user.id);
      setUnreadCount(unreadCount);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!user?.id) return;

    NotificationService.getInstance().subscribeToNotifications(user.id, (newNotification) => {
      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });
  };

  const markAsRead = async (notificationId: string) => {
    const success = await NotificationService.markAsRead(notificationId);
    if (success) {
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId
            ? { ...notif, is_read: true, read_at: new Date().toISOString() }
            : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    if (!user?.id) return;

    const success = await NotificationService.markAllAsRead(user.id);
    if (success) {
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, is_read: true, read_at: new Date().toISOString() }))
      );
      setUnreadCount(0);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    const success = await NotificationService.deleteNotification(notificationId);
    if (success) {
      setNotifications((prev) => prev.filter((notif) => notif.id !== notificationId));
      // Update unread count if deleted notification was unread
      const deletedNotif = notifications.find((n) => n.id === notificationId);
      if (deletedNotif && !deletedNotif.is_read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh: loadNotifications,
  };
}

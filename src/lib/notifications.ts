// Simplified notification service compatible with Odoo integration
export interface SimpleNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  created_at: string;
  user_id?: string;
}

export class NotificationService {
  private static instance: NotificationService;
  private listeners: Map<string, (notification: SimpleNotification) => void> = new Map();
  private notifications: SimpleNotification[] = [];

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Subscribe to notifications for a user (simplified version)
  subscribeToNotifications(userId: string, callback: (notification: SimpleNotification) => void) {
    this.listeners.set(userId, callback);
    // In a real implementation, this could connect to Odoo or another notification source
  }

  // Unsubscribe from notifications
  unsubscribeFromNotifications(userId: string) {
    this.listeners.delete(userId);
  }

  // Get unread count - simplified version
  static async getUnreadCount(userId: string): Promise<number> {
    try {
      // For now, return 0 to prevent errors
      // In the future, this could integrate with Odoo notifications
      return 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  // Get notifications for user
  static async getNotifications(userId: string, limit: number = 50): Promise<SimpleNotification[]> {
    try {
      // Return empty array for now
      // In the future, this could fetch from Odoo or local storage
      return [];
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId: string): Promise<void> {
    try {
      // For now, just log the action
      console.log('Marking notification as read:', notificationId);
      // In the future, this could update Odoo or local storage
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  // Mark all notifications as read for a user
  static async markAllAsRead(userId: string): Promise<void> {
    try {
      // For now, just log the action
      console.log('Marking all notifications as read for user:', userId);
      // In the future, this could update Odoo or local storage
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }

  // Delete a notification
  static async deleteNotification(notificationId: string): Promise<void> {
    try {
      // For now, just log the action
      console.log('Deleting notification:', notificationId);
      // In the future, this could delete from Odoo or local storage
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }

  // Create a new notification (simplified version)
  static async createNotification(notification: Omit<SimpleNotification, 'id' | 'created_at'>): Promise<SimpleNotification | null> {
    try {
      const newNotification: SimpleNotification = {
        ...notification,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
      };

      // In the future, this could save to Odoo or local storage
      console.log('Creating notification:', newNotification);
      
      return newNotification;
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  }

  // Request browser notification permission
  static async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notifications');
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

  // Show browser notification
  private showBrowserNotification(notification: SimpleNotification) {
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id,
      });
    }
  }
}

// Notification types for consistent usage across the application
export const NotificationTypes = {
  ERROR: 'error',
  SUCCESS: 'success',
  WARNING: 'warning',
  INFO: 'info',
  PROJECT_UPDATED: 'project_updated',
} as const;

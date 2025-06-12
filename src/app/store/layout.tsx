'use client';

import { NotificationProvider } from '@/contexts/NotificationContext';

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationProvider>
      {children}
    </NotificationProvider>
  );
}

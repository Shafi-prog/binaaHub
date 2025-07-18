"use client"

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/core/shared/components/ui/button';
import { 
  User,
  BarChart3,
  Package,
  Settings,
  Home,
  Search,
  Heart,
  Menu,
  X,
  Calculator,
  CreditCard,
  Shield,
  FileText,
  MessageSquare,
  Building2,
  LogOut
} from 'lucide-react';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userNavItems = [
    { href: '/user/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/user/projects', label: 'My Projects', icon: Package },
    { href: '/user/profile', label: 'Profile', icon: User },
    { href: '/user/chat', label: 'Messages', icon: MessageSquare },
    { href: '/user/stores-browse', label: 'Browse Stores', icon: Building2 },
    { href: '/user/building-advice', label: 'Building Advice', icon: FileText },
    { href: '/user/payment', label: 'Payments', icon: CreditCard },
    { href: '/user/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content only, sidebar and mobile header removed */}
      <div>
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

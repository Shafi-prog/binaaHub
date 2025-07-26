'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import { supabaseDataService } from '@/core/shared/services/supabase-data-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Badge } from '@/core/shared/components/ui/badge';
import { ErrorBoundary } from '@/core/shared/components/ErrorBoundary';
import { 
  Calendar,
  Clock,
  Users,
  Truck,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Phone
} from 'lucide-react';

// Type definition for booking
interface Booking {
  id: number;
  clientName: string;
  service: string;
  date: string;
  time: string;
  status: string;
  location: string;
  phone: string;
  amount: number;
}

export const dynamic = 'force-dynamic';

export default function BookingsManagement() {
  return (
    <ErrorBoundary>
      <BookingsContent />
    </ErrorBoundary>
  );
}

function BookingsContent() {
  const [isClient, setIsClient] = useState(false);
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      loadBookings();
    }
  }, [isClient]);

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      // Simulate loading bookings data
      const mockBookings = [
        {
          id: 1,
          clientName: 'أحمد محمد',
          service: 'توريد خرسانة',
          date: '2025-07-28',
          time: '08:00',
          status: 'confirmed',
          location: 'الرياض، حي النرجس',
          phone: '+966501234567',
          amount: 15000
        },
        {
          id: 2,
          clientName: 'سارة العلي',
          service: 'تأجير معدات',
          date: '2025-07-29',
          time: '10:00',
          status: 'pending',
          location: 'جدة، حي الصفا',
          phone: '+966501234568',
          amount: 8500
        },
        {
          id: 3,
          clientName: 'محمد السعد',
          service: 'مقاولات',
          date: '2025-07-30',
          time: '14:00',
          status: 'completed',
          location: 'الدمام، حي الفيصلية',
          phone: '+966501234569',
          amount: 25000
        }
      ];
      setBookings(mockBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'مؤكد';
      case 'pending': return 'معلق';
      case 'completed': return 'مكتمل';
      default: return 'غير محدد';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  إدارة الحجوزات
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  نظام موحد لإدارة جميع حجوزاتك وطلبات العملاء
                </p>
              </div>
              <div className="flex items-center space-x-4 space-x-reverse">
                <Badge className="bg-blue-100 text-blue-800">
                  {bookings.filter(b => b.status === 'pending').length} طلب جديد
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">إجمالي الحجوزات</p>
                  <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">معلقة</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {bookings.filter(b => b.status === 'pending').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">مؤكدة</p>
                  <p className="text-2xl font-bold text-green-600">
                    {bookings.filter(b => b.status === 'confirmed').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">الإيرادات</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {bookings.reduce((sum, b) => sum + b.amount, 0).toLocaleString()} ر.س
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings List */}
        <Card>
          <CardHeader>
            <CardTitle>الحجوزات الحديثة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{booking.clientName}</h4>
                      <p className="text-sm text-gray-600">{booking.service}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Calendar className="w-3 h-3 ml-1" />
                        {booking.date} - {booking.time}
                        <MapPin className="w-3 h-3 mr-2 ml-1" />
                        {booking.location}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">{booking.amount.toLocaleString()} ر.س</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Phone className="w-3 h-3 ml-1" />
                        {booking.phone}
                      </div>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      {getStatusText(booking.status)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

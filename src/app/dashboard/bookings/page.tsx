'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  Package,
  Truck,
  Settings,
  AlertCircle,
  CheckCircle2,
  Plus,
  Filter,
  Search,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Building,
  Wrench
} from 'lucide-react';

type BookingType = 'equipment' | 'concrete' | 'waste' | 'service' | 'consultation';
type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
  bookingId?: string;
}

interface Booking {
  id: string;
  type: BookingType;
  title: string;
  description: string;
  date: Date;
  timeSlot: string;
  duration: number; // في الساعات
  status: BookingStatus;
  customer: {
    name: string;
    phone: string;
    email: string;
    company?: string;
  };
  location: {
    address: string;
    city: string;
    coordinates?: { lat: number; lng: number; };
  };
  details: {
    equipmentType?: string;
    concreteGrade?: string;
    wasteType?: string;
    serviceType?: string;
    quantity?: number;
    specialRequirements?: string;
  };
  assigned?: {
    providerId: string;
    providerName: string;
    contactInfo: string;
  };
  pricing?: {
    basePrice: number;
    additionalCosts: number;
    totalPrice: number;
    paymentStatus: 'pending' | 'paid' | 'partial';
  };
  createdAt: Date;
  updatedAt: Date;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  bookings: Booking[];
  availableSlots: number;
}

export default function UnifiedBookingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    provider: 'all',
    search: ''
  });

  // Load bookings data
  useEffect(() => {
    loadBookings();
  }, []);

  // Apply filters
  useEffect(() => {
    applyFilters();
  }, [bookings, filters]);

  const loadBookings = async () => {
    try {
      // Fetch real bookings from Supabase
      const { createClientComponentClient } = await import('@supabase/auth-helpers-nextjs');
      const supabase = createClientComponentClient();
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('date', { ascending: true });
      if (error) throw error;
      // Optionally, map/parse data to Booking[] if needed
      setBookings(
        (data || []).map((b: any) => ({
          ...b,
          date: new Date(b.date),
          createdAt: new Date(b.createdAt),
          updatedAt: new Date(b.updatedAt)
        }))
      );
    } catch (error) {
      console.error('Error loading bookings:', error);
      setBookings([]);
    }
  };

  const applyFilters = () => {
    let filtered = bookings;

    if (filters.type !== 'all') {
      filtered = filtered.filter(booking => booking.type === filters.type);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(booking => booking.status === filters.status);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(booking => 
        booking.title.toLowerCase().includes(searchLower) ||
        booking.customer.name.toLowerCase().includes(searchLower) ||
        booking.location.address.toLowerCase().includes(searchLower)
      );
    }

    setFilteredBookings(filtered);
  };

  // Calendar navigation
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Generate calendar days
  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: CalendarDay[] = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dayBookings = filteredBookings.filter(booking => 
        booking.date.toDateString() === date.toDateString()
      );
      
      days.push({
        date,
        isCurrentMonth: date.getMonth() === month,
        isToday: date.toDateString() === today.toDateString(),
        bookings: dayBookings,
        availableSlots: 8 - dayBookings.length // assuming 8 slots per day
      });
    }
    
    return days;
  };

  // Get time slots for a specific date
  const getTimeSlots = (date: Date): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const dayBookings = bookings.filter(booking => 
      booking.date.toDateString() === date.toDateString()
    );

    // Generate hourly slots from 8 AM to 6 PM
    for (let hour = 8; hour < 18; hour++) {
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
      
      const booking = dayBookings.find(b => b.timeSlot === startTime);
      
      slots.push({
        start: startTime,
        end: endTime,
        available: !booking,
        bookingId: booking?.id
      });
    }

    return slots;
  };

  // Booking type configuration
  const bookingTypes = [
    { value: 'equipment', label: 'تأجير معدات', icon: Wrench, color: 'bg-blue-100 text-blue-800' },
    { value: 'concrete', label: 'خرسانة جاهزة', icon: Package, color: 'bg-gray-100 text-gray-800' },
    { value: 'waste', label: 'إدارة نفايات', icon: Truck, color: 'bg-green-100 text-green-800' },
    { value: 'service', label: 'خدمات فنية', icon: Settings, color: 'bg-purple-100 text-purple-800' },
    { value: 'consultation', label: 'استشارات', icon: Building, color: 'bg-yellow-100 text-yellow-800' }
  ];

  const getBookingTypeConfig = (type: BookingType) => {
    return bookingTypes.find(t => t.value === type) || bookingTypes[0];
  };

  // Status configuration
  const statusConfig = {
    'pending': { label: 'في الانتظار', color: 'bg-yellow-100 text-yellow-800' },
    'confirmed': { label: 'مؤكد', color: 'bg-blue-100 text-blue-800' },
    'in_progress': { label: 'قيد التنفيذ', color: 'bg-purple-100 text-purple-800' },
    'completed': { label: 'مكتمل', color: 'bg-green-100 text-green-800' },
    'cancelled': { label: 'ملغي', color: 'bg-red-100 text-red-800' }
  };

  // Format date helpers
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ar-SA', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('ar-SA', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const calendarDays = generateCalendarDays();
  const selectedDateBookings = selectedDate 
    ? filteredBookings.filter(booking => booking.date.toDateString() === selectedDate.toDateString())
    : [];

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              تقويم الحجوزات الموحد
            </h1>
            <p className="text-gray-600">
              إدارة جميع الحجوزات والمواعيد في مكان واحد
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setShowBookingForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              حجز جديد
            </Button>
            <Button variant="outline" onClick={goToToday}>
              <Calendar className="w-4 h-4 mr-2" />
              اليوم
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-500" />
                <Input
                  placeholder="البحث في الحجوزات..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-64"
                />
              </div>
              
              <Select
                value={filters.type}
                onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="نوع الخدمة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الخدمات</SelectItem>
                  {bookingTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.status}
                onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  تصدير
                </Button>
                <Button variant="outline" size="sm" onClick={loadBookings}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  تحديث
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {formatMonthYear(currentDate)}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth('prev')}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth('next')}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'].map(day => (
                    <div key={day} className="p-2 text-center font-semibold text-gray-600 text-sm">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => (
                    <div
                      key={index}
                      className={`min-h-[100px] p-2 border rounded cursor-pointer transition-colors ${
                        !day.isCurrentMonth 
                          ? 'bg-gray-50 text-gray-400' 
                          : day.isToday
                          ? 'bg-blue-50 border-blue-200'
                          : selectedDate?.toDateString() === day.date.toDateString()
                          ? 'bg-blue-100 border-blue-300'
                          : 'bg-white hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedDate(day.date)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-sm font-medium ${
                          day.isToday ? 'text-blue-600' : ''
                        }`}>
                          {day.date.getDate()}
                        </span>
                        {day.bookings.length > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {day.bookings.length}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        {day.bookings.slice(0, 3).map(booking => {
                          const typeConfig = getBookingTypeConfig(booking.type);
                          return (
                            <div
                              key={booking.id}
                              className={`text-xs p-1 rounded ${typeConfig.color}`}
                              title={booking.title}
                            >
                              {booking.timeSlot} - {booking.customer.name}
                            </div>
                          );
                        })}
                        {day.bookings.length > 3 && (
                          <div className="text-xs text-gray-500">
                            +{day.bookings.length - 3} أخرى
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Date Info */}
            {selectedDate && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {formatDate(selectedDate)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedDateBookings.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>لا توجد حجوزات في هذا اليوم</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3"
                        onClick={() => setShowBookingForm(true)}
                      >
                        إضافة حجز
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedDateBookings.map(booking => {
                        const typeConfig = getBookingTypeConfig(booking.type);
                        const statusColor = statusConfig[booking.status]?.color || 'bg-gray-100 text-gray-800';
                        
                        return (
                          <div
                            key={booking.id}
                            className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2">
                                <typeConfig.icon className="w-4 h-4" />
                                <span className="font-medium text-sm">{booking.title}</span>
                              </div>
                              <Badge className={statusColor}>
                                {statusConfig[booking.status]?.label}
                              </Badge>
                            </div>
                            
                            <div className="text-xs text-gray-600 space-y-1">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{booking.timeSlot}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                <span>{booking.customer.name}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span>{booking.location.city}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">إحصائيات سريعة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">إجمالي الحجوزات</span>
                    <span className="font-semibold">{filteredBookings.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">في الانتظار</span>
                    <span className="font-semibold text-yellow-600">
                      {filteredBookings.filter(b => b.status === 'pending').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">مؤكدة</span>
                    <span className="font-semibold text-blue-600">
                      {filteredBookings.filter(b => b.status === 'confirmed').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">مكتملة</span>
                    <span className="font-semibold text-green-600">
                      {filteredBookings.filter(b => b.status === 'completed').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">النشاط الأخير</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bookings
                    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
                    .slice(0, 5)
                    .map(booking => (
                      <div key={booking.id} className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">{booking.title}</p>
                          <p className="text-gray-500 text-xs">
                            {booking.updatedAt.toLocaleDateString('ar-SA')}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Booking Details Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedBooking.title}</CardTitle>
                    <p className="text-gray-600">رقم الحجز: {selectedBooking.id}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedBooking(null)}
                  >
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="details">التفاصيل</TabsTrigger>
                    <TabsTrigger value="customer">العميل</TabsTrigger>
                    <TabsTrigger value="history">السجل</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>نوع الخدمة</Label>
                        <p className="text-sm">
                          {getBookingTypeConfig(selectedBooking.type).label}
                        </p>
                      </div>
                      <div>
                        <Label>الحالة</Label>
                        <Badge className={statusConfig[selectedBooking.status]?.color}>
                          {statusConfig[selectedBooking.status]?.label}
                        </Badge>
                      </div>
                      <div>
                        <Label>التاريخ والوقت</Label>
                        <p className="text-sm">
                          {selectedBooking.date.toLocaleDateString('ar-SA')} - {selectedBooking.timeSlot}
                        </p>
                      </div>
                      <div>
                        <Label>المدة</Label>
                        <p className="text-sm">{selectedBooking.duration} ساعات</p>
                      </div>
                    </div>
                    
                    <div>
                      <Label>الموقع</Label>
                      <p className="text-sm">{selectedBooking.location.address}</p>
                    </div>
                    
                    <div>
                      <Label>الوصف</Label>
                      <p className="text-sm">{selectedBooking.description}</p>
                    </div>
                    
                    {selectedBooking.pricing && (
                      <div>
                        <Label>التكلفة</Label>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span>السعر الأساسي:</span>
                            <span>{selectedBooking.pricing.basePrice.toLocaleString()} ريال</span>
                          </div>
                          <div className="flex justify-between">
                            <span>تكاليف إضافية:</span>
                            <span>{selectedBooking.pricing.additionalCosts.toLocaleString()} ريال</span>
                          </div>
                          <div className="flex justify-between font-semibold">
                            <span>المجموع:</span>
                            <span>{selectedBooking.pricing.totalPrice.toLocaleString()} ريال</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="customer" className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label>اسم العميل</Label>
                        <p className="text-sm">{selectedBooking.customer.name}</p>
                      </div>
                      <div>
                        <Label>رقم الهاتف</Label>
                        <p className="text-sm">{selectedBooking.customer.phone}</p>
                      </div>
                      <div>
                        <Label>البريد الإلكتروني</Label>
                        <p className="text-sm">{selectedBooking.customer.email}</p>
                      </div>
                      {selectedBooking.customer.company && (
                        <div>
                          <Label>الشركة</Label>
                          <p className="text-sm">{selectedBooking.customer.company}</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="history" className="space-y-4">
                    <div className="space-y-3">
                      <div className="border-r-2 border-blue-500 pr-3">
                        <p className="text-sm font-medium">تم إنشاء الحجز</p>
                        <p className="text-xs text-gray-500">
                          {selectedBooking.createdAt.toLocaleString('ar-SA')}
                        </p>
                      </div>
                      <div className="border-r-2 border-yellow-500 pr-3">
                        <p className="text-sm font-medium">تم تحديث الحالة إلى: {statusConfig[selectedBooking.status]?.label}</p>
                        <p className="text-xs text-gray-500">
                          {selectedBooking.updatedAt.toLocaleString('ar-SA')}
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="flex gap-2 mt-6">
                  <Button size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    تعديل
                  </Button>
                  <Button variant="outline" size="sm">
                    <Phone className="w-4 h-4 mr-2" />
                    اتصال
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="w-4 h-4 mr-2" />
                    إرسال رسالة
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

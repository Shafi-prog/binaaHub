// API route for service provider dashboard data
import { NextRequest, NextResponse } from 'next/server';
import { ServiceProviderDashboardData } from '@/core/shared/types/platform-types';

export async function GET(request: NextRequest, { params }: { params: { providerId: string } }) {
  try {
    const providerId = params.providerId;

    // Fetch service bookings for this provider
    const bookingsRes = await fetch(`${request.nextUrl.origin}/api/platform/service-bookings?serviceProviderId=${providerId}`);
    const bookings = (await bookingsRes.json()).data || [];

    // Calculate analytics
    const completedServices = bookings.filter(b => b.status === 'completed').length;
    const upcomingBookings = bookings.filter(b => 
      new Date(b.scheduledDate) > new Date() && b.status === 'confirmed'
    ).length;

    const averageRating = bookings
      .filter(b => b.userRating)
      .reduce((sum, b) => sum + (b.userRating || 0), 0) / 
      bookings.filter(b => b.userRating).length || 0;

    const currentMonth = new Date().getMonth();
    const monthlyRevenue = bookings
      .filter(b => 
        b.status === 'completed' && 
        new Date(b.completedAt || b.createdAt).getMonth() === currentMonth
      )
      .reduce((sum, b) => sum + (b.serviceDetails.estimatedCost || 0), 0);

    const dashboardData: ServiceProviderDashboardData = {
      bookings,
      analytics: {
        totalBookings: bookings.length,
        completedServices,
        upcomingBookings,
        averageRating: Math.round(averageRating * 10) / 10,
        monthlyRevenue
      }
    };

    return NextResponse.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch service provider dashboard data'
    }, { status: 500 });
  }
}

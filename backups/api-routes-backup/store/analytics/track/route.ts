// @ts-nocheck
import { NextRequest, NextResponse } from "next/server"
import { TrackAnalyticsEventDTO } from "@medusajs/types"

export async function POST(request: NextRequest) {
  try {
    const data: TrackAnalyticsEventDTO = await request.json()

    // TODO: Integrate with the Analytics Service once the module is properly configured
    // For now, log the event (you can replace this with actual analytics service)
    console.log('Analytics Event Tracked:', data)

    // Here you would normally call:
    // const analyticsService = container.resolve("analyticsService")
    // await analyticsService.track(data)

    return NextResponse.json({ 
      success: true, 
      message: 'Event tracked successfully',
      event: data.event 
    })
  } catch (error) {
    console.error('Error tracking analytics event:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to track event' 
      },
      { status: 500 }
    )
  }
}



import { useState } from "react"
import { Container, Heading } from "@medusajs/ui"
import { DateRangePicker } from "../../../components/common/date-range-picker"
import { AnalyticsDashboard } from "../../../components/analytics/analytics-dashboard"
import { AnalyticsMetrics } from "../../../components/analytics/analytics-metrics"
import { SalesChart } from "../../../components/analytics/sales-chart"
import { CustomerAnalytics } from "../../../components/analytics/customer-analytics"
import { ProductAnalytics } from "../../../components/analytics/product-analytics"
import { VendorAnalytics } from "../../../components/analytics/vendor-analytics"
import { RealTimeMetrics } from "../../../components/analytics/real-time-metrics"

export const AnalyticsPage = () => {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date(),
  })

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-x-2">
          <Heading level="h1">Analytics Dashboard</Heading>
        </div>
        <div className="flex items-center gap-x-2">
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
          />
        </div>
      </div>

      <div className="flex flex-col gap-y-4 p-6">
        {/* Real-time metrics */}
        <RealTimeMetrics />
        
        {/* Main dashboard overview */}
        <AnalyticsDashboard dateRange={dateRange} />
        
        {/* Key metrics cards */}
        <AnalyticsMetrics dateRange={dateRange} />
        
        {/* Sales chart */}
        <SalesChart dateRange={dateRange} />
        
        {/* Customer analytics */}
        <CustomerAnalytics dateRange={dateRange} />
        
        {/* Product analytics */}
        <ProductAnalytics dateRange={dateRange} />
        
        {/* Vendor analytics (marketplace) */}
        <VendorAnalytics dateRange={dateRange} />
      </div>
    </Container>
  )
}

export default AnalyticsPage

// @ts-nocheck
'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/shared/components/ui/card'
import { Button } from '@/core/shared/components/ui/button'
import { Badge } from '@/core/shared/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/shared/components/ui/tabs'
import { Progress } from '@/core/shared/components/ui/progress'
import { 

  MapPin, 
  TrendingUp, 
  Users, 
  Store, 
  DollarSign, 
  Globe,
  Settings,
  Activity,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

// Force dynamic rendering to avoid SSG auth context issues
import { GCCMarketManager } from '@/core/shared/services/markets/gcc-market-manager'
import { UAEMarketManager } from '@/core/shared/services/markets/uae-market-manager'
import { KuwaitMarketManager } from '@/core/shared/services/markets/kuwait-market-manager'
import { QatarMarketManager } from '@/core/shared/services/markets/qatar-market-manager'


export const dynamic = 'force-dynamic'
interface MarketData {
  country: string
  code: string
  currency: string
  vendors: number
  customers: number
  revenue: number
  growth: number
  status: 'active' | 'pending' | 'planned'
  features: string[]
  compliance: number
}

export default function GCCMarketsPage() {
  const [marketData, setMarketData] = useState<MarketData[]>([])
  const [selectedMarket, setSelectedMarket] = useState<string>('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeMarkets = async () => {
      try {
        const gccManager = new GCCMarketManager()
        const uaeManager = new UAEMarketManager()
        const kuwaitManager = new KuwaitMarketManager()
        const qatarManager = new QatarMarketManager()

        // Initialize market data
        const markets: MarketData[] = [
          {
            country: 'Saudi Arabia',
            code: 'SA',
            currency: 'SAR',
            vendors: 8500,
            customers: 45000,
            revenue: 15750000,
            growth: 28.5,
            status: 'active',
            features: ['Complete ERP', 'ZATCA Compliance', 'Advanced POS', 'Local Banking'],
            compliance: 100
          },
          {
            country: 'United Arab Emirates',
            code: 'AE',
            currency: 'AED',
            vendors: 2100,
            customers: 12500,
            revenue: 4200000,
            growth: 45.2,
            status: 'active',
            features: ['Emirates NBD', 'ADCB Integration', 'Dubai Focus', 'Free Zone Support'],
            compliance: 85
          },
          {
            country: 'Kuwait',
            code: 'KW',
            currency: 'KWD',
            vendors: 850,
            customers: 5200,
            revenue: 1800000,
            growth: 32.1,
            status: 'active',
            features: ['KWD Support', 'Oil Sector Focus', 'Local Regulations', 'Banking Integration'],
            compliance: 75
          },
          {
            country: 'Qatar',
            code: 'QA',
            currency: 'QAR',
            vendors: 650,
            customers: 4100,
            revenue: 1950000,
            growth: 38.7,
            status: 'active',
            features: ['QNB Integration', 'Construction Focus', 'Luxury Goods', 'FIFA Legacy'],
            compliance: 80
          }
        ]

        setMarketData(markets)
        setLoading(false)
      } catch (error) {
        console.error('Failed to initialize GCC markets:', error)
        setLoading(false)
      }
    }

    initializeMarkets()
  }, [])

  const totalVendors = marketData.reduce((sum, market) => sum + market.vendors, 0)
  const totalCustomers = marketData.reduce((sum, market) => sum + market.customers, 0)
  const totalRevenue = marketData.reduce((sum, market) => sum + market.revenue, 0)
  const averageGrowth = marketData.reduce((sum, market) => sum + market.growth, 0) / marketData.length

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'SAR' ? 'SAR' : currency === 'AED' ? 'AED' : currency === 'KWD' ? 'KWD' : 'QAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading GCC Markets Dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">GCC Markets Management</h1>
          <p className="text-muted-foreground">Monitor and manage regional expansion across the Gulf</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => alert('Button clicked')}>
            <Settings className="h-4 w-4 mr-2" />
            Market Settings
          </Button>
          <Button onClick={() => alert('Button clicked')}>
            <Globe className="h-4 w-4 mr-2" />
            Expand Markets
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVendors.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across 4 GCC markets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Regional customer base</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalRevenue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">Combined GCC revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageGrowth.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Month-over-month growth</p>
          </CardContent>
        </Card>
      </div>

      {/* Market Details */}
      <Tabs value={selectedMarket} onValueChange={setSelectedMarket}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="SA">🇸🇦 Saudi Arabia</TabsTrigger>
          <TabsTrigger value="AE">🇦🇪 UAE</TabsTrigger>
          <TabsTrigger value="KW">🇰🇼 Kuwait</TabsTrigger>
          <TabsTrigger value="QA">🇶🇦 Qatar</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {marketData.map((market) => (
              <Card key={market.code}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        {market.country}
                      </CardTitle>
                      <CardDescription>
                        Market Code: {market.code} | Currency: {market.currency}
                      </CardDescription>
                    </div>
                    <Badge variant={market.status === 'active' ? 'default' : 'secondary'}>
                      {market.status === 'active' ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <AlertCircle className="h-3 w-3 mr-1" />
                      )}
                      {market.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Vendors</p>
                      <p className="font-semibold">{market.vendors.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Customers</p>
                      <p className="font-semibold">{market.customers.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Growth</p>
                      <p className="font-semibold text-green-600">+{market.growth}%</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Compliance Score</span>
                      <span>{market.compliance}%</span>
                    </div>
                    <Progress value={market.compliance} className="h-2" />
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Key Features</p>
                    <div className="flex flex-wrap gap-1">
                      {market.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <p className="text-sm text-muted-foreground">
                      Revenue: {formatCurrency(market.revenue, market.currency)}
                    </p>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedMarket(market.code)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Individual Market Tabs */}
        {marketData.map((market) => (
          <TabsContent key={market.code} value={market.code} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{market.country} Market Dashboard</CardTitle>
                <CardDescription>
                  Detailed analytics and management for {market.country}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Market Performance</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Active Vendors:</span>
                        <span className="font-medium">{market.vendors.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Total Customers:</span>
                        <span className="font-medium">{market.customers.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Monthly Revenue:</span>
                        <span className="font-medium">{formatCurrency(market.revenue, market.currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Growth Rate:</span>
                        <span className="font-medium text-green-600">+{market.growth}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Compliance & Regulations</h3>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Overall Compliance</span>
                        <span>{market.compliance}%</span>
                      </div>
                      <Progress value={market.compliance} className="h-2" />
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Payment Integration</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Tax Compliance</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                        <span>Documentation Pending</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Market Features</h3>
                    <div className="space-y-2">
                      {market.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full mt-4" onClick={() => alert('Button clicked')}>
                      Manage {market.country} Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}






// @ts-nocheck
'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"

// Force dynamic rendering to avoid static generation issues with QueryClient
export const dynamic = 'force-dynamic'

export default function StoreSettings() {
  const [store, setStore] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Simulate loading store data
    const loadStoreData = async () => {
      try {
        // Mock store data
        const mockStoreData = {
          id: "default",
          name: "Binna Store",
          default_currency_code: "USD",
          default_sales_channel_id: "default_channel",
          default_region_id: "default_region",
          created_at: new Date().toISOString(),
        }
        
        setStore(mockStoreData)
        setIsLoading(false)
      } catch (err) {
        setError(err)
        setIsLoading(false)
      }
    }

    loadStoreData()
  }, [])

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">
          Error loading store settings: {error.message}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Store Settings</h1>
          <p className="text-muted-foreground">
            Manage your store configuration and preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              General Settings
            </CardTitle>
            <CardDescription>
              Basic store information and configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Store Name</label>
              <p className="text-lg">{store?.name || 'Binna Store'}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Default Currency</label>
              <p className="text-lg">{store?.default_currency_code || 'USD'}</p>
            </div>
            <Button className="w-full">Edit Store Settings</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Store Status</CardTitle>
            <CardDescription>
              Current store operational status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Status</label>
              <p className="text-lg text-green-600">Active</p>
            </div>
            <div>
              <label className="text-sm font-medium">Created</label>
              <p className="text-lg">{store?.created_at ? new Date(store.created_at).toLocaleDateString() : 'N/A'}</p>
            </div>
            <Button variant="outline" className="w-full">View Store Analytics</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



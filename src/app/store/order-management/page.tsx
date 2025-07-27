'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function OrderManagementPage() {
  const [fulfillments] = useState([])
  const [shipments] = useState([])
  const [returns] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTab, setSelectedTab] = useState('fulfillments')

  const filteredFulfillments = fulfillments.filter((f: any) =>
    (f?.fulfillment_number || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (f?.order_number || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredShipments = shipments.filter((s: any) =>
    (s?.shipment_number || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s?.order_number || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s?.tracking_number || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredReturns = returns.filter((r: any) =>
    (r?.return_number || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r?.order_number || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r?.customer_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: 'secondary',
      in_progress: 'secondary',
      completed: 'default',
      shipped: 'default',
      delivered: 'default',
      returned: 'destructive',
      cancelled: 'destructive'
    }
    return statusColors[status] || 'outline'
  }

  const tabs = [
    { id: 'fulfillments', label: 'Fulfillments' },
    { id: 'shipments', label: 'Shipments' },
    { id: 'returns', label: 'Returns & Exchanges' }
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Order Management</h1>
        <Button>New Order</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Fulfillments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fulfillments.filter((f: any) => ['in_progress', 'partially_fulfilled'].includes(f?.status || '')).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {shipments.filter((s: any) => ['shipped', 'in_transit', 'out_for_delivery'].includes(s?.status || '')).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Returns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {returns.filter((r: any) => ['requested', 'approved'].includes(r?.status || '')).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex space-x-1 mb-4">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={selectedTab === tab.id ? 'default' : 'ghost'}
            onClick={() => setSelectedTab(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <div className="mb-4">
        <Input
          placeholder="Search orders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsContent value="fulfillments">
          <Card>
            <CardHeader>
              <CardTitle>Order Fulfillments</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fulfillment #</TableHead>
                    <TableHead>Order #</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Expected Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFulfillments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">No fulfillments found</TableCell>
                    </TableRow>
                  ) : (
                    filteredFulfillments.map((fulfillment: any) => {
                      const statusBadge = getStatusBadge(fulfillment?.status || '')
                      const progressPercentage = Math.round(((fulfillment?.fulfilled_quantity || 0) / (fulfillment?.total_quantity || 1)) * 100)

                      return (
                        <TableRow key={fulfillment?.id || Math.random()}>
                          <TableCell>
                            {fulfillment?.fulfillment_number || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {fulfillment?.order_number || 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusBadge as any}>
                              {fulfillment?.status || 'unknown'}
                            </Badge>
                          </TableCell>
                          <TableCell>{fulfillment?.warehouse || 'N/A'}</TableCell>
                          <TableCell>{fulfillment?.assigned_to || 'Unassigned'}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm">
                                {fulfillment?.fulfilled_quantity || 0}/{fulfillment?.total_quantity || 0}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {fulfillment?.expected_date ? new Date(fulfillment.expected_date).toLocaleDateString() : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">Update</Button>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipments">
          <Card>
            <CardHeader>
              <CardTitle>Shipments</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Shipment #</TableHead>
                    <TableHead>Order #</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Carrier</TableHead>
                    <TableHead>Tracking #</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Shipped Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredShipments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">No shipments found</TableCell>
                    </TableRow>
                  ) : (
                    filteredShipments.map((shipment: any) => {
                      const statusBadge = getStatusBadge(shipment?.status || '')

                      return (
                        <TableRow key={shipment?.id || Math.random()}>
                          <TableCell>
                            {shipment?.shipment_number || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {shipment?.order_number || 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusBadge as any}>
                              {shipment?.status || 'unknown'}
                            </Badge>
                          </TableCell>
                          <TableCell>{shipment?.carrier || 'N/A'}</TableCell>
                          <TableCell>
                            {shipment?.tracking_number || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {shipment?.shipping_address || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {shipment?.shipped_at ?
                              new Date(shipment.shipped_at).toLocaleDateString() :
                              'Not shipped'
                            }
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">Track</Button>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="returns">
          <Card>
            <CardHeader>
              <CardTitle>Returns & Exchanges</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Return #</TableHead>
                    <TableHead>Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Requested Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReturns.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">No returns found</TableCell>
                    </TableRow>
                  ) : (
                    filteredReturns.map((returnItem: any) => {
                      const statusBadge = getStatusBadge(returnItem?.status || '')

                      return (
                        <TableRow key={returnItem?.id || Math.random()}>
                          <TableCell>
                            {returnItem?.return_number || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {returnItem?.order_number || 'N/A'}
                          </TableCell>
                          <TableCell>{returnItem?.customer_name || 'N/A'}</TableCell>
                          <TableCell>
                            {(returnItem?.reason || 'unknown').replace('_', ' ')}
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusBadge as any}>
                              {returnItem?.status || 'unknown'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            ${(returnItem?.return_amount || 0).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            {returnItem?.requested_at ? new Date(returnItem.requested_at).toLocaleDateString() : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">Process</Button>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
'use client'

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Badge } from "../../../../components/ui/badge"
import { Input } from "../../../../components/ui/input"
import { 
  Plus, Search, Edit, Trash2, Package, Truck, RotateCcw, CheckCircle, 
  Clock, AlertCircle, MapPin, FileText, Settings, ArrowRight, Filter
} from "lucide-react"
import Link from "next/link"

// Table component replacement
const Table = ({ children }: { children: React.ReactNode }) => (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse">{children}</table>
  </div>
)
const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-gray-50">{children}</thead>
)
const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody>{children}</tbody>
)
const TableRow = ({ children }: { children: React.ReactNode }) => (
  <tr className="border-b hover:bg-gray-50">{children}</tr>
)
const TableHead = ({ children }: { children: React.ReactNode }) => (
  <th className="text-left p-4 font-medium text-gray-900">{children}</th>
)
const TableCell = ({ children }: { children: React.ReactNode }) => (
  <td className="p-4 text-gray-600">{children}</td>
)

// Mock data based on Odoo Sales & Inventory patterns
const mockOrderFulfillments = [
  {
    id: '1',
    fulfillment_number: 'FULFILL-2024-001',
    order_id: 'order_123',
    order_number: 'ORD-2024-001',
    status: 'in_progress',
    warehouse: 'Main Warehouse',
    assigned_to: 'John Smith',
    items_count: 3,
    total_quantity: 5,
    fulfilled_quantity: 3,
    expected_date: '2024-01-08',
    started_at: '2024-01-06T09:00:00Z',
    created_at: '2024-01-06T08:30:00Z'
  },
  {
    id: '2',
    fulfillment_number: 'FULFILL-2024-002',
    order_id: 'order_124',
    order_number: 'ORD-2024-002',
    status: 'fulfilled',
    warehouse: 'North Warehouse',
    assigned_to: 'Sarah Johnson',
    items_count: 2,
    total_quantity: 4,
    fulfilled_quantity: 4,
    expected_date: '2024-01-07',
    started_at: '2024-01-05T14:30:00Z',
    completed_at: '2024-01-06T16:45:00Z',
    created_at: '2024-01-05T14:00:00Z'
  },
  {
    id: '3',
    fulfillment_number: 'FULFILL-2024-003',
    order_id: 'order_125',
    order_number: 'ORD-2024-003',
    status: 'partially_fulfilled',
    warehouse: 'South Warehouse',
    assigned_to: 'Mike Davis',
    items_count: 4,
    total_quantity: 8,
    fulfilled_quantity: 5,
    expected_date: '2024-01-09',
    started_at: '2024-01-06T11:15:00Z',
    created_at: '2024-01-06T10:45:00Z'
  }
]

const mockShipments = [
  {
    id: '1',
    shipment_number: 'SHIP-2024-001',
    fulfillment_number: 'FULFILL-2024-002',
    order_number: 'ORD-2024-002',
    status: 'delivered',
    carrier: 'FedEx',
    tracking_number: '123456789012',
    shipped_at: '2024-01-06T18:00:00Z',
    delivered_at: '2024-01-07T14:30:00Z',
    shipping_address: 'New York, NY 10001',
    package_count: 1,
    weight: 2.5
  },
  {
    id: '2',
    shipment_number: 'SHIP-2024-002',
    fulfillment_number: 'FULFILL-2024-001',
    order_number: 'ORD-2024-001',
    status: 'in_transit',
    carrier: 'UPS',
    tracking_number: '987654321098',
    shipped_at: '2024-01-07T09:30:00Z',
    estimated_delivery: '2024-01-08T17:00:00Z',
    shipping_address: 'Los Angeles, CA 90210',
    package_count: 2,
    weight: 4.8
  },
  {
    id: '3',
    shipment_number: 'SHIP-2024-003',
    fulfillment_number: 'FULFILL-2024-003',
    order_number: 'ORD-2024-003',
    status: 'preparing',
    carrier: 'DHL',
    tracking_number: 'DHL456789123',
    shipping_address: 'Chicago, IL 60601',
    package_count: 2,
    weight: 3.2
  }
]

const mockReturns = [
  {
    id: '1',
    return_number: 'RET-2024-001',
    order_number: 'ORD-2023-098',
    status: 'approved',
    reason: 'damaged',
    customer_name: 'Alice Johnson',
    items_count: 1,
    return_amount: 129.99,
    requested_at: '2024-01-05T10:20:00Z',
    approved_at: '2024-01-06T09:15:00Z'
  },
  {
    id: '2',
    return_number: 'RET-2024-002',
    order_number: 'ORD-2023-099',
    status: 'items_received',
    reason: 'wrong_item',
    customer_name: 'Bob Wilson',
    items_count: 2,
    return_amount: 89.50,
    requested_at: '2024-01-04T15:45:00Z',
    approved_at: '2024-01-05T11:30:00Z',
    received_at: '2024-01-06T14:20:00Z'
  }
]

export default function AdvancedOrderManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("fulfillments")
  const [fulfillments] = useState(mockOrderFulfillments)
  const [shipments] = useState(mockShipments)
  const [returns] = useState(mockReturns)

  const filteredFulfillments = fulfillments.filter(f =>
    f.fulfillment_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.order_number.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredShipments = shipments.filter(s =>
    s.shipment_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.tracking_number.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredReturns = returns.filter(r =>
    r.return_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.customer_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'not_started': { variant: 'secondary' as const, icon: Clock },
      'in_progress': { variant: 'default' as const, icon: Package },
      'partially_fulfilled': { variant: 'secondary' as const, icon: AlertCircle },
      'fulfilled': { variant: 'default' as const, icon: CheckCircle },
      'preparing': { variant: 'secondary' as const, icon: Package },
      'shipped': { variant: 'default' as const, icon: Truck },
      'in_transit': { variant: 'default' as const, icon: Truck },
      'delivered': { variant: 'default' as const, icon: CheckCircle },
      'requested': { variant: 'secondary' as const, icon: Clock },
      'approved': { variant: 'default' as const, icon: CheckCircle },
      'items_received': { variant: 'default' as const, icon: Package },
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'outline' as const, icon: AlertCircle }
    return { ...config, label: status.replace('_', ' ') }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Advanced Order Management</h1>
          <p className="text-muted-foreground">
            Complete order fulfillment, shipping, and returns management system
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Workflows
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Fulfillment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Fulfillments</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fulfillments.filter(f => ['in_progress', 'partially_fulfilled'].includes(f.status)).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently being processed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {shipments.filter(s => ['shipped', 'in_transit', 'out_for_delivery'].includes(s.status)).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Shipments en route
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Returns</CardTitle>
            <RotateCcw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {returns.filter(r => ['requested', 'approved'].includes(r.status)).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting processing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">
              On-time delivery rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        {[
          { id: 'fulfillments', label: 'Fulfillments', icon: Package },
          { id: 'shipments', label: 'Shipments', icon: Truck },
          { id: 'returns', label: 'Returns', icon: RotateCcw },
          { id: 'workflows', label: 'Workflows', icon: Settings }
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={selectedTab === tab.id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedTab(tab.id)}
            className="gap-2"
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={`Search ${selectedTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Fulfillments Tab */}
      {selectedTab === 'fulfillments' && (
        <Card>
          <CardHeader>
            <CardTitle>Order Fulfillments</CardTitle>
            <CardDescription>
              Track order picking, packing, and fulfillment progress
            </CardDescription>
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
                {filteredFulfillments.map((fulfillment) => {
                  const statusBadge = getStatusBadge(fulfillment.status)
                  const progressPercentage = Math.round((fulfillment.fulfilled_quantity / fulfillment.total_quantity) * 100)
                  
                  return (
                    <TableRow key={fulfillment.id}>
                      <TableCell>
                        <div className="font-medium font-mono">
                          {fulfillment.fulfillment_number}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono">
                          {fulfillment.order_number}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusBadge.variant}>
                          <statusBadge.icon className="h-3 w-3 mr-1" />
                          {statusBadge.label}
                        </Badge>
                      </TableCell>
                      <TableCell>{fulfillment.warehouse}</TableCell>
                      <TableCell>{fulfillment.assigned_to}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${progressPercentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {fulfillment.fulfilled_quantity}/{fulfillment.total_quantity}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(fulfillment.expected_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Shipments Tab */}
      {selectedTab === 'shipments' && (
        <Card>
          <CardHeader>
            <CardTitle>Shipments & Tracking</CardTitle>
            <CardDescription>
              Monitor shipment status and delivery progress
            </CardDescription>
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
                {filteredShipments.map((shipment) => {
                  const statusBadge = getStatusBadge(shipment.status)
                  
                  return (
                    <TableRow key={shipment.id}>
                      <TableCell>
                        <div className="font-medium font-mono">
                          {shipment.shipment_number}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono">
                          {shipment.order_number}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusBadge.variant}>
                          <statusBadge.icon className="h-3 w-3 mr-1" />
                          {statusBadge.label}
                        </Badge>
                      </TableCell>
                      <TableCell>{shipment.carrier}</TableCell>
                      <TableCell>
                        <div className="font-mono text-sm">
                          {shipment.tracking_number}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                          {shipment.shipping_address}
                        </div>
                      </TableCell>
                      <TableCell>
                        {shipment.shipped_at ? 
                          new Date(shipment.shipped_at).toLocaleDateString() : 
                          'Not shipped'
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Truck className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Returns Tab */}
      {selectedTab === 'returns' && (
        <Card>
          <CardHeader>
            <CardTitle>Returns & Refunds</CardTitle>
            <CardDescription>
              Process customer returns and refund requests
            </CardDescription>
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
                {filteredReturns.map((returnItem) => {
                  const statusBadge = getStatusBadge(returnItem.status)
                  
                  return (
                    <TableRow key={returnItem.id}>
                      <TableCell>
                        <div className="font-medium font-mono">
                          {returnItem.return_number}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono">
                          {returnItem.order_number}
                        </div>
                      </TableCell>
                      <TableCell>{returnItem.customer_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {returnItem.reason.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusBadge.variant}>
                          <statusBadge.icon className="h-3 w-3 mr-1" />
                          {statusBadge.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          ${returnItem.return_amount.toFixed(2)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(returnItem.requested_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

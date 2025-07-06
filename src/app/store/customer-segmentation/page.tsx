'use client'

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Badge } from "../../../../components/ui/badge"
import { Input } from "../../../../components/ui/input"
import { Plus, Search, Edit, Trash2, Users, Target, TrendingUp, Filter } from "lucide-react"
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

// Mock data based on proven customer segmentation patterns from OpenCart/PrestaShop
const mockSegments = [
  {
    id: '1',
    name: 'High-Value Customers',
    description: 'Customers who have spent over $1,000 in the last 12 months',
    type: 'behavioral',
    status: 'active',
    customer_count: 245,
    auto_update: true,
    criteria: {
      conditions: [
        { field: 'total_spent', operator: 'greater_than', value: 1000 },
        { field: 'last_order_date', operator: 'greater_than', value: '2024-01-01' }
      ],
      logic: 'AND'
    },
    created_at: '2024-01-01',
    last_calculated_at: '2024-01-06'
  },
  {
    id: '2',
    name: 'Cart Abandoners',
    description: 'Customers who added items to cart but didn\'t complete purchase',
    type: 'behavioral',
    status: 'active',
    customer_count: 892,
    auto_update: true,
    criteria: {
      conditions: [
        { field: 'cart_abandoned', operator: 'equals', value: true },
        { field: 'cart_value', operator: 'greater_than', value: 50 }
      ],
      logic: 'AND'
    },
    created_at: '2024-01-02',
    last_calculated_at: '2024-01-06'
  },
  {
    id: '3',
    name: 'New Registrations',
    description: 'Customers who registered in the last 30 days',
    type: 'demographic',
    status: 'active',
    customer_count: 156,
    auto_update: true,
    criteria: {
      conditions: [
        { field: 'registration_date', operator: 'greater_than', value: '2023-12-07' }
      ],
      logic: 'AND'
    },
    created_at: '2024-01-03',
    last_calculated_at: '2024-01-06'
  },
  {
    id: '4',
    name: 'Win-Back Targets',
    description: 'Previously active customers who haven\'t ordered in 6 months',
    type: 'behavioral',
    status: 'active',
    customer_count: 1234,
    auto_update: true,
    criteria: {
      conditions: [
        { field: 'last_order_date', operator: 'less_than', value: '2023-07-01' },
        { field: 'total_orders', operator: 'greater_than', value: 2 }
      ],
      logic: 'AND'
    },
    created_at: '2024-01-04',
    last_calculated_at: '2024-01-06'
  },
  {
    id: '5',
    name: 'VIP Customers',
    description: 'Top 1% of customers by lifetime value',
    type: 'behavioral',
    status: 'active',
    customer_count: 78,
    auto_update: false,
    criteria: {
      conditions: [
        { field: 'lifetime_value', operator: 'greater_than', value: 5000 },
        { field: 'order_frequency', operator: 'greater_than', value: 10 }
      ],
      logic: 'AND'
    },
    created_at: '2024-01-05',
    last_calculated_at: '2024-01-05'
  }
]

export default function CustomerSegmentation() {
  const [searchQuery, setSearchQuery] = useState("")
  const [segments] = useState(mockSegments)

  const filteredSegments = segments.filter(segment =>
    segment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    segment.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalCustomers = segments.reduce((sum, segment) => sum + segment.customer_count, 0)
  const activeSegments = segments.filter(s => s.status === 'active').length
  const autoUpdateSegments = segments.filter(s => s.auto_update).length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Segmentation</h1>
          <p className="text-muted-foreground">
            Create and manage customer segments for targeted marketing campaigns
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Segment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Segments</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{segments.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeSegments} active segments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Segmented Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all segments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto-Update</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{autoUpdateSegments}</div>
            <p className="text-xs text-muted-foreground">
              Dynamic segments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Segment Size</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(totalCustomers / segments.length).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Customers per segment
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Segments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Segments</CardTitle>
          <CardDescription>
            Manage your customer segmentation rules and targeting criteria
          </CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search segments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Segment Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Customers</TableHead>
                <TableHead>Auto-Update</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSegments.map((segment) => (
                <TableRow key={segment.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{segment.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {segment.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {segment.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={segment.status === 'active' ? 'default' : 'secondary'}>
                      {segment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{segment.customer_count.toLocaleString()}</div>
                      <div className="text-muted-foreground">customers</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={segment.auto_update ? 'default' : 'secondary'}>
                      {segment.auto_update ? 'Yes' : 'No'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {segment.last_calculated_at ? 
                        new Date(segment.last_calculated_at).toLocaleDateString() : 
                        'Never'
                      }
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Segment Criteria Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Segment Types</CardTitle>
          <CardDescription>
            Ready-to-use customer segmentation templates based on proven e-commerce patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">High-Value Customers</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Customers with high lifetime value and frequent purchases
              </p>
              <div className="text-xs">
                <div>• Total spent > $1,000</div>
                <div>• Orders > 5</div>
                <div>• Last order within 6 months</div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Cart Abandoners</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Customers who added items but didn't complete purchase
              </p>
              <div className="text-xs">
                <div>• Cart value > $50</div>
                <div>• Last activity > 24 hours</div>
                <div>• No completed order</div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Win-Back Targets</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Previously active customers needing re-engagement
              </p>
              <div className="text-xs">
                <div>• Previous orders > 2</div>
                <div>• Last order > 6 months ago</div>
                <div>• Email engagement > 0</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

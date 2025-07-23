// @ts-nocheck
'use client'


// Force dynamic rendering to avoid SSG auth context issues
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/core/shared/components/ui/card"
import { Button } from "@/core/shared/components/ui/button"
import { Badge } from "@/core/shared/components/ui/badge"
import { Input } from "@/core/shared/components/ui/input"

// Table component replacement since we don't have the shadcn table
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
import { Plus, Search, Edit, Trash2, DollarSign } from "lucide-react"
import Link from "next/link"


export const dynamic = 'force-dynamic'
// Mock data - replace with actual API calls
const mockPriceLists = [
  {
    id: '1',
    name: 'VIP Customer Pricing',
    description: 'Special pricing for VIP customers',
    type: 'sale',
    status: 'active',
    starts_at: '2024-01-01',
    ends_at: '2024-12-31',
    customer_groups: ['VIP'],
    created_at: '2024-01-01',
  },
  {
    id: '2', 
    name: 'Bulk Order Discounts',
    description: 'Discounted prices for bulk orders',
    type: 'override',
    status: 'active',
    starts_at: '2024-01-01',
    ends_at: null,
    customer_groups: ['Wholesale'],
    created_at: '2024-01-15',
  }
]

export default function PricingManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [priceLists] = useState(mockPriceLists)

  const filteredPriceLists = priceLists.filter(priceList =>
    priceList.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    priceList.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pricing Management</h1>
          <p className="text-muted-foreground">
            Manage price lists, customer group pricing, and promotional rates
          </p>
        </div>
        <Link href="/store/pricing/create">
          <Button className="gap-2" onClick={() => alert('Button clicked')}>
            <Plus className="h-4 w-4" />
            Create Price List
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Price Lists</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{priceLists.filter(p => p.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">
              Currently active pricing rules
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Groups</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Groups with special pricing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Products with custom pricing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Impact</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12%</div>
            <p className="text-xs text-muted-foreground">
              Increase from pricing strategies
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Price Lists Table */}
      <Card>
        <CardHeader>
          <CardTitle>Price Lists</CardTitle>
          <CardDescription>
            Manage your pricing strategies and customer group discounts
          </CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search price lists..."
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
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Customer Groups</TableHead>
                <TableHead>Valid Period</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPriceLists.map((priceList) => (
                <TableRow key={priceList.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{priceList.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {priceList.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={priceList.type === 'sale' ? 'default' : 'secondary'}>
                      {priceList.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={priceList.status === 'active' ? 'default' : 'secondary'}>
                      {priceList.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {priceList.customer_groups.join(', ')}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{new Date(priceList.starts_at).toLocaleDateString()}</div>
                      <div className="text-muted-foreground">
                        to {priceList.ends_at ? new Date(priceList.ends_at).toLocaleDateString() : 'No end date'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => alert('Button clicked')}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => alert('Button clicked')}>
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
    </div>
  )
}






"use client"
// @ts-nocheck

// Force dynamic rendering to avoid SSG auth context issues

// Force dynamic rendering to avoid static generation issues

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/core/shared/components/ui/card"
import { Button } from "@/core/shared/components/ui/button"
import { Input } from "@/core/shared/components/ui/input"
import { Badge } from "@/core/shared/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/core/shared/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/shared/components/ui/select"
import { Plus, Search, Edit, Trash2, Warehouse, MapPin, Package, TrendingUp } from "lucide-react"
import { formatNumber, formatCurrency, formatDate, formatPercentage } from '@/core/shared/utils/formatting';


export const dynamic = 'force-dynamic'
interface WarehouseData {
  id: string
  name: string
  code: string
  address: string
  city: string
  region: string
  country_code: string
  warehouse_type: "main" | "distribution" | "returns" | "dropship"
  is_active: boolean
  is_default: boolean
  capacity: number
  current_utilization: number
  total_items: number
  total_value: number
  created_at: string
}

export default function WarehouseManagement() {
  const router = useRouter()
  const [warehouses, setWarehouses] = useState<WarehouseData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  useEffect(() => {
    loadWarehouses()
  }, [])

  const loadWarehouses = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual API call
      const mockWarehouses: WarehouseData[] = [
        {
          id: "wh_1",
          name: "Main Warehouse - Riyadh",
          code: "WH-RYD-001",
          address: "Industrial District, Exit 18",
          city: "Riyadh",
          region: "Riyadh Province",
          country_code: "SA",
          warehouse_type: "main",
          is_active: true,
          is_default: true,
          capacity: 10000,
          current_utilization: 7500,
          total_items: 1250,
          total_value: 850000,
          created_at: "2024-01-15T10:00:00Z"
        },
        {
          id: "wh_2",
          name: "Distribution Center - Jeddah",
          code: "WH-JED-002",
          address: "King Abdullah Economic City",
          city: "Jeddah",
          region: "Makkah Province",
          country_code: "SA",
          warehouse_type: "distribution",
          is_active: true,
          is_default: false,
          capacity: 7500,
          current_utilization: 4200,
          total_items: 890,
          total_value: 420000,
          created_at: "2024-01-20T08:00:00Z"
        },
        {
          id: "wh_3",
          name: "Returns Processing - Dammam",
          code: "WH-DMM-003",
          address: "Second Industrial City",
          city: "Dammam",
          region: "Eastern Province",
          country_code: "SA",
          warehouse_type: "returns",
          is_active: true,
          is_default: false,
          capacity: 2000,
          current_utilization: 350,
          total_items: 125,
          total_value: 45000,
          created_at: "2024-02-01T14:00:00Z"
        }
      ]
      setWarehouses(mockWarehouses)
    } catch (error) {
      console.error("Error loading warehouses:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredWarehouses = warehouses.filter(warehouse => {
    const matchesSearch = warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         warehouse.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         warehouse.city.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || warehouse.warehouse_type === typeFilter
    return matchesSearch && matchesType
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case "main": return "bg-blue-100 text-blue-800"
      case "distribution": return "bg-green-100 text-green-800"
      case "returns": return "bg-orange-100 text-orange-800"
      case "dropship": return "bg-purple-100 text-purple-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getUtilizationColor = (utilization: number, capacity: number) => {
    const percentage = (utilization / capacity) * 100
    if (percentage >= 90) return "text-red-600"
    if (percentage >= 75) return "text-orange-600"
    if (percentage >= 50) return "text-yellow-600"
    return "text-green-600"
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleDelete = async (warehouseId: string) => {
    if (confirm("Are you sure you want to delete this warehouse? This action cannot be undone.")) {
      try {
        // TODO: Replace with actual API call
        setWarehouses(warehouses.filter(w => w.id !== warehouseId))
      } catch (error) {
        console.error("Error deleting warehouse:", error)
      }
    }
  }

  const totalStats = warehouses.reduce(
    (acc, warehouse) => ({
      totalCapacity: acc.totalCapacity + warehouse.capacity,
      totalUtilization: acc.totalUtilization + warehouse.current_utilization,
      totalItems: acc.totalItems + warehouse.total_items,
      totalValue: acc.totalValue + warehouse.total_value,
    }),
    { totalCapacity: 0, totalUtilization: 0, totalItems: 0, totalValue: 0 }
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading warehouses...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Warehouse Management</h1>
          <p className="text-gray-600">Manage your warehouses and inventory locations</p>
        </div>
        <Button onClick={() => router.push("/store/warehouses/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Warehouse
        </Button>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Warehouse className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Warehouses</p>
                <p className="text-2xl font-bold">{warehouses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold">{totalStats.totalItems.toLocaleString('en-US')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold">{formatCurrency(totalStats.totalValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Utilization</p>
                <p className="text-2xl font-bold">
                  {Math.round((totalStats.totalUtilization / totalStats.totalCapacity) * 100)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search warehouses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-48 h-10 px-3 border border-gray-300 rounded-md"
            >
              <option value="all">All Types</option>
              <option value="main">Main Warehouse</option>
              <option value="distribution">Distribution</option>
              <option value="returns">Returns</option>
              <option value="dropship">Dropship</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredWarehouses.length === 0 ? (
            <div className="text-center py-12">
              <Warehouse className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No warehouses found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || typeFilter !== "all" 
                  ? "Try adjusting your filters"
                  : "Create your first warehouse to get started"
                }
              </p>
              {!searchTerm && typeFilter === "all" && (
                <Button onClick={() => router.push("/store/warehouses/create")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Warehouse
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWarehouses.map((warehouse) => (
                  <TableRow key={warehouse.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{warehouse.name}</div>
                        <div className="text-sm text-gray-500">{warehouse.code}</div>
                        {warehouse.is_default && (
                          <Badge className="mt-1 bg-blue-100 text-blue-800">Default</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(warehouse.warehouse_type)}>
                        {warehouse.warehouse_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{warehouse.city}</div>
                        <div className="text-xs text-gray-500">{warehouse.region}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className={`text-sm font-medium ${getUtilizationColor(warehouse.current_utilization, warehouse.capacity)}`}>
                          {warehouse.current_utilization.toLocaleString('en-US')} / {warehouse.capacity.toLocaleString('en-US')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {Math.round((warehouse.current_utilization / warehouse.capacity) * 100)}% utilized
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{warehouse.total_items.toLocaleString('en-US')}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">{formatCurrency(warehouse.total_value)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={warehouse.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {warehouse.is_active ? 'نشط' : 'غير نشط'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/store/warehouses/${warehouse.id}`)}
                        >
                          <Package className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/store/warehouses/${warehouse.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(warehouse.id)}
                          disabled={warehouse.is_default}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}






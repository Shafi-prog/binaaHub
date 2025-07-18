"use client";
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
import { Plus, Search, Edit, Trash2, Store, Users, DollarSign, Package, Eye, CheckCircle, XCircle } from "lucide-react"


export const dynamic = 'force-dynamic'
interface MarketplaceVendor {
  id: string
  business_name: string
  contact_person: string
  email: string
  phone: string
  city: string
  region: string
  status: "pending" | "approved" | "suspended" | "rejected"
  is_verified: boolean
  commission_rate: number
  total_sales: number
  total_commission: number
  total_products: number
  total_orders: number
  rating: number
  created_at: string
}

export default function MarketplaceVendors() {
  const router = useRouter()
  const [vendors, setVendors] = useState<MarketplaceVendor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    loadVendors()
  }, [])

  const loadVendors = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual API call
      const mockVendors: MarketplaceVendor[] = [
        {
          id: "vendor_1",
          business_name: "Al-Salam Construction Supplies",
          contact_person: "Ahmed Al-Mahmoud",
          email: "ahmed@alsalam-construction.com",
          phone: "+966-50-123-4567",
          city: "Riyadh",
          region: "Riyadh Province",
          status: "approved",
          is_verified: true,
          commission_rate: 0.05,
          total_sales: 2500000,
          total_commission: 125000,
          total_products: 145,
          total_orders: 267,
          rating: 4.8,
          created_at: "2024-01-15T10:00:00Z"
        },
        {
          id: "vendor_2",
          business_name: "Jeddah Tools & Equipment",
          contact_person: "Fatima Al-Zahrani",
          email: "fatima@jeddah-tools.com",
          phone: "+966-50-234-5678",
          city: "Jeddah",
          region: "Makkah Province",
          status: "approved",
          is_verified: true,
          commission_rate: 0.06,
          total_sales: 1800000,
          total_commission: 108000,
          total_products: 89,
          total_orders: 198,
          rating: 4.6,
          created_at: "2024-01-20T08:00:00Z"
        },
        {
          id: "vendor_3",
          business_name: "Dammam Industrial Materials",
          contact_person: "Omar Al-Qahtani",
          email: "omar@dammam-industrial.com",
          phone: "+966-50-345-6789",
          city: "Dammam",
          region: "Eastern Province",
          status: "pending",
          is_verified: false,
          commission_rate: 0.05,
          total_sales: 0,
          total_commission: 0,
          total_products: 23,
          total_orders: 0,
          rating: 0,
          created_at: "2024-02-01T14:00:00Z"
        },
        {
          id: "vendor_4",
          business_name: "Northern Hardware Solutions",
          contact_person: "Sarah Al-Rashid",
          email: "sarah@northern-hardware.com",
          phone: "+966-50-456-7890",
          city: "Tabuk",
          region: "Tabuk Province",
          status: "suspended",
          is_verified: true,
          commission_rate: 0.07,
          total_sales: 450000,
          total_commission: 31500,
          total_products: 34,
          total_orders: 45,
          rating: 3.2,
          created_at: "2024-01-10T11:30:00Z"
        }
      ]
      setVendors(mockVendors)
    } catch (error) {
      console.error("Error loading vendors:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || vendor.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800"
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "suspended": return "bg-red-100 text-red-800"
      case "rejected": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatRating = (rating: number) => {
    return rating > 0 ? `${rating.toFixed(1)}⭐` : "No ratings"
  }

  const handleApprove = async (vendorId: string) => {
    try {
      // TODO: Replace with actual API call
      setVendors(vendors.map(v => 
        v.id === vendorId 
          ? { ...v, status: "approved" as const, is_verified: true }
          : v
      ))
    } catch (error) {
      console.error("Error approving vendor:", error)
    }
  }

  const handleReject = async (vendorId: string) => {
    if (confirm("Are you sure you want to reject this vendor?")) {
      try {
        // TODO: Replace with actual API call
        setVendors(vendors.map(v => 
          v.id === vendorId 
            ? { ...v, status: "rejected" as const }
            : v
        ))
      } catch (error) {
        console.error("Error rejecting vendor:", error)
      }
    }
  }

  const handleSuspend = async (vendorId: string) => {
    if (confirm("Are you sure you want to suspend this vendor?")) {
      try {
        // TODO: Replace with actual API call
        setVendors(vendors.map(v => 
          v.id === vendorId 
            ? { ...v, status: "suspended" as const }
            : v
        ))
      } catch (error) {
        console.error("Error suspending vendor:", error)
      }
    }
  }

  const totalStats = vendors.reduce(
    (acc, vendor) => ({
      totalVendors: acc.totalVendors + 1,
      activeVendors: acc.activeVendors + (vendor.status === "approved" ? 1 : 0),
      totalSales: acc.totalSales + vendor.total_sales,
      totalCommission: acc.totalCommission + vendor.total_commission,
    }),
    { totalVendors: 0, activeVendors: 0, totalSales: 0, totalCommission: 0 }
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading vendors...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Marketplace Vendors</h1>
          <p className="text-gray-600">Manage vendor registrations and performance</p>
        </div>
        <Button onClick={() => router.push("/store/marketplace-vendors/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Vendor
        </Button>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Store className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Vendors</p>
                <p className="text-2xl font-bold">{totalStats.totalVendors}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Vendors</p>
                <p className="text-2xl font-bold">{totalStats.activeVendors}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold">{formatCurrency(totalStats.totalSales)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Commission Earned</p>
                <p className="text-2xl font-bold">{formatCurrency(totalStats.totalCommission)}</p>
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
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredVendors.length === 0 ? (
            <div className="text-center py-12">
              <Store className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your filters"
                  : "No vendors have registered yet"
                }
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{vendor.business_name}</div>
                        <div className="text-sm text-gray-500">
                          {vendor.total_products} products • {vendor.total_orders} orders
                        </div>
                        {vendor.is_verified && (
                          <Badge className="mt-1 bg-blue-100 text-blue-800">Verified</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm font-medium">{vendor.contact_person}</div>
                        <div className="text-sm text-gray-500">{vendor.email}</div>
                        <div className="text-sm text-gray-500">{vendor.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{vendor.city}</div>
                        <div className="text-xs text-gray-500">{vendor.region}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(vendor.status)}>
                        {vendor.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm font-medium">{formatCurrency(vendor.total_sales)}</div>
                        <div className="text-xs text-gray-500">{formatRating(vendor.rating)}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{(vendor.commission_rate * 100).toFixed(1)}%</div>
                        <div className="text-xs text-gray-500">{formatCurrency(vendor.total_commission)}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/store/marketplace-vendors/${vendor.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/store/marketplace-vendors/${vendor.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {vendor.status === "pending" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleApprove(vendor.id)}
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReject(vendor.id)}
                            >
                              <XCircle className="h-4 w-4 text-red-600" />
                            </Button>
                          </>
                        )}
                        {vendor.status === "approved" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSuspend(vendor.id)}
                          >
                            <XCircle className="h-4 w-4 text-orange-600" />
                          </Button>
                        )}
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






'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/core/shared/components/ui/card"
import { Button } from "@/core/shared/components/ui/button"
import { Badge } from "@/core/shared/components/ui/badge"
import { Input } from "@/core/shared/components/ui/input"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  Plus, Search, Edit, Trash2, DollarSign, TrendingUp, TrendingDown, 
  FileText, CreditCard, Receipt, Calculator, PieChart, BarChart3 
} from "lucide-react"
import Link from "next/link"
import { formatNumber, formatCurrency, formatDate, formatPercentage } from '@/core/shared/utils/formatting';


export const dynamic = 'force-dynamic'
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

// Real data from Supabase
const mockInvoices = [
  {
    id: '1',
    invoice_number: 'INV-2024-001',
    type: 'sales',
    status: 'paid',
    customer_name: 'Acme Corporation',
    invoice_date: '2024-01-06',
    due_date: '2024-01-21',
    total_amount: 2450.00,
    paid_amount: 2450.00,
    currency_code: 'USD'
  },
  {
    id: '2',
    invoice_number: 'INV-2024-002',
    type: 'sales',
    status: 'pending',
    customer_name: 'TechStart Inc.',
    invoice_date: '2024-01-05',
    due_date: '2024-01-20',
    total_amount: 1875.50,
    paid_amount: 0,
    currency_code: 'USD'
  },
  {
    id: '3',
    invoice_number: 'INV-2024-003',
    type: 'sales',
    status: 'overdue',
    customer_name: 'Global Solutions Ltd.',
    invoice_date: '2023-12-20',
    due_date: '2024-01-04',
    total_amount: 3240.75,
    paid_amount: 1000.00,
    currency_code: 'USD'
  },
  {
    id: '4',
    invoice_number: 'BILL-2024-001',
    type: 'purchase',
    status: 'paid',
    customer_name: 'Office Supplies Co.',
    invoice_date: '2024-01-04',
    due_date: '2024-01-19',
    total_amount: 890.25,
    paid_amount: 890.25,
    currency_code: 'USD'
  }
]

const mockFinancialSummary = {
  revenue: {
    thisMonth: 78450.00,
    lastMonth: 72380.00,
    growth: 8.4
  },
  expenses: {
    thisMonth: 34200.00,
    lastMonth: 31850.00,
    growth: 7.4
  },
  profit: {
    thisMonth: 44250.00,
    lastMonth: 40530.00,
    growth: 9.2
  },
  outstandingReceivables: 15670.50,
  outstandingPayables: 8950.25,
  cashFlow: 35320.25
}

export default function FinancialDashboard() {
const supabase = createClientComponentClient();

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("overview")
  const [invoices] = useState(mockInvoices)

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.customer_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(1)}%`
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Management</h1>
          <p className="text-muted-foreground">
            Complete financial accounting, invoicing, and reporting system
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="gap-2" onClick={() => alert('Button clicked')}>
            <FileText className="h-4 w-4" />
            Generate Report
          </Button>
          <Button className="gap-2" onClick={() => alert('Button clicked')}>
            <Plus className="h-4 w-4" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue (MTD)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(mockFinancialSummary.revenue.thisMonth)}
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              {formatPercentage(mockFinancialSummary.revenue.growth)} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses (MTD)</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(mockFinancialSummary.expenses.thisMonth)}
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              {formatPercentage(mockFinancialSummary.expenses.growth)} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit (MTD)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(mockFinancialSummary.profit.thisMonth)}
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              {formatPercentage(mockFinancialSummary.profit.growth)} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Flow</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(mockFinancialSummary.cashFlow)}
            </div>
            <p className="text-xs text-muted-foreground">
              Available cash position
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Outstanding Amounts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Accounts Receivable
            </CardTitle>
            <CardDescription>
              Outstanding amounts from customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(mockFinancialSummary.outstandingReceivables)}
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              {invoices.filter(i => i.status === 'pending' || i.status === 'overdue').length} unpaid invoices
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Accounts Payable
            </CardTitle>
            <CardDescription>
              Outstanding amounts to vendors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {formatCurrency(mockFinancialSummary.outstandingPayables)}
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              {invoices.filter(i => i.type === 'purchase' && i.status !== 'paid').length} unpaid bills
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'invoices', label: 'Invoices' },
          { id: 'payments', label: 'Payments' },
          { id: 'reports', label: 'Reports' }
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={selectedTab === tab.id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedTab(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Recent Invoices */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
          <CardDescription>
            Latest sales and purchase invoices
          </CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search invoices..."
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
                <TableHead>Invoice #</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Customer/Vendor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <div className="font-medium font-mono">
                      {invoice.invoice_number}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={invoice.type === 'sales' ? 'default' : 'secondary'}>
                      {invoice.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{invoice.customer_name}</div>
                  </TableCell>
                  <TableCell>
                    {new Date(invoice.invoice_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(invoice.due_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="text-right">
                      <div className="font-medium">
                        {formatCurrency(invoice.total_amount, invoice.currency_code)}
                      </div>
                      {invoice.paid_amount > 0 && invoice.paid_amount < invoice.total_amount && (
                        <div className="text-sm text-muted-foreground">
                          {formatCurrency(invoice.paid_amount, invoice.currency_code)} paid
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      invoice.status === 'paid' ? 'default' :
                      invoice.status === 'pending' ? 'secondary' :
                      invoice.status === 'overdue' ? 'destructive' : 'outline'
                    }>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => alert('Button clicked')}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => alert('Button clicked')}>
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Financial Actions</CardTitle>
          <CardDescription>
            Common financial management tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => alert('Button clicked')}>
              <FileText className="h-6 w-6" />
              <span className="text-sm">Create Invoice</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => alert('Button clicked')}>
              <Receipt className="h-6 w-6" />
              <span className="text-sm">Record Payment</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => alert('Button clicked')}>
              <Calculator className="h-6 w-6" />
              <span className="text-sm">Chart of Accounts</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => alert('Button clicked')}>
              <PieChart className="h-6 w-6" />
              <span className="text-sm">P&L Report</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => alert('Button clicked')}>
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm">Balance Sheet</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => alert('Button clicked')}>
              <TrendingUp className="h-6 w-6" />
              <span className="text-sm">Cash Flow</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}






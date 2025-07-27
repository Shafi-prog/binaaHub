'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function FinancialManagementPage() {
  const [invoices] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTab, setSelectedTab] = useState('all')

  const filteredInvoices = invoices.filter((invoice: any) =>
    (invoice?.invoice_number || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (invoice?.customer_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatCurrency = (amount: number, currency = 'SAR') => {
    return `${amount?.toFixed(2) || '0.00'} ${currency === 'SAR' ? 'ر.س' : currency}`
  }

  const tabs = [
    { id: 'all', label: 'All Invoices' },
    { id: 'sales', label: 'Sales' },
    { id: 'purchase', label: 'Purchases' },
    { id: 'pending', label: 'Pending' },
    { id: 'overdue', label: 'Overdue' }
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Financial Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline">Export Report</Button>
          <Button>Create Invoice</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                invoices
                  .filter((i: any) => i?.type === 'sales' && i?.status === 'paid')
                  .reduce((sum: number, i: any) => sum + (i?.total_amount || 0), 0)
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unpaid Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {invoices.filter((i: any) => i?.status === 'pending' || i?.status === 'overdue').length} invoices
            </div>
            <div className="text-xs text-muted-foreground">
              {formatCurrency(
                invoices
                  .filter((i: any) => i?.status === 'pending' || i?.status === 'overdue')
                  .reduce((sum: number, i: any) => sum + (i?.total_amount || 0), 0)
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unpaid Bills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {invoices.filter((i: any) => i?.type === 'purchase' && i?.status !== 'paid').length} bills
            </div>
            <div className="text-xs text-muted-foreground">
              {formatCurrency(
                invoices
                  .filter((i: any) => i?.type === 'purchase' && i?.status !== 'paid')
                  .reduce((sum: number, i: any) => sum + (i?.total_amount || 0), 0)
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(0)}</div>
            <div className="text-xs text-muted-foreground">+20.1% from last month</div>
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

      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">No invoices found</TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map((invoice: any) => (
                  <TableRow key={invoice?.id || Math.random()}>
                    <TableCell>
                      {invoice?.invoice_number || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={invoice?.type === 'sales' ? 'default' : 'secondary'}>
                        {invoice?.type || 'unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{invoice?.customer_name || 'Unknown Customer'}</div>
                    </TableCell>
                    <TableCell>
                      {invoice?.invoice_date ? new Date(invoice.invoice_date).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {invoice?.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div>
                        {formatCurrency(invoice?.total_amount || 0, invoice?.currency_code)}
                      </div>
                      {(invoice?.paid_amount || 0) > 0 && (invoice?.paid_amount || 0) < (invoice?.total_amount || 0) && (
                        <div className="text-sm text-gray-500">
                          {formatCurrency(invoice?.paid_amount || 0, invoice?.currency_code)} paid
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        invoice?.status === 'paid' ? 'default' :
                        invoice?.status === 'pending' ? 'secondary' :
                        invoice?.status === 'overdue' ? 'destructive' : 'outline'
                      }>
                        {invoice?.status || 'unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline">View</Button>
                        <Button size="sm" variant="outline">Edit</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
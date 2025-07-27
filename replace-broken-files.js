const fs = require('fs');
const path = require('path');

const storePath = path.join(__dirname, 'src', 'app', 'store');

// Final problematic files that need complete replacement
const brokenFiles = [
  'products/export/page.tsx',
  'promotions/page.tsx'
];

const cleanTemplates = {
  'products/export/page.tsx': `'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shared/components/ui/card'
import { Button } from '@/core/shared/components/ui/button'
import { Checkbox } from '@/core/shared/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/core/shared/components/ui/select'
import { Input } from '@/core/shared/components/ui/input'
import { Label } from '@/core/shared/components/ui/label'

export default function ProductExportPage() {
  const [selectedFields, setSelectedFields] = useState<string[]>(['title', 'price', 'sku'])
  const [exportFormat, setExportFormat] = useState('csv')
  const [exporting, setExporting] = useState(false)

  const availableFields = [
    { id: 'title', label: 'Product Title' },
    { id: 'description', label: 'Description' },
    { id: 'sku', label: 'SKU' },
    { id: 'price', label: 'Price' },
    { id: 'cost_price', label: 'Cost Price' },
    { id: 'category', label: 'Category' },
    { id: 'status', label: 'Status' },
    { id: 'quantity', label: 'Quantity' },
    { id: 'weight', label: 'Weight' },
    { id: 'dimensions', label: 'Dimensions' },
    { id: 'tags', label: 'Tags' },
    { id: 'created_at', label: 'Created Date' },
    { id: 'updated_at', label: 'Updated Date' }
  ]

  const handleFieldToggle = (fieldId: string) => {
    setSelectedFields(prev => 
      prev.includes(fieldId) 
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    )
  }

  const handleExport = async () => {
    if (selectedFields.length === 0) {
      alert('Please select at least one field to export')
      return
    }

    setExporting(true)
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create sample export data
      const exportData = []
      for (let i = 1; i <= 10; i++) {
        const row: any = {}
        selectedFields.forEach(field => {
          switch (field) {
            case 'title':
              row[field] = \`Sample Product \${i}\`
              break
            case 'price':
              row[field] = (Math.random() * 1000).toFixed(2)
              break
            case 'sku':
              row[field] = \`SKU-\${i.toString().padStart(3, '0')}\`
              break
            case 'quantity':
              row[field] = Math.floor(Math.random() * 100)
              break
            default:
              row[field] = \`Sample \${field} \${i}\`
          }
        })
        exportData.push(row)
      }

      // Generate CSV content
      const headers = selectedFields.map(field => 
        availableFields.find(f => f.id === field)?.label || field
      ).join(',')
      
      const rows = exportData.map(row => 
        selectedFields.map(field => row[field] || '').join(',')
      ).join('\\n')
      
      const csvContent = headers + '\\n' + rows
      
      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = \`products_export_\${new Date().getTime()}.\${exportFormat}\`
      a.click()
      window.URL.revokeObjectURL(url)
      
      alert('Export completed successfully!')
    } catch (error) {
      alert('Export failed. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Export Products</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Export Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="format">Export Format</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Fields to Export</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {availableFields.map((field) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={field.id}
                      checked={selectedFields.includes(field.id)}
                      onCheckedChange={() => handleFieldToggle(field.id)}
                    />
                    <Label htmlFor={field.id} className="text-sm">
                      {field.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Export Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                Selected Fields ({selectedFields.length}):
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedFields.map(field => (
                  <span
                    key={field}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                  >
                    {availableFields.find(f => f.id === field)?.label || field}
                  </span>
                ))}
              </div>
              
              {selectedFields.length === 0 && (
                <div className="text-red-500 text-sm">
                  Please select at least one field to export.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Start Export</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Ready to export products in {exportFormat.toUpperCase()} format
              </p>
              <p className="text-xs text-gray-500">
                Selected {selectedFields.length} fields for export
              </p>
            </div>
            <Button
              onClick={handleExport}
              disabled={selectedFields.length === 0 || exporting}
            >
              {exporting ? 'Exporting...' : 'Export Products'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}`,

  'promotions/page.tsx': `'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shared/components/ui/card'
import { Button } from '@/core/shared/components/ui/button'
import { Badge } from '@/core/shared/components/ui/badge'
import { Input } from '@/core/shared/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/core/shared/components/ui/table'

export default function PromotionsPage() {
  const [promotions] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPromotions = promotions.filter((promotion: any) =>
    (promotion?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (promotion?.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Promotions & Discounts</h1>
        <Button>Create Promotion</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Promotions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{promotions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Promotions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{promotions.filter((p: any) => p?.status === 'active').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {promotions.reduce((sum: number, p: any) => sum + (p?.usage_count || 0), 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{promotions.filter((p: any) => p?.status === 'scheduled').length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Promotions</CardTitle>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search promotions..."
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
                <TableHead>Promotion</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Valid Period</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPromotions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">No promotions found</TableCell>
                </TableRow>
              ) : (
                filteredPromotions.map((promotion: any) => (
                  <TableRow key={promotion?.id || Math.random()}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{promotion?.name || 'Unnamed Promotion'}</div>
                        <div className="text-sm text-gray-500">
                          {promotion?.description || 'No description'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={promotion?.type === 'percentage' ? 'default' : 'secondary'}>
                        {promotion?.type === 'percentage' ? \`\${promotion?.value || 0}% off\` : promotion?.type || 'fixed'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={promotion?.status === 'active' ? 'default' : 'secondary'}>
                        {promotion?.status || 'inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{promotion?.usage_count || 0} used</div>
                        <div className="text-sm text-gray-500">
                          of {promotion?.usage_limit || 'unlimited'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">
                          {promotion?.start_date ? new Date(promotion.start_date).toLocaleDateString() : 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          to {promotion?.end_date ? new Date(promotion.end_date).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" variant="outline">View</Button>
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
}`
}

function replaceBrokenFiles() {
  console.log('🔧 Replacing broken files with clean templates...\n');

  brokenFiles.forEach(file => {
    const filePath = path.join(storePath, file);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${file}`);
      return;
    }

    console.log(`📝 Replacing ${file} with clean template...`);
    
    const template = cleanTemplates[file];
    if (template) {
      fs.writeFileSync(filePath, template, 'utf8');
      console.log(`  ✅ Successfully replaced ${file}`);
    } else {
      console.log(`  ❌ No template found for ${file}`);
    }
  });

  console.log('\n🎉 File replacement completed!');
}

replaceBrokenFiles();

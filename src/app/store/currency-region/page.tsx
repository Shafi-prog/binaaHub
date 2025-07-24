// @ts-nocheck
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Button } from '@/core/shared/components/ui/button';
import { Input } from '@/core/shared/components/ui/input';
import { Label } from '@/core/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/core/shared/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/shared/components/ui/tabs';
import { Badge } from '@/core/shared/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/core/shared/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/core/shared/components/ui/dialog';
import { Switch } from '@/core/shared/components/ui/switch';
import { 

  Plus, 
  Globe, 
  MapPin, 
  DollarSign, 
  Edit, 
  Trash2, 
  Settings,
  Flag,
  TrendingUp,
  Users
} from 'lucide-react';
import toast from 'react-hot-toast';


export const dynamic = 'force-dynamic'
// Force dynamic rendering to avoid SSG auth context issues

// Mock data - replace with actual API calls from currency and region modules
const mockCurrencies = [
  {
    id: 'usd',
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    decimal_digits: 2,
    exchange_rate: 1.0,
    is_default: true,
    is_active: true,
    created_at: '2024-01-01'
  },
  {
    id: 'eur',
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    decimal_digits: 2,
    exchange_rate: 0.85,
    is_default: false,
    is_active: true,
    created_at: '2024-01-05'
  },
  {
    id: 'gbp',
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    decimal_digits: 2,
    exchange_rate: 0.73,
    is_default: false,
    is_active: true,
    created_at: '2024-01-10'
  }
];

const mockRegions = [
  {
    id: 'us',
    name: 'United States',
    currency_code: 'USD',
    countries: ['US'],
    tax_rate: 8.5,
    is_active: true,
    created_at: '2024-01-01'
  },
  {
    id: 'eu',
    name: 'European Union',
    currency_code: 'EUR',
    countries: ['DE', 'FR', 'IT', 'ES', 'NL'],
    tax_rate: 20.0,
    is_active: true,
    created_at: '2024-01-05'
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    currency_code: 'GBP',
    countries: ['GB'],
    tax_rate: 20.0,
    is_active: true,
    created_at: '2024-01-10'
  }
];

const mockCountries = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' }
];

export default function CurrencyRegionManagementPage() {
  const [activeTab, setActiveTab] = useState('currencies');
  const [isCreateCurrencyDialogOpen, setIsCreateCurrencyDialogOpen] = useState(false);
  const [isCreateRegionDialogOpen, setIsCreateRegionDialogOpen] = useState(false);
  
  const [newCurrency, setNewCurrency] = useState({
    code: '',
    name: '',
    symbol: '',
    decimal_digits: 2,
    exchange_rate: 1.0,
    is_active: true
  });

  const [newRegion, setNewRegion] = useState({
    name: '',
    currency_code: 'USD',
    countries: [],
    tax_rate: 0,
    is_active: true
  });

  const handleCreateCurrency = () => {
    // Implementation would use currency module hooks
    toast.success('Currency added successfully');
    setIsCreateCurrencyDialogOpen(false);
    setNewCurrency({
      code: '',
      name: '',
      symbol: '',
      decimal_digits: 2,
      exchange_rate: 1.0,
      is_active: true
    });
  };

  const handleCreateRegion = () => {
    // Implementation would use region module hooks
    toast.success('Region created successfully');
    setIsCreateRegionDialogOpen(false);
    setNewRegion({
      name: '',
      currency_code: 'USD',
      countries: [],
      tax_rate: 0,
      is_active: true
    });
  };

  const handleToggleCurrency = (currencyId: string, isActive: boolean) => {
    // Implementation would use currency module hooks
    toast.success(`Currency ${isActive ? 'enabled' : 'disabled'} successfully`);
  };

  const handleDeleteCurrency = (currencyId: string) => {
    // Implementation would use currency module hooks
    toast.success('Currency deleted successfully');
  };

  const handleDeleteRegion = (regionId: string) => {
    // Implementation would use region module hooks
    toast.success('Region deleted successfully');
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Globe className="w-8 h-8" />
            Currency & Region Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage supported currencies, regions, and localization settings
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="currencies">Currencies</TabsTrigger>
          <TabsTrigger value="regions">Regions</TabsTrigger>
          <TabsTrigger value="countries">Countries</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="currencies" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Supported Currencies</h2>
              <p className="text-gray-600">Manage currencies accepted in your store</p>
            </div>
            <Dialog open={isCreateCurrencyDialogOpen} onOpenChange={setIsCreateCurrencyDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => alert('Button clicked')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Currency
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Currency</DialogTitle>
                  <DialogDescription>
                    Add support for a new currency in your store
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="currency-code">Currency Code</Label>
                      <Input
                        id="currency-code"
                        value={newCurrency.code}
                        onChange={(e) => setNewCurrency({ ...newCurrency, code: e.target.value.toUpperCase() })}
                        placeholder="USD"
                        maxLength={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="currency-symbol">Symbol</Label>
                      <Input
                        id="currency-symbol"
                        value={newCurrency.symbol}
                        onChange={(e) => setNewCurrency({ ...newCurrency, symbol: e.target.value })}
                        placeholder="$"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="currency-name">Currency Name</Label>
                    <Input
                      id="currency-name"
                      value={newCurrency.name}
                      onChange={(e) => setNewCurrency({ ...newCurrency, name: e.target.value })}
                      placeholder="US Dollar"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="decimal-digits">Decimal Places</Label>
                      <Select 
                        value={newCurrency.decimal_digits.toString()} 
                        onValueChange={(value) => setNewCurrency({ ...newCurrency, decimal_digits: parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="exchange-rate">Exchange Rate (to USD)</Label>
                      <Input
                        id="exchange-rate"
                        type="number"
                        step="0.001"
                        value={newCurrency.exchange_rate}
                        onChange={(e) => setNewCurrency({ ...newCurrency, exchange_rate: parseFloat(e.target.value) })}
                        placeholder="1.000"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="currency-active"
                      checked={newCurrency.is_active}
                      onCheckedChange={(checked) => setNewCurrency({ ...newCurrency, is_active: checked })}
                    />
                    <Label htmlFor="currency-active">Enable this currency</Label>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateCurrencyDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateCurrency}>
                    Add Currency
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Currency</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Exchange Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Default</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCurrencies.map((currency) => (
                    <TableRow key={currency.id}>
                      <TableCell className="font-medium">{currency.name}</TableCell>
                      <TableCell>{currency.code}</TableCell>
                      <TableCell className="text-lg">{currency.symbol}</TableCell>
                      <TableCell>{currency.exchange_rate.toFixed(3)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={currency.is_active}
                            onCheckedChange={(checked) => handleToggleCurrency(currency.id, checked)}
                            size="sm"
                          />
                          <Badge variant={currency.is_active ? 'default' : 'secondary'}>
                            {currency.is_active ? 'نشط' : 'غير نشط'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {currency.is_default && (
                          <Badge variant="outline">Default</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => alert('Button clicked')}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          {!currency.is_default && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDeleteCurrency(currency.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regions" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Sales Regions</h2>
              <p className="text-gray-600">Define regions for localized pricing and tax rates</p>
            </div>
            <Dialog open={isCreateRegionDialogOpen} onOpenChange={setIsCreateRegionDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => alert('Button clicked')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Region
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Region</DialogTitle>
                  <DialogDescription>
                    Set up a new sales region with specific currency and tax settings
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="region-name">Region Name</Label>
                    <Input
                      id="region-name"
                      value={newRegion.name}
                      onChange={(e) => setNewRegion({ ...newRegion, name: e.target.value })}
                      placeholder="North America"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="region-currency">Currency</Label>
                    <Select 
                      value={newRegion.currency_code} 
                      onValueChange={(value) => setNewRegion({ ...newRegion, currency_code: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCurrencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.code} - {currency.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                    <Input
                      id="tax-rate"
                      type="number"
                      step="0.1"
                      value={newRegion.tax_rate}
                      onChange={(e) => setNewRegion({ ...newRegion, tax_rate: parseFloat(e.target.value) })}
                      placeholder="8.5"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="region-active"
                      checked={newRegion.is_active}
                      onCheckedChange={(checked) => setNewRegion({ ...newRegion, is_active: checked })}
                    />
                    <Label htmlFor="region-active">Enable this region</Label>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateRegionDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateRegion}>
                    Create Region
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockRegions.map((region) => (
              <Card key={region.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      {region.name}
                    </CardTitle>
                    <Badge variant={region.is_active ? 'default' : 'secondary'}>
                      {region.is_active ? 'نشط' : 'غير نشط'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Currency:</span>
                    <span className="font-medium">{region.currency_code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Tax Rate:</span>
                    <span className="font-medium">{region.tax_rate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Countries:</span>
                    <span className="font-medium">{region.countries.length}</span>
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => alert('Button clicked')}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDeleteRegion(region.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="countries" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag className="w-5 h-5" />
                Supported Countries
              </CardTitle>
              <CardDescription>
                Countries where your store operates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mockCountries.map((country) => (
                  <div key={country.code} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <span className="text-2xl">{country.flag}</span>
                    <div>
                      <div className="font-medium">{country.name}</div>
                      <div className="text-sm text-gray-500">{country.code}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Regions</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockRegions.filter(r => r.is_active).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across {mockCountries.length} countries
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Currency Performance</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">USD</div>
                <p className="text-xs text-muted-foreground">
                  Most used currency (65%)
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Region</CardTitle>
              <CardDescription>
                Sales performance across different regions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRegions.map((region) => {
                  const revenue = Math.floor(Math.random() * 20000 + 5000);
                  const percentage = Math.floor(Math.random() * 40 + 20);
                  return (
                    <div key={region.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        <div>
                          <div className="font-medium">{region.name}</div>
                          <div className="text-sm text-gray-500">{region.currency_code}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${revenue.toLocaleString('en-US')}</div>
                        <div className="text-sm text-gray-500">{percentage}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}







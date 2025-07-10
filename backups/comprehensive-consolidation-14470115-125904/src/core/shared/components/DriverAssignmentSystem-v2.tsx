// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/domains/shared/components/ui/card';
import { Button } from '@/domains/shared/components/ui/button';
import { Input } from '@/domains/shared/components/ui/input';
import { Badge } from '@/domains/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/domains/shared/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/domains/shared/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/domains/shared/components/ui/select';
import { Label } from '@/domains/shared/components/ui/label';
import { 
  Truck, 
  MapPin, 
  Clock, 
  Phone,
  Star,
  Navigation,
  Package,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  Search,
  Filter,
  Plus,
  Route,
  DollarSign
} from 'lucide-react';
import { Textarea } from '@/domains/shared/components/ui';

interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicleType: 'motorcycle' | 'car' | 'van' | 'truck';
  vehicleModel: string;
  plateNumber: string;
  rating: number;
  totalDeliveries: number;
  status: 'available' | 'busy' | 'offline' | 'suspended';
  currentLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  workingHours: {
    start: string;
    end: string;
  };
  joinDate: string;
  documents: {
    license: boolean;
    insurance: boolean;
    vehicle_registration: boolean;
  };
  emergencyContact: {
    name: string;
    phone: string;
  };
}

interface Delivery {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  driverId?: string;
  status: 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  scheduledTime: string;
  estimatedDuration: number; // minutes
  deliveryAddress: {
    street: string;
    district: string;
    city: string;
    coordinates: { lat: number; lng: number };
  };
  items: Array<{
    name: string;
    quantity: number;
    weight: number;
  }>;
  specialInstructions?: string;
  deliveryFee: number;
  distance: number; // km
  createdAt: string;
}

const mockDrivers: Driver[] = [
  {
    id: 'D001',
    name: 'Mohammed Al-Qahtani',
    phone: '+966501234567',
    email: 'mohammed.driver@binna.sa',
    vehicleType: 'motorcycle',
    vehicleModel: 'Honda CB125F',
    plateNumber: 'ABC-123',
    rating: 4.8,
    totalDeliveries: 1247,
    status: 'available',
    currentLocation: {
      lat: 24.7136,
      lng: 46.6753,
      address: 'King Fahd Road, Riyadh'
    },
    workingHours: {
      start: '08:00',
      end: '20:00'
    },
    joinDate: '2023-06-15',
    documents: {
      license: true,
      insurance: true,
      vehicle_registration: true
    },
    emergencyContact: {
      name: 'Ahmad Al-Qahtani',
      phone: '+966509876543'
    }
  },
  {
    id: 'D002',
    name: 'Fahad Al-Rashid',
    phone: '+966507654321',
    email: 'fahad.driver@binna.sa',
    vehicleType: 'car',
    vehicleModel: 'Toyota Camry 2022',
    plateNumber: 'XYZ-456',
    rating: 4.9,
    totalDeliveries: 892,
    status: 'busy',
    currentLocation: {
      lat: 24.6877,
      lng: 46.7219,
      address: 'Olaya District, Riyadh'
    },
    workingHours: {
      start: '09:00',
      end: '21:00'
    },
    joinDate: '2023-08-22',
    documents: {
      license: true,
      insurance: true,
      vehicle_registration: true
    },
    emergencyContact: {
      name: 'Nora Al-Rashid',
      phone: '+966502468135'
    }
  },
  {
    id: 'D003',
    name: 'Khalid Al-Mansouri',
    phone: '+966503692581',
    email: 'khalid.driver@binna.sa',
    vehicleType: 'van',
    vehicleModel: 'Nissan NV200',
    plateNumber: 'DEF-789',
    rating: 4.7,
    totalDeliveries: 634,
    status: 'available',
    currentLocation: {
      lat: 24.7742,
      lng: 46.6616,
      address: 'Al-Malaz District, Riyadh'
    },
    workingHours: {
      start: '07:00',
      end: '19:00'
    },
    joinDate: '2024-01-10',
    documents: {
      license: true,
      insurance: false,
      vehicle_registration: true
    },
    emergencyContact: {
      name: 'Fatima Al-Mansouri',
      phone: '+966508147259'
    }
  }
];

const mockDeliveries: Delivery[] = [
  {
    id: 'DEL001',
    orderId: 'ORD-2024-001',
    customerId: 'CUST001',
    customerName: 'Sarah Al-Zahrani',
    customerPhone: '+966501111111',
    status: 'pending',
    priority: 'high',
    scheduledTime: '2024-01-06T14:00:00',
    estimatedDuration: 25,
    deliveryAddress: {
      street: 'Prince Mohammed Bin Salman Road',
      district: 'Al-Nakheel',
      city: 'Riyadh',
      coordinates: { lat: 24.7935, lng: 46.6776 }
    },
    items: [
      { name: 'Electronics Bundle', quantity: 2, weight: 3.5 },
      { name: 'Books', quantity: 5, weight: 1.2 }
    ],
    specialInstructions: 'Call before arrival. Building has no elevator.',
    deliveryFee: 15,
    distance: 8.2,
    createdAt: '2024-01-06T12:30:00'
  },
  {
    id: 'DEL002',
    orderId: 'ORD-2024-002',
    customerId: 'CUST002',
    customerName: 'Abdullah Al-Mutairi',
    customerPhone: '+966502222222',
    driverId: 'D002',
    status: 'in_transit',
    priority: 'normal',
    scheduledTime: '2024-01-06T15:30:00',
    estimatedDuration: 35,
    deliveryAddress: {
      street: 'King Abdul Aziz Road',
      district: 'Al-Malaz',
      city: 'Riyadh',
      coordinates: { lat: 24.7742, lng: 46.6616 }
    },
    items: [
      { name: 'Grocery Items', quantity: 12, weight: 8.3 }
    ],
    deliveryFee: 20,
    distance: 12.5,
    createdAt: '2024-01-06T13:00:00'
  },
  {
    id: 'DEL003',
    orderId: 'ORD-2024-003',
    customerId: 'CUST003',
    customerName: 'Nora Hassan',
    customerPhone: '+966503333333',
    status: 'pending',
    priority: 'urgent',
    scheduledTime: '2024-01-06T16:00:00',
    estimatedDuration: 20,
    deliveryAddress: {
      street: 'Tahlia Street',
      district: 'Al-Wuroud',
      city: 'Riyadh',
      coordinates: { lat: 24.6889, lng: 46.6847 }
    },
    items: [
      { name: 'Medicine', quantity: 1, weight: 0.2 }
    ],
    specialInstructions: 'Urgent delivery - medication required',
    deliveryFee: 25,
    distance: 6.8,
    createdAt: '2024-01-06T14:00:00'
  }
];

export default function DriverAssignmentSystem() {
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);
  const [deliveries, setDeliveries] = useState<Delivery[]>(mockDeliveries);
  const [selectedDriver, setSelectedDriver] = useState<string>('');
  const [selectedDelivery, setSelectedDelivery] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isAddDriverDialogOpen, setIsAddDriverDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-blue-100 text-blue-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'picked_up': return 'bg-purple-100 text-purple-800';
      case 'in_transit': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVehicleIcon = (vehicleType: string) => {
    switch (vehicleType) {
      case 'motorcycle': return '🏍️';
      case 'car': return '🚗';
      case 'van': return '🚐';
      case 'truck': return '🚛';
      default: return '🚗';
    }
  };

  const handleAssignDriver = () => {
    if (!selectedDriver || !selectedDelivery) return;

    setDeliveries(prev => prev.map(delivery => 
      delivery.id === selectedDelivery 
        ? { ...delivery, driverId: selectedDriver, status: 'assigned' }
        : delivery
    ));

    setDrivers(prev => prev.map(driver => 
      driver.id === selectedDriver 
        ? { ...driver, status: 'busy' }
        : driver
    ));

    setIsAssignDialogOpen(false);
    setSelectedDriver('');
    setSelectedDelivery('');
  };

  const getOptimalDriver = (delivery: Delivery) => {
    return drivers
      .filter(driver => driver.status === 'available')
      .map(driver => {
        // Calculate distance from driver to delivery location
        const distance = Math.sqrt(
          Math.pow(driver.currentLocation.lat - delivery.deliveryAddress.coordinates.lat, 2) +
          Math.pow(driver.currentLocation.lng - delivery.deliveryAddress.coordinates.lng, 2)
        ) * 111; // Rough conversion to km

        // Calculate score based on rating, distance, and delivery count
        const score = (driver.rating * 20) - (distance * 2) + (driver.totalDeliveries * 0.01);
        
        return { ...driver, distance, score };
      })
      .sort((a, b) => b.score - a.score)[0];
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.phone.includes(searchTerm) ||
                         driver.plateNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const pendingDeliveries = deliveries.filter(d => d.status === 'pending');
  const activeDeliveries = deliveries.filter(d => ['assigned', 'picked_up', 'in_transit'].includes(d.status));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Driver Assignment System</h1>
        <p className="text-gray-600">Manage delivery drivers and order assignments</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Drivers</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{drivers.filter(d => d.status === 'available').length}</div>
            <p className="text-xs text-muted-foreground">
              {drivers.filter(d => d.status === 'busy').length} busy drivers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Deliveries</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingDeliveries.length}</div>
            <p className="text-xs text-muted-foreground">
              {deliveries.filter(d => d.priority === 'urgent').length} urgent orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDeliveries.length}</div>
            <p className="text-xs text-muted-foreground">
              In progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(drivers.reduce((sum, d) => sum + d.rating, 0) / drivers.length).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              Driver rating
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="assignments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assignments">Smart Assignment</TabsTrigger>
          <TabsTrigger value="drivers">Driver Management</TabsTrigger>
          <TabsTrigger value="deliveries">Delivery Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Smart Driver Assignment</h2>
            <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
              <DialogTrigger asChild>
                <Button>Manual Assignment</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Assign Driver to Delivery</DialogTitle>
                  <DialogDescription>
                    Manually assign a driver to a pending delivery
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Select Delivery</Label>
                    <Select value={selectedDelivery} onValueChange={setSelectedDelivery}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose delivery" />
                      </SelectTrigger>
                      <SelectContent>
                        {pendingDeliveries.map(delivery => (
                          <SelectItem key={delivery.id} value={delivery.id}>
                            {delivery.orderId} - {delivery.customerName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Select Driver</Label>
                    <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose driver" />
                      </SelectTrigger>
                      <SelectContent>
                        {drivers.filter(d => d.status === 'available').map(driver => (
                          <SelectItem key={driver.id} value={driver.id}>
                            {driver.name} - {getVehicleIcon(driver.vehicleType)} ({driver.rating}★)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAssignDriver} disabled={!selectedDriver || !selectedDelivery}>
                    Assign Driver
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Automatic Assignment Suggestions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recommended Assignments</h3>
            {pendingDeliveries.map(delivery => {
              const optimalDriver = getOptimalDriver(delivery);
              return (
                <Card key={delivery.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <Badge className={getPriorityColor(delivery.priority)}>
                            {delivery.priority.toUpperCase()}
                          </Badge>
                          <span className="font-semibold">{delivery.orderId}</span>
                          <span className="text-gray-600">→ {delivery.customerName}</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          📍 {delivery.deliveryAddress.district}, {delivery.deliveryAddress.city}
                        </p>
                        <p className="text-sm text-gray-500">
                          📦 {delivery.items.length} items • {delivery.distance}km • SAR {delivery.deliveryFee}
                        </p>
                      </div>
                      
                      {optimalDriver && (
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-medium">Recommended: {optimalDriver.name}</p>
                            <p className="text-sm text-gray-600">
                              {getVehicleIcon(optimalDriver.vehicleType)} {optimalDriver.rating}★ • 
                              {optimalDriver.distance.toFixed(1)}km away
                            </p>
                          </div>
                          <Button 
                            onClick={() => {
                              setSelectedDelivery(delivery.id);
                              setSelectedDriver(optimalDriver.id);
                              handleAssignDriver();
                            }}
                            size="sm"
                          >
                            Auto-Assign
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="drivers" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search drivers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={() => setIsAddDriverDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Driver
            </Button>
          </div>

          <div className="grid gap-4">
            {filteredDrivers.map(driver => (
              <Card key={driver.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                        {driver.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{driver.name}</h3>
                        <p className="text-gray-600">{driver.phone}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm">{getVehicleIcon(driver.vehicleType)}</span>
                          <span className="text-sm text-gray-500">{driver.vehicleModel} • {driver.plateNumber}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-semibold">{driver.rating}</span>
                        </div>
                        <p className="text-xs text-gray-500">{driver.totalDeliveries} deliveries</p>
                      </div>
                      
                      <div className="text-right">
                        <Badge className={getStatusColor(driver.status)}>
                          {driver.status}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          📍 {driver.currentLocation.address}
                        </p>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm">
                          <MapPin className="h-4 w-4 mr-1" />
                          Track
                        </Button>
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="deliveries" className="space-y-6">
          <h2 className="text-2xl font-semibold">Delivery Tracking</h2>
          
          <div className="space-y-4">
            {deliveries.map(delivery => {
              const assignedDriver = delivery.driverId ? drivers.find(d => d.id === delivery.driverId) : null;
              return (
                <Card key={delivery.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(delivery.status)}>
                            {delivery.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <Badge className={getPriorityColor(delivery.priority)}>
                            {delivery.priority.toUpperCase()}
                          </Badge>
                          <span className="font-semibold">{delivery.orderId}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium">Customer: {delivery.customerName}</p>
                            <p className="text-gray-600">📞 {delivery.customerPhone}</p>
                            <p className="text-gray-600">📍 {delivery.deliveryAddress.street}, {delivery.deliveryAddress.district}</p>
                          </div>
                          <div>
                            <p className="font-medium">📦 Items: {delivery.items.length}</p>
                            <p className="text-gray-600">🕒 ETA: {delivery.estimatedDuration} mins</p>
                            <p className="text-gray-600">💰 Fee: SAR {delivery.deliveryFee}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right space-y-2">
                        {assignedDriver ? (
                          <div>
                            <p className="font-medium">🚗 {assignedDriver.name}</p>
                            <p className="text-sm text-gray-600">{assignedDriver.phone}</p>
                            <div className="flex gap-2 mt-2">
                              <Button variant="outline" size="sm">
                                <MapPin className="h-4 w-4 mr-1" />
                                Track
                              </Button>
                              <Button variant="outline" size="sm">
                                <Phone className="h-4 w-4 mr-1" />
                                Call
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button 
                            onClick={() => {
                              setSelectedDelivery(delivery.id);
                              setIsAssignDialogOpen(true);
                            }}
                            size="sm"
                          >
                            Assign Driver
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}







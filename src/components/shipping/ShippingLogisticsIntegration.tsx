'use client';

import React, { useState, useEffect } from 'react';
import { 
  shippingManager, 
  ShippingProvider, 
  ShippingRequest, 
  ShippingRate, 
  TrackingInfo 
} from '@/lib/shipping/shipping-manager';
import { 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  AlertCircle,
  Search,
  TrendingUp,
  BarChart3,
  Globe,
  Route,
  Timer,
  Zap,
  Plane,
  Ship
} from 'lucide-react';

interface ShippingStats {
  total_shipments: number;
  delivered_shipments: number;
  in_transit_shipments: number;
  failed_shipments: number;
  delivery_rate: number;
  average_delivery_time: number;
  provider_breakdown: Record<string, any>;
  cost_breakdown: Record<string, number>;
}

export function ShippingLogisticsIntegration() {
  const [activeProviders, setActiveProviders] = useState<ShippingProvider[]>([]);
  const [shippingStats, setShippingStats] = useState<ShippingStats | null>(null);
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [trackingLoading, setTrackingLoading] = useState<boolean>(false);
  const [ratesLoading, setRatesLoading] = useState<boolean>(false);

  // Shipping request form
  const [shippingRequest, setShippingRequest] = useState<ShippingRequest>({
    origin: {
      country: 'SA',
      city: 'Riyadh',
      postal_code: '11564',
      address: 'King Fahd Road'
    },
    destination: {
      country: 'SA',
      city: 'Jeddah',
      postal_code: '21589',
      address: 'Corniche Road'
    },
    package: {
      weight: 1.5,
      dimensions: { length: 30, width: 20, height: 15 },
      value: 500,
      description: 'Electronics'
    }
  });

  useEffect(() => {
    loadShippingData();
  }, []);

  const loadShippingData = async () => {
    try {
      setLoading(true);
      
      // Load active providers
      const providers = shippingManager.getActiveProviders();
      setActiveProviders(providers);

      // Load shipping stats
      const stats = await shippingManager.getShippingStats('month');
      setShippingStats(stats);
    } catch (error) {
      console.error('Failed to load shipping data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getShippingRates = async () => {
    setRatesLoading(true);
    try {
      const rates = await shippingManager.getShippingRates(shippingRequest);
      setShippingRates(rates);
    } catch (error) {
      console.error('Failed to get shipping rates:', error);
    } finally {
      setRatesLoading(false);
    }
  };

  const trackShipment = async () => {
    if (!trackingNumber.trim()) return;
    
    setTrackingLoading(true);
    try {
      const info = await shippingManager.trackShipment(trackingNumber);
      setTrackingInfo(info);
    } catch (error) {
      console.error('Failed to track shipment:', error);
    } finally {
      setTrackingLoading(false);
    }
  };

  const getProviderIcon = (type: ShippingProvider['type']) => {
    switch (type) {
      case 'express': return <Zap className="w-5 h-5" />;
      case 'international': return <Plane className="w-5 h-5" />;
      case 'standard': return <Truck className="w-5 h-5" />;
      case 'economy': return <Ship className="w-5 h-5" />;
      case 'local': return <Package className="w-5 h-5" />;
      default: return <Truck className="w-5 h-5" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'out_for_delivery':
        return <Truck className="w-4 h-4 text-blue-500" />;
      case 'in_transit':
        return <Route className="w-4 h-4 text-yellow-500" />;
      case 'picked_up':
        return <Package className="w-4 h-4 text-indigo-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading shipping providers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Shipping & Logistics Integration</h1>
            <p className="text-blue-100 mt-1">
              20+ shipping providers • 30% faster delivery • Global coverage
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">
              {activeProviders.length}
            </div>
            <div className="text-blue-100">Active Providers</div>
          </div>
        </div>
      </div>

      {/* Shipping Statistics */}
      {shippingStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Shipments</p>
                <p className="text-2xl font-bold text-gray-900">{shippingStats.total_shipments}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Delivery Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {shippingStats.delivery_rate.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Delivery Time</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {shippingStats.average_delivery_time} days
                </p>
              </div>
              <Timer className="w-8 h-8 text-indigo-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Transit</p>
                <p className="text-2xl font-bold text-yellow-600">{shippingStats.in_transit_shipments}</p>
              </div>
              <Route className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Shipping Providers */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-indigo-600" />
              Active Shipping Providers
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {activeProviders.map((provider) => (
              <div key={provider.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    {getProviderIcon(provider.type)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{provider.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{provider.type}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {provider.supportedCountries.slice(0, 4).map((country) => (
                        <span key={country} className="px-2 py-1 bg-gray-100 text-xs rounded">
                          {country}
                        </span>
                      ))}
                      {provider.supportedCountries.length > 4 && (
                        <span className="px-2 py-1 bg-gray-100 text-xs rounded">
                          +{provider.supportedCountries.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    {provider.estimatedDays.domestic.min}-{provider.estimatedDays.domestic.max} days
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Package Tracking */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Search className="w-5 h-5 mr-2 text-indigo-600" />
              Track Shipment
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                onClick={trackShipment}
                disabled={trackingLoading || !trackingNumber.trim()}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {trackingLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </button>
            </div>

            {trackingInfo && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">
                      Tracking: {trackingInfo.tracking_number}
                    </h3>
                    <div className="flex items-center">
                      {getStatusIcon(trackingInfo.status)}
                      <span className="ml-2 text-sm font-medium capitalize">
                        {trackingInfo.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    {trackingInfo.location}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {trackingInfo.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Tracking History</h4>
                  {trackingInfo.events.map((event, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 border-l-2 border-gray-200">
                      {getStatusIcon(event.status)}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {event.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(event.timestamp).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })} • {event.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Shipping Rate Calculator */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-indigo-600" />
            Shipping Rate Calculator
          </h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Origin */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Origin</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={shippingRequest.origin.country}
                    onChange={(e) => setShippingRequest(prev => ({
                      ...prev,
                      origin: { ...prev.origin, country: e.target.value }
                    }))}
                    placeholder="Country"
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <input
                    type="text"
                    value={shippingRequest.origin.city}
                    onChange={(e) => setShippingRequest(prev => ({
                      ...prev,
                      origin: { ...prev.origin, city: e.target.value }
                    }))}
                    placeholder="City"
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <input
                  type="text"
                  value={shippingRequest.origin.postal_code}
                  onChange={(e) => setShippingRequest(prev => ({
                    ...prev,
                    origin: { ...prev.origin, postal_code: e.target.value }
                  }))}
                  placeholder="Postal Code"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Destination */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Destination</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={shippingRequest.destination.country}
                    onChange={(e) => setShippingRequest(prev => ({
                      ...prev,
                      destination: { ...prev.destination, country: e.target.value }
                    }))}
                    placeholder="Country"
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <input
                    type="text"
                    value={shippingRequest.destination.city}
                    onChange={(e) => setShippingRequest(prev => ({
                      ...prev,
                      destination: { ...prev.destination, city: e.target.value }
                    }))}
                    placeholder="City"
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <input
                  type="text"
                  value={shippingRequest.destination.postal_code}
                  onChange={(e) => setShippingRequest(prev => ({
                    ...prev,
                    destination: { ...prev.destination, postal_code: e.target.value }
                  }))}
                  placeholder="Postal Code"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Package Details */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Package Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="number"
                value={shippingRequest.package.weight}
                onChange={(e) => setShippingRequest(prev => ({
                  ...prev,
                  package: { ...prev.package, weight: Number(e.target.value) }
                }))}
                placeholder="Weight (kg)"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                min="0.1"
                step="0.1"
              />
              <input
                type="number"
                value={shippingRequest.package.dimensions.length}
                onChange={(e) => setShippingRequest(prev => ({
                  ...prev,
                  package: { 
                    ...prev.package, 
                    dimensions: { ...prev.package.dimensions, length: Number(e.target.value) }
                  }
                }))}
                placeholder="Length (cm)"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                min="1"
              />
              <input
                type="number"
                value={shippingRequest.package.dimensions.width}
                onChange={(e) => setShippingRequest(prev => ({
                  ...prev,
                  package: { 
                    ...prev.package, 
                    dimensions: { ...prev.package.dimensions, width: Number(e.target.value) }
                  }
                }))}
                placeholder="Width (cm)"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                min="1"
              />
              <input
                type="number"
                value={shippingRequest.package.dimensions.height}
                onChange={(e) => setShippingRequest(prev => ({
                  ...prev,
                  package: { 
                    ...prev.package, 
                    dimensions: { ...prev.package.dimensions, height: Number(e.target.value) }
                  }
                }))}
                placeholder="Height (cm)"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                min="1"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <input
                type="number"
                value={shippingRequest.package.value}
                onChange={(e) => setShippingRequest(prev => ({
                  ...prev,
                  package: { ...prev.package, value: Number(e.target.value) }
                }))}
                placeholder="Package Value (SAR)"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                min="1"
              />
              <input
                type="text"
                value={shippingRequest.package.description}
                onChange={(e) => setShippingRequest(prev => ({
                  ...prev,
                  package: { ...prev.package, description: e.target.value }
                }))}
                placeholder="Package Description"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            onClick={getShippingRates}
            disabled={ratesLoading}
            className="w-full md:w-auto bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {ratesLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Getting Rates...
              </>
            ) : (
              'Get Shipping Rates'
            )}
          </button>

          {/* Shipping Rates Results */}
          {shippingRates.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Available Shipping Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {shippingRates.map((rate, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:border-indigo-300">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 capitalize">
                        {activeProviders.find(p => p.id === rate.provider_id)?.name}
                      </h4>
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded capitalize">
                        {rate.service_type}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cost:</span>
                        <span className="font-medium">{rate.cost} {rate.currency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivery:</span>
                        <span className="font-medium">{rate.estimated_days} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tracking:</span>
                        <span className={rate.tracking_available ? 'text-green-600' : 'text-red-600'}>
                          {rate.tracking_available ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Insurance:</span>
                        <span className={rate.insurance_available ? 'text-green-600' : 'text-red-600'}>
                          {rate.insurance_available ? 'Available' : 'Not Available'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Provider Performance Breakdown */}
      {shippingStats && Object.keys(shippingStats.provider_breakdown).length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
              Provider Performance Breakdown
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(shippingStats.provider_breakdown).map(([providerId, stats]) => (
                <div key={providerId} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900 capitalize">
                      {activeProviders.find(p => p.id === providerId)?.name || providerId}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded ${
                      stats.delivered > stats.failed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {stats.total > 0 ? ((stats.delivered / stats.total) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-medium">{stats.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivered:</span>
                      <span className="font-medium text-green-600">{stats.delivered}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">In Transit:</span>
                      <span className="font-medium text-yellow-600">{stats.in_transit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Failed:</span>
                      <span className="font-medium text-red-600">{stats.failed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Cost:</span>
                      <span className="font-medium">{stats.cost.toLocaleString()} SAR</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

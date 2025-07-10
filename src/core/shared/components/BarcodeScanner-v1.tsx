// @ts-nocheck
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/domains/shared/components/ui';
import { Scan, Upload, Search, ShoppingBag, Plus, Info } from 'lucide-react';
import { useTranslation } from '@/domains/shared/hooks/useTranslation';
import { exportToCSV } from '@/utilities/data-export';

// Types for barcode scanner functionality
interface GlobalItem {
  id: string;
  barcode: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  image_url: string;
  created_at: string;
}

interface StoreInventory {
  id: string;
  store_id: string;
  global_item_id: string;
  store_price: number;
  store_cost: number;
  quantity: number;
  min_stock_level: number;
  store_specific_notes: string;
  store_name?: string;
}

interface EnrichedInventoryItem extends StoreInventory {
  item: GlobalItem;
  store_name: string;
}

export default function BarcodeScanner() {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanning, setScanning] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [scanResult, setScanResult] = useState<{
    globalItem: GlobalItem | null;
    storeInventory: EnrichedInventoryItem[];
  }>({
    globalItem: null,
    storeInventory: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  
  // Function to start the barcode scanner
  const startScanner = async () => {
    setScanning(true);
    setError(null);
    
    try {
      const constraints = {
        video: {
          facingMode: 'environment',
        },
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        requestAnimationFrame(scanBarcode);
      }
    } catch (err) {
      setError(t('barcode.camera_error'));
      setScanning(false);
      console.error('Error accessing camera:', err);
    }
  };
  
  // Function to stop the scanner
  const stopScanner = () => {
    setScanning(false);
    
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };
  
  // Function to scan for barcodes in video feed
  const scanBarcode = () => {
    if (!scanning || !videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (context && video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // This is where we would integrate with a barcode scanning library
      // For this implementation, we'll simulate finding a barcode
      
      // Simulated barcode detection (would be replaced with actual detection)
      const simulateDetection = Math.random() > 0.95; // Occasionally "detect" a barcode
      
      if (simulateDetection) {
        // Generate a random barcode for demo purposes
        const simulatedBarcode = Math.floor(100000000000 + Math.random() * 900000000000).toString();
        setBarcode(simulatedBarcode);
        stopScanner();
        searchBarcode(simulatedBarcode);
        return;
      }
      
      requestAnimationFrame(scanBarcode);
    } else {
      requestAnimationFrame(scanBarcode);
    }
  };
  
  // Function to manually enter a barcode
  const handleManualEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (barcode.trim()) {
      searchBarcode(barcode);
    }
  };
  
  // Function to search for a barcode
  const searchBarcode = async (code: string) => {
    setLoading(true);
    setScanResult({ globalItem: null, storeInventory: [] });
    setError(null);
    
    try {
      const response = await fetch(`/api/excel-import/search?barcode=${code}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t('barcode.search_error'));
      }
      
      const data = await response.json();
      setScanResult(data);
      
      if (!data.globalItem) {
        setShowInfoModal(true);
      }
    } catch (err) {
      console.error('Error searching barcode:', err);
      setError(err instanceof Error ? err.message : t('barcode.search_error'));
    } finally {
      setLoading(false);
    }
  };
  
  // Function to add a new global item
  const addNewGlobalItem = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/excel-import', {
        method: 'POST',
        body: JSON.stringify({
          action: 'create_global_item',
          barcode: barcode,
          name: formData.get('name'),
          description: formData.get('description'),
          category: formData.get('category'),
          brand: formData.get('brand'),
          image_url: formData.get('image_url'),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t('barcode.add_error'));
      }
      
      const data = await response.json();
      setScanResult({
        globalItem: data,
        storeInventory: [],
      });
      setShowInfoModal(false);
    } catch (err) {
      console.error('Error adding global item:', err);
      setError(err instanceof Error ? err.message : t('barcode.add_error'));
    } finally {
      setLoading(false);
    }
  };
  
  // Function to add item to store inventory
  const addToStoreInventory = async (formData: FormData) => {
    if (!scanResult.globalItem) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/excel-import', {
        method: 'POST',
        body: JSON.stringify({
          action: 'add_to_store_inventory',
          global_item_id: scanResult.globalItem.id,
          store_price: parseFloat(formData.get('store_price') as string),
          store_cost: parseFloat(formData.get('store_cost') as string),
          quantity: parseInt(formData.get('quantity') as string, 10),
          min_stock_level: parseInt(formData.get('min_stock_level') as string, 10),
          store_specific_notes: formData.get('store_specific_notes'),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t('barcode.add_inventory_error'));
      }
      
      // Refresh the search to show updated inventory
      searchBarcode(barcode);
    } catch (err) {
      console.error('Error adding to inventory:', err);
      setError(err instanceof Error ? err.message : t('barcode.add_inventory_error'));
    } finally {
      setLoading(false);
    }
  };

  // Function to export inventory data
  const exportInventoryData = () => {
    if (!scanResult.storeInventory || scanResult.storeInventory.length === 0) {
      setError(t('export.no_data'));
      return;
    }

    const exportData = scanResult.storeInventory.map(item => ({
      barcode: scanResult.globalItem?.barcode || '',
      item_name: scanResult.globalItem?.name || '',
      store_name: item.store_name,
      store_price: item.store_price,
      store_cost: item.store_cost,
      quantity: item.quantity,
      min_stock_level: item.min_stock_level,
      notes: item.store_specific_notes,
    }));

    exportToCSV(exportData, {
      filename: `inventory-${barcode}.csv`,
    });
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (scanning) {
        stopScanner();
      }
    };
  }, [scanning]);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold">{t('barcode.title')}</h1>
        <p className="text-gray-600">{t('barcode.description')}</p>
        
        {/* Camera access */}
        <div className="flex flex-col items-center space-y-4 p-4 border rounded-lg">
          <div className="relative w-full max-w-md h-64 bg-black rounded overflow-hidden">
            {scanning ? (
              <>
                <video ref={videoRef} className="w-full h-full object-cover" />
                <canvas ref={canvasRef} className="hidden" />
                <div className="absolute inset-0 border-2 border-dashed border-yellow-400 pointer-events-none" />
              </>
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-100">
                <Scan className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="flex space-x-4">
            {scanning ? (
              <Button onClick={stopScanner}>{t('barcode.stop_scanning')}</Button>
            ) : (
              <Button onClick={startScanner}>{t('barcode.start_scanning')}</Button>
            )}
          </div>
        </div>
        
        {/* Manual entry */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">{t('barcode.manual_entry')}</h2>
          <form onSubmit={handleManualEntry} className="flex space-x-4">
            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder={t('barcode.enter_barcode')}
              className="flex-1 border rounded-md px-4 py-2"
            />
            <Button type="submit" disabled={loading}>
              <Search className="mr-2 h-4 w-4" />
              {t('barcode.search')}
            </Button>
          </form>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        {/* Search results */}
        {!loading && scanResult.globalItem && (
          <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">{t('barcode.item_details')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">{scanResult.globalItem.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{t('barcode.barcode')}: {scanResult.globalItem.barcode}</p>
                <p className="mb-2">{scanResult.globalItem.description}</p>
                <div className="flex space-x-2 mb-4">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {scanResult.globalItem.category}
                  </span>
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                    {scanResult.globalItem.brand}
                  </span>
                </div>
              </div>
              {scanResult.globalItem.image_url && (
                <div className="flex justify-center">
                  <img 
                    src={scanResult.globalItem.image_url} 
                    alt={scanResult.globalItem.name} 
                    className="h-32 w-32 object-cover rounded"
                  />
                </div>
              )}
            </div>
            
            {/* Store inventory */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{t('barcode.store_inventory')}</h3>
                <div className="flex space-x-2">
                  <Button onClick={() => document.getElementById('add-inventory-form')?.classList.toggle('hidden')}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('barcode.add_to_inventory')}
                  </Button>
                  {scanResult.storeInventory.length > 0 && (
                    <Button onClick={exportInventoryData}>
                      {t('export.export')}
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Add to inventory form */}
              <form 
                id="add-inventory-form" 
                className="hidden mb-6 p-4 border rounded-lg bg-gray-50"
                onSubmit={(e) => {
                  e.preventDefault();
                  addToStoreInventory(new FormData(e.currentTarget));
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('barcode.store_price')}</label>
                    <input 
                      type="number" 
                      name="store_price" 
                      step="0.01" 
                      min="0" 
                      required 
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('barcode.store_cost')}</label>
                    <input 
                      type="number" 
                      name="store_cost" 
                      step="0.01" 
                      min="0" 
                      required 
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('barcode.quantity')}</label>
                    <input 
                      type="number" 
                      name="quantity" 
                      min="0" 
                      required 
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('barcode.min_stock')}</label>
                    <input 
                      type="number" 
                      name="min_stock_level" 
                      min="0" 
                      required 
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">{t('barcode.notes')}</label>
                  <textarea 
                    name="store_specific_notes" 
                    className="w-full border rounded-md px-3 py-2"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={loading}>
                    {t('barcode.save_to_inventory')}
                  </Button>
                </div>
              </form>
              
              {/* Inventory list */}
              {scanResult.storeInventory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('barcode.store')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('barcode.price')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('barcode.stock')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('barcode.min_stock')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('barcode.notes')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {scanResult.storeInventory.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.store_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.store_price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.min_stock_level}
                          </td>
                          <td className="px-6 py-4">
                            <div className="truncate max-w-xs">
                              {item.store_specific_notes}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 bg-gray-50 border rounded-lg">
                  <ShoppingBag className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">{t('barcode.no_inventory')}</p>
                  <p className="text-sm text-gray-500 mb-4">{t('barcode.add_first_inventory')}</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Item not found - create new modal */}
        {showInfoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-lg w-full mx-4 overflow-hidden">
              <div className="p-4 bg-blue-50 flex items-start">
                <Info className="h-6 w-6 text-blue-500 mr-3" />
                <div>
                  <h3 className="font-semibold">{t('barcode.item_not_found')}</h3>
                  <p className="text-sm text-gray-600">{t('barcode.create_new_item')}</p>
                </div>
              </div>
              
              <form 
                className="p-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  addNewGlobalItem(new FormData(e.currentTarget));
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">{t('barcode.item_name')}</label>
                    <input 
                      type="text" 
                      name="name" 
                      required 
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">{t('barcode.description')}</label>
                    <textarea 
                      name="description" 
                      className="w-full border rounded-md px-3 py-2"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('barcode.category')}</label>
                    <input 
                      type="text" 
                      name="category" 
                      required 
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('barcode.brand')}</label>
                    <input 
                      type="text" 
                      name="brand" 
                      required 
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">{t('barcode.image_url')}</label>
                    <input 
                      type="url" 
                      name="image_url" 
                      className="w-full border rounded-md px-3 py-2"
                      placeholder="https://..."
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <Button 
                    type="button" 
                    onClick={() => setShowInfoModal(false)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800"
                  >
                    {t('barcode.cancel')}
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {t('barcode.create_item')}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



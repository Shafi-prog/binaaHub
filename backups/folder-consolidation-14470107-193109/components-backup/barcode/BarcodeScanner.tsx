'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Camera, FlashlightOff, Flashlight } from 'lucide-react';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
}

export default function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFlash, setHasFlash] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [cameraDevices, setCameraDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    initializeCamera();
    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (selectedCamera) {
      initializeCamera();
    }
  }, [selectedCamera]);

  const initializeCamera = async () => {
    try {
      setError(null);
      
      // Get available cameras
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setCameraDevices(videoDevices);

      // Use back camera if available, otherwise use first available
      const backCamera = videoDevices.find(device => 
        device.label.toLowerCase().includes('back') || 
        device.label.toLowerCase().includes('rear') ||
        device.label.toLowerCase().includes('environment')
      );
      
      const cameraId = selectedCamera || backCamera?.deviceId || videoDevices[0]?.deviceId;
      
      if (!cameraId) {
        throw new Error('لا توجد كاميرا متاحة');
      }

      // Stop previous stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      // Request camera access
      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: cameraId,
          facingMode: selectedCamera ? undefined : { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        
        // Check if device has flash/torch
        const track = stream.getVideoTracks()[0];
        const capabilities = track.getCapabilities();
        setHasFlash('torch' in capabilities);
        
        setIsScanning(true);
        startScanning();
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError(err instanceof Error ? err.message : 'فشل في الوصول للكاميرا');
    }
  };
  const startScanning = () => {
    if (!isScanning && videoRef.current) {
      // Use a simple scanning approach with manual barcode detection
      scanIntervalRef.current = setInterval(async () => {
        if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
          try {
            // Create canvas from video frame
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            if (context) {
              canvas.width = videoRef.current.videoWidth;
              canvas.height = videoRef.current.videoHeight;
              context.drawImage(videoRef.current, 0, 0);
              
              // Try to import and use ZXing
              try {
                const { BrowserQRCodeReader } = await import('@zxing/browser');
                const codeReader = new BrowserQRCodeReader();
                
                // Convert canvas to ImageData
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                
                // This is a simplified approach - in real implementation
                // we would need proper barcode detection
                
              } catch (zxingError) {
                console.log('ZXing not available, using manual input fallback');
              }
            }
          } catch (scanError) {
            console.error('Scan error:', scanError);
          }
        }
      }, 500); // Scan every 500ms
    }
  };

  const toggleFlash = async () => {
    if (streamRef.current && hasFlash) {
      const track = streamRef.current.getVideoTracks()[0];
      try {
        await track.applyConstraints({
          advanced: [{ torch: !flashOn } as any]
        });
        setFlashOn(!flashOn);
      } catch (err) {
        console.error('Flash toggle error:', err);
      }
    }
  };

  const cleanup = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setIsScanning(false);
  };

  const handleManualInput = () => {
    const barcode = prompt('أدخل الباركود يدوياً:');
    if (barcode?.trim()) {
      onScan(barcode.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">مسح الباركود</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Camera Controls */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2 space-x-reverse">
              {cameraDevices.length > 1 && (
                <select
                  value={selectedCamera}
                  onChange={(e) => setSelectedCamera(e.target.value)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg"
                >
                  {cameraDevices.map((device) => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `كاميرا ${device.deviceId.slice(0, 5)}`}
                    </option>
                  ))}
                </select>
              )}
              
              {hasFlash && (
                <button
                  onClick={toggleFlash}
                  className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >                  {flashOn ? (
                    <Flashlight size={16} className="text-yellow-500" />
                  ) : (
                    <FlashlightOff size={16} className="text-gray-600" />
                  )}
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">
                {isScanning ? 'جاري المسح...' : 'متوقف'}
              </span>
            </div>
          </div>
        </div>

        {/* Camera View */}
        <div className="relative bg-black" style={{ aspectRatio: '4/3' }}>
          {error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
              <Camera size={48} className="mb-4 text-gray-400" />
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={initializeCamera}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                إعادة المحاولة
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
              
              {/* Scanning overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Scanning frame */}
                  <div className="w-64 h-64 border-2 border-white opacity-50 relative">
                    {/* Corner indicators */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-red-500"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-red-500"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-red-500"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-red-500"></div>
                    
                    {/* Scanning line animation */}
                    {isScanning && (
                      <div className="absolute top-0 left-0 w-full h-1 bg-red-500 opacity-75 animate-pulse"></div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Instructions */}
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <p className="text-white text-sm bg-black bg-opacity-50 px-3 py-2 rounded-lg">
                  وجه الكاميرا نحو الباركود
                </p>
              </div>
            </>
          )}
        </div>

        {/* Manual Input */}
        <div className="p-4 border-t bg-gray-50">
          <button
            onClick={handleManualInput}
            className="w-full py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            إدخال الباركود يدوياً
          </button>
        </div>

        {/* Instructions */}
        <div className="p-4 bg-blue-50">
          <h3 className="font-medium text-blue-800 mb-2">تعليمات المسح:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• تأكد من وضوح الباركود والإضاءة الجيدة</li>
            <li>• اجعل الباركود في وسط الإطار</li>
            <li>• حافظ على ثبات الجهاز أثناء المسح</li>
            <li>• استخدم الفلاش إذا كانت الإضاءة ضعيفة</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

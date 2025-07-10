"use client";

import React, { useState, useRef, useEffect } from 'react';

interface BarcodeScannerProps {
  onScan?: (result: string) => void;
  onError?: (error: string) => void;
  width?: number;
  height?: number;
  className?: string;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onScan,
  onError,
  width = 640,
  height = 480,
  className = ""
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastScan, setLastScan] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Use back camera if available
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
        setError(null);
      }
    } catch (err) {
      const errorMessage = 'Failed to access camera. Please check permissions.';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  };

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const simulateBarcodeScan = () => {
    // For demo purposes, simulate scanning a random barcode
    const mockBarcodes = [
      '1234567890123',
      '9876543210987',
      '1111222233334',
      '5555666677778'
    ];
    const randomBarcode = mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)];
    setLastScan(randomBarcode);
    onScan?.(randomBarcode);
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <div className={`barcode-scanner ${className}`}>
      <div className="scanner-container bg-gray-100 rounded-lg p-4">
        <div className="camera-view relative bg-black rounded-lg overflow-hidden" style={{ width, height }}>
          {isScanning ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              <div className="text-center">
                <div className="text-6xl mb-4">📷</div>
                <p>Camera not active</p>
              </div>
            </div>
          )}
          
          {/* Scanning overlay */}
          {isScanning && (
            <div className="absolute inset-0 border-2 border-red-500 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-32 border-2 border-red-500 bg-red-500 bg-opacity-10">
                <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse"></div>
              </div>
            </div>
          )}
        </div>

        <div className="controls mt-4 flex gap-2 justify-center">
          {!isScanning ? (
            <button
              onClick={startScanning}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Start Scanner
            </button>
          ) : (
            <button
              onClick={stopScanning}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Stop Scanner
            </button>
          )}
          
          <button
            onClick={simulateBarcodeScan}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Simulate Scan
          </button>
        </div>

        {error && (
          <div className="error mt-4 p-3 bg-red-100 border border-red-300 rounded-md text-red-700">
            {error}
          </div>
        )}

        {lastScan && (
          <div className="result mt-4 p-3 bg-green-100 border border-green-300 rounded-md">
            <strong>Last Scan:</strong> {lastScan}
          </div>
        )}

        <div className="instructions mt-4 text-sm text-gray-600">
          <h4 className="font-semibold mb-2">Instructions:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Position the barcode within the red frame</li>
            <li>Ensure good lighting for best results</li>
            <li>Hold steady until the barcode is detected</li>
            <li>Use "Simulate Scan" for testing without a camera</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;

'use client';
import { useEffect, useRef } from 'react';

interface MapPickerProps {
  initialLocation?: { lat: number; lng: number } | null;
  onLocationSelect?: (location: { lat: number; lng: number }) => void;
  readOnly?: boolean;
}

export function MapPicker({ initialLocation, onLocationSelect, readOnly = false }: MapPickerProps) {
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const defaultLocation = { lat: 24.7136, lng: 46.6753 }; // Riyadh

  useEffect(() => {
    // Add a manual input for coordinates in a simple form
    const container = document.getElementById('map-container');
    if (!container) return;

    if (readOnly && initialLocation) {
      container.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full bg-gray-50 p-4">
          <p class="text-gray-600 mb-2">الموقع المحفوظ:</p>
          <p class="text-gray-800 font-mono">${initialLocation.lat.toFixed(6)}, ${initialLocation.lng.toFixed(6)}</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="p-4 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">خط العرض (Latitude)</label>
          <input type="number" id="lat-input" step="any" value="${initialLocation?.lat || defaultLocation.lat}"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ${readOnly ? 'disabled' : ''}
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">خط الطول (Longitude)</label>
          <input type="number" id="lng-input" step="any" value="${initialLocation?.lng || defaultLocation.lng}"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ${readOnly ? 'disabled' : ''}
          />
        </div>
        ${
          !readOnly
            ? `
          <button id="update-location" class="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            تحديث الموقع
          </button>
        `
            : ''
        }
      </div>
    `;

    if (!readOnly) {
      const updateBtn = document.getElementById('update-location');
      const latInput = document.getElementById('lat-input') as HTMLInputElement;
      const lngInput = document.getElementById('lng-input') as HTMLInputElement;

      updateBtn?.addEventListener('click', () => {
        const lat = parseFloat(latInput.value);
        const lng = parseFloat(lngInput.value);

        if (!isNaN(lat) && !isNaN(lng)) {
          onLocationSelect?.({ lat, lng });
        }
      });
    }
  }, [initialLocation, onLocationSelect, readOnly]);

  return <div id="map-container" className="w-full h-full" />;
}

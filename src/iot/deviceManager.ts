// @ts-nocheck
// IoT Device Management Module (Phase 4)
// Placeholder for device registration, data ingestion, and monitoring

export interface IoTDevice {
  id: string;
  name: string;
  status: 'online' | 'offline';
  lastSeen: Date;
  temp?: number;
}

export const devices: IoTDevice[] = [
  { id: 'dev-001', name: 'Warehouse Sensor', status: 'online', lastSeen: new Date(), temp: 25 },
  { id: 'dev-002', name: 'Storefront Camera', status: 'offline', lastSeen: new Date(Date.now() - 3600 * 1000), temp: 0 },
];

export function getOnlineDevices() {
  return devices.filter((d) => d.status === 'online');
}

export function registerDevice(device: IoTDevice) {
  devices.push(device);
}

// Simulate backend data ingestion and alerting
export function ingestDeviceData(id: string, temp: number): string | null {
  const device = devices.find((d) => d.id === id);
  if (device) {
    device.temp = temp;
    device.lastSeen = new Date();
    if (temp > 30) {
      return `ALERT: ${device.name} temperature is too high (${temp}°C)!`;
    }
  }
  return null;
}



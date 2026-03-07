const DEVICE_ID_KEY = 'hotel_atenas_device_id';

function generateDeviceId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function getDeviceId(): string {
  if (typeof window === 'undefined') return '';

  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = generateDeviceId();
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
}

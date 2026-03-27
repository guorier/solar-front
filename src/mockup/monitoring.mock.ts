// src\mockup\monitoring.mock.ts
export interface MonitoringData {
  power: number;
  voltage: number;
  current: number;
  status: 'normal' | 'warning' | 'error';
  timestamp: number;
}

export const monitoringMock: MonitoringData = {
  power: 1200,
  voltage: 380,
  current: 32,
  status: 'normal',
  timestamp: Date.now(),
};

export function generateMonitoringMock(): MonitoringData {
  // console.log('polling 실행');

  const power = 1100 + Math.floor(Math.random() * 200);
  const voltage = 370 + Math.floor(Math.random() * 20);
  const current = 30 + Math.floor(Math.random() * 5);

  return {
    power,
    voltage,
    current,
    status: 'normal',
    timestamp: Date.now(),
  };
}
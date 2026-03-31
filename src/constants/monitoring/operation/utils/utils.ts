import { PIE_COLORS } from './constants';
import type { EnergyDisplay, PowerDisplay } from './types';

export const safeToFixed = (value: number | string | null | undefined, digits: number) => {
  const num = Number(value ?? 0);
  return Number((Number.isFinite(num) ? num : 0).toFixed(digits));
};

export const toChartValue = (value: number) => (value > 0 ? safeToFixed(value, 2) : 0.0001);

export const getProgressPercent = (value: number, max: number) =>
  Math.min(safeToFixed((Math.max(value, 0) / max) * 100, 2), 100);

export const formatPowerDisplay = (value: number | null | undefined): PowerDisplay => {
  const safeValue = value ?? 0;
  if (safeValue >= 1000) return { value: safeToFixed(safeValue / 1000, 2), unit: 'kW' };
  return { value: safeToFixed(safeValue, 2), unit: 'W' };
};

export const formatEnergyDisplay = (value: number | null | undefined): EnergyDisplay => {
  const safeValue = value ?? 0;
  if (safeValue >= 1000) return { value: safeToFixed(safeValue / 1000, 2), unit: 'MWh' };
  return { value: safeToFixed(safeValue, 2), unit: 'kWh' };
};

export const getInverterColor = (deviceAddresses: number) =>
  PIE_COLORS[(Math.max(deviceAddresses, 1) - 1) % PIE_COLORS.length];

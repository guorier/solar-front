import { getInverterColor, safeToFixed, toChartValue } from './utils';
import type { DonutDataItem, RealtimeInverterItem } from './types';

const getInverterLabel = (item: RealtimeInverterItem) =>
  item.displayName ?? `인버터 ${item.sourceDeviceAddresses ?? item.deviceAddresses}`;

const mapChartData = (
  inverterMap: Record<number, RealtimeInverterItem>,
  getValue: (item: RealtimeInverterItem) => number,
  unit: DonutDataItem['unit'],
): DonutDataItem[] =>
  Object.values(inverterMap)
    .sort((a, b) => a.deviceAddresses - b.deviceAddresses)
    .map((item) => ({
      name: getInverterLabel(item),
      value: toChartValue(getValue(item)),
      rawValue: safeToFixed(getValue(item), 2),
      unit,
      color: getInverterColor(item.deviceAddresses),
    }));

export const buildPowerChartData = (
  inverterMap: Record<number, RealtimeInverterItem>,
): DonutDataItem[] => mapChartData(inverterMap, (item) => item.gridPowerW, 'W');

export const buildPowerFactorChartData = (
  inverterMap: Record<number, RealtimeInverterItem>,
): DonutDataItem[] => mapChartData(inverterMap, (item) => item.gridPowerFactor, '%');

export const buildFrequencyChartData = (
  inverterMap: Record<number, RealtimeInverterItem>,
): DonutDataItem[] => mapChartData(inverterMap, (item) => item.gridFrequencyHz, 'Hz');

export const buildTodayPowerChartData = (
  inverterMap: Record<number, RealtimeInverterItem>,
): DonutDataItem[] => mapChartData(inverterMap, (item) => item.todayPower, 'Wh');

export const buildEfficiencyChartData = (
  inverterMap: Record<number, RealtimeInverterItem>,
): DonutDataItem[] => mapChartData(inverterMap, (item) => item.efficiency, '%');

export const buildInverterTotalEnergyChartData = (
  inverterMap: Record<number, RealtimeInverterItem>,
): DonutDataItem[] => mapChartData(inverterMap, (item) => item.inverterTotalEnergy, 'kWh');

export const buildIrradianceChartData = (
  inverterMap: Record<number, RealtimeInverterItem>,
): DonutDataItem[] => mapChartData(inverterMap, (item) => item.irradianceWm2, 'W');

export const buildTemperatureChartData = (
  inverterMap: Record<number, RealtimeInverterItem>,
): DonutDataItem[] => mapChartData(inverterMap, (item) => item.temperatureC, '%');

export const buildPredictionPowerChartData = (
  inverterMap: Record<number, RealtimeInverterItem>,
): DonutDataItem[] => mapChartData(inverterMap, (item) => item.predictionPowerW, 'W');

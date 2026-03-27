// 차트 데이터 가공 함수
import { getInverterColor, toChartValue } from './utils';
import type { DonutDataItem, RealtimeInverterItem } from './types';

const mapChartData = (
  inverterMap: Record<number, RealtimeInverterItem>,
  getValue: (item: RealtimeInverterItem) => number,
): DonutDataItem[] =>
  Object.values(inverterMap)
    .sort((a, b) => a.deviceAddresses - b.deviceAddresses)
    .map((item) => ({
      name: `인버터-${item.deviceAddresses}`,
      value: toChartValue(getValue(item)),
      color: getInverterColor(item.deviceAddresses),
    }));

export const buildVoltageChartData = (
  inverterMap: Record<number, RealtimeInverterItem>,
): DonutDataItem[] => mapChartData(inverterMap, (item) => item.averageVoltage);

export const buildPowerFactorChartData = (
  inverterMap: Record<number, RealtimeInverterItem>,
): DonutDataItem[] => mapChartData(inverterMap, (item) => item.gridPowerFactor);

export const buildFrequencyChartData = (
  inverterMap: Record<number, RealtimeInverterItem>,
): DonutDataItem[] => mapChartData(inverterMap, (item) => item.gridFrequencyHz);

export const buildTodayPowerChartData = (
  inverterMap: Record<number, RealtimeInverterItem>,
): DonutDataItem[] => mapChartData(inverterMap, (item) => item.todayPower);

export const buildOperationStatusChartData = (
  inverterMap: Record<number, RealtimeInverterItem>,
): DonutDataItem[] => mapChartData(inverterMap, (item) => item.irradianceWm2);

export const buildConnectionStatusChartData = (
  inverterMap: Record<number, RealtimeInverterItem>,
): DonutDataItem[] => mapChartData(inverterMap, (item) => item.temperatureC);

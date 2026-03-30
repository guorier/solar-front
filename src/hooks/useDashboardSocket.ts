'use client';

import { useState, useMemo } from 'react';
import { useRealtimeSocket } from '@/hooks/useRealtimeSocket';

type AlarmLevel = 'NORMAL' | 'MAJOR' | 'CRITICAL';

type InverterErrors = {
  topLevel?: AlarmLevel;
  topMessage?: string;
  criticalCount?: number;
};

type SocketBranch = {
  gridPowerW?: number;
  powerKw?: number;
  currentPowerKw?: number;
  capacityKw?: number;
  todayGenerationKwh?: number;
  todayGenerationMwh?: number;
  avgOperationRate?: number;
  operationRate?: number;
  areaNm?: string;
  pwplNm?: string;
  pwplLat?: number;
  pwplLot?: number;
  updateTime?: string;
  updatedAt?: string;
  inverterErrors?: InverterErrors;
};

type SocketMessage = {
  header?: {
    mac?: string;
  };
  inverter?: SocketBranch;
  summary?: SocketBranch;
  plant?: SocketBranch;
  dashboard?: SocketBranch;
  payload?: SocketBranch;
};

type SocketTarget = {
  pwplId: string;
  macAddr?: string;
};

type FlatDeviceMessage = {
  targetPwplId?: string;
  deviceAddresses?: string | number;
  powerW?: number | string;
  todayPower?: number | string;
  conversionEfficiency?: number | string;
};

type DeviceData = {
  powerW: number;
  todayPower: number;
  conversionEfficiency: number;
};

export type PlantAggSummary = {
  currentPowerKw: number;
  todayGenerationKwh: number;
  avgOperationRate: number;
};

type DashboardSocketState = {
  topLevel?: AlarmLevel;
  topMessage?: string;
  criticalCount?: number;
  gridPowerW?: number;
  powerKw?: number;
  currentPowerKw?: number;
  capacityKw?: number;
  todayGenerationKwh?: number;
  todayGenerationMwh?: number;
  avgOperationRate?: number;
  operationRate?: number;
  areaNm?: string;
  pwplNm?: string;
  pwplLat?: number;
  pwplLot?: number;
  updateTime?: string;
  updatedAt?: string;
  rawPayload?: unknown;
};

const normalizeMac = (value: string | null | undefined) =>
  String(value ?? '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');

const pickFirstNumber = (...values: Array<number | undefined>): number | undefined => {
  return values.find((value) => typeof value === 'number' && Number.isFinite(value));
};

const pickFirstString = (...values: Array<string | undefined>): string | undefined => {
  return values.find((value) => typeof value === 'string' && value.trim() !== '');
};

export function useDashboardSocket(targets: SocketTarget[]) {
  const [socketStatusMap, setSocketStatusMap] = useState<Record<string, DashboardSocketState>>({});
  const [deviceDataByPlant, setDeviceDataByPlant] = useState<
    Record<string, Record<string, DeviceData>>
  >({});

  useRealtimeSocket({
    targets,
    onMessage: (json) => {
      // 새 flat 포맷: { targetPwplId, deviceAddresses, powerW, todayPower, conversionEfficiency }
      const flat = json as FlatDeviceMessage;
      if (flat.targetPwplId) {
        const pwplId = flat.targetPwplId;
        const deviceAddr = String(flat.deviceAddresses ?? '_');
        setDeviceDataByPlant((prev) => ({
          ...prev,
          [pwplId]: {
            ...(prev[pwplId] ?? {}),
            [deviceAddr]: {
              powerW: Number(flat.powerW ?? 0),
              todayPower: Number(flat.todayPower ?? 0),
              conversionEfficiency: Number(flat.conversionEfficiency ?? 0),
            },
          },
        }));
        return;
      }

      const data = json as SocketMessage;
      const macKey = normalizeMac(data.header?.mac);

      if (!macKey) return;

      const inverter = data.inverter;
      const summary = data.summary;
      const plant = data.plant;
      const dashboard = data.dashboard;
      const payload = data.payload;

      const gridPowerW = pickFirstNumber(
        inverter?.gridPowerW,
        summary?.gridPowerW,
        plant?.gridPowerW,
        dashboard?.gridPowerW,
        payload?.gridPowerW,
      );

      const powerKw = pickFirstNumber(
        inverter?.powerKw,
        summary?.powerKw,
        plant?.powerKw,
        dashboard?.powerKw,
        payload?.powerKw,
        typeof gridPowerW === 'number' ? Number((gridPowerW / 1000).toFixed(1)) : undefined,
      );

      const currentPowerKw = pickFirstNumber(
        inverter?.currentPowerKw,
        summary?.currentPowerKw,
        plant?.currentPowerKw,
        dashboard?.currentPowerKw,
        payload?.currentPowerKw,
        powerKw,
      );

      const capacityKw = pickFirstNumber(
        inverter?.capacityKw,
        summary?.capacityKw,
        plant?.capacityKw,
        dashboard?.capacityKw,
        payload?.capacityKw,
      );

      const todayGenerationKwh = pickFirstNumber(
        inverter?.todayGenerationKwh,
        summary?.todayGenerationKwh,
        plant?.todayGenerationKwh,
        dashboard?.todayGenerationKwh,
        payload?.todayGenerationKwh,
      );

      const todayGenerationMwh = pickFirstNumber(
        inverter?.todayGenerationMwh,
        summary?.todayGenerationMwh,
        plant?.todayGenerationMwh,
        dashboard?.todayGenerationMwh,
        payload?.todayGenerationMwh,
        todayGenerationKwh,
      );

      const avgOperationRate = pickFirstNumber(
        inverter?.avgOperationRate,
        summary?.avgOperationRate,
        plant?.avgOperationRate,
        dashboard?.avgOperationRate,
        payload?.avgOperationRate,
      );

      const operationRate = pickFirstNumber(
        inverter?.operationRate,
        summary?.operationRate,
        plant?.operationRate,
        dashboard?.operationRate,
        payload?.operationRate,
        avgOperationRate,
      );

      const inverterErrors =
        inverter?.inverterErrors ??
        summary?.inverterErrors ??
        plant?.inverterErrors ??
        dashboard?.inverterErrors ??
        payload?.inverterErrors;

      const nextState: DashboardSocketState = {
        topLevel: inverterErrors?.topLevel,
        topMessage: inverterErrors?.topMessage,
        criticalCount: inverterErrors?.criticalCount,
        gridPowerW,
        powerKw,
        currentPowerKw,
        capacityKw,
        todayGenerationKwh,
        todayGenerationMwh,
        avgOperationRate,
        operationRate,
        areaNm: pickFirstString(
          inverter?.areaNm,
          summary?.areaNm,
          plant?.areaNm,
          dashboard?.areaNm,
          payload?.areaNm,
        ),
        pwplNm: pickFirstString(
          inverter?.pwplNm,
          summary?.pwplNm,
          plant?.pwplNm,
          dashboard?.pwplNm,
          payload?.pwplNm,
        ),
        pwplLat: pickFirstNumber(
          inverter?.pwplLat,
          summary?.pwplLat,
          plant?.pwplLat,
          dashboard?.pwplLat,
          payload?.pwplLat,
        ),
        pwplLot: pickFirstNumber(
          inverter?.pwplLot,
          summary?.pwplLot,
          plant?.pwplLot,
          dashboard?.pwplLot,
          payload?.pwplLot,
        ),
        updateTime: pickFirstString(
          inverter?.updateTime,
          summary?.updateTime,
          plant?.updateTime,
          dashboard?.updateTime,
          payload?.updateTime,
        ),
        updatedAt: pickFirstString(
          inverter?.updatedAt,
          summary?.updatedAt,
          plant?.updatedAt,
          dashboard?.updatedAt,
          payload?.updatedAt,
        ),
        rawPayload: json,
      };

      setSocketStatusMap((prev) => ({
        ...prev,
        [macKey]: nextState,
      }));
    },
  });

  const pwplAggMap = useMemo<Record<string, PlantAggSummary>>(() => {
    const result: Record<string, PlantAggSummary> = {};
    for (const [pwplId, devices] of Object.entries(deviceDataByPlant)) {
      const deviceList = Object.values(devices);
      if (deviceList.length === 0) continue;
      result[pwplId] = {
        currentPowerKw: deviceList.reduce((sum, d) => sum + d.powerW, 0) / 1000,
        todayGenerationKwh: deviceList.reduce((sum, d) => sum + d.todayPower, 0) / 1000,
        avgOperationRate:
          deviceList.reduce((sum, d) => sum + d.conversionEfficiency, 0) / deviceList.length,
      };
    }
    return result;
  }, [deviceDataByPlant]);

  return { socketStatusMap, pwplAggMap };
}

// // src/app/(home)/monitoring/operation/MonitoringOp.tsx
// 'use client';

// import {
//   InfoBoxComponent,
//   InfoBoxGroup,
//   TitleComponent,
//   TopInfoBoxComponent,
//   PieChartSmComponent,
//   Progressbar,
//   ProgressbarComponent,
// } from '@/components';
// import AnimatedWaveGauge from '@/components/chart/AnimatedWaveGauge';
// import { useState, useEffect, useMemo } from 'react';
// import type { MonitorOprateRes } from '@/services/monitoring/oprate/type';
// import type { MonitorWeatherRes } from '@/services/monitoring/weather/type';
// import { useGetMonitorWeather } from '@/services/monitoring/weather/query';
// import { ModalPlantSelector } from '@/constants/monitoring/ModalPlantSelector';
// import type { BarChartData } from '@/components/monitoring/monitoring-barchart.component';
// import { useSearchParams } from 'next/navigation';
// import { useDashboardSocketContext } from '@/providers/DashboardSocketContext';

// /* =========================
//  * 타입 정의
//  * ========================= */
// type MonitoringOpProps = {
//   pwplIds: string[];
// };

// type GenTableItem = MonitorOprateRes['genTable'][number] & {
//   isTotal?: boolean;
// };

// type DonutDataItem = {
//   name: string;
//   value: number;
//   color: string;
// };

// type RealtimeData = {
//   averageVoltage: number;
//   gridPowerFactor: number;
//   gridFrequencyHz: number;
//   gridPowerW: number;
//   todayPower: number;
//   inverterStatus: string;
//   statusConnection: string;
//   inverterTotalEnergy: number;
//   modulePower: number;
//   irradianceWm2: number;
//   temperatureC: number;
// };

// type RealtimeInverterItem = {
//   deviceAddresses: number;
//   averageVoltage: number;
//   gridPowerFactor: number;
//   gridFrequencyHz: number;
//   gridPowerW: number;
//   todayPower: number;
//   inverterStatus: string;
//   statusConnection: string;
//   inverterTotalEnergy: number;
//   modulePower: number;
//   irradianceWm2: number;
//   temperatureC: number;
// };

// type RealtimeMacMap = Record<string, Record<number, RealtimeInverterItem>>;

// type DashboardSocketPlantStatus = {
//   gridPowerW?: number;
//   powerKw?: number;
//   currentPowerKw?: number;
//   capacityKw?: number;
//   todayGenerationKwh?: number;
//   todayGenerationMwh?: number;
//   operationRate?: number;
//   areaNm?: string;
//   pwplNm?: string;
//   pwplLat?: number;
//   pwplLot?: number;
//   updateTime?: string;
//   updatedAt?: string;
//   topLevel?: 'NORMAL' | 'MAJOR' | 'CRITICAL';
//   topMessage?: string;
//   criticalCount?: number;
//   averageVoltage?: number;
//   gridPowerFactor?: number;
//   gridFrequencyHz?: number;
//   inverterStatus?: string;
//   statusConnection?: string;
//   inverterTotalEnergy?: number;
//   modulePower?: number;
//   irradianceWm2?: number;
//   temperatureC?: number;
// };

// type PowerDisplay = {
//   value: number;
//   unit: 'W' | 'kW';
// };

// type EnergyDisplay = {
//   value: number;
//   unit: 'kWh' | 'MWh';
// };

// type SavedPlantItem = {
//   pwplId: string;
//   macAddr?: string;
// };

// type RestoredSelection = {
//   pwplIds: string[];
//   plantNames: string[];
//   macAddrs: string[];
// };

// /* =========================
//  * 상수
//  * ========================= */
// const PIE_COLORS = ['#B43FAA', '#F14B7F', '#F17549', '#DAAD3E', '#8ED048', '#20D99A', '#23A2C3'];
// const POWER_MAX_W = 100000;
// const MODULE_POWER_MAX_W = 100000;
// const INVERTER_TOTAL_ENERGY_MAX_KWH = 10000;
// const MONITORING_OPERATION_SOCKET_CACHE_KEY = 'monitoring-operation-socket-cache';

// /* =========================
//  * 공통 유틸
//  * ========================= */
// const safeToFixed = (value: number | string | null | undefined, digits: number) =>
//   Number(Number(value ?? 0).toFixed(digits));

// const toChartValue = (value: number) => (value > 0 ? safeToFixed(value, 2) : 0.0001);

// const normalizeMac = (value: string | null | undefined) =>
//   String(value ?? '')
//     .trim()
//     .toUpperCase()
//     .replace(/[^A-Z0-9]/g, '');

// const getProgressPercent = (value: number, max: number = POWER_MAX_W) =>
//   Math.min(safeToFixed((Math.max(value, 0) / max) * 100, 2), 100);

// const formatPowerDisplay = (value: number | null | undefined): PowerDisplay => {
//   const safeValue = value ?? 0;

//   if (safeValue >= 1000) {
//     return {
//       value: safeToFixed(safeValue / 1000, 2),
//       unit: 'kW',
//     };
//   }

//   return {
//     value: safeToFixed(safeValue, 2),
//     unit: 'W',
//   };
// };

// const formatEnergyDisplay = (value: number | null | undefined): EnergyDisplay => {
//   const safeValue = value ?? 0;

//   if (safeValue >= 1000) {
//     return {
//       value: safeToFixed(safeValue / 1000, 2),
//       unit: 'MWh',
//     };
//   }

//   return {
//     value: safeToFixed(safeValue, 2),
//     unit: 'kWh',
//   };
// };

// const getInverterColor = (deviceAddresses: number) =>
//   PIE_COLORS[(Math.max(deviceAddresses, 1) - 1) % PIE_COLORS.length];

// const getSocketCurrentPowerW = (socketStatus?: DashboardSocketPlantStatus): number => {
//   if (!socketStatus) return 0;

//   if (typeof socketStatus.gridPowerW === 'number') {
//     return socketStatus.gridPowerW;
//   }

//   if (typeof socketStatus.powerKw === 'number') {
//     return socketStatus.powerKw * 1000;
//   }

//   if (typeof socketStatus.currentPowerKw === 'number') {
//     return socketStatus.currentPowerKw * 1000;
//   }

//   return 0;
// };

// const getSocketTodayGeneration = (socketStatus?: DashboardSocketPlantStatus): number => {
//   if (!socketStatus) return 0;

//   if (typeof socketStatus.todayGenerationKwh === 'number') {
//     return socketStatus.todayGenerationKwh;
//   }

//   if (typeof socketStatus.todayGenerationMwh === 'number') {
//     return socketStatus.todayGenerationMwh * 1000;
//   }

//   return 0;
// };

// const normalizeSocketStatusMap = (
//   socketStatusMap: Record<string, DashboardSocketPlantStatus>,
// ): Record<string, DashboardSocketPlantStatus> => {
//   return Object.entries(socketStatusMap).reduce<Record<string, DashboardSocketPlantStatus>>(
//     (acc, [key, value]) => {
//       const normalizedKey = normalizeMac(key);

//       if (normalizedKey) {
//         acc[normalizedKey] = value;
//       }

//       return acc;
//     },
//     {},
//   );
// };

// /* =========================
//  * 로컬 캐시 유틸
//  * ========================= */
// const readSocketCacheMap = (): Record<string, DashboardSocketPlantStatus> => {
//   if (typeof window === 'undefined') {
//     return {};
//   }

//   try {
//     const raw = localStorage.getItem(MONITORING_OPERATION_SOCKET_CACHE_KEY);

//     if (!raw) {
//       return {};
//     }

//     const parsed = JSON.parse(raw) as Record<string, DashboardSocketPlantStatus>;

//     return normalizeSocketStatusMap(parsed);
//   } catch {
//     return {};
//   }
// };

// const writeSocketCacheMap = (cacheMap: Record<string, DashboardSocketPlantStatus>) => {
//   if (typeof window === 'undefined') {
//     return;
//   }

//   try {
//     localStorage.setItem(
//       MONITORING_OPERATION_SOCKET_CACHE_KEY,
//       JSON.stringify(normalizeSocketStatusMap(cacheMap)),
//     );
//   } catch {
//     return;
//   }
// };

// const mergeSocketStatusMapWithCache = (
//   liveMap: Record<string, DashboardSocketPlantStatus>,
//   cacheMap: Record<string, DashboardSocketPlantStatus>,
//   selectedMacAddrs: string[],
// ): Record<string, DashboardSocketPlantStatus> => {
//   const normalizedLiveMap = normalizeSocketStatusMap(liveMap);
//   const normalizedCacheMap = normalizeSocketStatusMap(cacheMap);

//   return selectedMacAddrs.reduce<Record<string, DashboardSocketPlantStatus>>((acc, macAddr) => {
//     const normalizedMacAddr = normalizeMac(macAddr);

//     if (!normalizedMacAddr) {
//       return acc;
//     }

//     const liveItem = normalizedLiveMap[normalizedMacAddr];
//     const cacheItem = normalizedCacheMap[normalizedMacAddr];

//     if (liveItem) {
//       acc[normalizedMacAddr] = liveItem;
//       return acc;
//     }

//     if (cacheItem) {
//       acc[normalizedMacAddr] = cacheItem;
//     }

//     return acc;
//   }, {});
// };

// /* =========================
//  * 실시간 인버터 맵 생성
//  * ========================= */
// const buildRealtimeMapFromSocketStatus = (
//   socketStatusMap: Record<string, DashboardSocketPlantStatus>,
//   selectedMacAddrs: string[],
// ): RealtimeMacMap => {
//   const normalizedSocketStatusMap = normalizeSocketStatusMap(socketStatusMap);

//   return selectedMacAddrs.reduce<RealtimeMacMap>((acc, macAddr, index) => {
//     const normalizedMacAddr = normalizeMac(macAddr);
//     const current = normalizedSocketStatusMap[normalizedMacAddr];

//     if (!current) {
//       return acc;
//     }

//     acc[normalizedMacAddr] = {
//       1: {
//         deviceAddresses: index + 1,
//         averageVoltage: safeToFixed(current.averageVoltage, 2),
//         gridPowerFactor: safeToFixed(current.gridPowerFactor, 2),
//         gridFrequencyHz: safeToFixed(current.gridFrequencyHz, 2),
//         gridPowerW: safeToFixed(getSocketCurrentPowerW(current), 2),
//         todayPower: safeToFixed(getSocketTodayGeneration(current), 2),
//         inverterStatus: current.topLevel ?? current.inverterStatus ?? '',
//         statusConnection: current.statusConnection ?? '0',
//         inverterTotalEnergy: safeToFixed(current.inverterTotalEnergy, 2),
//         modulePower: safeToFixed(current.modulePower ?? getSocketCurrentPowerW(current), 2),
//         irradianceWm2: safeToFixed(current.irradianceWm2, 2),
//         temperatureC: safeToFixed(current.temperatureC, 2),
//       },
//     };

//     return acc;
//   }, {});
// };

// const buildSelectedInverterMap = (
//   next: RealtimeMacMap,
//   selectedMacAddrs: string[],
// ): Record<number, RealtimeInverterItem> => {
//   return selectedMacAddrs.reduce<Record<number, RealtimeInverterItem>>(
//     (acc, selectedMac, macIndex) => {
//       const normalizedMac = normalizeMac(selectedMac);
//       const currentMap = next[normalizedMac] ?? {};

//       Object.values(currentMap).forEach((item, itemIndex) => {
//         const deviceAddress = macIndex * 100 + itemIndex + 1;

//         acc[deviceAddress] = {
//           ...item,
//           deviceAddresses: deviceAddress,
//         };
//       });

//       return acc;
//     },
//     {},
//   );
// };

// /* =========================
//  * 차트 데이터 생성
//  * ========================= */
// const buildVoltageChartData = (
//   inverterMap: Record<number, RealtimeInverterItem>,
// ): DonutDataItem[] =>
//   Object.values(inverterMap)
//     .sort((a, b) => a.deviceAddresses - b.deviceAddresses)
//     .map((item) => ({
//       name: `인버터-${item.deviceAddresses}`,
//       value: toChartValue(item.averageVoltage),
//       color: getInverterColor(item.deviceAddresses),
//     }));

// const buildPowerFactorChartData = (
//   inverterMap: Record<number, RealtimeInverterItem>,
// ): DonutDataItem[] =>
//   Object.values(inverterMap)
//     .sort((a, b) => a.deviceAddresses - b.deviceAddresses)
//     .map((item) => ({
//       name: `인버터-${item.deviceAddresses}`,
//       value: toChartValue(item.gridPowerFactor),
//       color: getInverterColor(item.deviceAddresses),
//     }));

// const buildFrequencyChartData = (
//   inverterMap: Record<number, RealtimeInverterItem>,
// ): DonutDataItem[] =>
//   Object.values(inverterMap)
//     .sort((a, b) => a.deviceAddresses - b.deviceAddresses)
//     .map((item) => ({
//       name: `인버터-${item.deviceAddresses}`,
//       value: toChartValue(item.gridFrequencyHz),
//       color: getInverterColor(item.deviceAddresses),
//     }));

// const buildTodayPowerChartData = (
//   inverterMap: Record<number, RealtimeInverterItem>,
// ): DonutDataItem[] =>
//   Object.values(inverterMap)
//     .sort((a, b) => a.deviceAddresses - b.deviceAddresses)
//     .map((item) => ({
//       name: `인버터-${item.deviceAddresses}`,
//       value: toChartValue(item.todayPower),
//       color: getInverterColor(item.deviceAddresses),
//     }));

// const buildOperationStatusChartData = (
//   inverterMap: Record<number, RealtimeInverterItem>,
// ): DonutDataItem[] =>
//   Object.values(inverterMap)
//     .sort((a, b) => a.deviceAddresses - b.deviceAddresses)
//     .map((item) => ({
//       name: `인버터-${item.deviceAddresses}`,
//       value: toChartValue(item.irradianceWm2),
//       color: getInverterColor(item.deviceAddresses),
//     }));

// const buildConnectionStatusChartData = (
//   inverterMap: Record<number, RealtimeInverterItem>,
// ): DonutDataItem[] =>
//   Object.values(inverterMap)
//     .sort((a, b) => a.deviceAddresses - b.deviceAddresses)
//     .map((item) => ({
//       name: `인버터-${item.deviceAddresses}`,
//       value: toChartValue(item.temperatureC),
//       color: getInverterColor(item.deviceAddresses),
//     }));

// /* =========================
//  * 실시간 집계
//  * ========================= */
// const aggregateRealtimeData = (inverterMap: Record<number, RealtimeInverterItem>): RealtimeData => {
//   const values = Object.values(inverterMap);

//   if (values.length === 0) {
//     return {
//       averageVoltage: 0,
//       gridPowerFactor: 0,
//       gridFrequencyHz: 0,
//       gridPowerW: 0,
//       todayPower: 0,
//       inverterStatus: '',
//       statusConnection: '',
//       inverterTotalEnergy: 0,
//       modulePower: 0,
//       irradianceWm2: 0,
//       temperatureC: 0,
//     };
//   }

//   const count = values.length;
//   const lastItem = [...values].sort((a, b) => a.deviceAddresses - b.deviceAddresses)[count - 1];

//   return {
//     averageVoltage: safeToFixed(
//       values.reduce((sum, item) => sum + item.averageVoltage, 0) / count,
//       2,
//     ),
//     gridPowerFactor: safeToFixed(
//       values.reduce((sum, item) => sum + item.gridPowerFactor, 0) / count,
//       2,
//     ),
//     gridFrequencyHz: safeToFixed(
//       values.reduce((sum, item) => sum + item.gridFrequencyHz, 0) / count,
//       2,
//     ),
//     gridPowerW: safeToFixed(
//       values.reduce((sum, item) => sum + item.gridPowerW, 0),
//       2,
//     ),
//     todayPower: safeToFixed(
//       values.reduce((sum, item) => sum + item.todayPower, 0),
//       2,
//     ),
//     inverterStatus: lastItem.inverterStatus,
//     statusConnection: lastItem.statusConnection,
//     inverterTotalEnergy: safeToFixed(
//       values.reduce((sum, item) => sum + item.inverterTotalEnergy, 0),
//       2,
//     ),
//     modulePower: safeToFixed(
//       values.reduce((sum, item) => sum + item.modulePower, 0),
//       2,
//     ),
//     irradianceWm2: safeToFixed(
//       values.reduce((sum, item) => sum + item.irradianceWm2, 0) / count,
//       2,
//     ),
//     temperatureC: safeToFixed(values.reduce((sum, item) => sum + item.temperatureC, 0) / count, 2),
//   };
// };

// /* =========================
//  * 선택값 복원
//  * ========================= */
// const getRestoredSelection = (
//   searchParams: ReturnType<typeof useSearchParams>,
//   initialPwplIds: string[],
// ): RestoredSelection => {
//   const paramPwplIds = searchParams.get('pwplIds');
//   const paramPwplNms = searchParams.get('pwplNms');
//   const paramMacAddrs = searchParams.get('macAddrs');

//   if (paramPwplIds || paramPwplNms || paramMacAddrs) {
//     return {
//       pwplIds: (paramPwplIds ?? '')
//         .split(',')
//         .map((item) => item.trim())
//         .filter(Boolean),
//       plantNames: (paramPwplNms ?? '')
//         .split(',')
//         .map((item) => item.trim())
//         .filter(Boolean),
//       macAddrs: (paramMacAddrs ?? '')
//         .split(',')
//         .map((item) => normalizeMac(item))
//         .filter(Boolean),
//     };
//   }

//   if (typeof window === 'undefined') {
//     return {
//       pwplIds: initialPwplIds,
//       plantNames: [],
//       macAddrs: [],
//     };
//   }

//   const savedPwplIds = localStorage.getItem('pwplIds');
//   const savedPlantNames = localStorage.getItem('pwplNms');
//   const savedMacAddrs = localStorage.getItem('macAddrs');

//   let nextPwplIds: string[] = initialPwplIds;
//   let nextPlantNames: string[] = [];
//   let nextMacAddrs: string[] = [];

//   if (savedPwplIds) {
//     try {
//       const parsedPwplIds = JSON.parse(savedPwplIds) as Array<string | SavedPlantItem>;

//       if (Array.isArray(parsedPwplIds) && parsedPwplIds.length > 0) {
//         if (typeof parsedPwplIds[0] === 'string') {
//           nextPwplIds = parsedPwplIds as string[];
//         } else {
//           const parsedPlantItems = parsedPwplIds as SavedPlantItem[];
//           nextPwplIds = parsedPlantItems.map((item) => item.pwplId);
//         }
//       }
//     } catch {
//       nextPwplIds = initialPwplIds;
//     }
//   }

//   if (savedPlantNames) {
//     try {
//       nextPlantNames = (JSON.parse(savedPlantNames) as string[]).filter(Boolean);
//     } catch {
//       nextPlantNames = [];
//     }
//   }

//   if (savedMacAddrs) {
//     try {
//       nextMacAddrs = (JSON.parse(savedMacAddrs) as string[])
//         .map((item) => normalizeMac(item))
//         .filter(Boolean);
//     } catch {
//       nextMacAddrs = [];
//     }
//   }

//   return {
//     pwplIds: nextPwplIds,
//     plantNames: nextPlantNames,
//     macAddrs: nextMacAddrs,
//   };
// };

// /* =========================
//  * 상단 대시보드 섹션
//  * ========================= */
// const TopDashboardSection = ({
//   realtimeData,
//   weatherData,
// }: {
//   realtimeData: RealtimeData;
//   weatherData?: MonitorWeatherRes;
// }) => {
//   const inverterTotalEnergyDisplay = formatEnergyDisplay(realtimeData.inverterTotalEnergy);
//   const modulePowerDisplay = formatPowerDisplay(realtimeData.modulePower);

//   return (
//     <div
//       className="flex-1"
//       style={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         gap: '120px',
//         paddingTop: '152px',
//       }}
//     >
//       <div
//         style={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           gap: '160px',
//           width: '100%',
//         }}
//       >
//         <div
//           style={{
//             position: 'relative',
//             flex: 1,
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             minWidth: 0,
//           }}
//         >
//           <CircleGlowBackground />
//           <AnimatedWaveGauge
//             value={safeToFixed(realtimeData.gridPowerW, 2)}
//             title="3상 출력 전류"
//             unit="W"
//           />
//         </div>
//         <div
//           style={{
//             display: 'grid',
//             gap: '160px',
//             gridTemplateColumns: 'repeat(2, 360px)',
//             zIndex: 10,
//           }}
//         >
//           <ProgressbarComponent
//             title="인버터 누적 발전량"
//             count={inverterTotalEnergyDisplay.value}
//             unit={inverterTotalEnergyDisplay.unit}
//             rightSide
//           >
//             <Progressbar
//               aria-label="인버터 누적 발전량"
//               value={getProgressPercent(
//                 realtimeData.inverterTotalEnergy,
//                 INVERTER_TOTAL_ENERGY_MAX_KWH,
//               )}
//               fillColor="#BC0046"
//               trackColor="#ece8eb"
//               height={18}
//               radius={2}
//             />
//           </ProgressbarComponent>

//           <ProgressbarComponent
//             title="예상 발전량"
//             count={modulePowerDisplay.value}
//             unit={modulePowerDisplay.unit}
//             rightSide
//           >
//             <Progressbar
//               aria-label="예상 발전량"
//               value={getProgressPercent(realtimeData.modulePower, MODULE_POWER_MAX_W)}
//               fillColor="#DB5F00"
//               trackColor="#ece8eb"
//               height={18}
//               radius={2}
//             />
//           </ProgressbarComponent>
//         </div>
//       </div>

//       <TopInfoBoxComponent title="금일 기상정보" className="w-full z-10">
//         <InfoBoxGroup>
//           {[
//             {
//               icon: 'temp' as const,
//               title: '온도',
//               count: safeToFixed(weatherData?.tmpr, 2),
//               unit: '℃',
//             },
//             {
//               icon: 'humidity' as const,
//               title: '습도',
//               count: safeToFixed(weatherData?.hmdt, 2),
//               unit: '%',
//             },
//             {
//               icon: 'wind' as const,
//               title: '풍속',
//               count: safeToFixed(weatherData?.wndSpd, 2),
//               unit: 'm/s',
//             },
//             {
//               icon: 'solar' as const,
//               title: '강수확률',
//               count: safeToFixed(weatherData?.pr, 2),
//               unit: '%',
//             },
//             {
//               icon: 'dust' as const,
//               title: 'PM10',
//               count: safeToFixed(weatherData?.pm10, 2),
//               unit: 'μg/m³',
//             },
//             {
//               icon: 'dust' as const,
//               title: 'PM2.5',
//               count: safeToFixed(weatherData?.pm25, 2),
//               unit: 'μg/m³',
//             },
//           ].map((item, idx) => (
//             <InfoBoxComponent key={`weather-${idx}`} bg="white" {...item} />
//           ))}
//         </InfoBoxGroup>
//       </TopInfoBoxComponent>
//     </div>
//   );
// };

// const CircleGlowBackground = () => {
//   return (
//     <>
//       <div
//         style={{
//           position: 'absolute',
//           width: '840px',
//           height: '840px',
//           borderRadius: '50%',
//           border: '20px solid #F6F6F6',
//           pointerEvents: 'none',
//         }}
//       />
//       <div
//         style={{
//           position: 'absolute',
//           width: '1040px',
//           height: '1040px',
//           borderRadius: '50%',
//           border: '20px solid #F6F6F6',
//           pointerEvents: 'none',
//         }}
//       />
//       <div
//         style={{
//           position: 'absolute',
//           width: '1240px',
//           height: '1240px',
//           borderRadius: '50%',
//           border: '20px solid #F6F6F6',
//           pointerEvents: 'none',
//         }}
//       />
//       <div
//         style={{
//           position: 'absolute',
//           width: '1440px',
//           height: '1440px',
//           borderRadius: '50%',
//           border: '20px solid #F6F6F6',
//           pointerEvents: 'none',
//         }}
//       />
//       <div
//         style={{
//           position: 'absolute',
//           width: '1640px',
//           height: '1640px',
//           borderRadius: '50%',
//           border: '20px solid #F6F6F6',
//           pointerEvents: 'none',
//         }}
//       />
//       <div
//         style={{
//           position: 'absolute',
//           width: '1640px',
//           height: '1640px',
//           borderRadius: '50%',
//           pointerEvents: 'none',
//           background:
//             'radial-gradient(circle,rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)',
//           filter: 'blur(2px)',
//         }}
//       />
//     </>
//   );
// };
// /* =========================
//  * 메인 컴포넌트
//  * ========================= */
// export default function MonitoringOp({ pwplIds: initialPwplIds }: MonitoringOpProps) {
//   const searchParams = useSearchParams();
//   const socketStatusMap = useDashboardSocketContext() as Record<string, DashboardSocketPlantStatus>;

//   const restoredSelection = useMemo(
//     () => getRestoredSelection(searchParams, initialPwplIds),
//     [searchParams, initialPwplIds],
//   );

//   /* =========================
//    * 상태값
//    * ========================= */
//   const [pwplIds, setPwplIds] = useState<string[]>(restoredSelection.pwplIds);
//   const [selectedPlantNames, setSelectedPlantNames] = useState<string[]>(
//     restoredSelection.plantNames,
//   );
//   const [selectedMacAddrs, setSelectedMacAddrs] = useState<string[]>(restoredSelection.macAddrs);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [cachedSocketStatusMap, setCachedSocketStatusMap] = useState<
//     Record<string, DashboardSocketPlantStatus>
//   >(() => {
//     if (typeof window === 'undefined') {
//       return {};
//     }

//     const initialCacheMap = readSocketCacheMap();

//     return restoredSelection.macAddrs.reduce<Record<string, DashboardSocketPlantStatus>>(
//       (acc, macAddr) => {
//         const normalizedMacAddr = normalizeMac(macAddr);
//         const cachedItem = initialCacheMap[normalizedMacAddr];

//         if (cachedItem) {
//           acc[normalizedMacAddr] = cachedItem;
//         }

//         return acc;
//       },
//       {},
//     );
//   });

//   const [, setGenTableState] = useState<GenTableItem[]>([]);
//   const [, setChartDataState] = useState<BarChartData[]>([]);

//   /* =========================
//    * 파생값
//    * ========================= */
//   const selectedPlantNameText = useMemo(() => {
//     if (selectedPlantNames.length === 0) return '선택된 발전소 없음';
//     if (selectedPlantNames.length === 1) return selectedPlantNames[0];
//     return selectedPlantNames.join(', ');
//   }, [selectedPlantNames]);

//   const weatherPwplId = useMemo(() => pwplIds[0] ?? '', [pwplIds]);
//   const pwplIdsKey = useMemo(() => pwplIds.join(','), [pwplIds]);
//   const selectedMacKey = useMemo(() => selectedMacAddrs.join(','), [selectedMacAddrs]);

//   const { data: weatherData } = useGetMonitorWeather(
//     { pwplId: weatherPwplId },
//     Boolean(weatherPwplId),
//   );

//   /* =========================
//    * 선택값 복원 effect
//    * ========================= */
//   useEffect(() => {
//     setPwplIds(restoredSelection.pwplIds);
//     setSelectedPlantNames(restoredSelection.plantNames);
//     setSelectedMacAddrs(restoredSelection.macAddrs);

//     const nextCacheMap = readSocketCacheMap();
//     const filteredCacheMap = restoredSelection.macAddrs.reduce<
//       Record<string, DashboardSocketPlantStatus>
//     >((acc, macAddr) => {
//       const normalizedMacAddr = normalizeMac(macAddr);
//       const cachedItem = nextCacheMap[normalizedMacAddr];

//       if (cachedItem) {
//         acc[normalizedMacAddr] = cachedItem;
//       }

//       return acc;
//     }, {});

//     setCachedSocketStatusMap(filteredCacheMap);
//   }, [restoredSelection]);

//   /* =========================
//    * 선택 MAC 기준 캐시 재조회
//    * ========================= */
//   useEffect(() => {
//     if (selectedMacAddrs.length === 0) {
//       setCachedSocketStatusMap({});
//       return;
//     }

//     const nextCacheMap = readSocketCacheMap();
//     const filteredCacheMap = selectedMacAddrs.reduce<Record<string, DashboardSocketPlantStatus>>(
//       (acc, macAddr) => {
//         const normalizedMacAddr = normalizeMac(macAddr);
//         const cachedItem = nextCacheMap[normalizedMacAddr];

//         if (cachedItem) {
//           acc[normalizedMacAddr] = cachedItem;
//         }

//         return acc;
//       },
//       {},
//     );

//     setCachedSocketStatusMap(filteredCacheMap);
//   }, [selectedMacKey, selectedMacAddrs]);

//   /* =========================
//    * 실시간 소켓값 캐시 반영
//    * ========================= */
//   useEffect(() => {
//     if (selectedMacAddrs.length === 0) {
//       return;
//     }

//     const normalizedLiveMap = normalizeSocketStatusMap(socketStatusMap);
//     const hasSelectedLiveData = selectedMacAddrs.some((macAddr) => {
//       const normalizedMacAddr = normalizeMac(macAddr);
//       return Boolean(normalizedLiveMap[normalizedMacAddr]);
//     });

//     if (!hasSelectedLiveData) {
//       return;
//     }

//     const currentCacheMap = readSocketCacheMap();
//     const nextCacheMap = { ...currentCacheMap };

//     selectedMacAddrs.forEach((macAddr) => {
//       const normalizedMacAddr = normalizeMac(macAddr);
//       const liveItem = normalizedLiveMap[normalizedMacAddr];

//       if (liveItem) {
//         nextCacheMap[normalizedMacAddr] = liveItem;
//       }
//     });

//     writeSocketCacheMap(nextCacheMap);
//     setCachedSocketStatusMap((prev) => {
//       const mergedMap = { ...prev };

//       selectedMacAddrs.forEach((macAddr) => {
//         const normalizedMacAddr = normalizeMac(macAddr);
//         const liveItem = normalizedLiveMap[normalizedMacAddr];

//         if (liveItem) {
//           mergedMap[normalizedMacAddr] = liveItem;
//         }
//       });

//       return mergedMap;
//     });
//   }, [socketStatusMap, selectedMacKey, selectedMacAddrs]);

//   /* =========================
//    * 실시간 데이터 메모
//    * ========================= */
//   const effectiveSocketStatusMap = useMemo(
//     () => mergeSocketStatusMapWithCache(socketStatusMap, cachedSocketStatusMap, selectedMacAddrs),
//     [socketStatusMap, cachedSocketStatusMap, selectedMacAddrs],
//   );

//   const inverterRealtimeMap = useMemo(
//     () => buildRealtimeMapFromSocketStatus(effectiveSocketStatusMap, selectedMacAddrs),
//     [effectiveSocketStatusMap, selectedMacAddrs],
//   );

//   const selectedInverterMap = useMemo(
//     () => buildSelectedInverterMap(inverterRealtimeMap, selectedMacAddrs),
//     [inverterRealtimeMap, selectedMacAddrs],
//   );

//   const realtimeData = useMemo(
//     () => aggregateRealtimeData(selectedInverterMap),
//     [selectedInverterMap],
//   );

//   const averageVoltageChartData = useMemo(
//     () => buildVoltageChartData(selectedInverterMap),
//     [selectedInverterMap],
//   );

//   const powerFactorChartData = useMemo(
//     () => buildPowerFactorChartData(selectedInverterMap),
//     [selectedInverterMap],
//   );

//   const frequencyChartData = useMemo(
//     () => buildFrequencyChartData(selectedInverterMap),
//     [selectedInverterMap],
//   );

//   const todayPowerChartData = useMemo(
//     () => buildTodayPowerChartData(selectedInverterMap),
//     [selectedInverterMap],
//   );

//   const operationStatusChartData = useMemo(
//     () => buildOperationStatusChartData(selectedInverterMap),
//     [selectedInverterMap],
//   );

//   const connectionStatusChartData = useMemo(
//     () => buildConnectionStatusChartData(selectedInverterMap),
//     [selectedInverterMap],
//   );

//   /* =========================
//    * 오늘 데이터 동기화
//    * ========================= */
//   useEffect(() => {
//     const totalGridPowerW = Object.values(selectedInverterMap).reduce(
//       (sum, item) => sum + item.gridPowerW,
//       0,
//     );

//     const todayData: GenTableItem = {
//       label: '오늘',
//       genTimeH: 0,
//       genMwh: safeToFixed(totalGridPowerW / 1000, 2),
//       invMwh: 0,
//       acdcRate: 0,
//       co2Tco2: 0,
//     };

//     setGenTableState((prevTable) => {
//       if (prevTable.length === 0) {
//         return [todayData];
//       }

//       const hasToday = prevTable.some((row) => row.label === '오늘');

//       if (!hasToday) {
//         return [...prevTable, todayData];
//       }

//       return prevTable.map((row) =>
//         row.label === '오늘'
//           ? {
//               ...row,
//               genTimeH: todayData.genTimeH,
//               genMwh: todayData.genMwh,
//               invMwh: todayData.invMwh,
//               acdcRate: todayData.acdcRate,
//               co2Tco2: todayData.co2Tco2,
//             }
//           : row,
//       );
//     });

//     setChartDataState((prevChart) => {
//       if (prevChart.length === 0) {
//         return [
//           {
//             category: '오늘',
//             value: safeToFixed(totalGridPowerW / 1000, 2),
//           },
//         ];
//       }

//       const hasToday = prevChart.some((row) => row.category === '오늘');

//       if (!hasToday) {
//         return [
//           ...prevChart,
//           {
//             category: '오늘',
//             value: safeToFixed(totalGridPowerW / 1000, 2),
//           },
//         ];
//       }

//       return prevChart.map((row) =>
//         row.category === '오늘'
//           ? {
//               ...row,
//               value: safeToFixed(totalGridPowerW / 1000, 2),
//             }
//           : row,
//       );
//     });
//   }, [selectedInverterMap]);

//   /* =========================
//    * 선택 변경 시 상태 초기화
//    * ========================= */
//   useEffect(() => {
//     setGenTableState([]);
//     setChartDataState([]);
//   }, [pwplIdsKey, selectedMacKey]);

//   /* =========================
//    * 렌더
//    * ========================= */
//   return (
//     <>
//       <div className="title-group">
//         <TitleComponent
//           title="발전소 모니터링"
//           subTitle={selectedPlantNameText}
//           desc="Real-time Plant Operations Dashboard"
//         />
//       </div>

//       <div className="flex flex-1">
//         <div
//           className="row-group"
//           style={{ width: 280, alignItems: 'center', padding: '40px 20px' }}
//         >
//           <div className="flex-1">
//             <PieChartSmComponent centerText="전압데이터" data={averageVoltageChartData} />
//           </div>
//           <div className="flex-1">
//             <PieChartSmComponent centerText="역률" data={powerFactorChartData} />
//           </div>
//           <div className="flex-1">
//             <PieChartSmComponent centerText="GRID 주파수" data={frequencyChartData} />
//           </div>
//         </div>
//         <TopDashboardSection realtimeData={realtimeData} weatherData={weatherData} />

//         <div
//           className="row-group"
//           style={{ width: 280, alignItems: 'center', padding: '40px 20px' }}
//         >
//           <div className="flex-1">
//             <PieChartSmComponent centerText="금일 발전량" data={todayPowerChartData} />
//           </div>
//           <div className="flex-1">
//             <PieChartSmComponent centerText="일사량" data={operationStatusChartData} />
//           </div>
//           <div className="flex-1">
//             <PieChartSmComponent centerText="PV 모듈 온도" data={connectionStatusChartData} />
//           </div>
//         </div>
//       </div>

//       <ModalPlantSelector
//         isOpen={modalOpen}
//         onOpenChange={setModalOpen}
//         selectionMode="multiple"
//         onApplySingle={(plant) => {
//           const nextMacAddrs =
//             'macAddr' in plant && typeof plant.macAddr === 'string'
//               ? [normalizeMac(plant.macAddr)]
//               : [];

//           localStorage.setItem(
//             'pwplIds',
//             JSON.stringify([
//               {
//                 pwplId: plant.pwplId,
//                 macAddr: nextMacAddrs[0] ?? '',
//               },
//             ]),
//           );
//           localStorage.setItem('pwplNms', JSON.stringify([plant.pwplNm]));
//           localStorage.setItem('macAddrs', JSON.stringify(nextMacAddrs));
//           setPwplIds([plant.pwplId]);
//           setSelectedPlantNames([plant.pwplNm]);
//           setSelectedMacAddrs(nextMacAddrs);
//         }}
//         onApplyMulti={(plants) => {
//           const ids = plants.map((v) => v.pwplId);
//           const names = plants.map((v) => v.pwplNm);
//           const macAddrs = plants
//             .map((v) =>
//               'macAddr' in v && typeof v.macAddr === 'string' ? normalizeMac(v.macAddr) : '',
//             )
//             .filter(Boolean);

//           localStorage.setItem(
//             'pwplIds',
//             JSON.stringify(
//               plants.map((v) => ({
//                 pwplId: v.pwplId,
//                 macAddr:
//                   'macAddr' in v && typeof v.macAddr === 'string' ? normalizeMac(v.macAddr) : '',
//               })),
//             ),
//           );
//           localStorage.setItem('pwplNms', JSON.stringify(names));
//           localStorage.setItem('macAddrs', JSON.stringify(macAddrs));
//           setPwplIds(ids);
//           setSelectedPlantNames(names);
//           setSelectedMacAddrs(macAddrs);
//         }}
//       />
//     </>
//   );
// }

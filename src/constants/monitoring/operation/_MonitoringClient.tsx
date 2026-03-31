// 'use client';

// import {
//   BarChartComponent,
//   Cell,
//   Column,
//   GaugeChartComponent,
//   InfoBoxComponent,
//   InfoBoxGroup,
//   InfoGroupComponent,
//   PieChartComponent,
//   Row,
//   Table,
//   TableBody,
//   TableHeader,
//   TextBoxComponent,
//   TextBoxGroup,
//   TitleComponent,
//   TopInfoBoxComponent,
//   ButtonComponent,
// } from '@/components';
// import { Heading } from 'react-aria-components';
// import type { iName } from '@/components/icon/Icons';
// import { useState, useEffect } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import type { MonitorOprateRes } from '@/services/monitoring/oprate/type';
// import { getMonitorOprate } from '@/services/monitoring/oprate/request';
// import { ModalPlantSelector } from '@/constants/monitoring/ModalPlantSelector';
// import type { BarChartData } from '@/components/monitoring/monitoring-barchart.component';
// import { useRealtimeSocket } from '@/hooks';
// import { useSearchParams } from 'next/navigation';

// type MonitoringClientProps = {
//   pwplIds: string[];
// };

// type WeatherItem = {
//   icon: iName;
//   title: string;
//   count: number;
//   unit: string;
// };

// type PlantSummaryItem = {
//   icon: iName;
//   title: string;
//   count: number;
//   totalCount?: number;
//   unit: string;
// };

// type GenTableItem = MonitorOprateRes['genTable'][number] & {
//   isTotal?: boolean;
// };

// const safeToFixed = (value: number | null | undefined, digits: number) =>
//   Number((value ?? 0).toFixed(digits));

// const TopDashboardSection = ({ pwplIds }: { pwplIds: string[] }) => {
//   const { data } = useQuery({
//     queryKey: ['monitor', 'oprate', pwplIds.join(',')],
//     queryFn: () =>
//       getMonitorOprate({
//         pwplIds,
//       }),
//     enabled: pwplIds.length > 0,
//   });

//   const plantCount = pwplIds.length;

//   let currentPowerKw = 0;
//   let capacityKw = 0;
//   let operationRate = 0;
//   let normalEquip = 0;
//   let totalEquip = 0;
//   let avgEfficiency = 0;

//   if (data) {
//     currentPowerKw = data.plantSummary.currentPowerKw ?? 0;
//     capacityKw = data.plantSummary.capacityKw ?? 0;
//     operationRate = data.plantSummary.operationRate ?? 0;
//     normalEquip = data.plantSummary.normalEquip ?? 0;
//     totalEquip = data.plantSummary.totalEquip ?? 0;
//     avgEfficiency = data.plantSummary.avgEfficiency ?? 0;
//   }

//   if (plantCount > 0) {
//     currentPowerKw = safeToFixed(currentPowerKw / plantCount, 1);
//     operationRate = safeToFixed(operationRate / plantCount, 1);
//     avgEfficiency = safeToFixed(avgEfficiency / plantCount, 1);
//   }

//   capacityKw = safeToFixed(capacityKw, 1);
//   normalEquip = safeToFixed(normalEquip, 1);
//   totalEquip = safeToFixed(totalEquip, 1);

//   const WEATHER_DATA_RUNTIME: readonly WeatherItem[] = [
//     {
//       icon: 'temp',
//       title: '온도',
//       count: safeToFixed(data?.weatherSummary.temperatureC, 1),
//       unit: '℃',
//     },
//     {
//       icon: 'humidity',
//       title: '습도',
//       count: safeToFixed(data?.weatherSummary.humidity, 1),
//       unit: '%',
//     },
//     {
//       icon: 'wind',
//       title: '풍속',
//       count: safeToFixed(data?.weatherSummary.windSpeed, 1),
//       unit: 'm/s',
//     },
//     {
//       icon: 'solar',
//       title: '일사량',
//       count: safeToFixed(data?.weatherSummary.irradianceWm2, 1),
//       unit: 'W/m²',
//     },
//     {
//       icon: 'dust',
//       title: 'PM10',
//       count: safeToFixed(data?.weatherSummary.pm10, 1),
//       unit: 'μg/m³',
//     },
//     {
//       icon: 'dust',
//       title: 'PM2.5',
//       count: safeToFixed(data?.weatherSummary.pm25, 1),
//       unit: 'μg/m³',
//     },
//   ];

//   const PLANT_SUMMARY_RUNTIME: readonly PlantSummaryItem[] = [
//     {
//       icon: 'energy',
//       title: '현재출력',
//       count: safeToFixed(currentPowerKw, 1),
//       totalCount: capacityKw,
//       unit: 'kW',
//     },
//     {
//       icon: 'battery02',
//       title: '발전률',
//       count: safeToFixed(operationRate, 1),
//       unit: '%',
//     },
//     {
//       icon: 'feedback',
//       title: '정상 장비',
//       count: normalEquip,
//       totalCount: totalEquip,
//       unit: '대',
//     },
//     {
//       icon: 'factory',
//       title: '월누적 장애 건수',
//       count: safeToFixed(avgEfficiency, 1),
//       unit: '건',
//     },
//   ];

//   return (
//     <div className="group">
//       <TopInfoBoxComponent title="금일 기상정보">
//         {/* <InfoBoxGroup>
//           {WEATHER_DATA_RUNTIME.map((item, idx) => (
//             <InfoBoxComponent key={`weather-${idx}`} bg="white" {...item} />
//           ))}
//         </InfoBoxGroup> */}
//       </TopInfoBoxComponent>

//       <TopInfoBoxComponent
//         title="발전소 요약정보"
//         bg="var(--point-orange-5)"
//         color="#A34600"
//         className="flex-1"
//       >
//         <InfoBoxGroup>
//           {PLANT_SUMMARY_RUNTIME.map((item, idx) => (
//             <InfoBoxComponent key={`summary-${idx}`} bg="white" {...item} />
//           ))}
//         </InfoBoxGroup>
//       </TopInfoBoxComponent>
//     </div>
//   );
// };

// const PowerGenerationTable = ({ rows }: { rows: GenTableItem[] }) => (
//   <>
//     <Heading id="table-title" level={3} className="sr-only">
//       발전 현황 표
//     </Heading>
//     <p id="table-summary" className="sr-only">
//       구분, 발전시간, 발전량, 인버터송전량, AC/DC 변환율, CO₂ 감소량을 표시한 표입니다.
//     </p>

//     <Table
//       aria-labelledby="table-title"
//       aria-describedby="table-summary"
//       style={{ height: '100%' }}
//     >
//       <TableHeader style={{ height: 70 }}>
//         <Column isRowHeader>구분</Column>
//         <Column>
//           발전 시간
//           <br />
//           (시간)
//         </Column>
//         <Column>
//           발전량
//           <br />
//           (kWh)
//         </Column>
//         <Column>
//           인버터송전량
//           <br />
//           (kWh)
//         </Column>
//         <Column>
//           AC/DC 변환율
//           <br />
//           (%)
//         </Column>
//         <Column>
//           CO₂ 감소량
//           <br />
//           (tCO₂)
//         </Column>
//       </TableHeader>

//       <TableBody>
//         {!rows || rows.length === 0 ? (
//           <Row>
//             <Cell colSpan={6} style={{ textAlign: 'center', color: '#888' }}>
//               표시할 발전소 데이터가 없습니다
//             </Cell>
//           </Row>
//         ) : (
//           rows.map((row, idx) => (
//             <Row
//               key={idx}
//               className={idx === rows.length - 1 ? 'react-aria-Row tfoot' : 'react-aria-Row'}
//             >
//               <Cell>{row.label}</Cell>
//               <Cell>{safeToFixed(row.genTimeH, 1)} h</Cell>
//               <Cell>{safeToFixed(row.genMwh, 1)} kWh</Cell>
//               <Cell>{safeToFixed(row.invMwh, 1)} kWh</Cell>
//               <Cell>{safeToFixed(row.acdcRate, 1)} %</Cell>
//               <Cell>{safeToFixed(row.co2Tco2, 1)} tCO₂</Cell>
//             </Row>
//           ))
//         )}
//       </TableBody>
//     </Table>
//   </>
// );

// export default function MonitoringClient({ pwplIds: initialPwplIds }: MonitoringClientProps) {
//   const searchParams = useSearchParams();

//   const [pwplIds, setPwplIds] = useState<string[]>(initialPwplIds);
//   const [modalOpen, setModalOpen] = useState(false);

//   const [genTableState, setGenTableState] = useState<GenTableItem[]>([]);
//   // const [chartDataState, setChartDataState] = useState<BarChartData[]>([]);

//   useEffect(() => {
//     setPwplIds(initialPwplIds);
//   }, [initialPwplIds]);

//   // const { data } = useQuery({
//   //   queryKey: ['monitor', 'oprate', pwplIds.join(',')],
//   //   queryFn: () => getMonitorOprate({ pwplIds }),
//   //   enabled: pwplIds.length > 0,
//   // });

//   // const pieData = [
//   //   { name: '정상', value: data?.equipStatus.normal ?? 0, color: '#1AED83' },
//   //   { name: '점검중', value: data?.equipStatus.checking ?? 0, color: '#FFCA58' },
//   //   { name: '오류', value: data?.equipStatus.error ?? 0, color: '#FF5757' },
//   // ];

//   // useEffect(() => {
//   //   if (data) {
//   //     setGenTableState(data.genTable as GenTableItem[]);

//   //     const nextChart = [...data.performance]
//   //       .sort((a, b) => Number(a.label) - Number(b.label))
//   //       .map((v) => ({
//   //         category: v.label,
//   //         value: safeToFixed(v.value, 1),
//   //       }));

//   //     setChartDataState([...nextChart]);
//   //   } else {
//   //     setChartDataState([]);
//   //   }
//   // }, [data, pwplIds]);

//   useRealtimeSocket({
//     targets: pwplIds.length === 1 ? [{ pwplId: pwplIds[0] }] : [],

//     onMessage: (json) => {
//       const data = json as {
//         header?: {
//           mac?: string;
//           timeStamp?: string;
//         };
//         inverter?: {
//           gridPowerW?: number;
//           inverterTempC?: number;
//           inverterStatus?: string;
//         };
//       };

//       // ★ header 정보
//       // const mac = data.header?.mac;
//       // const time = data.header?.timeStamp;

//       // ★ inverter 정보
//       const powerW = data.inverter?.gridPowerW ?? 0;
//       // const temp = data.inverter?.inverterTempC ?? 0;
//       // const status = data.inverter?.inverterStatus ?? '';

//       // ★ 기존 콘솔 로그 유지
//       // console.log('🔥 웹소켓 값 도착:', json);


//       const todayData: GenTableItem = {
//         label: '오늘',
//         genTimeH: 0,
//         genMwh: powerW / 1000,
//         invMwh: 0,
//         acdcRate: 0,
//         co2Tco2: 0,
//       };

//       setGenTableState((prev) =>
//         prev.map((row) =>
//           row.label === '오늘'
//             ? {
//                 ...row,
//                 genTimeH: todayData.genTimeH,
//                 genMwh: todayData.genMwh,
//                 invMwh: todayData.invMwh,
//                 acdcRate: todayData.acdcRate,
//                 co2Tco2: todayData.co2Tco2,
//               }
//             : row,
//         ),
//       );
//     },
//   });

//   useEffect(() => {
//     const ids = searchParams.get('pwplIds');

//     if (ids) {
//       setPwplIds(ids.split(','));
//     }
//   }, [searchParams]);

//   return (
//     <>
//       <div className="title-group">
//         <TitleComponent
//           title="발전소 모니터링"
//           subTitle="운영 모니터링"
//           desc="Real-time Plant Operations Dashboard"
//         />
//         <ButtonComponent onPress={() => setModalOpen(true)}>발전소 선택</ButtonComponent>
//       </div>

//       <TopDashboardSection pwplIds={pwplIds} />

//       <div className="group flex-1">
//         <div className="row-group" style={{ width: 400 }}>
//           <InfoGroupComponent title="현재 장비 상태">
//             <PieChartComponent data={pieData} total={data?.equipStatus.total ?? 0} />

//             <TextBoxGroup $gap={2}>
//               <TextBoxComponent
//                 width="100%"
//                 title={<span className="dot normal">정상</span>}
//                 content={`${data?.equipStatus.normal ?? 0}건`}
//               />
//               <TextBoxComponent
//                 width="100%"
//                 title={<span className="dot checking">점검중</span>}
//                 content={`${data?.equipStatus.checking ?? 0}건`}
//               />
//               <TextBoxComponent
//                 width="100%"
//                 title={<span className="dot error">오류</span>}
//                 content={`${data?.equipStatus.error ?? 0}건`}
//               />
//             </TextBoxGroup>
//           </InfoGroupComponent>

//           <InfoGroupComponent flex={1} title="발전소별 성능">
//             <BarChartComponent key={pwplIds.join(',')} data={chartDataState} />
//           </InfoGroupComponent>
//         </div>

//         <div className="row-group flex-1">
//           <InfoGroupComponent title="발전소 발전량">
//             <div
//               style={{ display: 'flex', padding: '16px 0 20px', justifyContent: 'space-around' }}
//             >
//               <GaugeChartComponent
//                 title="지난달 발전량"
//                 value={safeToFixed(data?.genGauge.lastMonthMwh, 1)}
//               />
//               <GaugeChartComponent
//                 title="이번달 발전량"
//                 value={safeToFixed(data?.genGauge.thisMonthMwh, 1)}
//               />
//               <GaugeChartComponent
//                 title="전일 발전량"
//                 value={safeToFixed(data?.genGauge.yesterdayMwh, 1)}
//               />
//               <GaugeChartComponent
//                 title="현재 발전량"
//                 value={safeToFixed(data?.genGauge.currentMwh, 1)}
//               />
//             </div>
//           </InfoGroupComponent>

//           <InfoGroupComponent flex={1} title="발전 현황 표">
//             <PowerGenerationTable rows={genTableState} />
//           </InfoGroupComponent>
//         </div>
//       </div>

//       <ModalPlantSelector
//         isOpen={modalOpen}
//         onOpenChange={setModalOpen}
//         selectionMode="multiple"
//         onApplySingle={(plant) => {
//           localStorage.setItem('pwplIds', JSON.stringify([plant.pwplId]));
//           setPwplIds([plant.pwplId]);
//         }}
//         onApplyMulti={(plants) => {
//           const ids = plants.map((v) => v.pwplId);
//           localStorage.setItem('pwplIds', JSON.stringify(ids));
//           setPwplIds(ids);
//         }}
//       />
//     </>
//   );
// }

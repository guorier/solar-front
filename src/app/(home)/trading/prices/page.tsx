// app/trading/prices/page.tsx
'use client';

import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import {
  Cell,
  Column,
  Row,
  Table,
  TableBody,
  TableHeader,
  TitleComponent,
  Icons,
} from '@/components';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'react-aria-components';

// ─────────────────────────────────────────────
// 타입 정의
// ─────────────────────────────────────────────

type PriceSummaryCard = {
  key: string;
  label: string;
  value: string;
  unit: string;
};

type SmpPriceRow = {
  id: string;
  date: string;
  time: string;
  inlandForecastDemand: string;
  totalForecastDemand: string;
  smp: string;
};

type RecPriceRow = {
  id: string;
  date: string;
  time: string;
  avgPrice: string;
  highPrice: string;
  lowPrice: string;
};

// SMP 차트용 - API 연결 시 이 타입으로 데이터 받아오기
export type SmpChartItem = {
  date: string; // 'MM-DD' 형식
  inlandForecastDemand: number; // 육지 예측 수요 (MW)
  totalForecastDemand: number; // 총 예측 수요 (MW)
  smp: number; // SMP (원/kWh)
};

// REC 차트용 - API 연결 시 이 타입으로 데이터 받아오기
export type RecChartItem = {
  거래일자: string;
  평균가: number;
  상한가: number;
  하한가: number;
};

// ─────────────────────────────────────────────
// 더미 데이터 (API 연결 시 교체)
// ─────────────────────────────────────────────

const summaryCards: PriceSummaryCard[] = [
  { key: 'smp-prev', label: 'SMP 전일 단가', value: '145.87', unit: '원 / kWh' },
  { key: 'smp-today', label: 'SMP 금일 단가', value: '45,117', unit: '원 / REC' },
  { key: 'rec-base1', label: 'REC 2026-03-24 기준 단가', value: '145.87', unit: '원 / kWh' },
  { key: 'rec-base2', label: 'REC 2026-03-26 기준 단가', value: '14,287', unit: '원 / REC' },
];

// SMP 차트 더미 데이터 (30일)
const SMP_CHART_DUMMY: SmpChartItem[] = [
  { date: '03-01', inlandForecastDemand: 12100, totalForecastDemand: 32100, smp: 14.82 },
  { date: '03-02', inlandForecastDemand: 11980, totalForecastDemand: 31800, smp: 14.56 },
  { date: '03-03', inlandForecastDemand: 12250, totalForecastDemand: 32400, smp: 14.31 },
  { date: '03-04', inlandForecastDemand: 12400, totalForecastDemand: 32900, smp: 14.68 },
  { date: '03-05', inlandForecastDemand: 12600, totalForecastDemand: 33200, smp: 14.93 },
  { date: '03-06', inlandForecastDemand: 12800, totalForecastDemand: 33800, smp: 15.1 },
  { date: '03-07', inlandForecastDemand: 12350, totalForecastDemand: 32700, smp: 14.75 },
  { date: '03-08', inlandForecastDemand: 12050, totalForecastDemand: 32000, smp: 14.49 },
  { date: '03-09', inlandForecastDemand: 11850, totalForecastDemand: 31500, smp: 14.23 },
  { date: '03-10', inlandForecastDemand: 12200, totalForecastDemand: 32300, smp: 14.57 },
  { date: '03-11', inlandForecastDemand: 12480, totalForecastDemand: 33000, smp: 14.81 },
  { date: '03-12', inlandForecastDemand: 12700, totalForecastDemand: 33500, smp: 15.04 },
  { date: '03-13', inlandForecastDemand: 12950, totalForecastDemand: 34100, smp: 15.32 },
  { date: '03-14', inlandForecastDemand: 12580, totalForecastDemand: 33200, smp: 14.98 },
  { date: '03-15', inlandForecastDemand: 12280, totalForecastDemand: 32500, smp: 14.65 },
  { date: '03-16', inlandForecastDemand: 11980, totalForecastDemand: 31800, smp: 14.38 },
  { date: '03-17', inlandForecastDemand: 11750, totalForecastDemand: 31200, smp: 14.12 },
  { date: '03-18', inlandForecastDemand: 12100, totalForecastDemand: 32100, smp: 14.46 },
  { date: '03-19', inlandForecastDemand: 12380, totalForecastDemand: 32800, smp: 14.73 },
  { date: '03-20', inlandForecastDemand: 12650, totalForecastDemand: 33400, smp: 15.0 },
  { date: '03-21', inlandForecastDemand: 12900, totalForecastDemand: 34000, smp: 15.27 },
  { date: '03-22', inlandForecastDemand: 12500, totalForecastDemand: 33100, smp: 14.84 },
  { date: '03-23', inlandForecastDemand: 12180, totalForecastDemand: 32300, smp: 14.51 },
  { date: '03-24', inlandForecastDemand: 11900, totalForecastDemand: 31600, smp: 14.25 },
  { date: '03-25', inlandForecastDemand: 12230, totalForecastDemand: 32400, smp: 14.59 },
  { date: '03-26', inlandForecastDemand: 12510, totalForecastDemand: 33100, smp: 14.86 },
  { date: '03-27', inlandForecastDemand: 12760, totalForecastDemand: 33700, smp: 15.13 },
  { date: '03-28', inlandForecastDemand: 13000, totalForecastDemand: 34300, smp: 15.4 },
  { date: '03-29', inlandForecastDemand: 12600, totalForecastDemand: 33300, smp: 14.97 },
  { date: '03-30', inlandForecastDemand: 12123, totalForecastDemand: 32291, smp: 14.93 },
];

// REC 차트 더미 데이터 (dataset 형식)
const REC_CHART_DUMMY: RecChartItem[] = [
  { 거래일자: '03-16', 평균가: 44200, 상한가: 45800, 하한가: 42900 },
  { 거래일자: '03-17', 평균가: 44850, 상한가: 46200, 하한가: 43500 },
  { 거래일자: '03-18', 평균가: 45100, 상한가: 46700, 하한가: 43800 },
  { 거래일자: '03-19', 평균가: 44600, 상한가: 46100, 하한가: 43200 },
  { 거래일자: '03-20', 평균가: 45300, 상한가: 46900, 하한가: 44000 },
  { 거래일자: '03-21', 평균가: 45800, 상한가: 47400, 하한가: 44500 },
  { 거래일자: '03-22', 평균가: 45117, 상한가: 46800, 하한가: 43900 },
  { 거래일자: '03-23', 평균가: 44700, 상한가: 46200, 하한가: 43400 },
  { 거래일자: '03-24', 평균가: 44300, 상한가: 45900, 하한가: 43000 },
  { 거래일자: '03-25', 평균가: 45000, 상한가: 46600, 하한가: 43700 },
  { 거래일자: '03-26', 평균가: 45500, 상한가: 47100, 하한가: 44200 },
  { 거래일자: '03-27', 평균가: 46000, 상한가: 47600, 하한가: 44700 },
  { 거래일자: '03-28', 평균가: 46500, 상한가: 48100, 하한가: 45200 },
  { 거래일자: '03-29', 평균가: 45900, 상한가: 47500, 하한가: 44600 },
  { 거래일자: '03-30', 평균가: 14287, 상한가: 46900, 하한가: 44100 },
];

// SMP 테이블 더미 데이터
const smpRows: SmpPriceRow[] = [
  {
    id: '1',
    date: '2025-12-31',
    time: '09:00 12:11',
    inlandForecastDemand: '12,123',
    totalForecastDemand: '32,291 원',
    smp: '14.93원',
  },
  {
    id: '2',
    date: '2025-12-30',
    time: '09:00 12:00',
    inlandForecastDemand: '12,243',
    totalForecastDemand: '34,491 원',
    smp: '15.93원',
  },
  {
    id: '3',
    date: '2025-12-29',
    time: '09:00 11:56',
    inlandForecastDemand: '11,123',
    totalForecastDemand: '31,902 원',
    smp: '14.21원',
  },
  {
    id: '4',
    date: '2025-12-28',
    time: '09:00 11:48',
    inlandForecastDemand: '12,845',
    totalForecastDemand: '33,102 원',
    smp: '15.12원',
  },
  {
    id: '5',
    date: '2025-12-27',
    time: '09:00 11:31',
    inlandForecastDemand: '12,551',
    totalForecastDemand: '32,448 원',
    smp: '14.80원',
  },
];

// REC 테이블 더미 데이터
const recRows: RecPriceRow[] = [
  {
    id: '1',
    date: '2025-12-31',
    time: '09:00 12:11',
    avgPrice: '12,123 원',
    highPrice: '10,921 원',
    lowPrice: '현물가',
  },
  {
    id: '2',
    date: '2025-12-30',
    time: '09:00 12:00',
    avgPrice: '12,243 원',
    highPrice: '11,971 원',
    lowPrice: '입찰가',
  },
  {
    id: '3',
    date: '2025-12-29',
    time: '09:00 11:56',
    avgPrice: '11,123 원',
    highPrice: '11,962 원',
    lowPrice: '35,231 원',
  },
  {
    id: '4',
    date: '2025-12-28',
    time: '09:00 11:48',
    avgPrice: '12,845 원',
    highPrice: '10,884 원',
    lowPrice: '입찰가',
  },
  {
    id: '5',
    date: '2025-12-27',
    time: '09:00 11:31',
    avgPrice: '12,551 원',
    highPrice: '10,337 원',
    lowPrice: '현물가',
  },
];

// ─────────────────────────────────────────────
// 테이블 컬럼 정의
// ─────────────────────────────────────────────

const smpColumns: {
  key: keyof SmpPriceRow;
  label: string;
  width: string;
  isRowHeader?: boolean;
}[] = [
  { key: 'date', label: '거래일자', width: '16%', isRowHeader: true },
  { key: 'time', label: '시간', width: '18%' },
  { key: 'inlandForecastDemand', label: '육지 예측 수요', width: '22%' },
  { key: 'totalForecastDemand', label: '총 예측 수요', width: '22%' },
  { key: 'smp', label: 'SMP', width: '22%' },
];

const recColumns: {
  key: keyof RecPriceRow;
  label: string;
  width: string;
  isRowHeader?: boolean;
}[] = [
  { key: 'date', label: '거래일자', width: '16%', isRowHeader: true },
  { key: 'time', label: '시간', width: '18%' },
  { key: 'avgPrice', label: '평균가', width: '18%' },
  { key: 'highPrice', label: '상한가', width: '18%' },
  { key: 'lowPrice', label: '하한가', width: '30%' },
];

// ─────────────────────────────────────────────
// 스타일 상수
// ─────────────────────────────────────────────

const cellRightStyle: CSSProperties = { textAlign: 'right', paddingRight: '20px' };
const tableWrapStyle: CSSProperties = {
  width: '100%',
  overflow: 'auto',
  border: '1px solid #d9dde5',
  background: '#ffffff',
};
const tableStyle: CSSProperties = { width: '100%', minWidth: '900px', tableLayout: 'fixed' };
const chartWrapStyle: CSSProperties = {
  height: '380px',
  border: '1px solid #d9dde5',
  borderRadius: '12px',
  background: '#ffffff',
  padding: '16px',
};

// ─────────────────────────────────────────────
// SMP Stacked Line Chart
// ECharts line-stack 예제 기반
// ─────────────────────────────────────────────

function SmpStackedLineChart({ data = SMP_CHART_DUMMY }: { data?: SmpChartItem[] }) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  const option = useMemo<EChartsOption>(
    () => ({
      color: ['#D70251', '#1C7ED6'],
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          const items = Array.isArray(params) ? params : [params];
          const date =
            items[0] && typeof items[0] === 'object' && 'axisValueLabel' in items[0]
              ? String(items[0].axisValueLabel)
              : '';
          const lines = items.map((p) => {
            if (!p || typeof p !== 'object') return '';
            const name = 'seriesName' in p ? String(p.seriesName) : '';
            const val =
              'value' in p && typeof p.value === 'number' ? p.value.toLocaleString() : '-';
            const marker = 'marker' in p && typeof p.marker === 'string' ? p.marker : '';
            const unit = name === 'SMP' ? ' 원/kWh' : ' MW';
            return `${marker}${name}: ${val}${unit}`;
          });
          return [date, ...lines].join('<br/>');
        },
        axisPointer: { type: 'cross', label: { backgroundColor: '#6a7985' } },
      },
      legend: {
        top: 0,
        right: 0,
        data: ['육지 예측 수요', '총 예측 수요', 'SMP'],
        textStyle: { color: '#615E83', fontSize: 12 },
      },
      grid: { left: '3%', right: '4%', bottom: '3%', top: '14%', containLabel: true },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.map((d) => d.date),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#615E83', fontSize: 11 },
      },
      yAxis: [
        {
          type: 'value',
          name: 'MW',
          nameTextStyle: { color: '#615E83', fontSize: 10 },
          axisLabel: { color: '#615E83', fontSize: 11 },
          splitLine: { lineStyle: { type: 'dashed', color: '#EDF2F7' } },
        },
        {
          type: 'value',
          name: '원/kWh',
          nameTextStyle: { color: '#615E83', fontSize: 10 },
          axisLabel: { color: '#615E83', fontSize: 11 },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: '육지 예측 수요',
          type: 'line',
          stack: 'Total',
          yAxisIndex: 0,
          smooth: true,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(215, 2, 81, 0.3)' },
              { offset: 1, color: 'rgba(215, 2, 81, 0)' },
            ]),
          },
          lineStyle: { width: 2, color: '#D70251' },
          itemStyle: { color: '#D70251' },
          symbol: 'circle',
          symbolSize: 6,
          data: data.map((d) => d.inlandForecastDemand),
        },
        {
          name: '총 예측 수요',
          type: 'line',
          stack: 'Total',
          yAxisIndex: 0,
          smooth: true,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(28, 126, 214, 0.3)' },
              { offset: 1, color: 'rgba(28, 126, 214, 0)' },
            ]),
          },
          lineStyle: { width: 2, color: '#1C7ED6' },
          itemStyle: { color: '#1C7ED6' },
          symbol: 'circle',
          symbolSize: 6,
          data: data.map((d) => d.totalForecastDemand),
        },
        {
          name: 'SMP',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          lineStyle: { width: 2, color: '#2F9E44' },
          itemStyle: { color: '#2F9E44' },
          symbol: 'circle',
          symbolSize: 6,
          data: data.map((d) => d.smp),
        },
      ],
    }),
    [data],
  );

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.dispose();
      chartInstance.current = null;
    }
    chartInstance.current = echarts.init(chartRef.current);
    chartInstance.current.setOption(option);

    const handleResize = () => chartInstance.current?.resize();
    const ro = new ResizeObserver(handleResize);
    ro.observe(chartRef.current);
    window.addEventListener('resize', handleResize);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', handleResize);
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, [option]);

  return (
    <div style={chartWrapStyle}>
      <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

// ─────────────────────────────────────────────
// REC Dataset Bar Chart
// ECharts dataset-simple1 예제 기반
// ─────────────────────────────────────────────

function RecDatasetBarChart({ data = REC_CHART_DUMMY }: { data?: RecChartItem[] }) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  const option = useMemo<EChartsOption>(
    () => ({
      color: ['#D70251', '#ED751A', '#1C7ED6'],
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params) => {
          const items = Array.isArray(params) ? params : [params];
          const date =
            items[0] && typeof items[0] === 'object' && 'axisValueLabel' in items[0]
              ? String(items[0].axisValueLabel)
              : '';
          const lines = items.map((p) => {
            if (!p || typeof p !== 'object') return '';
            const name = 'seriesName' in p ? String(p.seriesName) : '';
            const val =
              'value' in p && typeof p.value === 'number' ? p.value.toLocaleString() : '-';
            const marker = 'marker' in p && typeof p.marker === 'string' ? p.marker : '';
            return `${marker}${name}: ${val} 원`;
          });
          return [date, ...lines].join('<br/>');
        },
      },
      legend: {
        top: 0,
        right: 0,
        data: ['평균가', '상한가', '하한가'],
        textStyle: { color: '#615E83', fontSize: 12 },
      },
      grid: { left: '3%', right: '3%', bottom: '3%', top: '14%', containLabel: true },
      dataset: {
        dimensions: ['거래일자', '평균가', '상한가', '하한가'],
        source: data,
      },
      xAxis: {
        type: 'category',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#615E83', fontSize: 11 },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: '#615E83',
          fontSize: 11,
          formatter: (val: number) => `${(val / 1000).toFixed(0)}k`,
        },
        splitLine: { lineStyle: { type: 'dashed', color: '#EDF2F7' } },
      },
      series: [
        { type: 'bar', name: '평균가', barMaxWidth: 20 },
        { type: 'bar', name: '상한가', barMaxWidth: 20 },
        { type: 'bar', name: '하한가', barMaxWidth: 20 },
      ],
    }),
    [data],
  );

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.dispose();
      chartInstance.current = null;
    }
    chartInstance.current = echarts.init(chartRef.current);
    chartInstance.current.setOption(option);

    const handleResize = () => chartInstance.current?.resize();
    const ro = new ResizeObserver(handleResize);
    ro.observe(chartRef.current);
    window.addEventListener('resize', handleResize);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', handleResize);
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, [option]);

  return (
    <div style={chartWrapStyle}>
      <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

// ─────────────────────────────────────────────
// 공통 컴포넌트
// ─────────────────────────────────────────────

function SummaryCard({ item }: { item: PriceSummaryCard }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid #d9dde5',
        borderRadius: '12px',
        padding: '16px 18px',
        background: '#ffffff',
        gap: '12px',
      }}
    >
      <div style={{ fontSize: '13px', color: '#6b7280', flexShrink: 0 }}>{item.label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '22px', fontWeight: 700, color: '#111827' }}>{item.value}</span>
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>{item.unit}</span>
        <Icons iName="alarm" size={22} />
      </div>
    </div>
  );
}

function SmpTable({ rows }: { rows: SmpPriceRow[] }) {
  return (
    <div style={tableWrapStyle}>
      <Table aria-label="SMP 단가 목록" style={tableStyle}>
        <TableHeader>
          {smpColumns.map((col) => (
            <Column key={col.key} style={{ width: col.width }} isRowHeader={col.isRowHeader}>
              {col.label}
            </Column>
          ))}
        </TableHeader>
        <TableBody>
          {rows.map((item) => (
            <Row key={item.id}>
              <Cell>{item.date}</Cell>
              <Cell>{item.time}</Cell>
              <Cell style={cellRightStyle}>{item.inlandForecastDemand}</Cell>
              <Cell style={cellRightStyle}>{item.totalForecastDemand}</Cell>
              <Cell style={cellRightStyle}>{item.smp}</Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function RecTable({ rows }: { rows: RecPriceRow[] }) {
  return (
    <div style={tableWrapStyle}>
      <Table aria-label="REC 단가 목록" style={tableStyle}>
        <TableHeader>
          {recColumns.map((col) => (
            <Column key={col.key} style={{ width: col.width }} isRowHeader={col.isRowHeader}>
              {col.label}
            </Column>
          ))}
        </TableHeader>
        <TableBody>
          {rows.map((item) => (
            <Row key={item.id}>
              <Cell>{item.date}</Cell>
              <Cell>{item.time}</Cell>
              <Cell style={cellRightStyle}>{item.avgPrice}</Cell>
              <Cell style={cellRightStyle}>{item.highPrice}</Cell>
              <Cell style={cellRightStyle}>
                {item.lowPrice === '현물가' || item.lowPrice === '입찰가' ? (
                  <span
                    style={{ color: '#d70251', textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    {item.lowPrice}
                  </span>
                ) : (
                  item.lowPrice
                )}
              </Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ─────────────────────────────────────────────
// 페이지
// ─────────────────────────────────────────────

export default function Page() {
  const [selectedTab, setSelectedTab] = useState<string>('smp');

  return (
    <div>
      <div className="title-group" style={{ marginBottom: '24px' }}>
        <TitleComponent
          title="SMP/REC 단가"
          subTitle="SMP/REC 단가 조회"
          desc="전력 거래 관리에 SMP/REC 단가 조회"
        />
      </div>

      {/* 상단 요약 카드 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        {summaryCards.map((item) => (
          <SummaryCard key={item.key} item={item} />
        ))}
      </div>

      <Tabs
        aria-label="SMP REC 관리"
        selectedKey={selectedTab}
        onSelectionChange={(key) => setSelectedTab(String(key))}
      >
        <TabList aria-label="SMP REC 탭" style={{ marginBottom: '20px', width: 'fit-content' }}>
          <Tab id="smp">SMP 관리</Tab>
          <Tab id="rec">REC 관리</Tab>
        </TabList>

        <TabPanels aria-label="SMP REC 패널">
          <TabPanel id="smp">
            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#111827',
                    marginBottom: '12px',
                  }}
                >
                  SMP 최근 단가 추이(30일)
                </div>
                {/* TODO: API 연결 시 → <SmpStackedLineChart data={apiData} /> */}
                <SmpStackedLineChart />
              </div>

              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    marginBottom: '12px',
                  }}
                >
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#111827' }}>
                    SMP 단가 목록
                  </div>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>{smpRows.length}건</div>
                </div>
                {/* TODO: API 연결 시 → <SmpTable rows={apiRows} /> */}
                <SmpTable rows={smpRows} />
              </div>
            </div>
          </TabPanel>

          <TabPanel id="rec">
            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#111827',
                    marginBottom: '12px',
                  }}
                >
                  REC 최근 단가 추이(30일)
                </div>
                {/* TODO: API 연결 시 → <RecDatasetBarChart data={apiData} /> */}
                <RecDatasetBarChart />
              </div>

              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    marginBottom: '12px',
                  }}
                >
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#111827' }}>
                    REC 단가 목록
                  </div>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>{recRows.length}건</div>
                </div>
                {/* TODO: API 연결 시 → <RecTable rows={apiRows} /> */}
                <RecTable rows={recRows} />
              </div>
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}

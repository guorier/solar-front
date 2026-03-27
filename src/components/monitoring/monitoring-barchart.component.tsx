'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import * as echarts from 'echarts';

export interface BarChartData {
  category: string;
  value: number;
}

const MOCK_DATA: BarChartData[] = [
  { category: '01', value: 15 },
  { category: '02', value: 45 },
  { category: '03', value: 90 },
  { category: '04', value: 15 },
  { category: '05', value: 40 },
  { category: '06', value: 55 },
  { category: '07', value: 30 },
  { category: '08', value: 20 },
  { category: '09', value: 45 },
  { category: '10', value: 15 },
];

interface BarChartProps {
  data?: BarChartData[];
  width?: string | number;
  height?: string | number;
}

const getFixedGradient = (
  value: number,
  maxUsage: number,
): string | echarts.graphic.LinearGradient => {
  const ratio = maxUsage > 0 ? value / maxUsage : 0;
  if (ratio <= 0) return '#C6CDEC';

  return new echarts.graphic.LinearGradient(0, 1, 0, 0, [
    { offset: 0, color: 'rgba(255, 221, 195, 0.4)' },
    { offset: 0.5, color: ratio >= 0.5 ? '#ED751A' : '#FFDDC3' },
    { offset: 0.8, color: ratio >= 0.8 ? '#D70251' : ratio >= 0.5 ? '#ED751A' : '#FFDDC3' },
    { offset: 1, color: ratio >= 0.8 ? '#D70251' : ratio >= 0.5 ? '#ED751A' : '#FFDDC3' },
  ]);
};

export function BarChartComponent({
  data = MOCK_DATA, // **데이터가 없을 경우 임시 데이터를 기본값으로 사용**
  width = '100%',
  height = '100%',
}: BarChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  const maxUsage = useMemo(() => {
    if (!data || data.length === 0) return 0;
    return data.reduce((max, item) => Math.max(max, item.value), 0);
  }, [data]);

  //option
  const option = useMemo(() => {
    if (!data || data.length === 0) return null;

    return {
      grid: {
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: data.map((item) => item.category),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: '#615E83',
          margin: 10,
          fontSize: 11,
        },
      },
      yAxis: {
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#D7D7D7',
          },
        },
        axisLine: { show: false },
        axisLabel: { show: false },
      },
      series: [
        {
          type: 'bar',
          barWidth: 16,
          showBackground: true,
          backgroundStyle: {
            color: '#F4F3F6',
            borderRadius: [2, 2, 0, 0],
          },
          itemStyle: {
            borderRadius: [2, 2, 0, 0],
          },
          animationDuration: 1200,
          animationEasing: 'cubicOut',
          data: data.map((item) => ({
            value: item.value,
            itemStyle: {
              color: getFixedGradient(item.value, maxUsage),
            },
          })),
        },
      ],
    };
  }, [data, maxUsage]);

  // -------------------------------------------------------------------------
  // 5. ECharts 렌더링 및 리사이즈 로직
  // -------------------------------------------------------------------------
useEffect(() => {
  if (!chartRef.current || !option) return;

  // 🔥 기존 인스턴스 있으면 무조건 제거
  if (chartInstance.current) {
    chartInstance.current.dispose(); // 🔥 추가 (핵심)
    chartInstance.current = null;
  }

  chartInstance.current = echarts.init(chartRef.current);

  const chart = chartInstance.current;
  chart.setOption(option);

  const handleResize = () => {
    chart.resize();
  };

  const resizeObserver = new ResizeObserver(handleResize);
  resizeObserver.observe(chartRef.current);
  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);
    resizeObserver.disconnect();
  };
}, [option]);


  // 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, []);

  return (
    <div
      style={{ width: width, height: height, minHeight: 159, position: 'relative', marginTop: -4 }}
    >
      {data.length === 0 ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            fontWeight: '600',
            color: '#888',
          }}
        >
          표시할 발전소 데이터가 없습니다
        </div>
      ) : (
        <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
      )}
    </div>
  );
}

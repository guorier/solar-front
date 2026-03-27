'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';

interface DonutDataItem {
  name: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data?: DonutDataItem[];
  total?: number;
  centerText?: string;
  width?: string | number;
  height?: string | number;
}

export function PieChartComponent({
  data,
  total,
  centerText = '전체 장비 수',
  width = '100%',
  height = 250,
}: PieChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  const chartData = useMemo(
    () =>
      data || [
        { name: '정상', value: 80, color: '#1AED83' },
        { name: '점검중', value: 20, color: '#FFCA58' },
        { name: '오류', value: 15, color: '#FF5757' },
      ],
    [data],
  );

  const totalValue = useMemo(
    () => total || chartData.reduce((sum, item) => sum + item.value, 0),
    [total, chartData],
  );

  // option
  const option: EChartsOption = useMemo(
    () => ({
      animation: true,
      animationDuration: 1500,
      animationEasing: 'cubicOut',
      backgroundColor: 'transparent',
      title: {
        text: centerText,
        subtext: `{val|${totalValue}}{unit|개}`,
        left: 'center',
        top: 'center',
        textStyle: { fontSize: '0.8667rem', fontWeight: 500, color: '#868092' },
        subtextStyle: {
          rich: {
            val: { fontSize: '1.3333rem', fontWeight: 500, color: '#333', padding: [4, 0] },
            unit: { fontSize: '0.8667rem', color: '#555', padding: [0, 0, 2, 2] },
          },
        },
      },
      series: [
        {
          type: 'pie',
          radius: [85, 110],
          center: ['50%', '50%'],
          animationType: 'expansion',
          animationDelay: 300,
          label: { show: false },
          itemStyle: {
            shadowBlur: 8,
            shadowOffsetX: 0,
            shadowOffsetY: 2,
            shadowColor: 'rgba(0, 0, 0, 0.2)',
          },
          data: chartData.map((item) => ({
            name: item.name,
            value: item.value,
            itemStyle: { color: item.color },
          })),
        },
      ],
    }),
    [chartData, totalValue, centerText],
  );

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    chartInstance.current.clear();

    const timer = setTimeout(() => {
      chartInstance.current?.setOption(option);
    }, 100);

    const handleResize = () => chartInstance.current?.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, [option]);

  return (
    <div style={{ width: width, height: height, marginTop: -4 }}>
      <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

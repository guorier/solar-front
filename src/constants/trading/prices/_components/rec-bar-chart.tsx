'use client';

import { useMemo, useRef } from 'react';
import type { EChartsOption } from 'echarts';
import type { RecChartItem } from '@/services/trading/prices/type';
import { useEChart, tooltipFormatter, chartWrapStyle } from '../_hooks/use-echart';

export function RecBarChart({ data = [] }: { data?: RecChartItem[] }) {
  const chartRef = useRef<HTMLDivElement>(null);

  const option = useMemo<EChartsOption>(
    () => ({
      color: ['#1C7ED6'],
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (p) => tooltipFormatter(p, ' 원/REC'),
      },
      legend: {
        top: 0,
        right: 0,
        data: ['평균가'],
        textStyle: { color: '#615E83', fontSize: 12 },
      },
      grid: { left: '3%', right: '3%', bottom: '3%', top: '14%', containLabel: true },
      xAxis: {
        type: 'category',
        data: data.map((d) => d.label),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#615E83', fontSize: 11 },
      },
      yAxis: {
        type: 'value',
        name: '원/REC',
        nameTextStyle: { color: '#615E83', fontSize: 10 },
        axisLabel: {
          color: '#615E83',
          fontSize: 11,
          formatter: (val: number) => `${(val / 1000).toFixed(0)}k`,
        },
        splitLine: { lineStyle: { type: 'dashed', color: '#EDF2F7' } },
      },
      series: [
        {
          name: '평균가',
          type: 'bar',
          barMaxWidth: 20,
          itemStyle: { color: '#1C7ED6' },
          data: data.map((d) => d.value),
        },
      ],
    }),
    [data],
  );

  useEChart(chartRef, option);
  return (
    <div style={chartWrapStyle}>
      <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

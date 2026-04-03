'use client';

import { useMemo, useRef } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import type { SmpChartItem } from '@/services/trading/prices/type';
import { useEChart, tooltipFormatter, chartWrapStyle } from '../_hooks/use-echart';

export function SmpLineChart({ data }: { data: SmpChartItem[] }) {
  const chartRef = useRef<HTMLDivElement>(null);

  const option = useMemo<EChartsOption>(
    () => ({
      color: ['#2F9E44'],
      tooltip: {
        trigger: 'axis',
        formatter: (p) => tooltipFormatter(p, ' 원/kWh'),
        axisPointer: { type: 'cross', label: { backgroundColor: '#6a7985' } },
      },
      legend: { top: 0, right: 0, data: ['SMP'], textStyle: { color: '#615E83', fontSize: 12 } },
      grid: { left: '3%', right: '4%', bottom: '3%', top: '14%', containLabel: true },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.map((d) => d.label),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#615E83', fontSize: 11 },
      },
      yAxis: {
        type: 'value',
        name: '원/kWh',
        nameTextStyle: { color: '#615E83', fontSize: 10 },
        axisLabel: { color: '#615E83', fontSize: 11 },
        splitLine: { lineStyle: { type: 'dashed', color: '#EDF2F7' } },
      },
      series: [
        {
          name: 'SMP',
          type: 'line',
          smooth: true,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(47, 158, 68, 0.3)' },
              { offset: 1, color: 'rgba(47, 158, 68, 0)' },
            ]),
          },
          lineStyle: { width: 2, color: '#2F9E44' },
          itemStyle: { color: '#2F9E44' },
          symbol: 'circle',
          symbolSize: 6,
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

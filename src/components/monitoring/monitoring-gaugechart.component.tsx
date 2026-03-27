'use client';

import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts/core';
import { GaugeChart, GaugeSeriesOption } from 'echarts/charts';
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers';
import { ComposeOption } from 'echarts/core';
import { Icons } from '@/components';

echarts.use([GaugeChart, CanvasRenderer, SVGRenderer]);

type ECOption = ComposeOption<GaugeSeriesOption>;

interface GaugeProps {
  value: number;
  maxValue?: number;
  title?: string;
}

export function GaugeChartComponent({ value, maxValue = 800, title }: GaugeProps) {
  const option: ECOption = useMemo(
    () => ({
      backgroundColor: 'transparent',
      grid: {
        top: 0,
        bottom: 0,
        containLabel: false,
      },
      series: [
        {
          type: 'gauge',
          startAngle: 210,
          endAngle: -30,
          min: 0,
          max: maxValue,
          radius: '100%',
          center: ['50%', '50%'],
          axisLine: {
            lineStyle: {
              width: 8,
              color: [[1, 'rgba(0,0,0,0)']],
            },
          },
          progress: {
            show: true,
            width: 8,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: 'rgba(237, 117, 26, 0.15)' },
                { offset: 1, color: 'rgba(215, 2, 81, 0.15)' },
              ]),
              shadowBlur: 16,
              shadowColor: 'rgba(220, 28, 68, 0.60)',
              shadowOffsetX: 0,
              shadowOffsetY: 0,
            },
          },
          data: [{ value: maxValue }],
          pointer: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          detail: { show: false },
        } as GaugeSeriesOption,
        {
          type: 'gauge',
          startAngle: 210,
          endAngle: -30,
          min: 0,
          max: maxValue,
          radius: '100%',
          center: ['50%', '50%'],
          axisLine: { show: false },
          progress: {
            show: true,
            width: 8,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#ED751A' },
                { offset: 1, color: '#D70251' },
              ]),
            },
          },
          pointer: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          detail: {
            offsetCenter: [0, '85%'],
            formatter: (v: number) => `{value|${v.toFixed(1)}}{unit| MWh}`,
            rich: {
              value: {
                fontSize: 'var(--font-size-20)',
                fontWeight: 500,
                color: 'var(--text-color-base)',
              },
              unit: {
                fontSize: 'var(--font-size)',
                fontWeight: 400,
                color: '#555',
                padding: [0, 0, -2, -2],
              },
            },
          },
          data: [{ value }],
        } as GaugeSeriesOption,
        {
          type: 'gauge',
          center: ['50%', '55%'],
          radius: '100%',
          pointer: { show: false },
          detail: {
            offsetCenter: [0, '50%'],
            formatter: title,
            fontSize: '0.8667rem',
            fontWeight: 500,
            color: '#868092',
          },
          data: [{ value: 0 }],
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
        } as GaugeSeriesOption,
      ],
    }),
    [value, maxValue, title],
  );

  return (
    <div style={{ position: 'relative', width: 136, height: 136, margin: '0 auto' }}>
      <ReactECharts
        option={option}
        style={{ height: '100%', width: '100%' }}
        opts={{ renderer: 'svg' }}
        notMerge={true}
      />
      <Icons
        iName="power"
        size={60}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          marginTop: -8,
        }}
         background="linear-gradient(256deg, #D70251 0%, #ED751A 100%)"
      />
    </div>
  );
}

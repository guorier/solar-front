'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import * as echarts from 'echarts';

import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { CallbackDataParams } from 'echarts/types/dist/shared';
import { Icons } from '@/components';

interface DonutDataItem {
  name: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data?: DonutDataItem[];
  total?: number;
  centerText?: string;
  centerValue?: string;
  width?: string | number;
  height?: string | number;
}

const formatNumber = (value: number, digits: number = 1) => {
  return new Intl.NumberFormat('ko-KR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
};

const getTooltipValueText = (centerText: string, value: number, name: string) => {
  if (centerText === '전압데이터') {
    return `${formatNumber(value, 1)} V`;
  }

  if (centerText === '역률') {
    return `${formatNumber(value, 3)} %`;
  }

  if (centerText === 'GRID 주파수') {
    return `${formatNumber(value, 1)} Hz`;
  }

  if (centerText === '금일 발전량') {
    if (value >= 1000) {
      return `${formatNumber(value / 1000, 1)} kWh`;
    }

    return `${formatNumber(value, 1)} Wh`;
  }

  if (centerText === '운영상태') {
    const statusText = name.replace(/^인버터-\d+\s*/, '');
    return statusText || '-';
  }

  if (centerText === '통신 상태') {
    const statusText = name.replace(/^인버터-\d+\s*/, '');
    return statusText || '-';
  }

  return formatNumber(value, 1);
};

export function PieChartSmComponent({
  data,
  centerText = '전압데이터',
  centerValue,
  width = 240,
  height = 240,
}: PieChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  const chartData = useMemo(
    () =>
      data || [
        { name: '인버터-1', value: 80, color: '#B43FAA' },
        { name: '인버터-2', value: 20, color: '#F14B7F' },
        { name: '인버터-3', value: 15, color: '#F17549' },
        { name: '인버터-4', value: 15, color: '#DAAD3E' },
        { name: '인버터-5', value: 15, color: '#8ED048' },
        { name: '인버터-6', value: 15, color: '#20D99A' },
        { name: '인버터-7', value: 15, color: '#23A2C3' },
      ],
    [data],
  );

  // option
  const option: EChartsOption = useMemo(
    () => ({
      animation: true,
      animationDuration: 1500,
      animationEasing: 'cubicOut',
      backgroundColor: 'transparent',
      title: undefined,
      tooltip: {
        trigger: 'item',
        confine: true,
        backgroundColor: 'rgba(34, 34, 34, 0.92)',
        borderColor: 'transparent',
        textStyle: {
          color: '#fff',
          fontSize: 13,
        },
        formatter: (params: CallbackDataParams | CallbackDataParams[]) => {
          const item = Array.isArray(params) ? params[0] : params;
          const value = Number(
            typeof item.value === 'number' || typeof item.value === 'string' ? item.value : 0,
          );
          const percent = Number(item.percent ?? 0);
          const valueText = getTooltipValueText(centerText, value, String(item.name ?? ''));

          return `
            <div style="min-width:140px;">
              <div style="display:flex;align-items:center;gap:6px;font-weight:700;margin-bottom:4px;">
                ${item.marker ?? ''}
                <span>${item.name ?? '-'}</span>
              </div>
              <div style="padding-left:14px;">값: ${valueText}</div>
              <div style="padding-left:14px;">비율: ${formatNumber(percent, 1)}%</div>
            </div>
          `;
        },
      },
      legend: {
        show: true,
        top: '66%',
        left: 'center',
        icon: 'circle',
        width: '100%',
        itemWidth: 8,
        itemHeight: 8,
        itemGap: 8,
        formatter: (name) => {
          return `{space|} ${name}`;
        },
        textStyle: {
          color: '#555',
          fontSize: 15,
          rich: {
            space: {
              width: -6,
            },
          },
        },
      },
      series: [
        {
          type: 'pie',
          radius: [40, 60],
          center: ['50%', 80],
          avoidLabelOverlap: false,
          padAngle: 4,
          animationType: 'expansion',
          animationDelay: 300,
          label: { show: false },
          emphasis: {
            scale: true,
            scaleSize: 6,
          },
          data: chartData.map((item) => ({
            name: item.name,
            value: item.value,
            itemStyle: {
              color: item.color,
              shadowBlur: 8,
              shadowOffsetX: 0,
              shadowOffsetY: 2,
              shadowColor: item.color + '66',
            },
          })),
        },
      ],
    }),
    [chartData, centerText],
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
    <div style={{ position: 'relative', width, height }}>
      <div
        ref={chartRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0,
        }}
      />
      <ReactECharts
        option={option}
        style={{ height: '100%', width: '100%' }}
        opts={{ renderer: 'svg' }}
        notMerge={true}
      />
      <div
        style={{
          position: 'absolute',
          top: centerValue ? '24%' : '28%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1,
        }}
      >
        <Icons iName="thunder" size={26} background="#dadada" />
      </div>
      <div
        style={{
          position: 'absolute',
          top: centerValue ? '30%' : '30%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          textAlign: 'center',
          width: '100%',
        }}
      >
        <span style={{ color: 'var(--gray-70)', fontWeight: 600 }}>{centerText}</span>
        {centerValue ? (
          <div
            style={{
              marginTop: 6,
              color: 'var(--gray-90)',
              fontWeight: 700,
              fontSize: 18,
              lineHeight: 1.2,
            }}
          >
            {centerValue}
          </div>
        ) : null}
      </div>
    </div>
  );
}

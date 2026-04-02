'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { CallbackDataParams } from 'echarts/types/dist/shared';
import { Icons } from '@/components';

interface DonutDataItem {
  name: string;
  value: number;
  color: string;
  rawValue?: number;
  unit?: 'V' | '%' | 'Hz' | 'W' | 'kW' | 'Wh' | 'kWh' | 'W/m²' | '℃';
}

interface PieChartProps {
  data?: DonutDataItem[];
  total?: number;
  centerText?: string;
  centerValue?: string;
  width?: string | number;
  height?: string | number;
}

const formatNumber = (value: number, digits: number = 2) => {
  return new Intl.NumberFormat('ko-KR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
};

const getTooltipValueText = (
  centerText: string,
  value: number,
  name: string,
  unit?: DonutDataItem['unit'],
) => {
  if (unit === 'W') {
    if (value >= 1000) {
      return `${formatNumber(value / 1000, 2)} kW`;
    }

    return `${formatNumber(value, 2)} W`;
  }

  if (unit === 'Wh') {
    if (value >= 1000) {
      return `${formatNumber(value / 1000, 2)} kWh`;
    }

    return `${formatNumber(value, 2)} Wh`;
  }

  if (unit === 'kWh') {
    if (value >= 1000) {
      return `${formatNumber(value / 1000, 2)} MWh`;
    }

    return `${formatNumber(value, 2)} kWh`;
  }

  if (unit === 'Hz') {
    return `${formatNumber(value, 2)} Hz`;
  }

  if (unit === 'V') {
    return `${formatNumber(value, 2)} V`;
  }

  if (unit === '%') {
    return `${formatNumber(value, 2)} %`;
  }

  if (unit === 'W/m²') {
    return `${formatNumber(value, 2)} W/m²`;
  }

  if (unit === '℃') {
    return `${formatNumber(value, 2)} ℃`;
  }

  if (centerText === '운영상태' || centerText === '통신 상태') {
    const statusText = name.replace(/^인버터\s*\d+\s*/, '');
    return statusText || '-';
  }

  return formatNumber(value, 2);
};

export function PieChartSmComponent({
  data,
  centerText = '전압데이터',
  centerValue,
  width = 240,
  height = 240,
}: PieChartProps) {
  const echartsRef = useRef<ReactECharts>(null);
  const unmountedRef = useRef(false);

  const chartData = useMemo(
    () =>
      data || [
        { name: '인버터 1', value: 80, color: '#B43FAA' },
        { name: '인버터 2', value: 20, color: '#F14B7F' },
        { name: '인버터 3', value: 15, color: '#F17549' },
        { name: '인버터 4', value: 15, color: '#DAAD3E' },
        { name: '인버터 5', value: 15, color: '#8ED048' },
        { name: '인버터 6', value: 15, color: '#20D99A' },
        { name: '인버터 7', value: 15, color: '#23A2C3' },
      ],
    [data],
  );

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
          const dataItem =
            item.data && typeof item.data === 'object' ? (item.data as DonutDataItem) : undefined;
          const rawValue = Number(dataItem?.rawValue ?? value);
          const valueText = getTooltipValueText(
            centerText,
            rawValue,
            String(item.name ?? ''),
            dataItem?.unit,
          );

          return `
            <div style="min-width:140px;">
              <div style="display:flex;align-items:center;gap:6px;font-weight:700;margin-bottom:4px;">
                ${item.marker ?? ''}
                <span>${item.name ?? '-'}</span>
              </div>
              <div style="padding-left:14px;">${valueText}</div>
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
        formatter: (name: string) => {
          const match = name.match(/(\d+)$/);
          const num = match ? match[1] : name;
          const item = chartData.find((d) => d.name === name);
          const rawVal = item?.rawValue ?? Number(item?.value ?? 0);
          const unit = item?.unit ?? '';
          const valueText = unit ? `${formatNumber(rawVal, 2)} ${unit}` : formatNumber(rawVal, 2);
          return `{space|} ${num}호  (${valueText})`;
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
            rawValue: item.rawValue,
            unit: item.unit,
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
    return () => {
      unmountedRef.current = true;
    };
  }, []);

  useEffect(() => {
    if (unmountedRef.current) return;
    const instance = echartsRef.current?.getEchartsInstance();
    if (!instance || instance.isDisposed()) return;
    instance.setOption(option, { notMerge: true });
  }, [option]);

  return (
    <div style={{ position: 'relative', width, height }}>
      <ReactECharts
        ref={echartsRef}
        option={option}
        style={{ height: '100%', width: '100%' }}
        opts={{ renderer: 'svg' }}
        notMerge={true}
        shouldSetOption={() => false}
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

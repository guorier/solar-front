'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';

interface DataPoint {
  time: string;
  value: number;
}

interface ChartItem {
  label: string;
  value: number;
}

interface LineChartProps {
  data?: DataPoint[];
  chart?: ChartItem[];
}

export function LineChartComponent({ data, chart }: LineChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const chartData = useMemo(() => {
    if (chart && chart.length > 0) {
      return chart.map((item) => ({
        time: item.label,
        value: item.value,
      }));
    }

    if (data) return data;

    return [];
  }, [data, chart]);

  const option: EChartsOption = useMemo(() => {
    return {
      backgroundColor: 'transparent',
      grid: {
        top: '15%',
        bottom: '15%',
        left: '3%',
        right: '3%',
        containLabel: false,
      },
      tooltip: {
        trigger: 'axis',
        show: true,
        axisPointer: {
          type: 'line',
          lineStyle: {
            color: '#9291A5',
            type: 'dashed',
            width: 1,
          },
        },
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        textStyle: { color: '#333' },
      },
      xAxis: {
        type: 'category',
        data: chartData.map((item) => item.time),
        boundaryGap: false,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: '#615E83',
          fontSize: 12,
          margin: 15,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#EDF2F7',
            type: 'dashed',
          },
        },
      },
      yAxis: {
        type: 'value',
        show: false,
      },
      series: [
        {
          name: 'Value',
          type: 'line',
          data: chartData.map((item) => item.value),
          smooth: 0.4,
          showSymbol: false,
          emphasis: {
            scale: true,
            itemStyle: {
              color: '#D70251',
              borderColor: '#FFFFFF',
              borderWidth: 2,
              shadowBlur: 8,
              shadowColor: 'rgba(0, 0, 0, 0.2)',
            },
          },
          symbol: 'circle',
          symbolSize: 15,
          lineStyle: {
            width: 1,
            color: '#D70251',
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgb(228, 70, 49)' },
              { offset: 0.45, color: 'rgb(241, 162, 152)' },
              { offset: 1, color: 'rgba(255, 255, 255, 0)' },
            ]),
          },
        },
      ],
    };
  }, [chartData]);

  useEffect(() => {
    if (!chartRef.current) return;

    // 차트 인스턴스 생성
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    chartInstance.current.setOption(option);

    // ResizeObserver 설정 - 차트 자체와 모든 부모 요소를 관찰
    const handleResize = () => {
      // 약간의 지연을 주어 DOM이 완전히 업데이트된 후 리사이즈
      requestAnimationFrame(() => {
        chartInstance.current?.resize();
      });
    };

    resizeObserverRef.current = new ResizeObserver(handleResize);

    // 차트 div와 여러 부모 요소를 모두 관찰
    let element = chartRef.current;
    const observedElements: Element[] = [];

    // 최대 5단계 부모까지 관찰
    for (let i = 0; i < 5 && element; i++) {
      resizeObserverRef.current.observe(element);
      observedElements.push(element);
      element = element.parentElement as HTMLDivElement;
    }

    // window resize도 처리
    const windowResizeHandler = () => handleResize();
    window.addEventListener('resize', windowResizeHandler);

    return () => {
      if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
      window.removeEventListener('resize', windowResizeHandler);
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, [option]);

  return (
    <div style={{ width: '100%', height: '100%', minHeight: 0 }}>
      <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

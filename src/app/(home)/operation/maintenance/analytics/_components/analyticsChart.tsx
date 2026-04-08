'use client';

import { Label, Modal, Select, SelectItem } from '@/components';
import { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import { Group } from 'react-aria-components';

const chartData = {
  categories: ['1월', '2월', '3월', '4월', '5월', '6월'],
  series: [
    {
      name: '서울 발전소',
      data: [120, 132, 101, 134, 90, 230],
    },
    {
      name: '부산 발전소',
      data: [220, 182, 191, 234, 290, 330],
    },
  ],
};

const option: EChartsOption = {
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    bottom: 0,
  },
  grid: {
    top: '5%',
    left: '3%',
    right: '4%',
    bottom: '10%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: chartData.categories,
  },
  yAxis: {
    type: 'value',
  },
  series: chartData.series.map((item) => ({
    name: item.name,
    type: 'line',
    data: item.data,
  })),
};

export default function AnalyticsChartModal({
  isOpen,
  onOpen,
}: {
  isOpen: boolean;
  onOpen: () => void;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpen}
      title="상세 분석 차트"
      width={800}
      primaryButton="닫기"
      secondaryButton=""
    >
      <Group style={{ justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <h3>일 단위 발전량 vs 기대 값 - 발전소</h3>
          <p style={{ color: 'var(--gray-30)' }}>실제 발전량과 예측 발전량을 비교합니다(kWh)</p>
        </div>

        <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: 'var(--spacing-10)' }}>
          <Label style={{ margin: 0, width: 'fit-content', textWrap: 'nowrap' }}>분석 차트</Label>

          <Select aria-label="검색 유형 선택">
            <SelectItem id="plantName">발전소</SelectItem>
            <SelectItem id="deviceName">장치</SelectItem>
            <SelectItem id="alarmCount">알림</SelectItem>
            <SelectItem id="dispatchCount">출동</SelectItem>
          </Select>
        </div>
      </Group>
      <div style={{ width: '100%', height: 400 }}>
        <ReactECharts option={option} style={{ width: '100%', height: '100%' }} />
      </div>
    </Modal>
  );
}

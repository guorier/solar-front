'use client';

import { useState } from 'react';
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  InfoGroupComponent,
  LineChartComponent,
} from '@/components';

export function TodayPowerGeneration({
  chart,
  onChangeChartType,
}: {
  chart: { label: string; value: number }[];
  onChangeChartType: (type: 'TIME' | 'DAY') => void;
}) {
  const isEmpty = !chart || chart.length === 0;
  const [title, setTitle] = useState('시간대별 출력량');

  return (
    <Tabs
      aria-label="출력탭"
      onSelectionChange={(key) => {
        if (key === 'time') {
          onChangeChartType('TIME');
          setTitle('시간대별 출력량');
        }
        if (key === 'day') {
          onChangeChartType('DAY');
          setTitle('주별 출력량');
        }
      }}
    >
      <InfoGroupComponent
        flex={1}
        minHeight={247}
        title={title}
        extra={
          <TabList aria-label="실시간 발전량 탭" style={{ height: 36 }}>
            <Tab id="time" style={{ padding: 'var(--spacing-3) var(--spacing-6)' }}>시간별</Tab>
            <Tab id="day" style={{ padding: 'var(--spacing-3) var(--spacing-6)' }}>
              주별
            </Tab>
          </TabList>
        }
      >
        <TabPanels>
          <TabPanel id="time">
            {isEmpty ? (
              <div
                style={{
                  height: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  fontSize: 'var(--font-size-14)',
                  color: 'var(--gray-500)',
                }}
              >
                표시할 발전소 데이터가 없습니다
              </div>
            ) : (
              <LineChartComponent chart={chart} />
            )}
          </TabPanel>

          <TabPanel id="day">
            {isEmpty ? (
              <div
                style={{
                  height: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'var(--font-size-14)',
                  fontWeight: '600',
                  color: '#888',
                }}
              >
                표시할 발전소 데이터가 없습니다
              </div>
            ) : (
              <LineChartComponent chart={chart} />
            )}
          </TabPanel>
        </TabPanels>
      </InfoGroupComponent>
    </Tabs>
  );
}
'use client';

import {
  ButtonComponent,
  DatePicker,
  Icons,
  TableTitleComponent,
  TitleComponent,
} from '@/components';
import { SummaryCard, SummaryCardItem, SummarySection } from '../../operation/_components';
import { Group } from 'react-aria-components';
import { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';

const CARD_ITEMS: SummaryCardItem[] = [
  {
    title: '금일 발전량',
    footer: (
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', width: '100%' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <p>RTU</p>
          <p>3,750.0 kWh</p>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: 'var(--spacing-4)',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <p>AMI</p>
          <p>3,992.0 kWh</p>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontWeight: 600,
          }}
        >
          <p>차이</p>
          <p>30.0 KWh (0.8%)</p>
        </div>
      </div>
    ),
  },
  {
    title: '금월 발전량',
    footer: (
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', width: '100%' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <p>RTU</p>
          <p>3,750.0 kWh</p>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: 'var(--spacing-4)',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <p>AMI</p>
          <p>3,992.0 kWh</p>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontWeight: 600,
          }}
        >
          <p>차이</p>
          <p>30.0 KWh (0.8%)</p>
        </div>
      </div>
    ),
  },
  {
    title: '금월 예상 정산액',
    footer: (
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', width: '100%' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <p>SMP</p>
          <p>17,245,250 원</p>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: 'var(--spacing-4)',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <p>REC</p>
          <p>3,250.0 원</p>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontWeight: 600,
          }}
        >
          <p>합계</p>
          <p>21,245,250 원</p>
        </div>
      </div>
    ),
  },
  {
    title: 'AMI 확정 대기',
    value: '2개월',
    description: '2025-12 외 5건',
    icon: 'feedback',
    valueColor: 'var(--critical)',
  },
  {
    title: '출력제약/이상치',
    value: '2개소',
    description: '즉시 확인 필요',
    icon: 'delete',
    valueColor: 'var(--critical)',
  },
];

const CARD_ITEMS2: SummaryCardItem[] = [
  {
    title: '총 수익',
    value: '245,291,212 원',
    description: '전월 대비 +9.1%',
    valueColor: 'var(--normal)',
  },
  {
    title: '수익률',
    value: '24.5%',
    description: '전월 대비 -2.1%',
    valueColor: 'var(--critical)',
  },
  {
    title: '운영 효율성',
    value: '24.5%',
    description: '전월 대비 +1.1%',
    valueColor: 'var(--normal)',
  },
  {
    title: '시장 점유율',
    value: '2.5%',
    description: '전월 대비 +1.1%',
    valueColor: 'var(--normal)',
  },
];

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

const option1: EChartsOption = {
  title: {
    text: '수익 구성 및 추이',
    left: 'left',
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    bottom: 0,
  },
  grid: {
    top: '18%',
    left: '1%',
    right: '1%',
    bottom: '10%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    boundaryGap: true,
    data: chartData.categories,
  },
  yAxis: {
    type: 'value',
  },
  series: chartData.series.map((item, index) => ({
    name: item.name,
    type: index === 0 ? 'bar' : 'line',
    data: item.data,
  })),
};

const option2: EChartsOption = {
  title: {
    text: '핵심 KPI 추이',
    left: 'left',
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    bottom: 0,
  },
  grid: {
    top: '18%',
    left: '1%',
    right: '1%',
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

export default function AnalysisOperationPage() {
  return (
    <>
      <div className="title-group">
        <TitleComponent
          title="분석 관리"
          subTitle="운영 분석"
          desc="거래/정산 수익 데이터 기반 운영 분석 및 판매 분석"
        />
      </div>

      <div className="content-group" style={{ paddingTop: 'var(--spacing-10)' }}>
        <SummarySection
          title="운영 분석"
          fitContent
          titleRight={
            <ButtonComponent icon={<Icons iName="download" color="white" size={12} />}>
              리포트
            </ButtonComponent>
          }
        >
          {CARD_ITEMS.map((item) => (
            <SummaryCard
              key={item.title}
              title={item.title}
              value={item.value}
              description={item.description}
              icon={item.icon}
              footer={item.footer}
              valueColor={item.valueColor}
            />
          ))}
        </SummarySection>

        <TableTitleComponent
          leftCont={<h3>기간 운영 분석</h3>}
          rightCont={
            <>
              <DatePicker /> - <DatePicker />
              <ButtonComponent>조회</ButtonComponent>
            </>
          }
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          <SummarySection fitContent>
            {CARD_ITEMS2.map((item) => (
              <SummaryCard
                key={item.title}
                title={item.title}
                value={item.value}
                description={item.description}
                icon={item.icon}
                footer={item.footer}
                valueColor={item.valueColor}
              />
            ))}
          </SummarySection>

          {/* 차트 영역 */}
          <Group>
            <div style={{ width: '100%', height: 360 }}>
              <ReactECharts option={option1} style={{ width: '100%', height: '100%' }} />
            </div>
            <div style={{ width: '100%', height: 360 }}>
              <ReactECharts option={option2} style={{ width: '100%', height: '100%' }} />
            </div>
          </Group>
        </div>

        {/* 임시 하단 영역 */}
        <Group style={{ gap: 'var(--spacing-10)' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-6)',
              width: '100%',
            }}
          >
            <h3>AMI 확정 대기 중 정산 월</h3>
            <div
              style={{
                flex: 1,
                width: '100%',
                height: '120px',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius)',
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-6)',
              width: '100%',
              height: '120px',
            }}
          >
            <h3>출력 제약 및 이상치 발생 발전소</h3>
            <div
              style={{
                flex: 1,
                width: '100%',
                height: '100%',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius)',
              }}
            />
          </div>
        </Group>
      </div>
    </>
  );
}

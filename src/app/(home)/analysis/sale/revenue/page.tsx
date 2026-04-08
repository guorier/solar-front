'use client';

import { SummaryCard, SummaryCardItem, SummarySection } from '@/app/(home)/operation/_components';
import {
  AgGridComponent,
  ButtonComponent,
  Icons,
  Progressbar,
  ProgressbarComponent,
  TableTitleComponent,
  TitleComponent,
} from '@/components';
import { EChartsOption } from 'echarts';
import { Group } from 'react-aria-components';
import ReactECharts from 'echarts-for-react';
import {
  REVENUE_CONTRACT_COLUMN,
  REVENUE_CONTRACT_DATA,
  REVENUE_PLANT_COLUMN,
  REVENUE_PLANT_ROW_DATA,
} from '@/constants/analysis/sale/revenue';

const CARD_ITEMS: SummaryCardItem[] = [
  {
    title: '금월 매출(2026-04)',
    value: '47,281,282원',
    description: '전월 대비 + 8.24%',
    valueColor: 'var(--warning)',
    footer: (
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', width: '100%' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 'var(--spacing-4)',
            borderTop: '1px solid var(--border-color)',
          }}
        >
          <p>SMP 매출</p>
          <p>42,425,666 원</p>
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
          <p>REC 매출</p>
          <p>42,425,666 원</p>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'var(--warning)',
            fontWeight: 600,
          }}
        >
          <p>순 이익</p>
          <p>98,456,826 원</p>
        </div>
      </div>
    ),
  },
  {
    title: '전월 매출(2026-03)',
    value: '47,281,282원',
    description: '전월 실적',
    footer: (
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', width: '100%' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 'var(--spacing-4)',
            borderTop: '1px solid var(--border-color)',
          }}
        >
          <p>SMP 매출</p>
          <p>42,425,666 원</p>
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
          <p>REC 매출</p>
          <p>42,425,666 원</p>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontWeight: 600,
          }}
        >
          <p>순 이익</p>
          <p>98,456,826 원</p>
        </div>
      </div>
    ),
  },
  {
    title: '전년 동월(2025-04)',
    value: '47,281,282원',
    description: 'YoY + 18.24%',
    footer: (
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', width: '100%' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 'var(--spacing-4)',
            borderTop: '1px solid var(--border-color)',
          }}
        >
          <p>SMP 매출</p>
          <p>42,425,666 원</p>
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
          <p>REC 매출</p>
          <p>42,425,666 원</p>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontWeight: 600,
          }}
        >
          <p>순 이익</p>
          <p>98,456,826 원</p>
        </div>
      </div>
    ),
  },
];

const CARD_ITEMS2: SummaryCardItem[] = [
  {
    title: '고정 가격 장기 계약',
    footer: (
      <ProgressbarComponent title="25,000,000원" count={8} unit="%" fractionDigits={2} rightSide>
        <Progressbar value={0.8} fillColor="#BC0046" trackColor="#ece8eb" height={18} radius={2} />
      </ProgressbarComponent>
    ),
    rightTop: (
      <p
        style={{
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius)',
          padding: 'var(--spacing-2) var(--spacing-4)',
          background: 'var(--gray-0)',
        }}
      >
        8건
      </p>
    ),
  },
  {
    title: '현물 거래',
    footer: (
      <ProgressbarComponent title="25,000,000원" count={8} unit="%" fractionDigits={2} rightSide>
        <Progressbar value={0.8} fillColor="#BC0046" trackColor="#ece8eb" height={18} radius={2} />
      </ProgressbarComponent>
    ),
    rightTop: (
      <p
        style={{
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius)',
          padding: 'var(--spacing-2) var(--spacing-4)',
          background: 'var(--gray-0)',
        }}
      >
        20건
      </p>
    ),
  },
  {
    title: '시장 연동 계약',
    footer: (
      <ProgressbarComponent title="25,000,000원" count={8} unit="%" fractionDigits={2} rightSide>
        <Progressbar value={0.8} fillColor="#BC0046" trackColor="#ece8eb" height={18} radius={2} />
      </ProgressbarComponent>
    ),
    rightTop: (
      <p
        style={{
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius)',
          padding: 'var(--spacing-2) var(--spacing-4)',
          background: 'var(--gray-0)',
        }}
      >
        40건
      </p>
    ),
  },
  {
    title: 'REC 선물 계약',
    footer: (
      <ProgressbarComponent title="25,000,000원" count={8} unit="%" fractionDigits={2} rightSide>
        <Progressbar value={0.8} fillColor="#BC0046" trackColor="#ece8eb" height={18} radius={2} />
      </ProgressbarComponent>
    ),
    rightTop: (
      <p
        style={{
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius)',
          padding: 'var(--spacing-2) var(--spacing-4)',
          background: 'var(--gray-0)',
        }}
      >
        10건
      </p>
    ),
  },
];

const chartData = {
  series: [
    { name: '서울 발전소', data: [120, 132, 101, 134, 90, 230] },
    { name: '부산 발전소', data: [220, 182, 191, 234, 290, 330] },
  ],
};

const pieData = chartData.series.map((item) => ({
  name: item.name,
  value: item.data.reduce((a, b) => a + b, 0),
}));

const optionPie: EChartsOption = {
  title: {
    text: '계약 유형별 매출 비중',
    left: 'left',
  },

  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)',
  },

  legend: {
    bottom: 0,
  },

  series: [
    {
      name: '매출 비중',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '45%'],

      data: pieData,

      label: {
        show: true,
        position: 'outside',
        formatter: '{b}\n{d}%',
      },

      labelLine: {
        show: true,
        length: 15,
        length2: 10,
      },

      emphasis: {
        label: {
          show: true,
          fontSize: 14,
          fontWeight: 'bold',
        },
      },
    },
  ],
};

export default function RevenueDashBoardPage() {
  return (
    <>
      <div className="title-group">
        <TitleComponent
          title="분석 관리"
          subTitle="판매 분석"
          thirdTitle="수익 대시보드"
          desc="거래/정산 수익 데이터 기반 운영 분석 및 판매 분석"
        />
      </div>

      <div className="content-group" style={{ paddingTop: 'var(--spacing-10)' }}>
        <SummarySection
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

        <Group style={{ gap: 'var(--spacing-6)' }}>
          <div style={{ flex: 1, height: 360 }}>
            <ReactECharts option={optionPie} style={{ flex: 1, width: '100%', height: '100%' }} />
          </div>
          <SummarySection background="none" columns={2} minColumnWidth="200px">
            {CARD_ITEMS2.map((item) => (
              <SummaryCard
                key={item.title}
                title={item.title}
                value={item.value}
                description={item.description}
                icon={item.icon}
                footer={item.footer}
                valueColor={item.valueColor}
                background="var(--gray-A100)"
                rightTop={item.rightTop}
              />
            ))}
          </SummarySection>
        </Group>

        <Group style={{ gap: 'var(--spacing-6)' }}>
          <div style={{ width: '100%' }}>
            <TableTitleComponent leftCont={<h3>Top5 수익 발전소</h3>} />
            <AgGridComponent rowData={REVENUE_PLANT_ROW_DATA} columnDefs={REVENUE_PLANT_COLUMN} />
          </div>

          <div style={{ width: '100%' }}>
            <TableTitleComponent leftCont={<h3>Top5 수익 계약</h3>} />
            <AgGridComponent rowData={REVENUE_CONTRACT_DATA} columnDefs={REVENUE_CONTRACT_COLUMN} />
          </div>
        </Group>
      </div>
    </>
  );
}

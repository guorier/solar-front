'use client';

import { AgGridComponent, Meter, TableTitleComponent, TitleComponent } from '@/components';
import {
  OPERATION_STATUS_COLUMN,
  OPERATION_STATUS_ROW_DATA,
} from '@/constants/operation/maintenance/status';
import { Tag, TagGroup, TagList } from 'react-aria-components';
import { SummaryCard, SummaryCardItem, SummarySection } from '../../_components';

const tagItems1 = [
  { key: 'critical', label: 'critical', count: 3 },
  { key: 'major', label: 'major', count: 3 },
  { key: 'minor', label: 'minor', count: 3 },
];

const tagItems2 = [
  { key: 'warning', label: '진행중', count: 4 },
  { key: 'pending', label: '대기중', count: 1 },
];

const CARD_ITEMS: SummaryCardItem[] = [
  {
    title: '가동률 (Availability)',
    value: '98.5%',
    description: '발전소 평균',
    icon: 'thunder',
    footer: <Meter value={98.5} />,
  },
  {
    title: '이상 알림 수',
    value: '12',
    description: '현재 발생 알람',
    icon: 'arrow_down',
    footer: (
      <TagGroup aria-label="이상 알림 수">
        <TagList>
          {tagItems1.map((item) => (
            <Tag key={item.key} id={item.key}>
              {item.label}: {item.count}
            </Tag>
          ))}
        </TagList>
      </TagGroup>
    ),
  },
  {
    title: '출동 요청 건',
    value: '5',
    description: '작업 요청 건',
    icon: 'arrow_down',
    footer: (
      <TagGroup aria-label="출동 요청 건">
        <TagList>
          {tagItems2.map((item) => (
            <Tag key={item.key} id={item.key}>
              {item.label}: {item.count}건
            </Tag>
          ))}
        </TagList>
      </TagGroup>
    ),
  },
  {
    title: '예상 발전 변동',
    value: '1,255kWh',
    description: (
      <>
        금일 누적 손실
        <br />
        <span style={{ color: 'red' }}>↑ 전일 대비 +15%</span>
      </>
    ),
    icon: 'thunder',
  },
];

export default function OperationStatusPage() {
  return (
    <>
      <div className="title-group">
        <TitleComponent
          title="운영 관리"
          subTitle="유지보수"
          thirdTitle="현황"
          desc="발전소 운영 및 유지보수 현황을 한눈에 확인"
        />
      </div>

      <div className="content-group" style={{ paddingTop: 'var(--spacing-10)' }}>
        <SummarySection title="발전소 현재 상태 요약" fitContent>
          {CARD_ITEMS.map((item) => (
            <SummaryCard
              key={item.title}
              title={item.title}
              value={item.value}
              description={item.description}
              icon={item.icon}
              footer={item.footer}
            />
          ))}
        </SummarySection>

        <TableTitleComponent leftCont={<h3>발전소별 상태 요약</h3>} />

        <AgGridComponent rowData={OPERATION_STATUS_ROW_DATA} columnDefs={OPERATION_STATUS_COLUMN} />
      </div>
    </>
  );
}

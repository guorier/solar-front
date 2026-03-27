// // app/trading/prices/page.tsx
// export default function Page() {
//   return <div>SMP/REC 단가</div>;
// }

// app/trading/prices/page.tsx
'use client';

import { CSSProperties, useMemo, useState } from 'react';
import {
  Cell,
  Column,
  DatePicker,
  Row,
  Table,
  TableBody,
  TableHeader,
  TitleComponent,
  Icons,
} from '@/components';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'react-aria-components';

type PriceSummaryCard = {
  key: string;
  label: string;
  value: string;
  unit: string;
  changeRate: string;
  baseText: string;
};

type SmpPriceRow = {
  id: string;
  date: string;
  time: string;
  inlandForecast: string;
  jejuForecast: string;
  totalForecast: string;
  smp: string;
};

type RecPriceRow = {
  id: string;
  date: string;
  time: string;
  recPrice: string;
  volume: string;
  amount: string;
  status: string;
};

type SmpTableColumn = {
  key: keyof SmpPriceRow;
  label: string;
  width: string;
  isRowHeader?: boolean;
};

type RecTableColumn = {
  key: keyof RecPriceRow;
  label: string;
  width: string;
  isRowHeader?: boolean;
};

const summaryCards: Record<'smp' | 'rec', PriceSummaryCard[]> = {
  smp: [
    {
      key: 'smp-latest',
      label: 'SMP 최근 단가',
      value: '145.87',
      unit: '원 / kWh',
      changeRate: '- 10.22 %',
      baseText: '평균 값은 7일 기준',
    },
    {
      key: 'rec-latest',
      label: 'REC 최근 단가',
      value: '45,117',
      unit: '원 / REC',
      changeRate: '- 1.22 %',
      baseText: '평균 값은 7일 기준',
    },
    {
      key: 'smp-average',
      label: 'SMP 7일 평균',
      value: '145.87',
      unit: '원 / kWh',
      changeRate: '',
      baseText: '최근 7일 기준',
    },
    {
      key: 'rec-average',
      label: 'REC 7일 평균',
      value: '14,287',
      unit: '원 / REC',
      changeRate: '',
      baseText: '최근 7일 기준',
    },
  ],
  rec: [
    {
      key: 'smp-latest',
      label: 'SMP 최근 단가',
      value: '145.87',
      unit: '원 / kWh',
      changeRate: '- 10.22 %',
      baseText: '평균 값은 7일 기준',
    },
    {
      key: 'rec-latest',
      label: 'REC 최근 단가',
      value: '45,117',
      unit: '원 / REC',
      changeRate: '- 1.22 %',
      baseText: '평균 값은 7일 기준',
    },
    {
      key: 'smp-average',
      label: 'SMP 7일 평균',
      value: '145.87',
      unit: '원 / kWh',
      changeRate: '',
      baseText: '최근 7일 기준',
    },
    {
      key: 'rec-average',
      label: 'REC 7일 평균',
      value: '14,287',
      unit: '원 / REC',
      changeRate: '',
      baseText: '최근 7일 기준',
    },
  ],
};

const smpRows: SmpPriceRow[] = [
  {
    id: '1',
    date: '2025-12-31',
    time: '09:00 12:11',
    inlandForecast: '12,123 원',
    jejuForecast: '10,921 원',
    totalForecast: '32,291 원',
    smp: '14.93 원',
  },
  {
    id: '2',
    date: '2025-12-30',
    time: '09:00 12:00',
    inlandForecast: '12,243 원',
    jejuForecast: '11,971 원',
    totalForecast: '34,491 원',
    smp: '15.93 원',
  },
  {
    id: '3',
    date: '2025-12-29',
    time: '09:00 11:56',
    inlandForecast: '11,123 원',
    jejuForecast: '11,001 원',
    totalForecast: '31,902 원',
    smp: '14.21 원',
  },
  {
    id: '4',
    date: '2025-12-28',
    time: '09:00 11:48',
    inlandForecast: '12,845 원',
    jejuForecast: '10,884 원',
    totalForecast: '33,102 원',
    smp: '15.12 원',
  },
  {
    id: '5',
    date: '2025-12-27',
    time: '09:00 11:31',
    inlandForecast: '12,551 원',
    jejuForecast: '10,337 원',
    totalForecast: '32,448 원',
    smp: '14.80 원',
  },
];

const recRows: RecPriceRow[] = [
  {
    id: '1',
    date: '2025-12-31',
    time: '09:00 12:11',
    recPrice: '45,117 원',
    volume: '1,200 REC',
    amount: '54,140,400 원',
    status: '정산 완료',
  },
  {
    id: '2',
    date: '2025-12-30',
    time: '09:00 12:00',
    recPrice: '44,920 원',
    volume: '980 REC',
    amount: '44,021,600 원',
    status: '정산 완료',
  },
  {
    id: '3',
    date: '2025-12-29',
    time: '09:00 11:56',
    recPrice: '45,000 원',
    volume: '1,050 REC',
    amount: '47,250,000 원',
    status: '처리 중',
  },
  {
    id: '4',
    date: '2025-12-28',
    time: '09:00 11:48',
    recPrice: '44,870 원',
    volume: '1,110 REC',
    amount: '49,805,700 원',
    status: '정산 완료',
  },
  {
    id: '5',
    date: '2025-12-27',
    time: '09:00 11:31',
    recPrice: '44,780 원',
    volume: '920 REC',
    amount: '41,197,600 원',
    status: '정산 완료',
  },
];

const smpColumns: SmpTableColumn[] = [
  { key: 'date', label: '날짜', width: '14%', isRowHeader: true },
  { key: 'time', label: '시간', width: '18%' },
  { key: 'inlandForecast', label: '육지 예측', width: '18%' },
  { key: 'jejuForecast', label: '제주예측', width: '18%' },
  { key: 'totalForecast', label: '총 예측', width: '18%' },
  { key: 'smp', label: 'SMP', width: '14%' },
];

const recColumns: RecTableColumn[] = [
  { key: 'date', label: '날짜', width: '16%', isRowHeader: true },
  { key: 'time', label: '시간', width: '18%' },
  { key: 'recPrice', label: 'REC 단가', width: '18%' },
  { key: 'volume', label: '거래량', width: '16%' },
  { key: 'amount', label: '거래 금액', width: '20%' },
  { key: 'status', label: '상태', width: '12%' },
];

const cellRightStyle: CSSProperties = {
  textAlign: 'right',
  paddingRight: '20px',
};

const tableWrapStyle: CSSProperties = {
  width: '100%',
  overflow: 'auto',
  border: '1px solid #d9dde5',
  background: '#ffffff',
};

const tableStyle: CSSProperties = {
  width: '100%',
  minWidth: '1100px',
  tableLayout: 'fixed',
};

const chartBoxStyle: CSSProperties = {
  height: '380px',
  border: '1px solid #d9dde5',
  borderRadius: '12px',
  background: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

function SummaryCard({ item }: { item: PriceSummaryCard }) {
  const isNegative = item.changeRate.trim().startsWith('-');

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        border: '1px solid #d9dde5',
        borderRadius: '12px',
        padding: '16px 18px',
      }}
    >
      <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '10px' }}>{item.label}</div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#111827' }}>{item.value}</div>
          <div style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>{item.unit}</div>
          <Icons iName="amount" size={24} />
        </div>
        {item.changeRate ? (
          <div
            style={{
              minHeight: '20px',
              fontSize: '13px',
              fontWeight: 700,
              color: isNegative ? '#d70251' : '#2563eb',
              marginBottom: '6px',
            }}
          >
            {item.changeRate}
          </div>
        ) : (
          <div style={{ fontSize: '12px', color: '#6b7280' }}>{item.baseText}</div>
        )}
      </div>
    </div>
  );
}

function ChartPlaceholder({ title }: { title: string }) {
  return (
    <div style={chartBoxStyle}>
      <div
        style={{
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '18px',
          fontWeight: 600,
          lineHeight: 1.6,
        }}
      >
        <div>{title}</div>
        <div>차트 영역</div>
      </div>
    </div>
  );
}

function SmpTable({ rows }: { rows: SmpPriceRow[] }) {
  return (
    <div style={tableWrapStyle}>
      <Table aria-label="SMP 단가 목록" style={tableStyle}>
        <TableHeader>
          {smpColumns.map((column) => (
            <Column
              key={column.key}
              style={{ width: column.width }}
              isRowHeader={column.isRowHeader}
            >
              {column.label}
            </Column>
          ))}
        </TableHeader>
        <TableBody>
          {rows.map((item) => (
            <Row key={item.id}>
              <Cell>{item.date}</Cell>
              <Cell>{item.time}</Cell>
              <Cell style={cellRightStyle}>{item.inlandForecast}</Cell>
              <Cell style={cellRightStyle}>{item.jejuForecast}</Cell>
              <Cell style={cellRightStyle}>{item.totalForecast}</Cell>
              <Cell style={cellRightStyle}>{item.smp}</Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function RecTable({ rows }: { rows: RecPriceRow[] }) {
  return (
    <div style={tableWrapStyle}>
      <Table aria-label="REC 단가 목록" style={tableStyle}>
        <TableHeader>
          {recColumns.map((column) => (
            <Column
              key={column.key}
              style={{ width: column.width }}
              isRowHeader={column.isRowHeader}
            >
              {column.label}
            </Column>
          ))}
        </TableHeader>
        <TableBody>
          {rows.map((item) => (
            <Row key={item.id}>
              <Cell>{item.date}</Cell>
              <Cell>{item.time}</Cell>
              <Cell style={cellRightStyle}>{item.recPrice}</Cell>
              <Cell style={cellRightStyle}>{item.volume}</Cell>
              <Cell style={cellRightStyle}>{item.amount}</Cell>
              <Cell>{item.status}</Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function Page() {
  const [selectedTab, setSelectedTab] = useState<string>('smp');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const currentSummaryCards = useMemo(() => {
    return selectedTab === 'smp' ? summaryCards.smp : summaryCards.rec;
  }, [selectedTab]);

  return (
    <div>
      <div className="title-group" style={{ marginBottom: '24px' }}>
        <TitleComponent
          title="SMP/REC 단가"
          subTitle="SMP/REC 단가 조회"
          desc="전력 거래 관리에 SMP/REC 단가 조회"
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        {currentSummaryCards.map((item) => (
          <SummaryCard key={item.key} item={item} />
        ))}
      </div>

      <Tabs
        aria-label="SMP REC 관리"
        selectedKey={selectedTab}
        onSelectionChange={(key) => setSelectedTab(String(key))}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '20px',
            flexWrap: 'wrap',
          }}
        >
          <TabList aria-label="SMP REC 탭" style={{ width: 'fit-content' }}>
            <Tab id="smp">SMP 관리</Tab>
            <Tab id="rec">REC 관리</Tab>
          </TabList>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              minWidth: '465px',
            }}
          >
            <DatePicker
              aria-label="시작일"
              value={startDate}
              onChange={(v: string) => setStartDate(v)}
            />
            <span>~</span>
            <DatePicker
              aria-label="종료일"
              value={endDate}
              onChange={(v: string) => setEndDate(v)}
            />
          </div>
        </div>

        <TabPanels aria-label="SMP REC 패널">
          <TabPanel id="smp">
            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#111827',
                    marginBottom: '12px',
                  }}
                >
                  SMP 최근 단가 추이(30일)
                </div>
                <ChartPlaceholder title="SMP 최근 단가 차트" />
              </div>

              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#111827' }}>
                    SMP 단가 목록
                  </div>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>{smpRows.length}건</div>
                </div>
                <SmpTable rows={smpRows} />
              </div>
            </div>
          </TabPanel>

          <TabPanel id="rec">
            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#111827',
                    marginBottom: '12px',
                  }}
                >
                  REC 최근 단가 추이(30일)
                </div>
                <ChartPlaceholder title="REC 최근 단가 차트" />
              </div>

              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    marginBottom: '12px',
                  }}
                >
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#111827' }}>
                    REC 단가 목록
                  </div>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>{recRows.length}건</div>
                </div>
                <RecTable rows={recRows} />
              </div>
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}

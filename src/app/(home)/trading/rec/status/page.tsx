'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import {
  BottomGroupComponent,
  Cell,
  Column,
  InfoBoxComponent,
  InfoBoxGroup,
  Meter,
  Pagination,
  Row,
  Table,
  TableBody,
  TableHeader,
  TitleComponent,
  TopInfoBoxComponent,
} from '@/components';
import {
  recStatusMonthlyMock,
  recStatusRecentIssuesMock,
  recStatusSummaryMock,
  type RecStatusRecentIssueRow,
} from '@/mockup/rec-status.mock';

type RecentIssueColumn = {
  key: keyof RecStatusRecentIssueRow;
  label: string;
  width: string;
  isRowHeader?: boolean;
};

const PAGE_SIZE = 10;

const sectionTitleStyle: CSSProperties = {
  fontSize: '16px',
  fontWeight: 700,
  color: '#111827',
};

const progressCardStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  border: '1px solid #d9dde5',
  borderRadius: '12px',
  padding: '16px 18px',
  background: '#ffffff',
};

const progressLabelStyle: CSSProperties = {
  color: '#8b8888',
  fontSize: '13px',
  fontWeight: 500,
  lineHeight: 1,
};

const progressRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const progressValueStyle: CSSProperties = {
  minWidth: '56px',
  color: '#8b8888',
  fontSize: '16px',
  fontWeight: 700,
  textAlign: 'right',
};

const tableWrapStyle: CSSProperties = {
  width: '100%',
  overflow: 'auto',
  border: '1px solid #d9dde5',
  background: '#ffffff',
};

const tableStyle: CSSProperties = {
  width: '100%',
  minWidth: '980px',
  tableLayout: 'fixed',
};

const centerCellStyle: CSSProperties = {
  textAlign: 'center',
};

const emptyStateStyle: CSSProperties = {
  padding: '24px 16px',
  color: '#8b8888',
  textAlign: 'center',
  borderTop: '1px solid #e5e7eb',
};

const recentIssueColumns: RecentIssueColumn[] = [
  { key: 'tradeDate', label: '거래 일', width: '14%', isRowHeader: true },
  { key: 'plantName', label: '발전소/기지국', width: '21%' },
  { key: 'transactionAmount', label: '거래량(kWh)', width: '18%' },
  { key: 'smpUnitPrice', label: 'SMP 단가', width: '16%' },
  { key: 'recUnitPrice', label: 'REC 단가', width: '16%' },
  { key: 'totalRevenue', label: '총 수익', width: '15%' },
];

function RecentIssueTable({ rows }: { rows: RecStatusRecentIssueRow[] }) {
  return (
    <div style={tableWrapStyle}>
      <Table aria-label="최근 발급 현황" style={tableStyle}>
        <TableHeader>
          {recentIssueColumns.map((column) => (
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
          {rows.map((row, index) => (
            <Row key={`${row.tradeDate}-${row.plantName}-${index}`}>
              <Cell style={centerCellStyle}>{row.tradeDate}</Cell>
              <Cell style={centerCellStyle}>{row.plantName}</Cell>
              <Cell style={centerCellStyle}>{row.transactionAmount}</Cell>
              <Cell style={centerCellStyle}>{row.smpUnitPrice}</Cell>
              <Cell style={centerCellStyle}>{row.recUnitPrice}</Cell>
              <Cell style={centerCellStyle}>{row.totalRevenue}</Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
      {rows.length === 0 ? <div style={emptyStateStyle}>일치하는 DATA가 없습니다</div> : null}
    </div>
  );
}

export default function RecStatusPage() {
  const [page, setPage] = useState(1);

  const pagedRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return recStatusRecentIssuesMock.slice(start, start + PAGE_SIZE);
  }, [page]);

  return (
    <>
      <div className="title-group" style={{ marginBottom: '18px' }}>
        <TitleComponent
          title="전력 거래"
          subTitle="REC 발급 관리"
          thirdTitle="발급 현황"
          desc="REC 발급 관리에서 발급 현황 정보"
        />
      </div>

      <TopInfoBoxComponent title="총 발급 현황" bg="var(--point-orange-5)" color="#A34600">
        <InfoBoxGroup className="row-type">
          {recStatusSummaryMock.map((item) => (
            <InfoBoxComponent
              key={`${item.label}-${item.value}`}
              icon="feedback"
              title={item.label}
              count={item.value}
              bg="white"
            >
              {item.helper}
            </InfoBoxComponent>
          ))}
        </InfoBoxGroup>
      </TopInfoBoxComponent>

      <div className="content-group" style={{ gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <TopInfoBoxComponent
            title="이번 달 REC 발급 현황 (2026년 1월)"
            bg="var(--point-orange-5)"
            color="#A34600"
          >
            <InfoBoxGroup className="row-type">
              {recStatusMonthlyMock.metrics.map((item, idx) => (
                <InfoBoxComponent
                  key={`${item.label}-${item.value}`}
                  icon={idx === 0 ? 'energy' : 'feedback'}
                  title={item.label}
                  count={item.value}
                  bg="white"
                >
                  {item.helper}
                </InfoBoxComponent>
              ))}
            </InfoBoxGroup>
          </TopInfoBoxComponent>

          <div style={progressCardStyle}>
            <div style={progressLabelStyle}>진행률</div>
            <div style={progressRowStyle}>
              <Meter
                className="rec-progress-meter flex-1"
                aria-label="REC 발급 진행률"
                minValue={0}
                maxValue={100}
                value={recStatusMonthlyMock.progressRate}
              />
              <div style={progressValueStyle}>{recStatusMonthlyMock.progressRate.toFixed(1)}%</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={sectionTitleStyle}>최근 발급 현황</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <RecentIssueTable rows={pagedRows} />
            <BottomGroupComponent
              leftCont={
                <Pagination
                  data={{
                    page,
                    size: PAGE_SIZE,
                    total: recStatusRecentIssuesMock.length,
                  }}
                  onChange={setPage}
                />
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}

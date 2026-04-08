'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import {
  BottomGroupComponent,
  ButtonComponent,
  Cell,
  Column,
  Icons,
  InfoBoxComponent,
  InfoBoxGroup,
  Pagination,
  Row,
  Table,
  TableBody,
  TableHeader,
  TableTitleComponent,
  TitleComponent,
  TopInfoBoxComponent,
  SearchFieldConfig,
  SearchForm,
  CountArea,
  SearchFields,
} from '@/components';
import {
  recHistoryRows,
  recHistorySummaryItems,
  type RecHistoryRow,
} from '@/mockup/rec-history.mock';

const PAGE_SIZE = 20;

const showNumberConfig: (SearchFieldConfig | SearchFieldConfig[])[] = [
  {
    key: 'showNumber',
    type: 'select',
    options: [
      { label: '20개씩 보기', value: '20' },
      { label: '40개씩 보기', value: '40' },
      { label: '60개씩 보기', value: '60' },
    ],
  },
];

type SearchState = {
  plant: string;
  approveMonth: string;
  issueMonth: string;
};

type PageState = SearchState & { page: number };

type HistoryColumn = {
  key: keyof RecHistoryRow;
  label: string;
  width: string;
  isRowHeader?: boolean;
};

const initialSearch: SearchState = {
  plant: '',
  approveMonth: '',
  issueMonth: '',
};

const historyColumns: HistoryColumn[] = [
  { key: 'requestNo', label: '신청 번호', width: '16%', isRowHeader: true },
  { key: 'plantName', label: '발전소', width: '19%' },
  { key: 'targetMonth', label: '대상 월', width: '13%' },
  { key: 'generationKwh', label: '발전량', width: '16%' },
  { key: 'recAmount', label: 'REC수량', width: '14%' },
  { key: 'approvedAt', label: '승인 일', width: '11%' },
  { key: 'issuedAt', label: '발급 일', width: '11%' },
];

const tableWrapStyle: CSSProperties = {
  width: '100%',
  height: 'calc(100dvh - 520px)',
  overflow: 'auto',
  border: '1px solid #d9dde5',
  background: '#ffffff',
};

const tableStyle: CSSProperties = {
  width: '100%',
  minWidth: '900px',
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

const searchConfig: SearchFieldConfig[] = [
  {
    key: 'plant',
    label: '발전소',
    type: 'text',
    placeholder: '발전소 검색',
  },
  {
    key: 'approveMonth',
    label: '승인일',
    type: 'date',
  },
  {
    key: 'issueMonth',
    label: '발급일',
    type: 'date',
  },
];

export default function RecHistoryPage() {
  const [draftSearch, setDraftSearch] = useState<Record<string, unknown>>(initialSearch);
  const [query, setQuery] = useState<PageState>({ ...initialSearch, page: 1 });
  const [values, setValues] = useState<Record<string, unknown>>({ showNumber: String(PAGE_SIZE) });

  const onChangeValues = (key: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const filteredRows = useMemo(() => {
    let rows = recHistoryRows;

    if (query.plant.trim()) {
      const kw = query.plant.trim().toLowerCase();
      rows = rows.filter((r) => r.plantName.toLowerCase().includes(kw));
    }

    if (query.approveMonth) {
      rows = rows.filter((r) => r.approvedAt.startsWith(query.approveMonth));
    }

    if (query.issueMonth) {
      rows = rows.filter((r) => r.issuedAt.startsWith(query.issueMonth));
    }

    return rows;
  }, [query.plant, query.approveMonth, query.issueMonth]);

  const pagedRows = useMemo(() => {
    const start = (query.page - 1) * PAGE_SIZE;
    return filteredRows.slice(start, start + PAGE_SIZE);
  }, [filteredRows, query.page]);

  const handleSearchChange = (key: string, value: unknown) => {
    setDraftSearch((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    setQuery({
      plant: (draftSearch.plant as string) || '',
      approveMonth: (draftSearch.approveMonth as string) || '',
      issueMonth: (draftSearch.issueMonth as string) || '',
      page: 1,
    });
  };

  return (
    <>
      <div className="title-group">
        <TitleComponent
          title="전력 거래"
          subTitle="REC 발급 관리"
          thirdTitle="발급 내역"
          desc="REC 발급 신청 내용 발급 현황 조회"
        />
      </div>

      <div className="content-group">
        <SearchForm
          config={searchConfig}
          values={draftSearch}
          onChange={handleSearchChange}
          onSearch={handleSearch}
        />

        <TopInfoBoxComponent title="발급 현황" bg="var(--point-orange-5)" color="#A34600">
          <InfoBoxGroup className="row-type">
            {recHistorySummaryItems.map((item) => (
              <InfoBoxComponent
                key={item.label}
                icon="feedback"
                title={item.label}
                count={item.value}
                bg="white"
              />
            ))}
          </InfoBoxGroup>
        </TopInfoBoxComponent>

        <div className="table-group">
          <TableTitleComponent
            leftCont={<CountArea search={filteredRows.length} total={recHistoryRows.length} />}
            rightCont={
              <SearchFields config={showNumberConfig} values={values} onChange={onChangeValues} />
            }
          />
          <div style={tableWrapStyle}>
            <Table aria-label="REC 발급 내역" style={tableStyle}>
              <TableHeader>
                {historyColumns.map((col) => (
                  <Column key={col.key} style={{ width: col.width }} isRowHeader={col.isRowHeader}>
                    {col.label}
                  </Column>
                ))}
              </TableHeader>
              <TableBody>
                {pagedRows.map((row) => (
                  <Row key={row.requestNo}>
                    <Cell style={centerCellStyle}>{row.requestNo}</Cell>
                    <Cell style={centerCellStyle}>{row.plantName}</Cell>
                    <Cell style={centerCellStyle}>{row.targetMonth}</Cell>
                    <Cell style={centerCellStyle}>{row.generationKwh}</Cell>
                    <Cell style={centerCellStyle}>{row.recAmount}</Cell>
                    <Cell style={centerCellStyle}>{row.approvedAt}</Cell>
                    <Cell style={centerCellStyle}>{row.issuedAt}</Cell>
                  </Row>
                ))}
              </TableBody>
            </Table>
            {pagedRows.length === 0 && <div style={emptyStateStyle}>일치하는 DATA가 없습니다</div>}
          </div>
        </div>
      </div>

      <BottomGroupComponent
        leftCont={
          <Pagination
            data={{ page: query.page, size: PAGE_SIZE, total: filteredRows.length }}
            onChange={(page) => setQuery((prev) => ({ ...prev, page }))}
          />
        }
        rightCont={
          <ButtonComponent
            variant="excel"
            icon={<Icons iName="xlsx" size={16} color="#fff" />}
            onPress={() => undefined}
          >
            Excel
          </ButtonComponent>
        }
      />
    </>
  );
}

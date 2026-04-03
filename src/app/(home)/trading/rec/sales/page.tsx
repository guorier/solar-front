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
  SearchFieldConfig,
  SearchForm,
  Tab,
  Table,
  TableBody,
  TableHeader,
  TableTitleComponent,
  TabList,
  TabPanel,
  Tabs,
  TitleComponent,
  TopInfoBoxComponent,
} from '@/components';
import {
  recSalesBuyerOptions,
  recSalesContractRows,
  recSalesSummary,
  recSalesStatusOptions,
  type RecSalesContractRow,
} from '@/mockup/rec-sales.mock';

const PAGE_SIZE = 20;

type SearchState = {
  contractNo: string;
  buyer: string;
  status: string;
  periodFrom: string;
  periodTo: string;
};

type PageState = SearchState & { page: number };

type ContractColumn = {
  key: keyof RecSalesContractRow;
  label: string;
  width: string;
  isRowHeader?: boolean;
};

const initialSearch: SearchState = {
  contractNo: '',
  buyer: '',
  status: '',
  periodFrom: '',
  periodTo: '',
};

const contractColumns: ContractColumn[] = [
  { key: 'contractNo', label: '계약 번호', width: '13%', isRowHeader: true },
  { key: 'contractName', label: '계약 명', width: '20%' },
  { key: 'buyer', label: '구매자', width: '14%' },
  { key: 'contractPeriod', label: '계약 기간', width: '17%' },
  { key: 'monthlyQty', label: '월별 수량', width: '10%' },
  { key: 'unitPrice', label: '단가', width: '11%' },
  { key: 'executionPeriod', label: '실행 기간', width: '8%' },
  { key: 'status', label: '상태', width: '7%' },
];

const searchConfig: SearchFieldConfig[] = [
  {
    key: 'contractNo',
    label: '계약 번호',
    type: 'text',
    placeholder: '계약 번호 입력',
    gridSize: 2,
  },
  {
    key: 'buyer',
    label: '구매자',
    type: 'select',
    options: recSalesBuyerOptions,
    gridSize: 2,
  },
  {
    key: 'status',
    label: '상태',
    type: 'select',
    options: recSalesStatusOptions,
    gridSize: 2,
  },
  {
    key: 'periodFrom',
    label: '계약 시작일',
    type: 'date',
    gridSize: 2,
  },
  {
    key: 'periodTo',
    label: '계약 종료일',
    type: 'date',
    gridSize: 2,
  },
];

const tableWrapStyle: CSSProperties = {
  width: '100%',
  height: 'calc(100dvh - 560px)',
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

const countAreaStyle: CSSProperties = {
  fontSize: '14px',
  fontWeight: 500,
  color: '#222222',
  lineHeight: 1,
};

const totalCountStyle: CSSProperties = {
  color: '#D70251',
  fontWeight: 700,
};

const emptyStateStyle: CSSProperties = {
  padding: '24px 16px',
  color: '#8b8888',
  textAlign: 'center',
  borderTop: '1px solid #e5e7eb',
};

const tabContentStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  paddingTop: '12px',
};

export default function RecSalesPage() {
  const [draftSearch, setDraftSearch] = useState<Record<string, unknown>>(initialSearch);
  const [query, setQuery] = useState<PageState>({ ...initialSearch, page: 1 });

  const filteredRows = useMemo(() => {
    let rows = recSalesContractRows;

    if (query.contractNo.trim()) {
      const kw = query.contractNo.trim().toUpperCase();
      rows = rows.filter((r) => r.contractNo.toUpperCase().includes(kw));
    }

    if (query.buyer) {
      rows = rows.filter((r) => r.buyer === query.buyer);
    }

    if (query.status) {
      rows = rows.filter((r) => r.status === query.status);
    }

    return rows;
  }, [query.contractNo, query.buyer, query.status]);

  const pagedRows = useMemo(() => {
    const start = (query.page - 1) * PAGE_SIZE;
    return filteredRows.slice(start, start + PAGE_SIZE);
  }, [filteredRows, query.page]);

  const handleSearchChange = (key: string, value: unknown) => {
    setDraftSearch((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    setQuery({
      contractNo: (draftSearch.contractNo as string) || '',
      buyer: (draftSearch.buyer as string) || '',
      status: (draftSearch.status as string) || '',
      periodFrom: (draftSearch.periodFrom as string) || '',
      periodTo: (draftSearch.periodTo as string) || '',
      page: 1,
    });
  };

  return (
    <>
      <div className="title-group">
        <TitleComponent
          title="전력 거래"
          subTitle="REC 발급 관리"
          thirdTitle="REC 판매(장기REC 계약 관리)"
          desc="REC 판매 계약 관리 내역 조회"
        />
      </div>

      <TopInfoBoxComponent title="총 판매 현황" bg="var(--point-orange-5)" color="#A34600">
        <InfoBoxGroup className="row-type">
          {recSalesSummary.map((item) => (
            <InfoBoxComponent
              key={item.label}
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

      <div className="content-group">
        <Tabs className="tabs">
          <TableTitleComponent
            leftCont={
              <TabList aria-label="REC 판매 관리">
                <Tab id="longterm">장기 REC 계약 관리</Tab>
                <Tab id="spot">현물 시장 거래 관리</Tab>
              </TabList>
            }
          />

          <TabPanel id="longterm">
            <div style={tabContentStyle}>
              <SearchForm
                config={searchConfig}
                values={draftSearch}
                onChange={handleSearchChange}
                onSearch={handleSearch}
              />

              <div className="table-group">
                <TableTitleComponent
                  leftCont={
                    <div style={countAreaStyle}>
                      검색 {filteredRows.length} / 전체{' '}
                      <span style={totalCountStyle}>{recSalesContractRows.length}</span>
                    </div>
                  }
                  rightCont={
                    <ButtonComponent
                      variant="contained"
                      icon={<Icons iName="plus" size={16} color="#fff" />}
                      iconPosition="left"
                      onPress={() => undefined}
                    >
                      계약 등록
                    </ButtonComponent>
                  }
                />

                <div style={tableWrapStyle}>
                  <Table aria-label="장기 REC 계약 관리" style={tableStyle}>
                    <TableHeader>
                      {contractColumns.map((col) => (
                        <Column
                          key={col.key}
                          style={{ width: col.width }}
                          isRowHeader={col.isRowHeader}
                        >
                          {col.label}
                        </Column>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {pagedRows.map((row) => (
                        <Row key={row.contractNo}>
                          <Cell style={centerCellStyle}>{row.contractNo}</Cell>
                          <Cell style={centerCellStyle}>{row.contractName}</Cell>
                          <Cell style={centerCellStyle}>{row.buyer}</Cell>
                          <Cell style={centerCellStyle}>{row.contractPeriod}</Cell>
                          <Cell style={centerCellStyle}>{row.monthlyQty}</Cell>
                          <Cell style={centerCellStyle}>{row.unitPrice}</Cell>
                          <Cell style={centerCellStyle}>{row.executionPeriod}</Cell>
                          <Cell style={centerCellStyle}>{row.status}</Cell>
                        </Row>
                      ))}
                    </TableBody>
                  </Table>
                  {pagedRows.length === 0 && (
                    <div style={emptyStateStyle}>일치하는 DATA가 없습니다</div>
                  )}
                </div>
              </div>
            </div>
          </TabPanel>

          <TabPanel id="spot">
            <div
              style={{
                paddingTop: '40px',
                textAlign: 'center',
                color: '#8b8888',
                fontSize: '14px',
              }}
            >
              현물 시장 거래 관리 화면
            </div>
          </TabPanel>
        </Tabs>
      </div>

      <BottomGroupComponent
        centerCont={
          <Pagination
            data={{ page: query.page, size: PAGE_SIZE, total: filteredRows.length }}
            onChange={(page) => setQuery((prev) => ({ ...prev, page }))}
          />
        }
      />
    </>
  );
}

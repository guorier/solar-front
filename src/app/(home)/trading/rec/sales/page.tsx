'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import {
  AgGridComponent,
  BottomGroupComponent,
  ButtonComponent,
  CountArea,
  Icons,
  InfoBoxComponent,
  InfoBoxGroup,
  Pagination,
  SearchFieldConfig,
  SearchForm,
  Tab,
  TableTitleComponent,
  TabList,
  TabPanel,
  Tabs,
  TitleComponent,
  TopInfoBoxComponent,
} from '@/components';
import type { CellStyle, ColDef } from 'ag-grid-community';
import { RecContractRegisterModal } from './_components/RecContractRegisterModal';
import { RecSpotRegisterModal } from './_components/RecSpotRegisterModal';
import {
  recSalesBuyerOptions,
  recSalesContractRows,
  recSalesSummary,
  recSalesStatusOptions,
  recSalesSpotRows,
  type RecSalesContractRow,
  type RecSalesSpotRow,
} from '@/mockup/rec-sales.mock';

const PAGE_SIZE = 20;

// ── 장기 계약 ──────────────────────────────

type LtcSearchState = {
  contractNo: string;
  buyer: string;
  status: string;
  periodFrom: string;
  periodTo: string;
};

type LtcPageState = LtcSearchState & { page: number };

type ContractColumn = {
  key: keyof RecSalesContractRow;
  label: string;
  width: string;
  isRowHeader?: boolean;
};

const ltcInitialSearch: LtcSearchState = {
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

const ltcSearchConfig: SearchFieldConfig[] = [
  {
    key: 'contractNo',
    label: '계약 번호',
    type: 'text',
    placeholder: '계약 번호 입력',
    gridSize: 2,
  },
  { key: 'buyer', label: '구매자', type: 'select', options: recSalesBuyerOptions, gridSize: 2 },
  { key: 'status', label: '상태', type: 'select', options: recSalesStatusOptions, gridSize: 2 },
  { key: 'periodFrom', label: '계약기간', type: 'date-range', gridSize: 3 },
];

// ── 현물 시장 ──────────────────────────────

type SpotSearchState = {
  tradeNo: string;
  buyer: string;
  status: string;
  tradeMonth: string;
};

type SpotColumn = {
  key: keyof RecSalesSpotRow;
  label: string;
  width: string;
  isRowHeader?: boolean;
};

const TODAY = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

const spotInitialSearch: SpotSearchState = {
  tradeNo: '',
  buyer: '',
  status: '',
  tradeMonth: TODAY,
};

const spotColumns: SpotColumn[] = [
  { key: 'tradeNo', label: '거래 번호', width: '14%', isRowHeader: true },
  { key: 'tradeDate', label: '거래 일', width: '13%' },
  { key: 'buyer', label: '구매자', width: '16%' },
  { key: 'saleQty', label: '판매 수량', width: '11%' },
  { key: 'settlePrice', label: '체결 단가', width: '13%' },
  { key: 'commission', label: '수수료', width: '13%' },
  { key: 'netProfit', label: '순이익', width: '13%' },
  { key: 'status', label: '상태', width: '7%' },
];

const spotSearchConfig: SearchFieldConfig[] = [
  {
    key: 'tradeNo',
    label: '거래 번호',
    type: 'text',
    placeholder: '거래 번호 입력 (최대 25자)',
    gridSize: 2,
  },
  { key: 'buyer', label: '구매자', type: 'select', options: recSalesBuyerOptions, gridSize: 2 },
  { key: 'status', label: '상태', type: 'select', options: recSalesStatusOptions, gridSize: 2 },
  { key: 'tradeMonth', label: '거래 일', type: 'date', gridSize: 2 },
];

// ── 공통 스타일 ────────────────────────────

const tableWrapStyle: CSSProperties = {
  width: '100%',
  height: 'calc(100dvh - 560px)',
  overflow: 'auto',
  border: '1px solid #d9dde5',
  background: '#ffffff',
};

const gridCenterCellStyle: CellStyle = { textAlign: 'center' };

const ltcColumnDefs: ColDef<RecSalesContractRow>[] = contractColumns.map((col) => ({
  field: col.key,
  headerName: col.label,
  flex: Number.parseFloat(col.width) / 10,
  cellStyle: gridCenterCellStyle,
}));

const spotColumnDefs: ColDef<RecSalesSpotRow>[] = spotColumns.map((col) => ({
  field: col.key,
  headerName: col.label,
  flex: Number.parseFloat(col.width) / 10,
  cellStyle: gridCenterCellStyle,
}));

const tabContentStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

// ── 컴포넌트 ──────────────────────────────

export default function RecSalesPage() {
  // 탭 상태
  const [selectedTab, setSelectedTab] = useState<string>('longterm');

  // 장기 계약 상태
  const [ltcDraft, setLtcDraft] = useState<Record<string, unknown>>(ltcInitialSearch);
  const [ltcQuery, setLtcQuery] = useState<LtcPageState>({ ...ltcInitialSearch, page: 1 });
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isSpotRegisterOpen, setIsSpotRegisterOpen] = useState(false);

  // 현물 시장 상태
  const [spotDraft, setSpotDraft] = useState<Record<string, unknown>>(spotInitialSearch);
  const [spotQuery, setSpotQuery] = useState<SpotSearchState>(spotInitialSearch);

  // 장기 계약 필터
  const ltcFiltered = useMemo(() => {
    let rows = recSalesContractRows;
    if (ltcQuery.contractNo.trim()) {
      const kw = ltcQuery.contractNo.trim().toUpperCase();
      rows = rows.filter((r) => r.contractNo.toUpperCase().includes(kw));
    }
    if (ltcQuery.buyer) rows = rows.filter((r) => r.buyer === ltcQuery.buyer);
    if (ltcQuery.status) rows = rows.filter((r) => r.status === ltcQuery.status);
    return rows;
  }, [ltcQuery]);

  const ltcPaged = useMemo(() => {
    const start = (ltcQuery.page - 1) * PAGE_SIZE;
    return ltcFiltered.slice(start, start + PAGE_SIZE);
  }, [ltcFiltered, ltcQuery.page]);

  // 현물 시장 필터 (월별, 최신순 → 진행중 우선)
  const spotFiltered = useMemo(() => {
    let rows = recSalesSpotRows;
    if (spotQuery.tradeNo.trim()) {
      const kw = spotQuery.tradeNo.trim().toUpperCase();
      rows = rows.filter((r) => r.tradeNo.toUpperCase().includes(kw));
    }
    if (spotQuery.buyer) rows = rows.filter((r) => r.buyer === spotQuery.buyer);
    if (spotQuery.status) rows = rows.filter((r) => r.status === spotQuery.status);
    if (spotQuery.tradeMonth) {
      const ym = spotQuery.tradeMonth.slice(0, 7); // YYYY-MM
      rows = rows.filter((r) => r.tradeDate.startsWith(ym));
    }
    // 최신순 → 진행 중 우선
    return [...rows].sort((a, b) => {
      if (a.status === '진행 중' && b.status !== '진행 중') return -1;
      if (a.status !== '진행 중' && b.status === '진행 중') return 1;
      return b.tradeDate.localeCompare(a.tradeDate);
    });
  }, [spotQuery]);

  return (
    <>
      <div className="title-group">
        <TitleComponent
          title="전력 거래"
          subTitle="REC 발급 관리"
          thirdTitle="REC 판매"
          desc={
            selectedTab === 'spot'
              ? '현물 시장 거래 관리 내역 조회'
              : 'REC 장기 계약 관리 내역 조회'
          }
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
        <Tabs className="tabs" onSelectionChange={(key) => setSelectedTab(key as string)}>
          <TableTitleComponent
            leftCont={
              <TabList aria-label="REC 판매 관리">
                <Tab id="longterm">장기 REC 계약 관리</Tab>
                <Tab id="spot">현물 시장 거래 관리</Tab>
              </TabList>
            }
          />

          <TabPanel id="longterm" style={{ borderTop: 0 }}>
            <div style={tabContentStyle}>
              <SearchForm
                config={ltcSearchConfig}
                values={ltcDraft}
                onChange={(key, val) => setLtcDraft((prev) => ({ ...prev, [key]: val }))}
                onSearch={() =>
                  setLtcQuery({
                    contractNo: (ltcDraft.contractNo as string) || '',
                    buyer: (ltcDraft.buyer as string) || '',
                    status: (ltcDraft.status as string) || '',
                    periodFrom: (ltcDraft.periodFrom as string) || '',
                    periodTo: (ltcDraft.periodTo as string) || '',
                    page: 1,
                  })
                }
              />

              <div className="table-group">
                <TableTitleComponent
                  leftCont={
                    <CountArea search={ltcFiltered.length} total={recSalesContractRows.length} />
                  }
                />

                <div style={tableWrapStyle}>
                  <AgGridComponent rowData={ltcPaged} columnDefs={ltcColumnDefs} />
                </div>
              </div>
            </div>
            
            <BottomGroupComponent
              leftCont={
                <Pagination
                  data={{ page: ltcQuery.page, size: PAGE_SIZE, total: ltcFiltered.length }}
                  onChange={(page) => setLtcQuery((prev) => ({ ...prev, page }))}
                />
              }
              rightCont={
                <ButtonComponent
                  variant="contained"
                  icon={<Icons iName="plus" size={16} color="#fff" />}
                  onPress={() => setIsRegisterOpen(true)}
                >
                  계약 등록
                </ButtonComponent>
              }
            />
          </TabPanel>

          <TabPanel id="spot" style={{ borderTop: 0 }}>
            <div style={tabContentStyle}>
              <SearchForm
                config={spotSearchConfig}
                values={spotDraft}
                onChange={(key, val) => setSpotDraft((prev) => ({ ...prev, [key]: val }))}
                onSearch={() =>
                  setSpotQuery({
                    tradeNo: (spotDraft.tradeNo as string) || '',
                    buyer: (spotDraft.buyer as string) || '',
                    status: (spotDraft.status as string) || '',
                    tradeMonth: (spotDraft.tradeMonth as string) || TODAY,
                  })
                }
              />

              <div className="table-group">
                <TableTitleComponent
                  leftCont={
                    <CountArea search={spotFiltered.length} total={recSalesSpotRows.length} />
                  }
                />

                <div style={tableWrapStyle}>
                  <AgGridComponent rowData={spotFiltered} columnDefs={spotColumnDefs} />
                </div>
              </div>
            </div>

            <BottomGroupComponent
              leftCont={
                <Pagination
                  data={{ page: ltcQuery.page, size: PAGE_SIZE, total: ltcFiltered.length }}
                  onChange={(page) => setLtcQuery((prev) => ({ ...prev, page }))}
                />
              }
              rightCont={
                <ButtonComponent
                  variant="contained"
                  icon={<Icons iName="plus" size={16} color="#fff" />}
                  onPress={() => setIsSpotRegisterOpen(true)}
                >
                  거래 등록
                </ButtonComponent>
              }
            />
          </TabPanel>
        </Tabs>
      </div>

      <RecContractRegisterModal isOpen={isRegisterOpen} onOpenChange={setIsRegisterOpen} />
      <RecSpotRegisterModal isOpen={isSpotRegisterOpen} onOpenChange={setIsSpotRegisterOpen} />
    </>
  );
}

'use client';
import {
  AgGridComponent,
  BottomGroupComponent,
  ButtonComponent,
  CountArea,
  InfoBoxComponent,
  InfoBoxGroup,
  Pagination,
  SearchFieldConfig,
  SearchFields,
  SearchForm,
  Tab,
  TableTitleComponent,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  TitleComponent,
  TopInfoBoxComponent,
} from '@/components';
import Icons, { iName } from '@/components/icon/Icons';

import {
  createSearchConfig,
  initialSearchValues,
} from '@/constants/settlement/_constants/settlementConfig';
import { SearchValues } from '@/constants/settlement/model/settlementType';
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import { useState } from 'react';

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

type SettlementSummaryItem = {
  icon: iName;
  title: string;
  count: number;
  totalCount?: number;
  unit: string;
  tag?: string;
};

interface settlementListResponse {
  [key: string]: string;
  date: string;
  plantName: string;
  rtuPower: string;
  amiPower: string;
  criteria: string;
  smpUnitPrice: string;
  prvAmount: string;
  stAmount: string;
  correctAmount: string;
  stType: string;
}

interface HistoryListResponse {
  month: string;
  plantName: string;
  status: string;
  progress: number;
  deadline: string;
  contractorName: string;
  businessNumber: string;
  rtuPower: string;
  amiPower: string;
  errorRate: string;
  smpAmount: string;
  recAmount: string;
  totalAmount: string;
}

//정산현황 박스
const SETTLEMENT_SUMMARY_DATA: readonly SettlementSummaryItem[] = [
  { icon: 'energy', title: 'RTU 발전량', count: 13258, unit: 'kWh' },
  { icon: 'energy', title: 'AMI 발전량', count: 13258, unit: 'kWh' },
  { icon: 'energy', title: '정산 평균', count: 13258, unit: 'kWh' },
  { icon: 'amount', title: '임시 정산 액', count: 150, unit: '원' },
  { icon: 'amount', title: '정산 액', count: 150, unit: '원' },
  { icon: 'amount', title: '보정 액', count: 7025292, unit: '원' },
];

const HISTORY_DUMMY_DATA: HistoryListResponse[] = [
  {
    month: '2026-02',
    plantName: '와이어블 1호기',
    status: '완료',
    progress: 100,
    deadline: '2026-03-10',
    contractorName: '한국전력공사',
    businessNumber: '123-45-67890',
    rtuPower: '34,796 kWh',
    amiPower: '34,886 kWh',
    errorRate: '0.26%',
    smpAmount: '5,254,125원',
    recAmount: '1,826,765원',
    totalAmount: '7,080,891원',
  },
  {
    month: '2026-02',
    plantName: '와이어블 2호기',
    status: '완료',
    progress: 100,
    deadline: '2026-03-10',
    contractorName: '한국전력공사',
    businessNumber: '123-45-67890',
    rtuPower: '36,904 kWh',
    amiPower: '37,000 kWh',
    errorRate: '0.26%',
    smpAmount: '5,572,557원',
    recAmount: '1,937,479원',
    totalAmount: '7,510,035원',
  },
  {
    month: '2026-02',
    plantName: '와이어블 3호기',
    status: '완료',
    progress: 100,
    deadline: '2026-03-10',
    contractorName: '한국전력공사',
    businessNumber: '123-45-67890',
    rtuPower: '33,741 kWh',
    amiPower: '33,829 kWh',
    errorRate: '0.26%',
    smpAmount: '5,094,909원',
    recAmount: '1,771,409원',
    totalAmount: '6,866,318원',
  },
  {
    month: '2026-01',
    plantName: '와이어블 1호기',
    status: '완료',
    progress: 100,
    deadline: '2026-02-10',
    contractorName: '한국전력공사',
    businessNumber: '123-45-67890',
    rtuPower: '36,118 kWh',
    amiPower: '34,406 kWh',
    errorRate: '-4.74%',
    smpAmount: '5,453,794원',
    recAmount: '1,896,187원',
    totalAmount: '7,349,980원',
  },
  {
    month: '2026-01',
    plantName: '와이어블 2호기',
    status: '완료',
    progress: 100,
    deadline: '2026-02-10',
    contractorName: '한국전력공사',
    businessNumber: '123-45-67890',
    rtuPower: '38,307 kWh',
    amiPower: '36,492 kWh',
    errorRate: '-4.74%',
    smpAmount: '5,784,327원',
    recAmount: '2,011,107원',
    totalAmount: '7,795,434원',
  },
  {
    month: '2026-01',
    plantName: '와이어블 3호기',
    status: '완료',
    progress: 100,
    deadline: '2026-02-10',
    contractorName: '한국전력공사',
    businessNumber: '123-45-67890',
    rtuPower: '35,023 kWh',
    amiPower: '33,364 kWh',
    errorRate: '-4.74%',
    smpAmount: '5,288,527원',
    recAmount: '1,838,726원',
    totalAmount: '7,127,254원',
  },
  {
    month: '2025-12',
    plantName: '와이어블 1호기',
    status: '완료',
    progress: 100,
    deadline: '2026-01-10',
    contractorName: '한국전력공사',
    businessNumber: '123-45-67890',
    rtuPower: '37,797 kWh',
    amiPower: '34,297 kWh',
    errorRate: '-9.26%',
    smpAmount: '5,707,379원',
    recAmount: '1,984,354원',
    totalAmount: '7,691,732원',
  },
  {
    month: '2025-12',
    plantName: '와이어블 2호기',
    status: '완료',
    progress: 100,
    deadline: '2026-01-10',
    contractorName: '한국전력공사',
    businessNumber: '123-45-67890',
    rtuPower: '40,088 kWh',
    amiPower: '36,376 kWh',
    errorRate: '-9.26%',
    smpAmount: '6,053,280원',
    recAmount: '2,104,618원',
    totalAmount: '8,157,898원',
  },
  {
    month: '2025-12',
    plantName: '와이어블 3호기',
    status: '완료',
    progress: 100,
    deadline: '2026-01-10',
    contractorName: '한국전력공사',
    businessNumber: '123-45-67890',
    rtuPower: '36,652 kWh',
    amiPower: '33,258 kWh',
    errorRate: '-9.26%',
    smpAmount: '5,534,428원',
    recAmount: '1,924,222원',
    totalAmount: '7,458,650원',
  },
  {
    month: '2025-11',
    plantName: '와이어블 1호기',
    status: '완료',
    progress: 100,
    deadline: '2025-12-10',
    contractorName: '한국전력공사',
    businessNumber: '123-45-67890',
    rtuPower: '38,290 kWh',
    amiPower: '35,011 kWh',
    errorRate: '-8.56%',
    smpAmount: '5,781,725원',
    recAmount: '2,010,203원',
    totalAmount: '7,791,928원',
  },
  {
    month: '2025-11',
    plantName: '와이어블 2호기',
    status: '완료',
    progress: 100,
    deadline: '2025-12-10',
    contractorName: '한국전력공사',
    businessNumber: '123-45-67890',
    rtuPower: '40,610 kWh',
    amiPower: '37,133 kWh',
    errorRate: '-8.56%',
    smpAmount: '6,132,133원',
    recAmount: '2,132,033원',
    totalAmount: '8,264,166원',
  },
  {
    month: '2025-11',
    plantName: '와이어블 3호기',
    status: '완료',
    progress: 100,
    deadline: '2025-12-10',
    contractorName: '한국전력공사',
    businessNumber: '123-45-67890',
    rtuPower: '37,129 kWh',
    amiPower: '33,950 kWh',
    errorRate: '-8.56%',
    smpAmount: '5,606,521원',
    recAmount: '1,949,287원',
    totalAmount: '7,555,809원',
  },
  {
    month: '2025-10',
    plantName: '와이어블 1호기',
    status: '완료',
    progress: 100,
    deadline: '2025-11-10',
    contractorName: '한국전력공사',
    businessNumber: '123-45-67890',
    rtuPower: '37,142 kWh',
    amiPower: '34,752 kWh',
    errorRate: '-6.43%',
    smpAmount: '5,608,516원',
    recAmount: '1,949,981원',
    totalAmount: '7,558,407원',
  },
];

export default function SmpRecPage() {
  const [searchValues, setSearchValues] = useState<SearchValues>(initialSearchValues);
  const [tableValues, setTableValues] = useState<Record<string, unknown>>({
    showNumber: String(PAGE_SIZE),
  });
  const [smpPage, setSmpPage] = useState(1);
  const [recPage, setRecPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);

  //그리드
  const columnDefs: ColDef[] = [
    { field: 'date', headerName: '날짜', width: 200 },
    { field: 'plantName', headerName: '발전소', flex: 1 },
    { field: 'rtuPower', headerName: 'RTU 발전량', flex: 1 },
    { field: 'amiPower', headerName: 'AMI 발전량', flex: 1 },
    { field: 'criteria', headerName: '정산 기준', flex: 1 },
    { field: 'smpUnitPrice', headerName: 'SMP 단가', flex: 1 },
    { field: 'prvAmount', headerName: '임시 정산 액', flex: 1 },
    { field: 'stAmount', headerName: '정산 액', flex: 1 },
    { field: 'correctAmount', headerName: '보정 액', flex: 1 },
    { field: 'stType', headerName: '정산 유형', flex: 1 },
  ];

  const historyColumnDefs: ColDef<HistoryListResponse>[] = [
    { field: 'month', headerName: '정산월', width: 100 },
    { field: 'plantName', headerName: '발전소', width: 140 },
    {
      field: 'status',
      headerName: '상태',
      width: 80,
      cellRenderer: (params: ICellRendererParams<HistoryListResponse>) => (
        <span
          style={{
            display: 'inline-block',
            background: '#e8f5e9',
            color: '#2e7d32',
            padding: '2px 10px',
            borderRadius: 4,
            fontSize: 12,
            fontWeight: 600,
            lineHeight: '20px',
          }}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: 'progress',
      headerName: '진행률',
      width: 130,
      cellRenderer: (params: ICellRendererParams<HistoryListResponse>) => (
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <span style={{ fontSize: 12, color: '#555' }}>{params.value}%</span>
        </div>
      ),
    },
    { field: 'deadline', headerName: '마감일', width: 110 },
    { field: 'contractorName', headerName: '계약 사업자명', flex: 1 },
    { field: 'businessNumber', headerName: '사업자 등록번호', width: 140 },
    { field: 'rtuPower', headerName: 'RTU 발전량', width: 120 },
    { field: 'amiPower', headerName: 'AMI 발전량', width: 120 },
    {
      field: 'errorRate',
      headerName: '오차율',
      width: 90,
      cellStyle: (params) => ({
        color: String(params.value).startsWith('-') ? '#e53935' : '#1565c0',
        fontWeight: 600,
      }),
    },
    {
      field: 'smpAmount',
      headerName: 'SMP 정산액',
      width: 120,
      cellStyle: { color: '#f97316', fontWeight: 600 },
    },
    {
      field: 'recAmount',
      headerName: 'REC 정산액',
      width: 120,
      cellStyle: { color: '#1565c0', fontWeight: 600 },
    },
    { field: 'totalAmount', headerName: '총 정산액', width: 120 },
    {
      headerName: '작업',
      width: 70,
      cellRenderer: () => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <Icons iName="eye" size={18} color="#888" />
          </button>
        </div>
      ),
    },
  ];

  const [settlementList] = useState<settlementListResponse[]>([
    {
      date: '2025-12-01',
      plantName: '와이어블 1호기',
      rtuPower: '1,215 kWh',
      amiPower: '1,215 kWh',
      criteria: '1,215 kWh',
      smpUnitPrice: '149원 / kWh',
      prvAmount: '178,000 원',
      stAmount: '35,000 원',
      correctAmount: '-213,937 원',
      stType: 'RTU 임시 정산',
    },
  ]);

  // 핸들러
  const handleSearchChange = (key: string, value: unknown) => {
    setSearchValues((prev) => {
      if (key in prev) {
        return { ...prev, [key]: String(value ?? '') } as SearchValues;
      }
      return prev;
    });
  };

  // 검색 버튼 기준으로만 반영
  const handleSearch = () => {
    setSearchValues(searchValues);
    //setPage(1);
  };

  return (
    <>
      <div className="title-group">
        <TitleComponent
          title="정산 관리"
          subTitle="SMP/REC 정산"
          desc="SMP와 REC 정산을 월별, 발전소별 조회 확인 할 수 있다."
        />
      </div>

      <div className="content-group">
        <SearchForm
          config={createSearchConfig(handleSearch)}
          values={searchValues}
          onChange={handleSearchChange}
          onSearch={handleSearch}
        />
        <Tabs className="tabs">
          <TableTitleComponent
            leftCont={
              <TabList aria-label="정산 선택">
                <Tab id="smp">SMP 정산</Tab>
                <Tab id="rec">REC 정산</Tab>
                <Tab id="history">정산 이력</Tab>
              </TabList>
            }
          />

          <TabPanels>
            <TabPanel id="smp">
              <TopInfoBoxComponent title="SMP 정산" bg="var(--point-orange-5)" color="#A34600">
                <InfoBoxGroup className="row-type">
                  {SETTLEMENT_SUMMARY_DATA.map((item, idx) => (
                    <InfoBoxComponent key={`summary-${idx}`} bg="white" {...item} />
                  ))}
                </InfoBoxGroup>
              </TopInfoBoxComponent>

              <div className="table-group">
                <TableTitleComponent
                  leftCont={
                    <CountArea search={settlementList.length} total={settlementList.length} />
                  }
                  rightCont={
                    <SearchFields
                      config={showNumberConfig}
                      values={tableValues}
                      onChange={(k, v) => setTableValues((prev) => ({ ...prev, [k]: v }))}
                    />
                  }
                />
                <AgGridComponent rowData={settlementList} columnDefs={columnDefs} />

                <BottomGroupComponent
                  leftCont={
                    <Pagination
                      data={{ page: smpPage, size: PAGE_SIZE, total: settlementList.length }}
                      onChange={setSmpPage}
                    />
                  }
                  rightCont={
                    <ButtonComponent
                      variant="excel"
                      icon={<Icons iName="download" size={16} color="#fff" />}
                    >
                      엑셀 다운로드
                    </ButtonComponent>
                  }
                />
              </div>
            </TabPanel>

            <TabPanel id="rec">
              <TopInfoBoxComponent title="REC 정산" bg="var(--point-orange-5)" color="#A34600">
                <InfoBoxGroup className="row-type">
                  {SETTLEMENT_SUMMARY_DATA.map((item, idx) => (
                    <InfoBoxComponent key={`summary-${idx}`} bg="white" {...item} />
                  ))}
                </InfoBoxGroup>
              </TopInfoBoxComponent>

              <div className="table-group">
                <TableTitleComponent
                  leftCont={
                    <CountArea search={settlementList.length} total={settlementList.length} />
                  }
                  rightCont={
                    <SearchFields
                      config={showNumberConfig}
                      values={tableValues}
                      onChange={(k, v) => setTableValues((prev) => ({ ...prev, [k]: v }))}
                    />
                  }
                />
                <AgGridComponent rowData={settlementList} columnDefs={columnDefs} />
                <BottomGroupComponent
                  leftCont={
                    <Pagination
                      data={{ page: recPage, size: PAGE_SIZE, total: settlementList.length }}
                      onChange={setRecPage}
                    />
                  }
                  rightCont={
                    <ButtonComponent
                      variant="excel"
                      icon={<Icons iName="download" size={16} color="#fff" />}
                    >
                      엑셀 다운로드
                    </ButtonComponent>
                  }
                />
              </div>
            </TabPanel>

            <TabPanel id="history">
              <TopInfoBoxComponent
                title="누적 정산 현황"
                bg="var(--point-orange-5)"
                color="#A34600"
                headerRight={
                  <span
                    style={{
                      background: '#e8f5e9',
                      color: '#2e7d32',
                      padding: '3px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 'var(--font-size-13)',
                      fontWeight: 600,
                    }}
                  >
                    완료 10개월 30건
                  </span>
                }
              >
                <InfoBoxGroup className="row-type">
                  <InfoBoxComponent
                    icon="energy"
                    title="누적 RTU 발전량"
                    count={1107836}
                    unit="kWh"
                    bg="white"
                  />
                  <InfoBoxComponent
                    icon="energy"
                    title="누적 AMI 발전량"
                    count={1051021}
                    unit="kWh"
                    bg="white"
                  />
                  <InfoBoxComponent
                    icon="amount"
                    title="누적 SMP 정산액"
                    count="167,283,387"
                    unit="원"
                    bg="white"
                  />
                  <InfoBoxComponent
                    icon="amount"
                    title="누적 REC 정산액"
                    count="58,161,449"
                    unit="원"
                    bg="white"
                  />
                  <InfoBoxComponent
                    icon="amount"
                    title="누적 총 정산액"
                    count="225,444,834"
                    unit="원"
                    bg="white"
                  />
                  <InfoBoxComponent
                    icon="amount"
                    title="평균 월별 정산액"
                    count="22,544,483"
                    unit="원"
                    bg="white"
                  />
                  <InfoBoxComponent
                    icon="amount"
                    title="누적 평균 오차율"
                    count="-5.00"
                    unit="%"
                    bg="white"
                  />
                </InfoBoxGroup>
              </TopInfoBoxComponent>

              {/* 정산 이력 테이블 */}
              <div className="table-group">
                <TableTitleComponent
                  leftCont={
                    <CountArea
                      search={HISTORY_DUMMY_DATA.length}
                      total={HISTORY_DUMMY_DATA.length}
                    />
                  }
                  rightCont={
                    <SearchFields
                      config={showNumberConfig}
                      values={tableValues}
                      onChange={(k, v) => setTableValues((prev) => ({ ...prev, [k]: v }))}
                    />
                  }
                />
                <AgGridComponent rowData={HISTORY_DUMMY_DATA} columnDefs={historyColumnDefs} />
                <BottomGroupComponent
                  leftCont={
                    <Pagination
                      data={{
                        page: historyPage,
                        size: PAGE_SIZE,
                        total: HISTORY_DUMMY_DATA.length,
                      }}
                      onChange={setHistoryPage}
                    />
                  }
                  rightCont={
                    <ButtonComponent
                      variant="excel"
                      icon={<Icons iName="download" size={16} color="#fff" />}
                    >
                      엑셀 다운로드
                    </ButtonComponent>
                  }
                />
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </>
  );
}

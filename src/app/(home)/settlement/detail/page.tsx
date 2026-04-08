'use client';
import {
  AgGridComponent,
  BottomGroupComponent,
  ButtonComponent,
  Icons,
  CountArea,
  InfoBoxComponent,
  InfoBoxGroup,
  Pagination,
  SearchFieldConfig,
  SearchFields,
  SearchForm,
  TableTitleComponent,
  TitleComponent,
  TopInfoBoxComponent,
} from '@/components';
import { iName } from '@/components/icon/Icons';
import { ColDef } from 'ag-grid-community';
import { useMemo, useState } from 'react';
import { createSearchConfig } from '@/constants/settlement/_constants/config';
import { ModalPlantSelectorSingle } from '@/constants/dashboard/ModalPlantSelectorSingle';
import { ModalSettlementRegister } from '@/constants/settlement/ModalSettlementRegister';

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
  unit: string;
};

interface SettlementListRow {
  [key: string]: string;
  date: string;
  plantName: string;
  bizNm: string;
  bizNo: string;
  rtuPower: string;
  amiPower: string;
  errorRate: string;
  smpUnitPrice: string;
  smpAmount: string;
  recUnitPrice: string;
  recAmount: string;
  totalAmount: string;
  status: string;
  issue: string;
}

const SETTLEMENT_SUMMARY_DATA: readonly SettlementSummaryItem[] = [
  { icon: 'energy', title: 'RTU 발전량', count: 320296, unit: 'kWh' },
  { icon: 'energy', title: 'AMI 발전', count: 120296, unit: 'kWh' },
  { icon: 'amount', title: 'SMP 정산', count: 62120296, unit: '원' },
  { icon: 'amount', title: 'REC 정산', count: 82190296, unit: '원' },
  { icon: 'amount', title: '합계', count: 182120296, unit: '원' },
];

const columnDefs: ColDef[] = [
  { field: 'date', headerName: '날짜', flex: 1.4 },
  { field: 'plantName', headerName: '발전소', flex: 1.5 },
  { field: 'bizNm', headerName: '사업자 명', flex: 1.5 },
  { field: 'bizNo', headerName: '사업자 번호', flex: 1.5 },
  { field: 'rtuPower', headerName: 'RTU 발전량', flex: 1.3 },
  { field: 'amiPower', headerName: 'AMI 발전량', flex: 1.3 },
  { field: 'errorRate', headerName: '오차율', flex: 1 },
  { field: 'smpUnitPrice', headerName: 'SMP 단가', flex: 1.2 },
  { field: 'smpAmount', headerName: 'SMP 정산', flex: 1.2 },
  { field: 'recUnitPrice', headerName: 'REC 단가', flex: 1.2 },
  { field: 'recAmount', headerName: 'REC 정산', flex: 1.2 },
  { field: 'totalAmount', headerName: '합계', flex: 1.2 },
  { field: 'status', headerName: '상태', flex: 1 },
  { field: 'issue', headerName: '발행', flex: 1 },
];

const MOCK_DATA: SettlementListRow[] = [
  {
    date: '2025-12-31',
    plantName: '와이어블 1호기',
    bizNm: '한국 전력',
    bizNo: '123-45-12345',
    rtuPower: '32,721 kWh',
    amiPower: '36,831 kWh',
    errorRate: '-0.72 %',
    smpUnitPrice: '151원/kWh',
    smpAmount: '5,492,625원',
    recUnitPrice: '35,000원/REC',
    recAmount: '2,837,382원',
    totalAmount: '8,382,938원',
    status: '진행 중',
    issue: '—',
  },
];

export default function SmpRecPage() {
  const [page, setPage] = useState(1);
  const [searchValues, setSearchValues] = useState<Record<string, unknown>>({
    plantNm: '',
    baseYmd: '',
    bizNm: '',
  });
  const [tableValues, setTableValues] = useState<Record<string, unknown>>({
    showNumber: String(PAGE_SIZE),
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const searchConfig = createSearchConfig(() => setModalOpen(true));

  const items = MOCK_DATA;
  const total = MOCK_DATA.length;

  const pagedRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  }, [page, items]);

  const handleSearchChange = (key: string, value: unknown) => {
    setSearchValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    // setPage(1);
  };

  return (
    <>
      <div className="title-group">
        <TitleComponent
          title="정산 관리"
          subTitle="정상 상세"
          desc="SMP와 REC 정산을 월별, 발전소별 조회 확인 할 수 있다."
        />
      </div>

      <div className="content-group">
        <SearchForm
          config={searchConfig}
          values={searchValues}
          onChange={handleSearchChange}
          onSearch={handleSearch}
        />

        <TopInfoBoxComponent title="발전소별 상세 정산" bg="var(--point-orange-5)" color="#A34600">
          <InfoBoxGroup className="row-type">
            {SETTLEMENT_SUMMARY_DATA.map((item, idx) => (
              <InfoBoxComponent key={`summary-${idx}`} bg="white" {...item} />
            ))}
          </InfoBoxGroup>
        </TopInfoBoxComponent>

        <TableTitleComponent
          leftCont={<CountArea search={items.length} total={total} />}
          rightCont={
            <SearchFields
              config={showNumberConfig}
              values={tableValues}
              onChange={(k, v) => setTableValues((prev) => ({ ...prev, [k]: v }))}
            />
          }
        />
        <AgGridComponent
          rowData={pagedRows as unknown as Record<string, unknown>[]}
          columnDefs={columnDefs}
        />
        <BottomGroupComponent
          leftCont={<Pagination data={{ page, size: PAGE_SIZE, total }} onChange={setPage} />}
          rightCont={
            <ButtonComponent
              variant="contained"
              icon={<Icons iName="plus" size={16} color="#fff" />}
              onClick={() => setRegisterModalOpen(true)}
            >
              상세 정산 등록
            </ButtonComponent>
          }
        />
      </div>

      <ModalPlantSelectorSingle
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        onApply={(plant) => {
          handleSearchChange('plantNm', plant.pwplNm);
        }}
      />

      <ModalSettlementRegister isOpen={registerModalOpen} onOpenChange={setRegisterModalOpen} />
    </>
  );
}

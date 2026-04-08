'use client';
import {
  AgGridComponent,
  BottomGroupComponent,
  CountArea,
  InfoBoxComponent,
  InfoBoxGroup,
  Meter,
  Pagination,
  SearchFieldConfig,
  SearchFields,
  Select,
  SelectItem,
  TableTitleComponent,
  TitleComponent,
  TopInfoBoxComponent,
} from '@/components';
import { iName } from '@/components/icon/Icons';
import { ColDef } from 'ag-grid-community';
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
  dailyPower: string;
  smpUnitPrice: string;
  smpAmount: string;
  recUnitPrice: string;
  recAmount: string;
  totalAmount: string;
  status: string;
}

//정산현황 박스
const SETTLEMENT_SUMMARY_DATA: readonly SettlementSummaryItem[] = [
  { icon: 'energy', title: 'RTU 발전량', count: 13258, unit: 'kWh' },
  { icon: 'energy', title: 'AMI 발전량', count: 13258, unit: 'kWh' },
  { icon: 'energy', title: '일 평균 발전량', count: 13258, unit: 'kWh' },
  { icon: 'amount', title: '평균 SMP 단가', count: 150, unit: '원 / kWh' },
  { icon: 'amount', title: '일 평균 정산 액', count: 150, unit: '원' },
  { icon: 'amount', title: '총 정산 액', count: 7025292, unit: '원' },
];

const SETTLEMENT_DATA: readonly SettlementSummaryItem[] = [
  { icon: 'amount', title: '총 정산 금액', count: 150, unit: '원', tag: '27일 누적' },
  { icon: 'amount', title: 'SMP 정산 액(예상)', count: 7025292, unit: '원', tag: '평균 150/kWh' },
  {
    icon: 'amount',
    title: 'REC 정산 액(예상)',
    count: 7025292,
    unit: '원',
    tag: '평균 35,000원/REC',
  },
  { icon: 'energy', title: '총 발전량', count: 13258, unit: 'kW', tag: '일 평균 1,242 kWh' },
];

//상단 발전소선택 셀렉트
const PLANTS = [
  { id: 'plant-1', name: '와이어블 1호기' },
  { id: 'plant-2', name: '와이어블 2호기' },
  { id: 'plant-3', name: '와이어블 3호기' },
] as const;

const PlantSelector = () => (
  <form style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
    <Select
      aria-label="발전소 선택"
      selectionMode="multiple"
      placeholder="발전소 선택"
      style={{ flex: 1, width: 200 }}
    >
      {PLANTS.map((plant) => (
        <SelectItem key={plant.id}>{plant.name}</SelectItem>
      ))}
    </Select>
  </form>
);


export default function DailyPage() {
  const [page, setPage] = useState(1);
  const [values, setValues] = useState<Record<string, unknown>>({ showNumber: String(PAGE_SIZE) });

  const onChangeValues = (key: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  //그리드
  const columnDefs: ColDef[] = [
    { field: 'date', headerName: '날짜', width: 200 },
    { field: 'plantName', headerName: '발전소', flex: 1 },
    { field: 'dailyPower', headerName: '일 발전량', flex: 1 },
    { field: 'smpUnitPrice', headerName: 'SMP 단가', flex: 1 },
    { field: 'smpAmount', headerName: 'SMP 정산 액', flex: 1 },
    { field: 'recUnitPrice', headerName: 'REC 단가', flex: 1 },
    { field: 'recAmount', headerName: 'REC 정산 액', flex: 1 },
    { field: 'totalAmount', headerName: '총 정산 금액', flex: 1 },
    { field: 'status', headerName: '상태', flex: 1 },
  ];

  const [settlementList] = useState<settlementListResponse[]>([
    {
      date: '2025-12-01',
      plantName: '와이어블 1호기',
      dailyPower: '1,215 kWh',
      smpUnitPrice: '149원 / kWh',
      smpAmount: '178,000 원',
      recUnitPrice: '35,000 원/REC',
      recAmount: '35,000 원',
      totalAmount: '213.937 원',
      status: '완료',
    },
  ]);

  return (
    <>
      <div className="title-group">
        <TitleComponent
          title="정산 관리"
          subTitle="일별 정산"
          desc="일별 정상 현황을 화면에 출력 한다."
        />
        <PlantSelector />
      </div>

      <div className="content-group">
        <TopInfoBoxComponent
          title="2025-12 요약 정산 현황"
          bg="var(--point-orange-5)"
          color="#A34600"
        >
          <InfoBoxGroup className="row-type">
            {SETTLEMENT_SUMMARY_DATA.map((item, idx) => (
              <InfoBoxComponent key={`summary-${idx}`} bg="white" {...item} />
            ))}
            <InfoBoxComponent
              width="100%"
              flex="none"
              bg="#fff"
              icon="amount"
              title="정산 진행률"
              count={120}
              unit="%"
              headerRight={<span>마감일 2026-01-10</span>}
            >
              <Meter value={20} />
            </InfoBoxComponent>

          </InfoBoxGroup>
        </TopInfoBoxComponent>

        <TopInfoBoxComponent
          title="2025-12 일별 정산 현황"
          bg="var(--point-orange-5)"
          color="#A34600"
        >
          <InfoBoxGroup className="row-type">
            {SETTLEMENT_DATA.map((item, idx) => (
              <InfoBoxComponent key={`summary-${idx}`} bg="white" {...item} />
            ))}
          </InfoBoxGroup>
        </TopInfoBoxComponent>

        <TableTitleComponent
          leftCont={<CountArea search={settlementList.length} total={settlementList.length} />}
          rightCont={
            <SearchFields config={showNumberConfig} values={values} onChange={onChangeValues} />
          }
        />
        <AgGridComponent rowData={settlementList} columnDefs={columnDefs} />
        <BottomGroupComponent
          centerCont={
            <Pagination
              data={{
                page,
                size: PAGE_SIZE,
                total: settlementList.length,
              }}
              onChange={setPage}
            />
          }
        />
      </div>
    </>
  );
}

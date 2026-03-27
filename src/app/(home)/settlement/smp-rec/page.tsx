'use client';
import {
  AgGridComponent,
  ButtonComponent,
  InfoBoxComponent,
  InfoBoxGroup,
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

import { initialSearchValues, searchConfig } from '@/constants/settlement/model/settlementConfig';
import { SearchValues } from '@/constants/settlement/model/settlementType';
import { ColDef } from 'ag-grid-community';
import { useState } from 'react';

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

//정산현황 박스
const SETTLEMENT_SUMMARY_DATA: readonly SettlementSummaryItem[] = [
  { icon: 'energy', title: 'RTU 발전량', count: 13258, unit: 'kWh' },
  { icon: 'energy', title: 'AMI 발전량', count: 13258, unit: 'kWh' },
  { icon: 'energy', title: '정산 평균', count: 13258, unit: 'kWh' },
  { icon: 'amount', title: '임시 정산 액', count: 150, unit: '원' },
  { icon: 'amount', title: '정산 액', count: 150, unit: '원' },
  { icon: 'amount', title: '보정 액', count: 7025292, unit: '원' },
];



export default function SmpRecPage() {
  const [searchValues, setSearchValues] = useState<SearchValues>(initialSearchValues);

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
          config={searchConfig}
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
              </TabList>
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

          <TabPanels>
            <TabPanel id="smp">
              <TopInfoBoxComponent title="SMP 정산" bg="var(--point-orange-5)" color="#A34600">
                <InfoBoxGroup className="row-type">
                  {SETTLEMENT_SUMMARY_DATA.map((item, idx) => (
                    <InfoBoxComponent key={`summary-${idx}`} bg="white" {...item} />
                  ))}
                </InfoBoxGroup>
              </TopInfoBoxComponent>

              <AgGridComponent rowData={settlementList} columnDefs={columnDefs} />
            </TabPanel>
            <TabPanel id="rec">
              <TopInfoBoxComponent title="REC 정산" bg="var(--point-orange-5)" color="#A34600">
                <InfoBoxGroup className="row-type">
                  {SETTLEMENT_SUMMARY_DATA.map((item, idx) => (
                    <InfoBoxComponent key={`summary-${idx}`} bg="white" {...item} />
                  ))}
                </InfoBoxGroup>
              </TopInfoBoxComponent>
              <AgGridComponent rowData={settlementList} columnDefs={columnDefs} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </>
  );
}

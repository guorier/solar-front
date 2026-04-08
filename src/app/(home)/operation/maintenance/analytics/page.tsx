'use client';

import {
  AgGridComponent,
  BottomGroupComponent,
  ButtonComponent,
  Pagination,
  TableTitleComponent,
  TitleComponent,
} from '@/components';
import {
  OPERATION_ANALYTICS_COLUMN,
  OPERATION_ANALYTICS_ROW_DATA,
} from '@/constants/operation/maintenance/analytics';
import { useState } from 'react';
import AnalyticsSearch from './_components/analyticsSearch';
import AnalyticsChartModal from './_components/analyticsChart';
import { SummaryCard, SummaryCardItem, SummarySection } from '../../_components';

const CARD_ITEMS: SummaryCardItem[] = [
  {
    title: '평균 일 발전량',
    value: '8,543kWh',
    description: '최근 14일 기준 (발전소 평균)',
  },
  {
    title: '발전 효율',
    value: '99.5%',
    description: '최근 14일 기준 (발전소 평균)',
  },
  {
    title: '연간 총 손실',
    value: '8,543kWh',
    description: '전년도 누적 (발전소 합계)',
    valueColor: 'var(--critical)',
  },
  {
    title: '연간 총 출동',
    value: '32건',
    description: '전년도 누적 (발전소 합계)',
    valueColor: 'var(--warning)',
  },
];

const INITIAL_SEARCH_VALUES = {
  searchType: '',
  valueType: '',
  start: '',
  end: '',
};

export default function OperationAnalyticshPage() {
  const [searchValues, setSearchValues] = useState(INITIAL_SEARCH_VALUES);
  const [appliedSearchValues, setAppliedSearchValues] = useState(INITIAL_SEARCH_VALUES);
  const [isChartOpen, setIsChartOpen] = useState<boolean>(false);

  const pageData = {
    page: 1,
    size: 20,
    total: 0,
  };

  // 검색 폼 입력 값 변경 핸들러
  const handleSearchChange = (key: keyof typeof INITIAL_SEARCH_VALUES, value: string | number) => {
    console.log('search Form 값 변경 중', key, value);

    setSearchValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 검색 핸들러
  const handleSearch = () => {
    console.log('검색!');
    setAppliedSearchValues(searchValues);
  };

  console.log(appliedSearchValues);

  return (
    <>
      <div className="title-group">
        <TitleComponent
          title="운영 관리"
          subTitle="유지보수"
          thirdTitle="상세 분석"
          desc="일/월별 발전량 분석 및 설비별 상세 지표 확인"
        />
      </div>

      <div className="content-group" style={{ paddingTop: 'var(--spacing-10)' }}>
        <SummarySection
          title="월/일 발전량 분석"
          sideSection={
            <ButtonComponent onClick={() => setIsChartOpen(true)}>
              일별/월별 차트보기
            </ButtonComponent>
          }
        >
          {CARD_ITEMS.map((item) => (
            <SummaryCard
              key={item.title}
              title={item.title}
              value={item.value}
              description={item.description}
              icon={item.icon}
              footer={item.footer}
              valueColor={item.valueColor}
            />
          ))}
        </SummarySection>

        <AnalyticsSearch
          searchValues={searchValues}
          onSearchChange={handleSearchChange}
          onSearch={handleSearch}
        />

        <TableTitleComponent
          leftCont={
            <>
              <h3>설비별 상세 지표 (Equipment Level Metrics)</h3>-<h3>검색 0 / 전체 10</h3>
            </>
          }
          rightCont={<ButtonComponent variant="excel">Excel</ButtonComponent>}
        />
        <div style={{ height: 580 }}>
          <AgGridComponent
            rowData={OPERATION_ANALYTICS_ROW_DATA}
            columnDefs={OPERATION_ANALYTICS_COLUMN}
          />
        </div>
      </div>

      <BottomGroupComponent leftCont={<Pagination data={pageData} />} />

      <AnalyticsChartModal isOpen={isChartOpen} onOpen={() => setIsChartOpen((prev) => !prev)} />
    </>
  );
}

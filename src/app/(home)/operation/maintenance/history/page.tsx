'use client';

import {
  AgGridComponent,
  BottomGroupComponent,
  Pagination,
  SearchForm,
  Select,
  SelectItem,
  TableTitleComponent,
  TitleComponent,
} from '@/components';
import {
  OPERATION_HISTORY_COLUMN,
  OPERATION_HISTORY_ROW_DATA,
  OPERATION_HISTORY_SEARCH_CONFIG,
} from '@/constants/operation/maintenance/history';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const INITIAL_SEARCH_VALUES = {
  plantName: '',
  worker: '',
  taskType: '',
  completedDate: {
    start: '',
    end: '',
  },
};

export default function OperationHistoryhPage() {
  const router = useRouter();

  const [searchValues, setSearchValues] = useState(INITIAL_SEARCH_VALUES);
  const [appliedSearchValues, setAppliedSearchValues] = useState(INITIAL_SEARCH_VALUES);

  const pageData = {
    page: 1,
    size: 20,
    total: 0,
  };

  // 검색 폼 입력 값 변경 핸들러
  const handleSearchChange = (key: string, value: unknown) => {
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

  // 테이블 행 클릭 핸들러 (상세 페이지 이동 및 수정)
  const handleRowClick = (e: { data?: { taskCode?: string } }) => {
    const taskCode = e.data?.taskCode;
    if (!taskCode) return;

    router.push(`/operation/maintenance/history/${taskCode}`);
  };

  console.log(appliedSearchValues);

  return (
    <>
      <div className="title-group">
        <TitleComponent
          title="운영 관리"
          subTitle="유지보수"
          thirdTitle="정비 이력"
          desc="유지보수 장애 접수에 출동 처리된 이력 조회"
        />
      </div>

      <div className="content-group" style={{ paddingTop: 'var(--spacing-10)' }}>
        <SearchForm
          config={OPERATION_HISTORY_SEARCH_CONFIG}
          values={searchValues}
          onChange={handleSearchChange}
          onSearch={handleSearch}
        />
        <TableTitleComponent
          leftCont={<h3>검색 0 / 전체 10</h3>}
          rightCont={
            <Select defaultValue={20} aria-label="보기 선택">
              <SelectItem id={20}>20개씩 보기</SelectItem>
              <SelectItem id={30}>30개씩 보기</SelectItem>
              <SelectItem id={40}>40개씩 보기</SelectItem>
              <SelectItem id={50}>50개씩 보기</SelectItem>
            </Select>
          }
        />
        <AgGridComponent
          rowData={OPERATION_HISTORY_ROW_DATA}
          columnDefs={OPERATION_HISTORY_COLUMN}
          onRowClicked={handleRowClick}
        />
      </div>

      <BottomGroupComponent leftCont={<Pagination data={pageData} />} />
    </>
  );
}

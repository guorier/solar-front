'use client';

import {
  AgGridComponent,
  BottomGroupComponent,
  ButtonComponent,
  Icons,
  Pagination,
  SearchForm,
  Select,
  SelectItem,
  TableTitleComponent,
  TitleComponent,
} from '@/components';
import {
  OPERATION_DISPATCH_COLUMN,
  OPERATION_DISPATCH_ROW_DATA,
  OPERATION_DISPATCH_SEARCH_CONFIG,
} from '@/constants/operation/maintenance/dispatch';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const INITIAL_SEARCH_VALUES = {
  plantId: '',
  managerName: '',
  status: '',
  completedDate: {
    start: '',
    end: '',
  },
};

export default function OperationDispatchPage() {
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
  const handleRowClick = (e: { data?: { workCode?: string } }) => {
    const workCode = e.data?.workCode;
    if (!workCode) return;

    router.push(`/operation/maintenance/dispatch/${workCode}`);
  };

  // 접수 페이지 이동 핸들러
  const handleCreate = () => {
    router.push('/operation/maintenance/dispatch/create');
  };

  // 엑셀 다운로드 핸들러
  const handleExcel = () => {
    console.log('엑셀 다운로드!');
  };

  console.log(appliedSearchValues);

  return (
    <>
      <div className="title-group">
        <TitleComponent
          title="운영 관리"
          subTitle="유지보수"
          thirdTitle="출동 관리"
          desc="장애 조치 관련 장애 접수 및 관리하는 메뉴"
        />
      </div>

      <div className="content-group" style={{ paddingTop: 'var(--spacing-10)' }}>
        <SearchForm
          config={OPERATION_DISPATCH_SEARCH_CONFIG}
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
          rowData={OPERATION_DISPATCH_ROW_DATA}
          columnDefs={OPERATION_DISPATCH_COLUMN}
          onRowClicked={handleRowClick}
        />
      </div>

      <BottomGroupComponent
        leftCont={<Pagination data={pageData} />}
        rightCont={
          <div className="button-group">
            <ButtonComponent
              variant="excel"
              icon={<Icons iName="download" size={16} color="#fff" />}
              onClick={handleExcel}
            >
              엑셀
            </ButtonComponent>
            <ButtonComponent variant="contained" onClick={handleCreate}>
              접수
            </ButtonComponent>
          </div>
        }
      />
    </>
  );
}

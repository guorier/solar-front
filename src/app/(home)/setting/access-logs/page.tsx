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
  ACCESS_LOGS_COLUMN,
  ACCESS_LOGS_ROW_DATA,
  ACCESS_LOGS_SEARCH_CONFIG,
} from '@/constants/setting/accessLogs';
import { useState } from 'react';

const INITIAL_SEARCH_VALUES = {
  id: '',
  name: '',
  date: {
    start: '',
    end: '',
  },
  ip: '',
};

export default function AccessLogsPage() {
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

  console.log(appliedSearchValues);

  return (
    <>
      <div className="title-group">
        <TitleComponent
          title="설정 관리"
          subTitle="기록 관리"
          desc="해당 서비스에 1년간의 접근 기록을 보관 및 검색"
        />
      </div>

      <div className="content-group" style={{ paddingTop: 'var(--spacing-10)' }}>
        <SearchForm
          config={ACCESS_LOGS_SEARCH_CONFIG}
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
        <AgGridComponent rowData={ACCESS_LOGS_ROW_DATA} columnDefs={ACCESS_LOGS_COLUMN} />
      </div>

      <BottomGroupComponent leftCont={<Pagination data={pageData} />} />
    </>
  );
}

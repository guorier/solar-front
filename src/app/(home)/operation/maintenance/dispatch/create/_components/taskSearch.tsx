import { AgGridComponent, ButtonComponent, DatePicker, Modal } from '@/components';
import {
  OPERATION_TASK_SEARCH_COLUMN,
  OPERATION_TASK_SEARCH_ROW_DATA,
} from '@/constants/operation/maintenance/dispatch';
import { useState } from 'react';

const INITIAL_SEARCH_VALUES = {
  start: '',
  end: '',
};

export default function TaskSearchModal({
  isOpen,
  onOpen,
}: {
  isOpen: boolean;
  onOpen: () => void;
}) {
  const [searchValues, setSearchValues] = useState(INITIAL_SEARCH_VALUES);
  const [appliedSearchValues, setAppliedSearchValues] = useState(INITIAL_SEARCH_VALUES);

  // 검색 폼 입력 값 변경 핸들러
  const handleSearchChange = (key: 'start' | 'end', value: string) => {
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
  };

  console.log(appliedSearchValues);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpen}
      title="작업 검색"
      primaryButton="닫기"
      secondaryButton=""
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <DatePicker
          value={searchValues.start}
          onChange={(date) => handleSearchChange('start', date)}
          aria-label="시작일 선택"
        />
        <span>-</span>
        <DatePicker
          value={searchValues.end}
          onChange={(date) => handleSearchChange('end', date)}
          aria-label="종료일 선택"
        />
        <ButtonComponent onClick={handleSearch}>검색</ButtonComponent>
      </div>
      <AgGridComponent
        rowData={OPERATION_TASK_SEARCH_ROW_DATA}
        columnDefs={OPERATION_TASK_SEARCH_COLUMN}
        onRowClicked={handleRowClick}
      />
    </Modal>
  );
}

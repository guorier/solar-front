import { AgGridComponent, Modal } from '@/components';
import {
  OPERATION_ERROR_SEARCH_COLUMN,
  OPERATION_ERROR_SEARCH_ROW_DATA,
} from '@/constants/operation/maintenance/dispatch';

export default function ErrorSearchModal({
  isOpen,
  onOpen,
}: {
  isOpen: boolean;
  onOpen: () => void;
}) {
  // 테이블 행 클릭 핸들러 (상세 페이지 이동 및 수정)
  const handleRowClick = (e: { data?: { errorCode?: string } }) => {
    const errorCode = e.data?.errorCode;
    if (!errorCode) return;
    console.log(errorCode);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpen}
      title="장애 검색"
      primaryButton="닫기"
      secondaryButton=""
    >
      <AgGridComponent
        rowData={OPERATION_ERROR_SEARCH_ROW_DATA}
        columnDefs={OPERATION_ERROR_SEARCH_COLUMN}
        onRowClicked={handleRowClick}
      />
    </Modal>
  );
}

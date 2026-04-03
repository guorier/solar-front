import { useRef, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  ClientSideRowModelModule,
  PaginationModule,
  RowSelectionModule,
  ColumnAutoSizeModule,
  type ColDef,
  RowDoubleClickedEvent,
  CellStyleModule,
  RowClickedEvent,
  CellClickedEvent,
  CellMouseOverEvent,
  type RowSelectionOptions,
  type SelectionChangedEvent,
} from 'ag-grid-community';
import './ag-grid.component.scss';
import { EmptyBox } from '@/components/empty/emptyData';
import { Loading } from '@/components/loading/loading';
// import { Checkbox } from '@/components'; //선언없어서 주석처리

type RowDataType = Record<string, unknown>; // ✅ never -> unknown (제네릭 제약으로 row 타입 확장 가능)

type PaginationRequest = {
  page: number;
  size: number;
};

type BaseAgGridProps<T extends PaginationRequest, R extends RowDataType> = {
  rowData: R[]; // 외부에서 데이터 전달
  columnDefs: ColDef<R>[]; // ✅ ColDef[] -> ColDef<R>[] (주석의 주석: row 타입 연결)
  actions?: { label: string; onClick: () => void; color?: string }[]; // 사용자 정의 액션 버튼
  initialPageSize?: number; // 초기 페이지 크기
  requestData?: T;
  paginationData?: { totalCount: number; totalPage: number };
  onCellClicked?: (event: CellClickedEvent<R>) => void;
  onRowClicked?: (event: RowClickedEvent<R>) => void;
  onRowDoubleClicked?: (event: RowDoubleClickedEvent<R>) => void;
  handlePageChange?: (pageNumber: number) => void;
  rowSelection?: 'single' | 'multiple' | RowSelectionOptions<R>;
  onSelectionChanged?: (event: SelectionChangedEvent<R>) => void;

  loading?: boolean;
  // ✅ (선택) 문구 커스텀 가능하게
  loadingText?: string;
  emptyText?: string;

  isPagination?: boolean;
};

export const AgGridComponent = <T extends PaginationRequest, R extends RowDataType>({
  rowData = [],
  columnDefs,
  // actions = [], //선언없어서 주석처리
  initialPageSize = 20,
  // requestData, //선언없어서 주석처리
  // paginationData,//선언없어서 주석처리
  loading = false,
  onCellClicked,
  onRowClicked,
  onRowDoubleClicked,
  // handlePageChange, //선언없어서 주석처리
  rowSelection,
  onSelectionChanged,
  loadingText = '로딩중...',
  emptyText = '일치하는 DATA가 없습니다',
  isPagination = true,
}: BaseAgGridProps<T, R>) => {
  const gridRef = useRef<AgGridReact<R>>(null); // ✅ R 연결

  const onGridReady = () => {
    if (gridRef.current) {
      const api = gridRef.current.api;
      api.sizeColumnsToFit(); // 화면 크기에 맞게 열 크기 조정
      //화면 크기 변경 시 다시 조정
      window.addEventListener('resize', () => api.sizeColumnsToFit());
    }
  };

  // 말줄임표 셀에 마우스 오버 시 툴팁처럼 표시
  const handleCellMouseOver = (event: CellMouseOverEvent<R>) => {
    const cellElement = event?.event?.target as HTMLElement;
    if (cellElement.scrollWidth > cellElement.clientWidth) {
      cellElement.title = String(event.value ?? '');
      return;
    }
    cellElement.title = '';
  };

  // 기본 열 정의 (모든 열에 적용)
  // ✅ ColDef 에 onCellMouseOver 없음 → defaultColDef에서 제거하고,
  // ✅ AgGridReact prop onCellMouseOver로만 사용(기존 코드 유지)
  const defaultColDef: ColDef<R> = {
    resizable: true,
    // minWidth: 80,
    // initialWidth: 150,
  };

  // ✅ 여기서 loading/empty 오버레이 제어
  useEffect(() => {
    const api = gridRef.current?.api;
    if (!api) return;

    if (loading) {
      api.showLoadingOverlay();
      return;
    }

    if (!rowData || rowData.length === 0) {
      api.showNoRowsOverlay();
      return;
    }

    api.hideOverlay();
  }, [loading, rowData]);

  return (
    <div className="ag-theme-alpine" style={{ height: '100%' }}>
      <AgGridReact<R>
        ref={gridRef}
        rowData={rowData}
        defaultColDef={defaultColDef}
        columnDefs={columnDefs}
        modules={[
          ClientSideRowModelModule,
          RowSelectionModule,
          PaginationModule,
          ColumnAutoSizeModule,
          CellStyleModule,
        ]}
        pagination={isPagination}
        paginationPageSize={rowData.length > 0 ? rowData.length : initialPageSize}
        onRowClicked={onRowClicked}
        onRowDoubleClicked={onRowDoubleClicked}
        onGridReady={onGridReady}
        onCellClicked={onCellClicked}
        onCellMouseOver={handleCellMouseOver}
        suppressPaginationPanel={true}
        suppressMovableColumns={true}
        headerHeight={43}
        rowHeight={43}
        rowSelection={rowSelection}
        onSelectionChanged={onSelectionChanged}
        loadingOverlayComponent={() => <Loading loadingText={loadingText} />}
        noRowsOverlayComponent={() => <EmptyBox>{emptyText}</EmptyBox>}
      />
    </div>
  );
};

export default AgGridComponent;

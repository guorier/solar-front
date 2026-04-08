'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AgGridComponent,
  BottomGroupComponent,
  ButtonComponent,
  CountArea,
  Icons,
  InfoBoxComponent,
  InfoBoxGroup,
  Modal,
  Pagination,
  SearchFieldConfig,
  SearchFields,
  SearchForm,
  TableTitleComponent,
  TitleComponent,
  TopInfoBoxComponent,
  Checkbox,
} from '@/components';
import type {
  ColDef,
  ICellRendererParams,
  IHeaderParams,
  RowClickedEvent,
  SelectionChangedEvent,
} from 'ag-grid-community';
import { recStatusRecentIssuesMock, recStatusSummaryMock } from '@/mockup/rec-status.mock';
import type { RecIssueRow } from '@/mockup/rec-status.mock';

function SelectAllHeader({ api }: IHeaderParams<RecIssueRow>) {
  const [checkState, setCheckState] = useState<'none' | 'some' | 'all'>('none');

  const getCheckState = useCallback(() => {
    let selectableCount = 0;
    let selectedCount = 0;

    api.forEachNode((node) => {
      if (node.selectable) {
        selectableCount += 1;
        if (node.isSelected()) selectedCount += 1;
      }
    });

    if (selectableCount === 0 || selectedCount === 0) return 'none';
    if (selectedCount === selectableCount) return 'all';
    return 'some';
  }, [api]);

  const updateCheckState = useCallback(() => {
    setCheckState(getCheckState());
  }, [getCheckState]);

  useEffect(() => {
    updateCheckState();
    api.addEventListener('selectionChanged', updateCheckState);
    api.addEventListener('modelUpdated', updateCheckState);

    return () => {
      api.removeEventListener('selectionChanged', updateCheckState);
      api.removeEventListener('modelUpdated', updateCheckState);
    };
  }, [api, updateCheckState]);

  const handleChange = (isSelected: boolean) => {
    setCheckState(isSelected ? 'all' : 'none');

    api.forEachNode((node) => {
      if (node.selectable) node.setSelected(isSelected);
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        cursor: 'pointer',
        width: '100%',
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <Checkbox
        isSelected={checkState === 'all'}
        isIndeterminate={checkState === 'some'}
        onChange={handleChange}
        aria-label="전체 선택"
      />
    </div>
  );
}

function CheckboxCell({ node }: ICellRendererParams<RecIssueRow>) {
  const isRegistered = node.data?.certStatus === '등록';
  const [isSelected, setIsSelected] = useState(!!node.isSelected());

  useEffect(() => {
    const handleRowSelected = () => setIsSelected(!!node.isSelected());
    node.addEventListener('rowSelected', handleRowSelected);
    return () => node.removeEventListener('rowSelected', handleRowSelected);
  }, [node]);

  const handleChange = (nextSelected: boolean) => {
    if (isRegistered) return;
    node.setSelected(nextSelected);
  };

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <Checkbox
        isSelected={isRegistered || isSelected}
        isDisabled={isRegistered}
        onChange={handleChange}
        aria-label="행 선택"
      />
    </div>
  );
}

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

const searchConfig: SearchFieldConfig[] = [
  { key: 'period', label: '발급기간', type: 'date-range', gridSize: 3 },
];

export default function RecStatusPage() {
  const [page, setPage] = useState(1);
  const [searchValues, setSearchValues] = useState<Record<string, unknown>>({});
  const [showValues, setShowValues] = useState<Record<string, unknown>>({
    showNumber: String(PAGE_SIZE),
  });
  const [rowData, setRowData] = useState<RecIssueRow[]>(recStatusRecentIssuesMock);
  const [selectedRows, setSelectedRows] = useState<RecIssueRow[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const total = rowData.length;
  const pageSize = Number(showValues.showNumber) || PAGE_SIZE;

  const pagedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rowData.slice(start, start + pageSize);
  }, [page, rowData, pageSize]);

  const handleSelectionChanged = (event: SelectionChangedEvent<RecIssueRow>) => {
    setSelectedRows(event.api.getSelectedRows());
  };

  const handleRegister = () => {
    const selectedIds = new Set(selectedRows.map((r) => r.id));
    setRowData((prev) =>
      prev.map((row) => (selectedIds.has(row.id) ? { ...row, certStatus: '등록' as const } : row)),
    );
    setSelectedRows([]);
    setSelectedFileName('');
    setIsModalOpen(false);
  };

  const columnDefs: ColDef<RecIssueRow>[] = useMemo(
    () => [
      {
        colId: 'checkbox',
        headerComponent: SelectAllHeader,
        width: 80,
        minWidth: 80,
        maxWidth: 80,
        resizable: false,
        suppressSizeToFit: true,
        cellRenderer: CheckboxCell,
      },
      { field: 'targetDate', headerName: '대상 일', width: 200, minWidth: 200, maxWidth: 200 },
      { field: 'plantName', headerName: '발전소/기지국', flex: 1 },
      { field: 'powerAmount', headerName: '발전량(kWh)', width: 160, minWidth: 160, maxWidth: 160 },
      { field: 'recCount', headerName: 'REC수량', width: 160, minWidth: 160, maxWidth: 160 },
      {
        field: 'certStatus',
        headerName: '인증서 등록 상태',
        width: 160,
        minWidth: 160,
        maxWidth: 160,
        cellRenderer: (params: ICellRendererParams<RecIssueRow>) => (
          <span style={{ color: params.value === '등록' ? '#2563eb' : '#888' }}>
            {params.value}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <>
      <div className="title-group" style={{ marginBottom: '18px' }}>
        <TitleComponent
          title="전력 거래"
          subTitle="REC 발급 관리"
          thirdTitle="발급 현황"
          desc="REC 발급 관리에서 발급 현황 정보"
        />
      </div>
      <div className="content-group" style={{ gap: '16px' }}>
        <SearchForm
          config={searchConfig}
          values={searchValues}
          onChange={(key, val) => setSearchValues((prev) => ({ ...prev, [key]: val }))}
          onSearch={() => {}}
        />

        <TopInfoBoxComponent title="총 발급 현황" bg="var(--point-orange-5)" color="#A34600">
          <InfoBoxGroup className="row-type">
            {recStatusSummaryMock.map((item) => (
              <InfoBoxComponent
                key={item.label}
                icon="feedback"
                title={item.label}
                count={item.value}
                bg="white"
                tag={item.helper}
              />
            ))}
          </InfoBoxGroup>
        </TopInfoBoxComponent>

        <div className="table-group">
          <TableTitleComponent
            leftCont={<CountArea search={rowData.length} total={total} />}
            rightCont={
              <SearchFields
                config={showNumberConfig}
                values={showValues}
                onChange={(k, v) => setShowValues((prev) => ({ ...prev, [k]: v }))}
              />
            }
          />
          <AgGridComponent
            rowData={pagedRows}
            columnDefs={columnDefs}
            rowSelection={{
              mode: 'multiRow',
              checkboxes: false,
              headerCheckbox: false,
              isRowSelectable: (node) => node.data?.certStatus !== '등록',
            }}
            onSelectionChanged={handleSelectionChanged}
            onRowClicked={(event: RowClickedEvent<RecIssueRow>) => {
              if (event.node.selectable) {
                event.node.setSelected(!event.node.isSelected());
              }
            }}
          />
          <BottomGroupComponent
            centerCont={<Pagination data={{ page, size: pageSize, total }} onChange={setPage} />}
            rightCont={
              <ButtonComponent
                variant="contained"
                isDisabled={selectedRows.length === 0}
                icon={<Icons iName="plus" color="#fff" size={16} />}
                iconPosition="left"
                onClick={() => setIsModalOpen(true)}
              >
                인증서 등록
              </ButtonComponent>
            }
          />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setSelectedFileName('');
        }}
        title="REC 인증서 등록"
        primaryButton="등록"
        secondaryButton="취소"
        onPrimaryPress={handleRegister}
        width={480}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 0 8px',
          }}
        >
          <span style={{ whiteSpace: 'nowrap', fontSize: '14px', minWidth: '80px' }}>
            인증서 업로드
          </span>
          <div
            style={{
              flex: 1,
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius)',
              padding: '6px 10px',
              cursor: 'pointer',
              fontSize: '14px',
              color: selectedFileName ? '#333' : '#aaa',
              background: '#fff',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            {selectedFileName || '파일을 선택하세요'}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              setSelectedFileName(file?.name ?? '');
            }}
          />
        </div>
      </Modal>
    </>
  );
}

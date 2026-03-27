// src/constants/eqpmnt/components/ModalPlantSearch.tsx
'use client';

import { useMemo, useState, useEffect } from 'react';
import { ButtonComponent, AgGridComponent, Pagination } from '@/components';
import { Group, Input, TextField } from 'react-aria-components';
import { Modal } from '@/components/modal/modal.component';
import { useGetPlantEqpmntPop } from '@/services/plants/query';
import type { PlantEqpmntPop } from '@/services/plants/type';
import type { ColDef, RowClickedEvent, ICellRendererParams } from 'ag-grid-community';
import { Radio } from '@/components/radio';

// API 응답 객체 타입 정의 (실제 백엔드 스펙에 맞춰 조정 가능)
interface PlantApiResponse {
  items?: PlantEqpmntPop[];
  list?: PlantEqpmntPop[];
  content?: PlantEqpmntPop[];
  totalCount?: number;
  total?: number;
}

interface ModalPlantSearchProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (plant: PlantEqpmntPop) => void;
  srcTable: string;
}

export const ModalPlantSearch = ({
  isOpen,
  onOpenChange,
  onApply,
  srcTable,
}: ModalPlantSearchProps) => {
  const [keyword, setKeyword] = useState('');
  const [appliedKeyword, setAppliedKeyword] = useState('');
  const [selected, setSelected] = useState<PlantEqpmntPop | null>(null);

  const [page, setPage] = useState(1);
  const [size] = useState(10);

  useEffect(() => {
    if (isOpen) {
      setKeyword('');
      setAppliedKeyword('');
      setSelected(null);
      setPage(1);
    }
  }, [isOpen]);

  const handleSearch = () => {
    setAppliedKeyword(keyword.trim());
    setPage(1);
  };

  const { data, isFetching } = useGetPlantEqpmntPop(
    {
      srcTable,
      page,
      size,
    },
    isOpen,
  ) as { data: PlantEqpmntPop[] | PlantApiResponse | undefined; isFetching: boolean };
  // console.log('API DATA >>>', data);

  const pageItems = useMemo(() => {
    if (!data) return [];

    let list: PlantEqpmntPop[] = [];

    if (Array.isArray(data)) {
      list = data;
    } else {
      list = data.items || data.list || data.content || [];
    }

    // console.log('LIST >>>', list);

    if (!appliedKeyword) return list;

    const filtered = list.filter((x: PlantEqpmntPop) =>
      (x.pwplNm ?? '').toLowerCase().includes(appliedKeyword.toLowerCase()),
    );

    // console.log('FILTERED >>>', filtered);

    return filtered;
  }, [data, appliedKeyword]);

  const total = useMemo(() => {
    if (!data) return 0;
    if (Array.isArray(data)) return pageItems.length;

    return data.total ?? data.totalCount ?? 0;
  }, [data, pageItems.length]);

  const columnDefs: ColDef<PlantEqpmntPop>[] = useMemo(
    () => [
      {
        headerName: '',
        width: 60,
        minWidth: 60,
        maxnWidth: 60,
        suppressSizeToFit: true,
        cellRenderer: (params: ICellRendererParams<PlantEqpmntPop>) => {
          const row = params.data;
          if (!row) return null;

          return (
            <Radio
              name="plantSelect"
              value={row.pwplId}
              checked={selected?.pwplId === row.pwplId}
              onChange={() => setSelected(row)}
              ariaLabel="선택"
            />
          );
        },
      },
      {
        field: 'pwplNm',
        headerName: '발전소 명',
        flex: 1,
        cellStyle: {
          textAlign: 'left',
          justifyContent: 'flex-start',
        },
      },
    ],
    [selected],
  );

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="발전소 목록"
      width={460}
      primaryButton="적용"
      secondaryButton="취소"
      onPrimaryPress={() => {
        if (!selected) return;
        onApply(selected);
        onOpenChange(false);
      }}
      isPrimaryDisabled={!selected}
    >
      <TextField style={{ maxWidth: '100%' }} aria-label="발전소 검색">
        <Group style={{ flex: 'none' }}>
          <Input
            placeholder="발전소 명"
            aria-label="발전소 명"
            value={keyword}
            onChange={(e) => setKeyword((e.target as HTMLInputElement).value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <ButtonComponent onPress={handleSearch}>검색</ButtonComponent>
        </Group>
      </TextField>
      {/* <div style={{ marginTop: 10 }}>
        <pre style={{ fontSize: 12 }}>{JSON.stringify(pageItems, null, 2)}</pre>
      </div> */}
      <div style={{ height: 360, marginTop: 16 }}>
        <AgGridComponent
          key={isFetching ? 'loading' : 'ready'}
          rowData={pageItems}
          columnDefs={columnDefs}
          loading={isFetching}
          isPagination={false}
          onRowClicked={(e: RowClickedEvent<PlantEqpmntPop>) => {
            const row = e.data;
            if (!row) return;
            setSelected(row);
          }}
        />
      </div>

      <Pagination
        data={{
          page,
          size,
          total,
        }}
        onChange={(p: number) => setPage(p)}
      />
    </Modal>
  );
};

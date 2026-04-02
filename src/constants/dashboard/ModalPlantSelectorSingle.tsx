// src\constants\dashboard\ModalPlantSelectorSingle.tsx
'use client';

import { useMemo, useState, useEffect } from 'react';
import { ButtonComponent, AgGridComponent } from '@/components';
import { Group, Input, TextField } from 'react-aria-components';
import { Modal } from '@/components/modal/modal.component';
import { useGetPlantBaseCombo } from '@/services/plants/query';
import type { PlantBaseComboItem } from '@/services/plants/type';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { Radio } from '@/components/radio';

type StoredPlantItem = {
  pwplId: string;
  macAddr?: string;
};

const getStoredPwplIds = (value: string | null): string[] => {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as Array<string | StoredPlantItem>;

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [];
    }

    if (typeof parsed[0] === 'string') {
      return parsed.filter((item): item is string => typeof item === 'string');
    }

    return parsed
      .map((item) => (item && typeof item === 'object' ? item.pwplId : ''))
      .filter(Boolean);
  } catch (error) {
    console.error(error);
    return [];
  }
};

type PaginationRequest = {
  page: number;
  size: number;
};

interface ModalPlantSelectorSingleProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (plant: PlantBaseComboItem) => void;
}

export const ModalPlantSelectorSingle = ({
  isOpen,
  onOpenChange,
  onApply,
}: ModalPlantSelectorSingleProps) => {
  const [keyword, setKeyword] = useState('');
  const [appliedKeyword, setAppliedKeyword] = useState('');
  const [selected, setSelected] = useState<PlantBaseComboItem | null>(null);

  const { data, isFetching } = useGetPlantBaseCombo();

  const plants: PlantBaseComboItem[] = useMemo(
    () =>
      data?.map(
        (v) =>
          ({
            pwplId: v.pwplId,
            pwplNm: v.pwplNm,
            pwplLat: v.pwplLat,
            pwplLot: v.pwplLot,
            macAddr: v.macAddr,
          }) as PlantBaseComboItem,
      ) ?? [],
    [data],
  );

  const filtered = plants.filter((v) =>
    v.pwplNm?.toLowerCase().includes(appliedKeyword.toLowerCase()),
  );

  useEffect(() => {
    if (isOpen) {
      setKeyword('');
      setAppliedKeyword('');
      setSelected(null);

      const stored = localStorage.getItem('pwplIds');

      if (stored) {
        const ids = getStoredPwplIds(stored);
        const found = plants.find((v) => v.pwplId === ids[0]);
        if (found) setSelected(found);
      }
    }
  }, [isOpen, plants]);

  const handleSearch = () => {
    setAppliedKeyword(keyword.trim());
  };

  const columnDefs: ColDef<PlantBaseComboItem>[] = useMemo(
    () => [
      {
        headerName: '',
        width: 60,
        minWidth: 60,
        maxWidth: 60,
        suppressSizeToFit: true,
        resizable: false,
        cellRenderer: (params: ICellRendererParams<PlantBaseComboItem>) => {
          const row = params.data;
          if (!row) return null;

          return (
            <Radio
              name="plantSelectSingle"
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
          cursor: 'pointer',
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

      <div style={{ height: 360 }}>
        <AgGridComponent<PaginationRequest, PlantBaseComboItem>
          rowData={filtered}
          columnDefs={columnDefs}
          loading={isFetching}
          onRowClicked={(e) => {
            const row = e.data;
            if (!row) return;
            setSelected(row);
          }}
        />
      </div>
    </Modal>
  );
};

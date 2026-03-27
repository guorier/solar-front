// src\constants\monitoring\ModalPlantSelector.tsx
'use client';

import { useMemo, useState, useEffect } from 'react';
import { ButtonComponent, AgGridComponent } from '@/components';
import { Group, Input, TextField } from 'react-aria-components';
import { Modal } from '@/components/modal/modal.component';
import { useGetPlantBaseCombo } from '@/services/plants/query';
import type { PlantBaseComboItem } from '@/services/plants/type';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { Radio } from '@/components/radio';
import { Checkbox } from '@/components/checkbox';

type PaginationRequest = {
  page: number;
  size: number;
};

interface ModalPlantSelectorProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectionMode: 'single' | 'multiple';
  onApplySingle: (plant: PlantBaseComboItem) => void;
  onApplyMulti: (plants: PlantBaseComboItem[]) => void;
}

export const ModalPlantSelector = ({
  isOpen,
  onOpenChange,
  selectionMode,
  onApplySingle,
  onApplyMulti,
}: ModalPlantSelectorProps) => {
  const [keyword, setKeyword] = useState('');
  const [appliedKeyword, setAppliedKeyword] = useState('');
  const [selected, setSelected] = useState<PlantBaseComboItem | null>(null);
  const [selectedList, setSelectedList] = useState<PlantBaseComboItem[]>([]);

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
      setSelectedList([]);

      // ===== 추가 =====
      const stored = localStorage.getItem('pwplIds');

      if (stored) {
        try {
          const ids = JSON.parse(stored) as string[];

          if (selectionMode === 'single') {
            const found = plants.find((v) => v.pwplId === ids[0]);
            if (found) setSelected(found);
          } else {
            const foundList = plants.filter((v) => ids.includes(v.pwplId));
            setSelectedList(foundList);
          }
        } catch (e) {
          console.error(e);
        }
      }
      // =================
    }
  }, [isOpen, plants, selectionMode]);

  const handleSearch = () => {
    setAppliedKeyword(keyword.trim());
  };

  const columnDefs: ColDef<PlantBaseComboItem>[] = useMemo(() => {
    if (selectionMode === 'single') {
      return [
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
            cursor: 'pointer',
          },
        },
      ];
    }

    return [
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

          const checked = selectedList.some((v) => v.pwplId === row.pwplId);

          return (
            <Checkbox
              isSelected={checked}
              onChange={(checkedValue: boolean) => {
                if (checkedValue) {
                  // ✅ 중복 방지 추가
                  setSelectedList((prev) => {
                    if (prev.some((v) => v.pwplId === row.pwplId)) return prev;
                    return [...prev, row];
                  });
                } else {
                  setSelectedList((prev) => prev.filter((v) => v.pwplId !== row.pwplId));
                }
              }}
              aria-label="선택"
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
    ];
  }, [selectionMode, selected, selectedList]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="발전소 목록"
      width={460}
      primaryButton="적용"
      secondaryButton="취소"
      onPrimaryPress={() => {
        if (selectionMode === 'single') {
          if (!selected) return;

          // ✅ 덮어쓰기 (remove 없어도 동일)
          localStorage.setItem('pwplIds', JSON.stringify([selected.pwplId]));
          onApplySingle(selected);
        } else {
          if (!selectedList.length) return;

          // ✅ 덮어쓰기
          localStorage.setItem('pwplIds', JSON.stringify(selectedList.map((v) => v.pwplId)));
          onApplyMulti(selectedList);
        }

        onOpenChange(false);
      }}
      isPrimaryDisabled={selectionMode === 'single' ? !selected : selectedList.length === 0}
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

      <div style={{ height: 360, marginTop: 16 }}>
        <AgGridComponent<PaginationRequest, PlantBaseComboItem>
          rowData={filtered}
          columnDefs={columnDefs}
          loading={isFetching}
          onRowClicked={(e) => {
            const row = e.data;
            if (!row) return;

            if (selectionMode === 'single') {
              setSelected(row);
            }

            if (selectionMode === 'multiple') {
              const exists = selectedList.some((v) => v.pwplId === row.pwplId);

              if (exists) {
                setSelectedList((prev) => prev.filter((v) => v.pwplId !== row.pwplId));
              } else {
                setSelectedList((prev) => [...prev, row]);
              }
            }
          }}
        />
      </div>
    </Modal>
  );
};

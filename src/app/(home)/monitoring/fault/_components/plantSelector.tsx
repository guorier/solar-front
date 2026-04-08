'use client';

import { AgGridComponent, ButtonComponent, InputComponent, Modal } from '@/components';
import { PLANT_SELECT_COLUMN } from '@/constants/monitoring/fault/fault';
import { useGetPlantBaseCombo } from '@/services/plants/query';
import { PlantBaseComboItem } from '@/services/plants/type';
import { useEffect, useMemo, useState } from 'react';
import type { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Group } from 'react-aria-components';

type PlantSelectorProps = {
  isOpen: boolean;
  onOpen: (open: boolean) => void;
  onPrimaryAction: (selected: PlantBaseComboItem[]) => void;
  selectionMode?: 'singleRow' | 'multiRow';
  selectedPwplIds?: string[];
};

export function PlantSelectorModal({
  isOpen,
  onOpen,
  onPrimaryAction,
  selectionMode = 'multiRow',
  selectedPwplIds = [],
}: PlantSelectorProps) {
  const [keyword, setKeyword] = useState<string>('');
  const [appliedKeyword, setAppliedKeyword] = useState<string>('');

  const [selectedPlants, setSelectedPlants] = useState<PlantBaseComboItem[]>([]);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);

  const { data: plantList } = useGetPlantBaseCombo();

  // 선택한 발전소 저장
  const handleSave = () => {
    onPrimaryAction(selectedPlants ?? []);
    onOpen(false);
  };

  // 이전에 선택했던 발전소 표출
  useEffect(() => {
    if (!isOpen || !gridApi || !plantList?.length) return;

    gridApi.forEachNode((node) => {
      const pwplId = node.data?.pwplId;
      node.setSelected(selectedPwplIds.includes(pwplId));
    });

    setSelectedPlants(plantList.filter((plant) => selectedPwplIds.includes(plant.pwplId)));
  }, [isOpen, gridApi, plantList, selectedPwplIds]);

  // 발전소 목록 데이터 가공
  const plants: PlantBaseComboItem[] = useMemo(
    () =>
      plantList?.map(
        (v) =>
          ({
            pwplId: v.pwplId,
            pwplNm: v.pwplNm,
            pwplLat: v.pwplLat,
            pwplLot: v.pwplLot,
            macAddr: v.macAddr,
          }) as PlantBaseComboItem,
      ) ?? [],
    [plantList],
  );

  // 검색어에 따른 발전소 목록 필터링
  const filteredPlants = useMemo(() => {
    return plants.filter((v) => v.pwplNm?.toLowerCase().includes(appliedKeyword.toLowerCase()));
  }, [plants, appliedKeyword]);

  return (
    <Modal
      title="발전소 목록"
      isOpen={isOpen}
      onOpenChange={onOpen}
      onPrimaryPress={handleSave}
      primaryButton="적용"
    >
      <Group>
        <InputComponent
          placeholder="발전소 명"
          aria-label="발전소 명"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setAppliedKeyword(keyword);
            }
          }}
        />
        <ButtonComponent onClick={() => setAppliedKeyword(keyword)}>검색</ButtonComponent>
      </Group>
      <div style={{ height: 400 }}>
        <AgGridComponent
          rowData={filteredPlants ?? []}
          columnDefs={PLANT_SELECT_COLUMN}
          rowSelection={
            selectionMode === 'multiRow'
              ? {
                  mode: 'multiRow' as const,
                  enableClickSelection: true,
                  enableSelectionWithoutKeys: true,
                }
              : {
                  mode: 'singleRow' as const,
                  enableClickSelection: true,
                }
          }
          onGridReady={(params: GridReadyEvent) => setGridApi(params.api)}
          onSelectionChanged={(params) => {
            const selectedRows = params.api.getSelectedRows();
            setSelectedPlants(selectedRows);
          }}
          selectionColumnDef={{
            headerClass: 'checkbox-header',
          }}
        />
      </div>
    </Modal>
  );
}

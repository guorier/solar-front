'use client';

import {
  AgGridComponent,
  ButtonComponent,
  TableTitleComponent,
  TitleComponent,
} from '@/components';
import { ModalPlantSelector } from '@/constants/dashboard/ModalPlantSelector';
import {
  OPERATION_ERRORS_COLUMN,
  OPERATION_ERRORS_ROW_DATA,
} from '@/constants/operation/maintenance/erros';
import { useState } from 'react';
import { Tag, TagGroup, TagList } from 'react-aria-components';

const TAG_ITEMS = [
  { key: 'all', label: '전체', count: 24 },
  { key: 'critical', label: '심각', count: 8 },
  { key: 'major', label: '경고', count: 8 },
  { key: 'minor', label: '주의', count: 8 },
];

export default function OperationErrorsPage() {
  const [isPlantModalOpen, setIsPlantModalOpen] = useState<boolean>(false);

  return (
    <>
      <div className="title-group">
        <TitleComponent
          title="운영 관리"
          subTitle="유지보수"
          thirdTitle="오류 모니터링"
          desc="실시간 장치 감시 모니터링 관리"
        />
      </div>

      <div className="content-group" style={{ paddingTop: 'var(--spacing-10)' }}>
        <TableTitleComponent
          leftCont={
            <TagGroup aria-label="장애 건수">
              <TagList>
                {TAG_ITEMS.map((item) => (
                  <Tag key={item.key} id={item.key} style={{ cursor: 'pointer' }}>
                    {item.label} <em>{item.count}건</em>
                  </Tag>
                ))}
              </TagList>
            </TagGroup>
          }
          rightCont={
            <div className="button-group">
              <ButtonComponent variant="excel">엑셀</ButtonComponent>
              <ButtonComponent variant="contained" onClick={() => setIsPlantModalOpen(true)}>
                발전소
              </ButtonComponent>
            </div>
          }
        />
        <AgGridComponent rowData={OPERATION_ERRORS_ROW_DATA} columnDefs={OPERATION_ERRORS_COLUMN} />
      </div>

      <ModalPlantSelector
        isOpen={isPlantModalOpen}
        onOpenChange={setIsPlantModalOpen}
        selectionMode="multiple"
        onApplySingle={(plant) => {
          console.log(plant);
        }}
        onApplyMulti={(plants) => {
          console.log(plants);
        }}
      />
    </>
  );
}

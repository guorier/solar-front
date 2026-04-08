'use client';

import { useMemo, useState } from 'react';
import type { RowClickedEvent } from 'ag-grid-community';
import {
  BottomGroupComponent,
  ButtonComponent,
  Icons,
  Pagination,
  TitleComponent,
} from '@/components';
import { ModalPlantSelectorSingle } from '@/constants/dashboard/ModalPlantSelectorSingle';
import type { KepcoListItem } from '@/services/trading/verification/type';
import {
  useGetKepcoSystem,
  useGetKepcoList,
  useGetKepcoDayList,
  useSaveKepco,
} from '@/services/trading/verification/query';
import { PAGE_SIZE, getCurrentMonth } from './_constants/config';
import { KepcoInputCard } from './_components/KepcoInputCard';
import { MonthlyTable } from './_components/MonthlyTable';
import { DayTable } from './_components/DayTable';

export function VerificationPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<{ pwplId: string; pwplNm: string } | null>(
    null,
  );
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [kepcoMeterValue, setKepcoMeterValue] = useState('');
  const [queryState, setQueryState] = useState({ page: 1 });
  const [values, setValues] = useState<Record<string, unknown>>({ showNumber: String(PAGE_SIZE) });
  const [selectedRow, setSelectedRow] = useState<KepcoListItem | null>(null);

  const onChangeValues = (key: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const pageSize = Number(values.showNumber) || PAGE_SIZE;

  const handlePageChange = (page: number) => {
    setQueryState((prev) => ({ ...prev, page }));
  };

  const handleRowClicked = (event: RowClickedEvent<KepcoListItem>) => {
    if (event.data) setSelectedRow(event.data);
  };

  const vrfyYm = selectedMonth.replace('-', '');
  const enabled = !!selectedPlant?.pwplId;

  const { data: listData } = useGetKepcoList(
    { pwplId: selectedPlant?.pwplId ?? '', page: queryState.page, size: pageSize },
    enabled,
  );

  const listItems = useMemo(() => listData?.items ?? [], [listData]);
  const listTotal = listData?.totalCount ?? listItems.length;

  const dayEnabled = !!selectedPlant?.pwplId && !!selectedRow;
  const { data: dayData } = useGetKepcoDayList(
    {
      pwplId: selectedPlant?.pwplId ?? '',
      vrfyYm: selectedRow?.vrfyYmText.replace('-', '') ?? '',
      page: 1,
      size: 31,
    },
    dayEnabled,
  );
  const dayItems = useMemo(() => dayData?.items ?? [], [dayData]);

  const { data: systemData } = useGetKepcoSystem(
    { pwplId: selectedPlant?.pwplId ?? '', vrfyYm },
    enabled,
  );
  const mutation = useSaveKepco();

  // 저장 후 → POST 응답의 kepcoEgqty, 저장 전 → GET 응답의 sysEgqty
  const displayEgqty = mutation.data?.kepcoEgqty ?? systemData?.sysEgqty;

  const handleSave = () => {
    if (!selectedPlant?.pwplId) {
      alert('발전소를 선택해 주세요.');
      return;
    }
    if (!kepcoMeterValue) {
      alert('한전 계량기 값을 입력해 주세요.');
      return;
    }
    mutation.mutate({
      pwplId: selectedPlant.pwplId,
      vrfyYm,
      kepcoEgqty: Number(kepcoMeterValue),
      userId: 'admin',
    });
  };

  return (
    <>
      <div className="title-group">
        <TitleComponent title="전력 거래" subTitle="발전량 검증" desc="발전소 발전량 목록 조회" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {selectedPlant && (
            <span style={{ fontSize: 'var(--font-size-13)', color: 'var(--gray-70)' }}>
              {selectedPlant.pwplNm}
            </span>
          )}
          <ButtonComponent
            onPress={() => setModalOpen(true)}
            variant="contained"
            icon={<Icons iName="link" size={20} color="#fff" />}
          >
            발전소 선택
          </ButtonComponent>
        </div>
      </div>

      <div className="content-group">
        <div className="flex flex-col gap16">
          <KepcoInputCard
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            kepcoMeterValue={kepcoMeterValue}
            onMeterValueChange={setKepcoMeterValue}
            displayEgqty={displayEgqty}
            onSave={handleSave}
            isSaving={mutation.isPending}
          />

          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <MonthlyTable
              listItems={listItems}
              listTotal={listTotal}
              values={values}
              onChangeValues={onChangeValues}
              onRowClicked={handleRowClicked}
            />

            {selectedRow && (
              <DayTable
                selectedRow={selectedRow}
                dayItems={dayItems}
                onClose={() => setSelectedRow(null)}
              />
            )}
          </div>
        </div>

        <BottomGroupComponent
          leftCont={
            <Pagination
              data={{ page: queryState.page, size: pageSize, total: listTotal }}
              onChange={handlePageChange}
            />
          }
          rightCont={
            <ButtonComponent
              variant="excel"
              icon={<Icons iName="download" size={16} color="#fff" />}
              iconPosition="left"
              onPress={() => undefined}
            >
              다운로드
            </ButtonComponent>
          }
        />
      </div>

      <ModalPlantSelectorSingle
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        onApply={(plant) => {
          setSelectedPlant({ pwplId: plant.pwplId, pwplNm: plant.pwplNm });
        }}
      />
    </>
  );
}

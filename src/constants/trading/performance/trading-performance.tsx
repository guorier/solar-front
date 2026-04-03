'use client';

import { useState } from 'react';
import { ButtonComponent, Icons, TitleComponent } from '@/components';
import { ModalPlantSelectorSingle } from '@/constants/dashboard/ModalPlantSelectorSingle';
import { searchConfig, showNumberConfig } from './_constants/config';
import { tradeColumnDefs } from './_constants/columns';
import { toApiDate } from './_utils/format';
import { TradeSummaryPanel } from './_components/TradeSummaryPanel';
import { TradePeriodSearchForm } from './_components/TradePeriodSearchForm';
import { TradeListSection } from './_components/TradeListSection';
import {
  useGetTradeSummary,
  useGetTradePeriodSummary,
  useGetTradeStatusList,
} from '@/services/trading/performance/query';

export function TradingPerformancePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<{ pwplId: string; pwplNm: string } | null>(
    null,
  );
  const [searchValues, setSearchValues] = useState<Record<string, unknown>>({
    tradeDate: '',
    fromDate: '2026-03-01',
    toDate: '2026-03-31',
  });
  const [showNumberValues, setShowNumberValues] = useState<Record<string, unknown>>({
    showNumber: '20',
  });
  const [page, setPage] = useState(1);
  const [appliedParams, setAppliedParams] = useState({
    pwplId: undefined as string | undefined,
    fromDate: '20260301',
    toDate: '20260331',
  });

  const startDate = (searchValues.fromDate as string) ?? '';
  const endDate = (searchValues.toDate as string) ?? '';
  const hasInvalidRange = !!startDate && !!endDate && startDate > endDate;
  const size = Number(showNumberValues.showNumber as string) || 20;
  const enabled = !!appliedParams.pwplId;

  const { data: summary } = useGetTradeSummary(appliedParams, enabled);
  const { data: periodSummary } = useGetTradePeriodSummary(appliedParams, enabled);
  const { data: listData } = useGetTradeStatusList({ ...appliedParams, page, size }, enabled);

  const handleSearchChange = (key: string, value: unknown) => {
    setSearchValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleShowNumberChange = (key: string, value: unknown) => {
    setShowNumberValues((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleSearch = () => {
    if (hasInvalidRange) return;
    setPage(1);
    setAppliedParams({
      pwplId: selectedPlant?.pwplId,
      fromDate: startDate ? toApiDate(startDate) : '',
      toDate: endDate ? toApiDate(endDate) : '',
    });
  };

  return (
    <>
      <div className="title-group">
        <TitleComponent
          title="전력 거래"
          subTitle="거래 현황 및 실적"
          desc="최근 거래 현황 실적 조회"
        />
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

      <div
        className="content-group"
        style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
      >
        <TradeSummaryPanel summary={summary} />

        <TradePeriodSearchForm
          config={searchConfig}
          values={searchValues}
          onChange={handleSearchChange}
          onSearch={handleSearch}
          periodSummary={periodSummary}
        />

        <TradeListSection
          listData={listData}
          columnDefs={tradeColumnDefs}
          showNumberConfig={showNumberConfig}
          showNumberValues={showNumberValues}
          onShowNumberChange={handleShowNumberChange}
          page={page}
          size={size}
          onPageChange={setPage}
        />
      </div>

      <ModalPlantSelectorSingle
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        onApply={(plant) => {
          setSelectedPlant({ pwplId: plant.pwplId, pwplNm: plant.pwplNm });
          setAppliedParams((prev) => ({ ...prev, pwplId: plant.pwplId }));
          setPage(1);
        }}
      />
    </>
  );
}

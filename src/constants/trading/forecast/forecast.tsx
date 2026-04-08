'use client';

import { useState } from 'react';
import {
  SearchForm,
  Tab,
  TableTitleComponent,
  TabList,
  TabPanel,
  Tabs,
  TitleComponent,
} from '@/components';
import { ModalPlantSelectorSingle } from '@/constants/dashboard/ModalPlantSelectorSingle';
import {
  useGetPredictionChart,
  useGetPredictionTrend,
  useGetPredictionAccuracy,
  useGetPredictionSummary,
  useGetPredictionList,
} from '@/services/trading/forecast/query';
import { createSearchConfig } from './_constants/config';
import { columnDefs } from './_constants/columns';
import { useForecastCharts } from './_hooks/use-forecast-charts';
import { SummaryInfoBox } from './_components/SummaryInfoBox';
import { ComparisonTab } from './_components/ComparisonTab';
import { HourlyTab } from './_components/HourlyTab';

function getTodayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function ForecastPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlantId, setSelectedPlantId] = useState<string | undefined>(undefined);

  const [draftSearch, setDraftSearch] = useState<Record<string, unknown>>({
    plantNm: '',
    baseYmd: getTodayStr(),
  });
  const [appliedParams, setAppliedParams] = useState<{ pwplId?: string; baseYmd: string }>({
    pwplId: undefined,
    baseYmd: getTodayStr().replace(/-/g, ''),
  });

  const searchConfig = createSearchConfig(() => setModalOpen(true));

  const handleSearchChange = (key: string, value: unknown) => {
    setDraftSearch((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    const baseYmd = ((draftSearch.baseYmd as string) ?? '').replace(/-/g, '');
    setAppliedParams({ pwplId: selectedPlantId, baseYmd });
  };

  const enabled = !!appliedParams.pwplId;

  const { data: chartData } = useGetPredictionChart(appliedParams, enabled);
  const { data: trendData } = useGetPredictionTrend(appliedParams, enabled);
  const { data: accuracyData } = useGetPredictionAccuracy(appliedParams, enabled);
  const { data: summaryData } = useGetPredictionSummary(appliedParams, enabled);
  const { data: listData } = useGetPredictionList(appliedParams, enabled);

  const { comparisonChartOption, irradianceChartOption } = useForecastCharts(chartData, trendData);

  return (
    <>
      <div className="title-group">
        <TitleComponent
          title="전력 거래"
          subTitle="발전량 예측"
          desc="전력 거래 발전량 예측 비교 분석"
        />
      </div>

      <SearchForm
        config={searchConfig}
        values={draftSearch}
        onChange={handleSearchChange}
        onSearch={handleSearch}
      />

      <SummaryInfoBox summaryData={summaryData} />

      <div className="content-group">
        <Tabs className="tabs">
          <TableTitleComponent
            leftCont={
              <TabList aria-label="발전량 예측">
                <Tab id="comparison">발전량 예측 비교</Tab>
                <Tab id="hourly">시간대별 상세 예측</Tab>
              </TabList>
            }
          />

          <TabPanel id="comparison" style={{ borderTop: 0 }}>
            <ComparisonTab
              accuracyData={accuracyData}
              comparisonChartOption={comparisonChartOption}
              irradianceChartOption={irradianceChartOption}
            />
          </TabPanel>

          <TabPanel id="hourly" style={{ borderTop: 0 }}>
            <HourlyTab listData={listData} columnDefs={columnDefs} />
          </TabPanel>
        </Tabs>
      </div>

      <ModalPlantSelectorSingle
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        onApply={(plant) => {
          setSelectedPlantId(plant.pwplId);
          setDraftSearch((prev) => ({ ...prev, plantNm: plant.pwplNm }));
        }}
      />
    </>
  );
}

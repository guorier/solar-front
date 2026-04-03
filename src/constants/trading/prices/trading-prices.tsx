'use client';

import { useState } from 'react';
import {
  InfoBoxComponent,
  InfoBoxGroup,
  SearchForm,
  Tab,
  TableTitleComponent,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  TitleComponent,
  TopInfoBoxComponent,
} from '@/components';
import { useGetRecSummary, useGetSmpSummary } from '@/services/trading/prices/query';
import { getDefaultDates, searchConfig } from './_constants/config';
import { RecTab } from './_components/rec-tab';
import { SmpTab } from './_components/smp-tab';

export function TradingPricesPage() {
  const [selectedTab, setSelectedTab] = useState<string>('smp');
  const [smpPage, setSmpPage] = useState(1);
  const [recPage, setRecPage] = useState(1);
  const [size, setSize] = useState(20);

  const [searchValues, setSearchValues] = useState<Record<string, unknown>>(() => {
    const { fromDate, toDate } = getDefaultDates();
    return { tradeDate: '', fromDate, toDate };
  });
  const [appliedSearchValues, setAppliedSearchValues] = useState<Record<string, unknown>>(() => {
    const { fromDate, toDate } = getDefaultDates();
    return { tradeDate: '', fromDate, toDate };
  });
  const [values, setValues] = useState<Record<string, unknown>>({ showNumber: '20' });

  const handleSearchChange = (key: string, value: unknown) =>
    setSearchValues((prev) => ({ ...prev, [key]: value }));

  const handleSearch = () => {
    setAppliedSearchValues(searchValues);
    setSmpPage(1);
    setRecPage(1);
  };

  const handleChangeValues = (key: string, value: unknown) => {
    const next = String(value ?? '');
    setValues((prev) => ({ ...prev, [key]: next }));
    if (key === 'showNumber') {
      const nextSize = Number(next);
      if (!Number.isNaN(nextSize) && nextSize > 0) {
        setSize(nextSize);
        setSmpPage(1);
        setRecPage(1);
      }
    }
  };

  const { data: smpSummary } = useGetSmpSummary();
  const { data: recSummary } = useGetRecSummary();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div className="title-group">
        <TitleComponent
          title="SMP/REC 단가"
          subTitle="SMP/REC 단가 조회"
          desc="전력 거래 관리에 SMP/REC 단가 조회"
        />
      </div>

      <SearchForm
        config={searchConfig}
        values={searchValues}
        onChange={handleSearchChange}
        onSearch={handleSearch}
      />

      <TopInfoBoxComponent title="SMP/REC 단가" bg="var(--point-orange-5)" color="#A34600">
        <InfoBoxGroup className="row-type">
          <InfoBoxComponent
            icon="feedback"
            title={`SMP 최근 단가 (${smpSummary?.currTradeDate ?? '-'})`}
            count={smpSummary ? String(smpSummary.currSmp) : '-'}
            unit="원/kWh"
            bg="white"
          />
          <InfoBoxComponent
            icon="feedback"
            title={`REC 최근 단가 (${recSummary?.currDate ?? '-'})`}
            count={recSummary ? recSummary.currPrice.toLocaleString('ko-KR') : '-'}
            unit="원/REC"
            bg="white"
          />
          <InfoBoxComponent
            icon="feedback"
            title={`SMP 전일 단가 (${smpSummary?.prevTradeDate ?? '-'})`}
            count={smpSummary ? String(smpSummary.prevSmp) : '-'}
            unit="원/kWh"
            bg="white"
          />
          <InfoBoxComponent
            icon="feedback"
            title={`REC 전일 단가 (${recSummary?.prevDate ?? '-'})`}
            count={recSummary ? recSummary.prevPrice.toLocaleString('ko-KR') : '-'}
            unit="원/REC"
            bg="white"
          />
        </InfoBoxGroup>
      </TopInfoBoxComponent>

      <Tabs
        className="tabs"
        aria-label="SMP REC 관리"
        selectedKey={selectedTab}
        onSelectionChange={(key) => setSelectedTab(String(key))}
      >
        <TableTitleComponent
          leftCont={
            <TabList aria-label="SMP REC 탭">
              <Tab id="smp">SMP 관리</Tab>
              <Tab id="rec">REC 관리</Tab>
            </TabList>
          }
        />

        <TabPanels aria-label="SMP REC 패널">
          <TabPanel id="smp">
            <SmpTab
              appliedSearchValues={appliedSearchValues}
              page={smpPage}
              size={size}
              values={values}
              onPageChange={setSmpPage}
              onChangeValues={handleChangeValues}
            />
          </TabPanel>

          <TabPanel id="rec">
            <RecTab
              appliedSearchValues={appliedSearchValues}
              page={recPage}
              size={size}
              values={values}
              onPageChange={setRecPage}
              onChangeValues={handleChangeValues}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}

'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import type { CellStyle, ColDef } from 'ag-grid-community';
import {
  AgGridComponent,
  ButtonComponent,
  Icons,
  TitleComponent,
  DatePicker,
  InfoBoxComponent,
  InfoBoxGroup,
  TopInfoBoxComponent,
} from '@/components';
import type { iName } from '@/components/icon/Icons';
import { ModalPlantSelectorSingle } from '@/constants/dashboard/ModalPlantSelectorSingle';

type SummaryMetricItem = {
  icon: iName;
  title: string;
  count: string;
  unit: string;
  tag?: string;
};

type TradeRow = {
  id: string;
  tradeDate: string;
  plantName: string;
  tradeVolume: number;
  smpPrice: number;
  recPrice: number;
  totalRevenue: number;
};

type SearchSummary = {
  totalVolume: string;
  totalRevenue: string;
  averageSmpPrice: string;
  averageRecPrice: string;
};

const TODAY_SUMMARY_ITEMS: readonly SummaryMetricItem[] = [
  { icon: 'energy', title: 'SMP 거래 수량', count: '100,000', unit: 'kWh', tag: 'X개 발전소 선택' },
  {
    icon: 'amount',
    title: 'SMP 예상 매출',
    count: '1,890,000',
    unit: '원',
    tag: '평균 단가 12,020원',
  },
  {
    icon: 'energy',
    title: 'REC 거래 수량',
    count: '1,000',
    unit: 'REC',
    tag: '1 REC = 1 MWh 기준',
  },
  {
    icon: 'amount',
    title: 'REC 예상 매출',
    count: '100,000',
    unit: '원',
    tag: '평균 단가 35,000원/REC',
  },
];

const ACCUMULATED_SUMMARY_ITEMS: readonly SummaryMetricItem[] = [
  { icon: 'energy', title: '누적 SMP 거래량', count: '890,000', unit: 'kWh', tag: '12건의 거래' },
  {
    icon: 'amount',
    title: '누적 SMP 매출',
    count: '9,900,000',
    unit: '원',
    tag: '평균 단가 210원',
  },
  { icon: 'energy', title: '누적 REC 거래량', count: '15', unit: 'REC', tag: '1 REC = 1 MWh 기준' },
  {
    icon: 'amount',
    title: '누적 REC 매출',
    count: '900,000',
    unit: '원',
    tag: '평균 단가 321,000원/REC',
  },
];

const TRADE_ROWS: readonly TradeRow[] = [
  {
    id: 'trade-01',
    tradeDate: '2026-03-31',
    plantName: '와이어블 1호기',
    tradeVolume: 1252,
    smpPrice: 150,
    recPrice: 32,
    totalRevenue: 928921,
  },
  {
    id: 'trade-02',
    tradeDate: '2026-03-30',
    plantName: '와이어블 2호기',
    tradeVolume: 1410,
    smpPrice: 152,
    recPrice: 33,
    totalRevenue: 1002840,
  },
  {
    id: 'trade-03',
    tradeDate: '2026-03-29',
    plantName: '와이어블 1호기',
    tradeVolume: 1180,
    smpPrice: 148,
    recPrice: 30,
    totalRevenue: 875400,
  },
  {
    id: 'trade-04',
    tradeDate: '2026-03-27',
    plantName: '와이어블 3호기',
    tradeVolume: 1340,
    smpPrice: 153,
    recPrice: 31,
    totalRevenue: 1012300,
  },
  {
    id: 'trade-05',
    tradeDate: '2026-03-24',
    plantName: '와이어블 2호기',
    tradeVolume: 1090,
    smpPrice: 145,
    recPrice: 31,
    totalRevenue: 798200,
  },
  {
    id: 'trade-06',
    tradeDate: '2026-03-22',
    plantName: '와이어블 1호기',
    tradeVolume: 1420,
    smpPrice: 155,
    recPrice: 34,
    totalRevenue: 1105600,
  },
  {
    id: 'trade-07',
    tradeDate: '2026-03-18',
    plantName: '와이어블 3호기',
    tradeVolume: 950,
    smpPrice: 147,
    recPrice: 28,
    totalRevenue: 623500,
  },
  {
    id: 'trade-08',
    tradeDate: '2026-03-15',
    plantName: '와이어블 1호기',
    tradeVolume: 890,
    smpPrice: 144,
    recPrice: 27,
    totalRevenue: 581240,
  },
  {
    id: 'trade-09',
    tradeDate: '2026-03-10',
    plantName: '와이어블 2호기',
    tradeVolume: 1045,
    smpPrice: 146,
    recPrice: 29,
    totalRevenue: 694520,
  },
  {
    id: 'trade-10',
    tradeDate: '2026-03-04',
    plantName: '와이어블 4호기',
    tradeVolume: 860,
    smpPrice: 142,
    recPrice: 26,
    totalRevenue: 524860,
  },
];

const EMPTY_SEARCH_SUMMARY: SearchSummary = {
  totalVolume: '0',
  totalRevenue: '0',
  averageSmpPrice: '0',
  averageRecPrice: '0',
};

const panelStyle: CSSProperties = {
  border: '1px solid var(--gray-20)',
  borderRadius: 12,
  background: '#fff',
  padding: 20,
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
};

const panelGridStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
};

const sectionTitleStyle: CSSProperties = {
  fontSize: 'var(--font-size-17)',
  fontWeight: 700,
  color: 'var(--gray-90)',
};

const toolbarStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 16,
  flexWrap: 'wrap',
};

const summaryGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: 8,
};

const gridWrapStyle: CSSProperties = {
  minHeight: 360,
};

const validationTextStyle: CSSProperties = {
  marginBottom: 12,
  fontSize: 'var(--font-size-13)',
  fontWeight: 600,
  color: 'var(--point-pink-60)',
};

const rightAlignCellStyle: CellStyle = {
  justifyContent: 'flex-end',
  textAlign: 'right',
};

function formatNumber(value: number) {
  return value.toLocaleString('ko-KR');
}

function formatCurrency(value: number) {
  return `${formatNumber(value)}`;
}

function buildSearchSummary(rows: TradeRow[]): SearchSummary {
  if (rows.length === 0) {
    return EMPTY_SEARCH_SUMMARY;
  }

  const totalVolume = rows.reduce((sum, row) => sum + row.tradeVolume, 0);
  const totalRevenue = rows.reduce((sum, row) => sum + row.totalRevenue, 0);
  const averageSmpPrice = Math.round(
    rows.reduce((sum, row) => sum + row.smpPrice, 0) / rows.length,
  );
  const averageRecPrice = Math.round(
    rows.reduce((sum, row) => sum + row.recPrice, 0) / rows.length,
  );

  return {
    totalVolume: formatNumber(totalVolume),
    totalRevenue: formatNumber(totalRevenue),
    averageSmpPrice: formatNumber(averageSmpPrice),
    averageRecPrice: formatNumber(averageRecPrice),
  };
}

export default function TradingPerformancePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlantName, setSelectedPlantName] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('2026-03-01');
  const [endDate, setEndDate] = useState('2026-03-31');
  const startMonthInput = startDate.slice(0, 7);
  const endMonthInput = endDate.slice(0, 7);
  const hasInvalidRange = startDate > endDate;
  const [appliedRange, setAppliedRange] = useState({
    startMonth: '2026-03',
    endMonth: '2026-03',
  });

  const filteredRows = useMemo(
    () =>
      TRADE_ROWS.filter((row) => {
        const rowMonth = row.tradeDate.slice(0, 7);
        return rowMonth >= appliedRange.startMonth && rowMonth <= appliedRange.endMonth;
      }),
    [appliedRange.endMonth, appliedRange.startMonth],
  );

  const searchSummary = useMemo(() => buildSearchSummary(filteredRows), [filteredRows]);

  const columnDefs = useMemo<ColDef<TradeRow>[]>(
    () => [
      { field: 'tradeDate', headerName: '거래 일', width: 140 },
      {
        field: 'plantName',
        headerName: '발전소/기지국',
        minWidth: 220,
        flex: 1.3,
        cellRenderer: ({ value }: { value: string }) => value,
      },
      {
        field: 'tradeVolume',
        headerName: '거래량(kWh)',
        minWidth: 150,
        flex: 1,
        cellStyle: rightAlignCellStyle,
        valueFormatter: ({ value }) => `${formatNumber(Number(value ?? 0))} kWh`,
      },
      {
        field: 'smpPrice',
        headerName: 'SMP 단가',
        minWidth: 140,
        flex: 1,
        cellStyle: rightAlignCellStyle,
        valueFormatter: ({ value }) => `${formatNumber(Number(value ?? 0))} 원`,
      },
      {
        field: 'recPrice',
        headerName: 'REC 단가',
        minWidth: 140,
        flex: 1,
        cellStyle: rightAlignCellStyle,
        valueFormatter: ({ value }) => `${formatNumber(Number(value ?? 0))} 원`,
      },
      {
        field: 'totalRevenue',
        headerName: '총 수익',
        minWidth: 180,
        flex: 1.1,
        cellStyle: rightAlignCellStyle,
        valueFormatter: ({ value }) => formatCurrency(Number(value ?? 0)),
      },
    ],
    [],
  );

  const handleSearch = () => {
    if (hasInvalidRange) return;

    setAppliedRange({
      startMonth: startMonthInput,
      endMonth: endMonthInput,
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
          {selectedPlantName && (
            <span style={{ fontSize: 'var(--font-size-13)', color: 'var(--gray-70)' }}>
              {selectedPlantName}
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
        <div style={panelGridStyle}>
          <TopInfoBoxComponent
            title="금일 거래 현황"
            bg="var(--point-orange-5)"
            color="#A34600"
            totalLabel="금일 총 예상 수익"
            totalValue="402,000 원"
          >
            <InfoBoxGroup className="row-type">
              {TODAY_SUMMARY_ITEMS.map((item) => (
                <InfoBoxComponent
                  key={`${item.title}-${item.count}`}
                  icon="feedback"
                  title={item.title}
                  count={item.count}
                  bg="white"
                />
              ))}
            </InfoBoxGroup>
          </TopInfoBoxComponent>
          <TopInfoBoxComponent
            title="누적 거래 실적"
            bg="var(--point-orange-5)"
            color="#A34600"
            totalLabel="누적 총 수익"
            totalValue="1,402,000 원"
          >
            <InfoBoxGroup className="row-type">
              {ACCUMULATED_SUMMARY_ITEMS.map((item) => (
                <InfoBoxComponent
                  key={`${item.title}-${item.count}`}
                  icon="feedback"
                  title={item.title}
                  count={item.count}
                  bg="white"
                />
              ))}
            </InfoBoxGroup>
          </TopInfoBoxComponent>
        </div>

        <section style={panelStyle}>
          <div style={sectionTitleStyle}>최근 거래 내역</div>

          <div style={toolbarStyle}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                minWidth: '465px',
              }}
            >
              <DatePicker
                aria-label="시작일"
                value={startDate}
                onChange={(v: string) => setStartDate(v)}
              />
              <span>~</span>
              <DatePicker
                aria-label="종료일"
                value={endDate}
                onChange={(v: string) => setEndDate(v)}
              />
            </div>

            <ButtonComponent
              variant="contained"
              minWidth={108}
              height={38}
              icon={<Icons iName="search" size={15} color="#fff" />}
              onPress={handleSearch}
              isDisabled={hasInvalidRange}
              style={{ backgroundColor: '#111827', border: '1px solid #111827' }}
            >
              검색
            </ButtonComponent>
          </div>

          {hasInvalidRange ? (
            <div style={validationTextStyle}>기준 시작 월은 종료 월보다 늦을 수 없습니다.</div>
          ) : null}

          <div style={summaryGridStyle}>
            <InfoBoxGroup className="row-type">
              <InfoBoxComponent
                icon="energy"
                title="총 거래량"
                count={searchSummary.totalVolume}
                unit="kWh"
              />
              <InfoBoxComponent
                icon="energy"
                title="총 수익"
                count={searchSummary.totalRevenue}
                unit="원"
              />
              <InfoBoxComponent
                icon="energy"
                title="평균 SMP 단가"
                count={searchSummary.averageSmpPrice}
                unit="원"
              />
              <InfoBoxComponent
                icon="energy"
                title="평균 REC 단가"
                count={searchSummary.averageRecPrice}
                unit="원"
              />
            </InfoBoxGroup>
          </div>

          <div style={gridWrapStyle}>
            <AgGridComponent
              rowData={filteredRows}
              columnDefs={columnDefs}
              emptyText="일치하는 DATA가 없습니다"
            />
          </div>
        </section>
      </div>

      <ModalPlantSelectorSingle
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        onApply={(plant) => {
          setSelectedPlantName(plant.pwplNm);
        }}
      />
    </>
  );
}

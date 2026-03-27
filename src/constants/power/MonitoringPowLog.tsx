// power/MonitoringPowLog.tsx
'use client';

import { CSSProperties, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ButtonComponent,
  Cell,
  Column,
  Row,
  Table,
  TableBody,
  TableHeader,
  TitleComponent,
} from '@/components';
import { Modal } from '@/components/modal/modal.component';
import {
  useGetMonitorPowerHex,
  useGetMonitorPowerInverter,
  useGetMonitorPowerWeather,
} from '@/services/monitoring/power/query';
import type {
  GetMonitorPowerHexItem,
  GetMonitorPowerInverterItem,
  GetMonitorPowerWeatherItem,
} from '@/services/monitoring/power/type';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'react-aria-components';
import './components/MonitoringPowTable.scss';

type MonitoringPowLogProps = {
  id: string;
};

type TabKey = 'inverter' | 'mppt' | 'weather' | 'rtu';
type SortDirection = 'asc' | 'desc';
type RowValue = string | null | undefined;
type LogRow = Record<string, RowValue>;

type LogColumn = {
  key: string;
  label: string;
  width: string;
  isRowHeader?: boolean;
  align?: 'left' | 'right' | 'center';
  isHex?: boolean;
};

const EMPTY_VALUE_LABEL = '-';
const EMPTY_TABLE_LABEL = '표시할 데이터가 없습니다';
const TABLE_BODY_HEIGHT = 'calc(100vh - 230px)';

const baseCellStyle: CSSProperties = {
  paddingRight: '20px',
};

const inverterColumns: LogColumn[] = [
  { key: 'eventRegDt', label: '발생시간', width: '12%', isRowHeader: true },
  { key: 'pwplId', label: '발전소 아이디', width: '10%' },
  { key: 'pwplNm', label: '발전소명', width: '12%' },
  { key: 'macAddr', label: 'MAC 주소', width: '12%' },
  { key: 'gridPowerW', label: '출력전력', width: '8%', align: 'right' },
  { key: 'gridFrequencyHz', label: '계통 주파수 (Hz)', width: '8%', align: 'right' },
  { key: 'gridPowerFactor', label: '역률', width: '7%', align: 'right' },
  { key: 'inverterTempC', label: '인버터 온도 (화씨)', width: '8%', align: 'right' },
  { key: 'inverterTotalEnergy', label: '누적 발전량 (kWh)', width: '9%', align: 'right' },
  { key: 'inverterInsulationKohm', label: '절연 저항 (kΩ)', width: '8%', align: 'right' },
  { key: 'inverterStatus', label: '인버터 상태', width: '8%' },
  { key: 'deviceAddr', label: '장비 구분 코드', width: '7%' },
  { key: 'protocolVersion', label: '프로토콜 버전', width: '8%' },
  { key: 'powerOutageStatus', label: '정전 상태 코드', width: '8%' },
  { key: 'hex', label: 'HEX', width: '18%', isHex: true },
];

const weatherColumns: LogColumn[] = [
  { key: 'eventRegDt', label: '장비 발생 일시', width: '12%', isRowHeader: true },
  { key: 'pwplId', label: '발전소 아이디', width: '10%' },
  { key: 'pwplNm', label: '발전소명', width: '12%' },
  { key: 'macAddr', label: 'RTU 장비 MAC 주소', width: '12%' },
  { key: 'deviceAddr', label: '장비 주소', width: '8%' },
  { key: 'temperatureC', label: '기온 (섭씨)', width: '8%', align: 'right' },
  { key: 'irradianceWm2', label: '일사량 (W/m2)', width: '8%', align: 'right' },
  { key: 'panelTemperatureC', label: '모듈 온도', width: '8%', align: 'right' },
  { key: 'commModel', label: '통신 모델 코드', width: '8%' },
  { key: 'equipmentCode', label: '장비 구분 코드', width: '8%' },
  { key: 'protocolVersion', label: '프로토콜 버전', width: '8%' },
  { key: 'powerOutageStatus', label: '정전 상태 코드', width: '8%' },
];

const hexColumns: LogColumn[] = [
  { key: 'eventRegDt', label: '발생시간', width: '12%', isRowHeader: true },
  { key: 'pwplId', label: '발전소 아이디', width: '10%' },
  { key: 'pwplNm', label: '발전소명', width: '12%' },
  { key: 'macAddr', label: 'MAC 주소', width: '12%' },
  { key: 'gridPowerW', label: '출력전력', width: '8%', align: 'right' },
  { key: 'gridFrequencyHz', label: '계통 주파수 (Hz)', width: '8%', align: 'right' },
  { key: 'gridPowerFactor', label: '역률', width: '7%', align: 'right' },
  { key: 'inverterTempC', label: '인버터 온도 (화씨)', width: '8%', align: 'right' },
  { key: 'inverterTotalEnergy', label: '누적 발전량 (kWh)', width: '9%', align: 'right' },
  { key: 'inverterInsulationKohm', label: '절연 저항 (kΩ)', width: '8%', align: 'right' },
  { key: 'inverterStatus', label: '인버터 상태', width: '8%' },
  { key: 'deviceAddr', label: '장비 구분 코드', width: '7%' },
  { key: 'protocolVersion', label: '프로토콜 버전', width: '8%' },
  { key: 'powerOutageStatus', label: '정전 상태 코드', width: '8%' },
  { key: 'hex', label: 'HEX', width: '18%', isHex: true },
];

const toDisplayValue = (value: RowValue): string => {
  if (value === null || value === undefined || value === '') {
    return EMPTY_VALUE_LABEL;
  }

  return String(value);
};

const normalizeSortValue = (value: RowValue): number | string => {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  const numericValue = Number(value);

  if (Number.isFinite(numericValue) && String(value).trim() !== '') {
    return numericValue;
  }

  return String(value);
};

const formatDisplayTime = (value: RowValue): string => {
  const displayValue = toDisplayValue(value);

  if (displayValue === EMPTY_VALUE_LABEL) {
    return displayValue;
  }

  const matchedValue = displayValue.match(
    /(\d{4})-(\d{1,2})-(\d{1,2})\s+(\d{1,2}):(\d{1,2})(?::\d{1,2})?/,
  );

  if (!matchedValue) {
    return displayValue;
  }

  const [, year, month, day, hour, minute] = matchedValue;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')} ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
};

const mapInverterRows = (items: GetMonitorPowerInverterItem[]): LogRow[] => {
  return items.map((item, index) => ({
    id: `${item.pwplId}-${item.deviceAddr ?? 'device'}-${index}`,
    eventRegDt: item.eventRegDt,
    pwplId: item.pwplId,
    pwplNm: item.pwplNm,
    macAddr: item.macAddr,
    gridPowerW: item.gridPowerW,
    gridFrequencyHz: item.gridFrequencyHz,
    gridPowerFactor: item.gridPowerFactor,
    inverterTempC: item.inverterTempC,
    inverterTotalEnergy: item.inverterTotalEnergy,
    inverterInsulationKohm: item.inverterInsulationKohm,
    inverterStatus: item.inverterStatus,
    deviceAddr: item.deviceAddr,
    protocolVersion: item.protocolVersion,
    powerOutageStatus: item.powerOutageStatus,
    hex: item.hex,
  }));
};

const mapWeatherRows = (items: GetMonitorPowerWeatherItem[]): LogRow[] => {
  return items.map((item, index) => ({
    id: `${item.pwplId}-${item.deviceAddr ?? 'weather'}-${index}`,
    eventRegDt: item.eventRegDt,
    pwplId: item.pwplId,
    pwplNm: item.pwplNm,
    macAddr: item.macAddr,
    deviceAddr: item.deviceAddr,
    temperatureC: item.temperatureC,
    irradianceWm2: item.irradianceWm2,
    panelTemperatureC: item.panelTemperatureC,
    commModel: item.commModel,
    equipmentCode: item.equipmentCode,
    protocolVersion: item.protocolVersion,
    powerOutageStatus: item.powerOutageStatus,
  }));
};

const mapHexRows = (items: GetMonitorPowerHexItem[]): LogRow[] => {
  return items.map((item, index) => ({
    id: `${item.pwplId}-${item.deviceAddr ?? 'hex'}-${index}`,
    eventRegDt: item.eventRegDt,
    pwplId: item.pwplId,
    pwplNm: item.pwplNm,
    macAddr: item.macAddr,
    gridPowerW: item.gridPowerW,
    gridFrequencyHz: item.gridFrequencyHz,
    gridPowerFactor: item.gridPowerFactor,
    inverterTempC: item.inverterTempC,
    inverterTotalEnergy: item.inverterTotalEnergy,
    inverterInsulationKohm: item.inverterInsulationKohm,
    inverterStatus: item.inverterStatus,
    deviceAddr: item.deviceAddr,
    protocolVersion: item.protocolVersion,
    powerOutageStatus: item.powerOutageStatus,
    hex: item.hex,
  }));
};

export default function MonitoringPowLog({ id }: MonitoringPowLogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTab, setSelectedTab] = useState<TabKey>('inverter');
  const [sortKey, setSortKey] = useState<string>('eventRegDt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedHex, setSelectedHex] = useState<string | null>(null);

  const { data: inverterData = [] } = useGetMonitorPowerInverter(
    { pwplId: id },
    selectedTab === 'inverter',
  );
  const { data: weatherData = [] } = useGetMonitorPowerWeather(
    { pwplId: id },
    selectedTab === 'weather',
  );
  const { data: hexData = [] } = useGetMonitorPowerHex({ pwplId: id }, selectedTab === 'rtu');

  const tabConfig = useMemo(() => {
    return {
      inverter: {
        title: '인버터 로그 목록',
        summary: `${inverterData.length}건`,
        columns: inverterColumns,
        rows: mapInverterRows(inverterData),
      },
      mppt: {
        title: 'MPPT 로그 목록',
        summary: '0건',
        columns: [
          { key: 'eventRegDt', label: '발생시간', width: '20%', isRowHeader: true },
          { key: 'pwplId', label: '발전소 아이디', width: '20%' },
          { key: 'pwplNm', label: '발전소명', width: '20%' },
          { key: 'deviceAddr', label: '장비 주소', width: '20%' },
          { key: 'status', label: '상태', width: '20%' },
        ] satisfies LogColumn[],
        rows: [],
      },
      weather: {
        title: '기상센서 로그 목록',
        summary: `${weatherData.length}건`,
        columns: weatherColumns,
        rows: mapWeatherRows(weatherData),
      },
      rtu: {
        title: 'RTU HEX 로그 목록',
        summary: `${hexData.length}건`,
        columns: hexColumns,
        rows: mapHexRows(hexData),
      },
    };
  }, [hexData, inverterData, weatherData]);

  const activeConfig = tabConfig[selectedTab];

  const sortedRows = useMemo(() => {
    const copiedRows = [...activeConfig.rows];

    copiedRows.sort((a, b) => {
      const aValue = normalizeSortValue(a[sortKey]);
      const bValue = normalizeSortValue(b[sortKey]);

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      const comparedValue = String(aValue).localeCompare(String(bValue), 'ko-KR', {
        numeric: true,
        sensitivity: 'base',
      });

      return sortDirection === 'asc' ? comparedValue : -comparedValue;
    });

    return copiedRows;
  }, [activeConfig.rows, sortDirection, sortKey]);

  const subTitle = useMemo(() => {
    const firstRow = sortedRows[0] ?? activeConfig.rows[0];
    const plantName = firstRow ? toDisplayValue(firstRow.pwplNm) : EMPTY_VALUE_LABEL;

    switch (selectedTab) {
      case 'weather':
        return `${plantName} 기상센서 로그`;
      case 'rtu':
        return `${plantName} RTU HEX 로그`;
      case 'mppt':
        return `${plantName} MPPT 로그`;
      default:
        return `${plantName} 인버터 로그`;
    }
  }, [activeConfig.rows, selectedTab, sortedRows]);

  const handleBack = (): void => {
    const backUrl = searchParams.get('backUrl');

    if (backUrl) {
      router.push(decodeURIComponent(backUrl));
      return;
    }

    router.back();
  };

  const handleSort = (nextSortKey: string): void => {
    if (sortKey === nextSortKey) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortKey(nextSortKey);
    setSortDirection('asc');
  };

  const renderSortLabel = (label: string, targetSortKey: string) => {
    const isActive = sortKey === targetSortKey;
    const arrow = isActive ? (sortDirection === 'asc' ? ' ▲' : ' ▼') : '';

    return (
      <button
        type="button"
        onClick={() => handleSort(targetSortKey)}
        style={{
          border: 'none',
          background: 'transparent',
          padding: 0,
          margin: 0,
          font: 'inherit',
          color: 'inherit',
          cursor: 'pointer',
        }}
      >
        {label}
        {arrow}
      </button>
    );
  };

  const renderHeader = (columns: LogColumn[]) => {
    return (
      <TableHeader>
        {columns.map((column) => (
          <Column key={column.key} style={{ width: column.width }} isRowHeader={column.isRowHeader}>
            {renderSortLabel(column.label, column.key)}
          </Column>
        ))}
      </TableHeader>
    );
  };

const renderEmptyBody = (columns: LogColumn[]) => {
  return (
    <TableBody>
      <Row>
        <Cell colSpan={columns.length} style={{ textAlign: 'center', color: '#888' }}>
          {EMPTY_TABLE_LABEL}
        </Cell>
      </Row>
    </TableBody>
  );
};

  const renderHexCell = (value: RowValue) => {
    const displayValue = toDisplayValue(value);

    if (displayValue === EMPTY_VALUE_LABEL) {
      return displayValue;
    }

    return (
      <button
        type="button"
        onClick={() => setSelectedHex(displayValue)}
        style={{
          width: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          textAlign: 'left',
          border: 'none',
          background: 'transparent',
          padding: 0,
          color: '#2563eb',
          cursor: 'pointer',
        }}
        title={displayValue}
      >
        {displayValue}
      </button>
    );
  };

  const renderRowCell = (row: LogRow, column: LogColumn) => {
    const rawValue = row[column.key];

    if (column.isHex) {
      return renderHexCell(rawValue);
    }

    if (column.key === 'eventRegDt') {
      return formatDisplayTime(rawValue);
    }

    return toDisplayValue(rawValue);
  };

  const renderBody = (columns: LogColumn[], rows: LogRow[]) => {
    if (rows.length === 0) {
      return renderEmptyBody(columns);
    }

    return (
      <TableBody>
        {rows.map((row) => (
          <Row key={String(row.id ?? `${row.pwplId}-${row.eventRegDt}`)}>
            {columns.map((column) => {
              const alignStyle =
                column.align === 'right'
                  ? { ...baseCellStyle, textAlign: 'right' as const }
                  : column.align === 'center'
                    ? { textAlign: 'center' as const }
                    : undefined;

              return (
                <Cell key={`${String(row.id)}-${column.key}`} style={alignStyle}>
                  {renderRowCell(row, column)}
                </Cell>
              );
            })}
          </Row>
        ))}
      </TableBody>
    );
  };

  const renderTable = (title: string, summary: string, columns: LogColumn[], rows: LogRow[]) => {
    return (
      <div className="pow-table">
        <div className="pow-head">
          <div className="pow-title">{title}</div>
          <div className="pow-summary">{summary}</div>
        </div>

        <div className="pow-body" style={{ height: TABLE_BODY_HEIGHT }}>
          <Table
            aria-labelledby="monitoring-pow-log-title"
            aria-describedby="monitoring-pow-log-summary"
            style={{ width: '100%', tableLayout: 'fixed' }}
          >
            {renderHeader(columns)}
            {renderBody(columns, rows)}
          </Table>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="title-group">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            width: '100%',
          }}
        >
          <TitleComponent
            title="발전소 모니터링"
            subTitle={subTitle}
            desc="실시간 운영전력 상세 로그를 확인합니다."
          />
          <ButtonComponent onPress={handleBack}>이전으로</ButtonComponent>
        </div>
      </div>

      <Tabs
        aria-label="로그 유형"
        selectedKey={selectedTab}
        onSelectionChange={(key) => {
          const nextTab = String(key) as TabKey;
          setSelectedTab(nextTab);
          setSortKey('eventRegDt');
          setSortDirection('desc');
        }}
      >
        <TabList aria-label="로그 유형" style={{ width: 'fit-content' }}>
          <Tab id="inverter">인버터</Tab>
          <Tab id="mppt">MPPT</Tab>
          <Tab id="weather">기상센서</Tab>
          <Tab id="rtu">RTU HEX</Tab>
        </TabList>

        <TabPanels aria-label="로그 패널">
          <TabPanel id="inverter">
            {renderTable(
              tabConfig.inverter.title,
              tabConfig.inverter.summary,
              tabConfig.inverter.columns,
              sortedRows,
            )}
          </TabPanel>

          <TabPanel id="mppt">
            {renderTable(tabConfig.mppt.title, tabConfig.mppt.summary, tabConfig.mppt.columns, [])}
          </TabPanel>

          <TabPanel id="weather">
            {renderTable(
              tabConfig.weather.title,
              tabConfig.weather.summary,
              tabConfig.weather.columns,
              sortedRows,
            )}
          </TabPanel>

          <TabPanel id="rtu">
            {renderTable(
              tabConfig.rtu.title,
              tabConfig.rtu.summary,
              tabConfig.rtu.columns,
              sortedRows,
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Modal
        isOpen={Boolean(selectedHex)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedHex(null);
          }
        }}
        title="HEX 데이터"
        primaryButton="닫기"
        secondaryButton=""
        width={960}
        onPrimaryPress={() => setSelectedHex(null)}
      >
        <div
          style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            fontFamily: 'monospace',
            fontSize: '13px',
            lineHeight: 1.6,
            paddingBottom: '8px',
          }}
        >
          {selectedHex ?? EMPTY_VALUE_LABEL}
        </div>
      </Modal>
    </>
  );
}

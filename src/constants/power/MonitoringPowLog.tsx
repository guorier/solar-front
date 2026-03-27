// power/MonitoringPowLog.tsx
'use client';

import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ButtonComponent,
  Cell,
  Column,
  DatePicker,
  Row,
  Table,
  TableBody,
  TableHeader,
  TitleComponent,
} from '@/components';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'react-aria-components';
import { getPowerTrendLogList } from './monitoringPowMock';
import { PowerTrendLogRow } from './monitoringPowType';
import './components/MonitoringPowTable.scss';

type MonitoringPowLogProps = {
  id: string;
};

type LogColumn = {
  key: string;
  label: string;
  width: string;
  isRowHeader?: boolean;
};

type LogTableConfig = {
  title: string;
  summary: string;
  columns: LogColumn[];
  rows: PowerTrendLogRow[];
  type: 'inverter' | 'mppt' | 'weather' | 'rtu';
};

type SortDirection = 'asc' | 'desc';

const toFixedTwo = (value: number | string | null | undefined): string => {
  const numericValue = Number(value ?? 0);

  if (!Number.isFinite(numericValue)) {
    return '0.00';
  }

  return numericValue.toFixed(2);
};

const formatPowerUnit = (value: number | string | null | undefined): string => {
  const numericValue = Number(value ?? 0);

  if (!Number.isFinite(numericValue)) {
    return '0.00 W';
  }

  const absoluteValue = Math.abs(numericValue);

  if (absoluteValue > 0) {
    const kiloWattValue = numericValue / 1000;

    if (Number.isInteger(kiloWattValue)) {
      return `${kiloWattValue} kW`;
    }

    return `${toFixedTwo(kiloWattValue)} kW`;
  }

  return `${toFixedTwo(numericValue)} W`;
};

const formatDisplayTime = (value: string): string => {
  const matchedValue = value.match(/(\d{1,2})[./-](\d{1,2})\s+(\d{1,2}):(\d{1,2})(?::\d{1,2})?/);

  if (matchedValue) {
    const [, month, day, hour, minute] = matchedValue;

    return `${month.padStart(2, '0')}.${day.padStart(2, '0')} ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
  }

  return value.replace(/:\d{2}$/, '');
};

const TABLE_BODY_HEIGHT = 'calc(100vh - 230px)';

const inverterColumns: LogColumn[] = [
  { key: 'time', label: '시간', width: '10%', isRowHeader: true },
  { key: 'plantName', label: '발전소', width: '12%' },
  { key: 'inverterName', label: '인버터', width: 'auto' },
  { key: 'logLevel', label: '레벨', width: '8%' },
  { key: 'message', label: '메시지', width: 'auto' },
  { key: 'currentPowerW', label: '현재 발전량', width: '6%' },
  { key: 'previousPowerW', label: '이전 발전량', width: '6%' },
  { key: 'changedPowerW', label: '변동 전력', width: '6%' },
  { key: 'changeRate', label: '변화율', width: '6%' },
  { key: 'temperatureC', label: '온도', width: '6%' },
];

const mpptColumns: LogColumn[] = [
  { key: 'time', label: '시간', width: '10%', isRowHeader: true },
  { key: 'plantName', label: '발전소', width: '12%' },
  { key: 'mppt', label: 'MPPT', width: 'auto' },
  { key: 'logLevel', label: '레벨', width: '8%' },
  { key: 'message', label: '메시지', width: 'auto' },
  { key: 'currentPowerW', label: '현재 발전량', width: '6%' },
  { key: 'previousPowerW', label: '이전 발전량', width: '6%' },
  { key: 'changedPowerW', label: '변동 전력', width: '6%' },
  { key: 'changeRate', label: '변화율', width: '6%' },
  { key: 'temperatureC', label: '온도', width: '6%' },
];

const weatherColumns: LogColumn[] = [
  { key: 'time', label: '시간', width: '10%', isRowHeader: true },
  { key: 'plantName', label: '발전소', width: '12%' },
  { key: 'weather', label: '기상센서', width: 'auto' },
  { key: 'logLevel', label: '레벨', width: '8%' },
  { key: 'message', label: '메시지', width: 'auto' },
  { key: 'currentPowerW', label: '현재 발전량', width: '6%' },
  { key: 'previousPowerW', label: '이전 발전량', width: '6%' },
  { key: 'changedPowerW', label: '변동 전력', width: '6%' },
  { key: 'changeRate', label: '변화율', width: '6%' },
  { key: 'temperatureC', label: '온도', width: '6%' },
];

const rtuColumns: LogColumn[] = [
  { key: 'time', label: '시간', width: '10%', isRowHeader: true },
  { key: 'plantName', label: '발전소', width: '12%' },
  { key: 'weather', label: 'RTU HEX', width: 'auto' },
];

const cellStyle: CSSProperties = {
  paddingRight: '20px',
  textAlign: 'right',
};

export default function MonitoringPowLog({ id }: MonitoringPowLogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rows, setRows] = useState<PowerTrendLogRow[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>('inverter');
  const [rtuStartDate, setRtuStartDate] = useState<string>('');
  const [rtuEndDate, setRtuEndDate] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('time');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const response = await getPowerTrendLogList(id);
      setRows(response);
    };

    void fetchData();
  }, [id]);

  const subTitle = useMemo(() => {
    if (rows.length === 0) {
      return '인버터 로그';
    }

    return `${rows[0].plantName} ${rows[0].inverterName} 로그`;
  }, [rows]);

  const isErrorLog = (logLevel: string): boolean => {
    return ['ERROR', 'ERR', '에러', '오류'].includes(logLevel.toUpperCase());
  };

  const handleBack = (): void => {
    const backUrl = searchParams.get('backUrl');

    if (backUrl) {
      router.push(decodeURIComponent(backUrl));
      return;
    }

    router.back();
  };

  const getSortValue = (item: PowerTrendLogRow, key: string): number | string => {
    const value = item[key as keyof PowerTrendLogRow];

    if (
      key === 'currentPowerW' ||
      key === 'previousPowerW' ||
      key === 'changedPowerW' ||
      key === 'changeRate' ||
      key === 'temperatureC'
    ) {
      return Number(value ?? 0);
    }

    return String(value ?? '');
  };

  const getSortedRows = (tableRows: PowerTrendLogRow[]): PowerTrendLogRow[] => {
    const copiedRows = [...tableRows];

    copiedRows.sort((a, b) => {
      const aValue = getSortValue(a, sortKey);
      const bValue = getSortValue(b, sortKey);

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
  };

  const handleSort = (key: string): void => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortKey(key);
    setSortDirection('asc');
  };

  const renderSortLabel = (label: string, key: string) => {
    const isActive = sortKey === key;
    const arrow = isActive ? (sortDirection === 'asc' ? ' ↑' : ' ↓') : '';

    return (
      <button
        type="button"
        onClick={() => handleSort(key)}
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

  const renderEmptyBody = () => {
    return <TableBody>{[]}</TableBody>;
  };

  const renderInverterBody = (tableRows: PowerTrendLogRow[]) => {
    return (
      <TableBody>
        {tableRows.map((item) => {
          const errorStyle = isErrorLog(item.logLevel) ? { color: '#d70251', fontWeight: 700 } : {};

          return (
            <Row key={item.id}>
              <Cell>{formatDisplayTime(item.time)}</Cell>
              <Cell>{item.plantName}</Cell>
              <Cell>{item.inverterName}</Cell>
              <Cell style={errorStyle}>{item.logLevel}</Cell>
              <Cell style={errorStyle}>{item.message}</Cell>
              <Cell style={cellStyle}>{formatPowerUnit(item.currentPowerW)}</Cell>
              <Cell style={cellStyle}>{formatPowerUnit(item.previousPowerW)}</Cell>
              <Cell style={cellStyle}>{formatPowerUnit(item.changedPowerW)}</Cell>
              <Cell style={cellStyle}>{toFixedTwo(item.changeRate)}%</Cell>
              <Cell style={cellStyle}>{toFixedTwo(item.temperatureC)} ℃</Cell>
            </Row>
          );
        })}
      </TableBody>
    );
  };

  const renderDateSearch = () => {
    return (
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
          value={rtuStartDate}
          onChange={(v: string) => setRtuStartDate(v)}
        />
        <span>~</span>
        <DatePicker
          aria-label="종료일"
          value={rtuEndDate}
          onChange={(v: string) => setRtuEndDate(v)}
        />
      </div>
    );
  };

  const renderTable = ({ title, summary, columns, rows: tableRows, type }: LogTableConfig) => {
    const sortedRows = getSortedRows(tableRows);

    return (
      <div className="pow-table">
        <div className="pow-head">
          {type === 'rtu' ? (
            <>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                <div className="pow-title">{title}</div>
                <div className="pow-summary">{summary}</div>
              </div>
              {renderDateSearch()}
            </>
          ) : (
            <>
              <div className="pow-title">{title}</div>
              <div className="pow-summary">{summary}</div>
            </>
          )}
        </div>

        <div className="pow-body" style={{ height: TABLE_BODY_HEIGHT }}>
          <Table
            aria-labelledby="monitoring-pow-log-title"
            aria-describedby="monitoring-pow-log-summary"
            style={{ width: '100%', tableLayout: 'fixed' }}
          >
            {renderHeader(columns)}
            {type === 'inverter' && sortedRows.length > 0
              ? renderInverterBody(sortedRows)
              : renderEmptyBody()}
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
            desc="실시간 운영 발전 전력에 대한 추이 변화 확인"
          />
          <ButtonComponent onPress={handleBack}>이전으로</ButtonComponent>
        </div>
      </div>

      <Tabs
        aria-label="로그 유형"
        selectedKey={selectedTab}
        onSelectionChange={(key) => setSelectedTab(String(key))}
      >
        <TabList aria-label="로그 유형" style={{ width: 'fit-content' }}>
          <Tab id="inverter">인버터</Tab>
          <Tab id="mppt">MPPT(String)</Tab>
          <Tab id="weather">기상센서</Tab>
          <Tab id="rtu">RTU HEX 데이터</Tab>
        </TabList>

        <TabPanels aria-label="로그 패널">
          <TabPanel id="inverter">
            {renderTable({
              title: '인버터 로그 목록',
              summary: `${rows.length}건`,
              columns: inverterColumns,
              rows,
              type: 'inverter',
            })}
          </TabPanel>

          <TabPanel id="mppt">
            {renderTable({
              title: 'MPPT 로그 목록',
              summary: '0건',
              columns: mpptColumns,
              rows: [],
              type: 'mppt',
            })}
          </TabPanel>

          <TabPanel id="weather">
            {renderTable({
              title: '기상센서 로그 목록',
              summary: '0건',
              columns: weatherColumns,
              rows: [],
              type: 'weather',
            })}
          </TabPanel>

          <TabPanel id="rtu">
            {renderTable({
              title: 'RTU HEX 데이터 로그 목록',
              summary: '0건',
              columns: rtuColumns,
              rows: [],
              type: 'rtu',
            })}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}

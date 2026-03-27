// power/components/MonitoringPowTable.tsx
'use client';

import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Cell, Column, Row, Table, TableBody, TableHeader } from '@/components';
import { PowerTrendRow } from '../monitoringPowType';
import './MonitoringPowTable.scss';

type MonitoringPowTableProps = {
  rows: PowerTrendRow[];
  summaryText: string;
  isLoading: boolean;
  hasMore: boolean;
  onMore: () => void;
};

type SortKey =
  | 'time'
  | 'plantName'
  | 'inverterName'
  | 'currentPowerW'
  | 'previousPowerW'
  | 'dayPowerMWh'
  | 'irradianceWm2'
  | 'temperatureC'
  | 'inverterEfficiency'
  | 'changedPowerW'
  | 'changeRate'
  | 'status';

type SortDirection = 'asc' | 'desc';

const ROW_HEIGHT = 52;
const OVERSCAN = 10;
const COLUMN_COUNT = 13;

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

  if (absoluteValue >= 100) {
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

const getSortValue = (item: PowerTrendRow, sortKey: SortKey): number | string => {
  switch (sortKey) {
    case 'time':
      return item.time;
    case 'plantName':
      return item.plantName;
    case 'inverterName':
      return item.inverterName;
    case 'currentPowerW':
      return Number(item.currentPowerW ?? 0);
    case 'previousPowerW':
      return Number(item.previousPowerW ?? 0);
    case 'dayPowerMWh':
      return Number(item.dayPowerMWh ?? 0);
    case 'irradianceWm2':
      return Number(item.irradianceWm2 ?? 0);
    case 'temperatureC':
      return Number(item.temperatureC ?? 0);
    case 'inverterEfficiency':
      return Number(item.inverterEfficiency ?? 0);
    case 'changedPowerW':
      return Number(item.changedPowerW ?? 0);
    case 'changeRate':
      return Number(item.changeRate ?? 0);
    case 'status':
      return String(item.status ?? '');
    default:
      return '';
  }
};

export default function MonitoringPowTable({
  rows,
  summaryText,
  isLoading,
  hasMore,
  onMore,
}: MonitoringPowTableProps) {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('time');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const sortedRows = useMemo(() => {
    const copiedRows = [...rows];

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
  }, [rows, sortDirection, sortKey]);

  const handleSort = (nextSortKey: SortKey) => {
    if (sortKey === nextSortKey) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortKey(nextSortKey);
    setSortDirection('asc');
  };

  const renderSortLabel = (label: string, targetSortKey: SortKey) => {
    const isActive = sortKey === targetSortKey;
    const arrow = isActive ? (sortDirection === 'asc' ? ' ↑' : ' ↓') : '';

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

  const rowVirtualizer = useVirtualizer({
    count: sortedRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: OVERSCAN,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();

  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? rowVirtualizer.getTotalSize() - virtualRows[virtualRows.length - 1].end
      : 0;

  return (
    <div className="pow-table">
      <div className="pow-head">
        <div className="pow-title">발전소 운영 목록</div>
        <div className="pow-summary">{summaryText}</div>
      </div>

      <div ref={parentRef} className="pow-body">
        <Table aria-labelledby="monitoring-pow-title" aria-describedby="monitoring-pow-summary">
          <TableHeader>
            <Column isRowHeader width={180} minWidth={180}>
              {renderSortLabel('시간', 'time')}
            </Column>
            <Column width={120} minWidth={120}>
              {renderSortLabel('발전소', 'plantName')}
            </Column>
            <Column width={120} minWidth={120}>
              {renderSortLabel('인버터', 'inverterName')}
            </Column>
            <Column width={120} minWidth={120}>
              {renderSortLabel('현재 발전량', 'currentPowerW')}
            </Column>
            <Column width={120} minWidth={120}>
              {renderSortLabel('이전 발전량', 'previousPowerW')}
            </Column>
            <Column width={120} minWidth={120}>
              {renderSortLabel('일 발전량', 'dayPowerMWh')}
            </Column>
            <Column width={100} minWidth={100}>
              {renderSortLabel('일사량', 'irradianceWm2')}
            </Column>
            <Column width={90} minWidth={90}>
              {renderSortLabel('PV 모듈 온도', 'temperatureC')}
            </Column>
            <Column width={120} minWidth={120}>
              {renderSortLabel('인버터 효율', 'inverterEfficiency')}
            </Column>
            <Column width={120} minWidth={120}>
              {renderSortLabel('변동 전력', 'changedPowerW')}
            </Column>
            <Column width={100} minWidth={100}>
              {renderSortLabel('변화율', 'changeRate')}
            </Column>
            <Column width={90} minWidth={90}>
              {renderSortLabel('상태', 'status')}
            </Column>
            <Column width={80} minWidth={80}>
              로그
            </Column>
          </TableHeader>

          <TableBody>
            {paddingTop > 0 && (
              <Row>
                <Cell>
                  <div style={{ height: `${paddingTop}px` }} />
                </Cell>
                {Array.from({ length: COLUMN_COUNT - 1 }).map((_, index) => (
                  <Cell key={`top-space-${index}`} />
                ))}
              </Row>
            )}

            {virtualRows.map((virtualRow) => {
              const item = sortedRows[virtualRow.index];

              return (
                <Row key={`${item.id}-${item.time}`}>
                  <Cell>{formatDisplayTime(item.time)}</Cell>
                  <Cell>{item.plantName}</Cell>
                  <Cell>{item.inverterName}</Cell>
                  <Cell style={{ paddingRight: '20px', textAlign: 'right' }}>
                    {formatPowerUnit(item.currentPowerW)}
                  </Cell>
                  <Cell style={{ paddingRight: '20px', textAlign: 'right' }}>
                    {formatPowerUnit(item.previousPowerW)}
                  </Cell>
                  <Cell style={{ paddingRight: '20px', textAlign: 'right' }}>
                    {toFixedTwo(item.dayPowerMWh)} MWh
                  </Cell>
                  <Cell style={{ paddingRight: '20px', textAlign: 'right' }}>
                    {toFixedTwo(item.irradianceWm2)} W/m²
                  </Cell>
                  <Cell style={{ paddingRight: '20px', textAlign: 'right' }}>
                    {toFixedTwo(item.temperatureC)} ℃
                  </Cell>
                  <Cell style={{ paddingRight: '20px', textAlign: 'right' }}>
                    {toFixedTwo(item.inverterEfficiency)}%
                  </Cell>
                  <Cell style={{ paddingRight: '20px', textAlign: 'right' }}>
                    <span
                      className={
                        item.changedPowerW > 0
                          ? 'pow-num pow-num--up'
                          : item.changedPowerW < 0
                            ? 'pow-num pow-num--down'
                            : 'pow-num'
                      }
                    >
                      {item.changedPowerW > 0 ? '+' : ''}
                      {formatPowerUnit(item.changedPowerW)}
                      {item.changedPowerW > 0 ? (
                        <span className="pow-arrow pow-arrow--up">↑</span>
                      ) : item.changedPowerW < 0 ? (
                        <span className="pow-arrow pow-arrow--down">↓</span>
                      ) : null}
                    </span>
                  </Cell>
                  <Cell style={{ paddingRight: '20px', textAlign: 'right' }}>
                    {toFixedTwo(item.changeRate)}%
                  </Cell>
                  <Cell>{String(item.status ?? '-')}</Cell>
                  <Cell>
                    <Link href={`/monitoring/power/${item.id}`} className="pow-link">
                      상세
                    </Link>
                  </Cell>
                </Row>
              );
            })}

            {paddingBottom > 0 && (
              <Row>
                <Cell>
                  <div style={{ height: `${paddingBottom}px` }} />
                </Cell>
                {Array.from({ length: COLUMN_COUNT - 1 }).map((_, index) => (
                  <Cell key={`bottom-space-${index}`} />
                ))}
              </Row>
            )}
          </TableBody>
        </Table>

        {!isLoading && sortedRows.length === 0 && (
          <div className="pow-empty">일치하는 DATA가 없습니다</div>
        )}
      </div>

      <div className="pow-foot">
        {hasMore ? (
          <button type="button" className="pow-more" onClick={onMore}>
            <span className="pow-more__text">더보기</span>
            <span className="pow-more__count">20건 추가</span>
          </button>
        ) : (
          <span className="pow-last">마지막 데이터입니다</span>
        )}
      </div>
    </div>
  );
}

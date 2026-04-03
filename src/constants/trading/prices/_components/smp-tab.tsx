'use client';

import {
  AgGridComponent,
  CountArea,
  Pagination,
  SearchFields,
  TableTitleComponent,
} from '@/components';
import { useGetSmpChart, useGetSmpList } from '@/services/trading/prices/query';
import { SmpLineChart } from './smp-line-chart';
import { smpColumnDefs } from '../_constants/columns';
import { showNumberConfig } from '../_constants/config';

type Props = {
  appliedSearchValues: Record<string, unknown>;
  page: number;
  size: number;
  values: Record<string, unknown>;
  onPageChange: (page: number) => void;
  onChangeValues: (key: string, value: unknown) => void;
};

export function SmpTab({
  appliedSearchValues,
  page,
  size,
  values,
  onPageChange,
  onChangeValues,
}: Props) {
  const fromDate = String(appliedSearchValues.fromDate ?? '');
  const toDate = String(appliedSearchValues.toDate ?? '');
  const tradeDate = appliedSearchValues.tradeDate
    ? String(appliedSearchValues.tradeDate)
    : undefined;

  const { data: chartData = [] } = useGetSmpChart({ fromDate, toDate });
  const { data: listData, isFetching } = useGetSmpList({ tradeDate, fromDate, toDate, page, size });

  const items = listData?.items ?? [];
  const total = listData?.total ?? 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <SmpLineChart data={chartData} />

      <div className="table-group">
        <TableTitleComponent
          leftCont={<CountArea search={items.length} total={total} />}
          rightCont={
            <SearchFields config={showNumberConfig} values={values} onChange={onChangeValues} />
          }
        />
        <AgGridComponent
          rowData={items as Record<string, unknown>[]}
          columnDefs={smpColumnDefs}
          loading={isFetching}
        />
      </div>
      <Pagination data={{ page, size, total }} onChange={onPageChange} />
    </div>
  );
}

'use client';

import {
  AgGridComponent,
  CountArea,
  Pagination,
  SearchFields,
  TableTitleComponent,
  BottomGroupComponent,
} from '@/components';
import { useGetRecChart, useGetRecList } from '@/services/trading/prices/query';
import { RecBarChart } from './rec-bar-chart';
import { recColumnDefs } from '../_constants/columns';
import { showNumberConfig } from '../_constants/config';

type Props = {
  appliedSearchValues: Record<string, unknown>;
  page: number;
  size: number;
  values: Record<string, unknown>;
  onPageChange: (page: number) => void;
  onChangeValues: (key: string, value: unknown) => void;
};

export function RecTab({
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

  const { data: chartData = [] } = useGetRecChart({ fromDate, toDate });
  const { data: listData, isFetching } = useGetRecList({ tradeDate, fromDate, toDate, page, size });

  const items = listData?.items ?? [];
  const total = listData?.total ?? 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px' }}>
      <RecBarChart data={chartData} />

      <div className="table-group" style={{ height: '400px' }}>
        <TableTitleComponent
          leftCont={<CountArea search={items.length} total={total} />}
          rightCont={
            <SearchFields config={showNumberConfig} values={values} onChange={onChangeValues} />
          }
        />
        <AgGridComponent
          rowData={items as Record<string, unknown>[]}
          columnDefs={recColumnDefs}
          loading={isFetching}
        />
      </div>

      <BottomGroupComponent
        centerCont={<Pagination data={{ page, size, total }} onChange={onPageChange} />}
      />
    </div>
  );
}

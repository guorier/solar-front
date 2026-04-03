import {
  AgGridComponent,
  CountArea,
  Pagination,
  SearchFields,
  TableTitleComponent,
} from '@/components';
import type { SearchFieldConfig } from '@/components';
import type { ColDef } from 'ag-grid-community';
import type { TradeStatusListItem, TradeStatusListRes } from '@/services/trading/performance/type';

interface TradeListSectionProps {
  listData?: TradeStatusListRes;
  columnDefs: ColDef<TradeStatusListItem>[];
  showNumberConfig: (SearchFieldConfig | SearchFieldConfig[])[];
  showNumberValues: Record<string, unknown>;
  onShowNumberChange: (key: string, value: unknown) => void;
  page: number;
  size: number;
  onPageChange: (page: number) => void;
}

export function TradeListSection({
  listData,
  columnDefs,
  showNumberConfig,
  showNumberValues,
  onShowNumberChange,
  page,
  size,
  onPageChange,
}: TradeListSectionProps) {
  return (
    <>
      <TableTitleComponent
        leftCont={<CountArea search={listData?.items.length ?? 0} total={listData?.total ?? 0} />}
        rightCont={
          <SearchFields
            config={showNumberConfig}
            values={showNumberValues}
            onChange={onShowNumberChange}
          />
        }
      />
      <AgGridComponent
        rowData={listData?.items ?? []}
        columnDefs={columnDefs}
        emptyText="일치하는 DATA가 없습니다"
      />
      <Pagination data={{ page, size, total: listData?.total ?? 0 }} onChange={onPageChange} />
    </>
  );
}

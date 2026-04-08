import type { RowClickedEvent } from 'ag-grid-community';
import { AgGridComponent, CountArea, SearchFields, TableTitleComponent } from '@/components';
import type { KepcoListItem } from '@/services/trading/verification/type';
import { showNumberConfig } from '../_constants/config';
import { monthlyColumnDefs } from '../_constants/columns';
import { tableWrapStyle } from '../_constants/styles';

interface MonthlyTableProps {
  listItems: KepcoListItem[];
  listTotal: number;
  values: Record<string, unknown>;
  onChangeValues: (key: string, value: unknown) => void;
  onRowClicked: (event: RowClickedEvent<KepcoListItem>) => void;
}

export function MonthlyTable({
  listItems,
  listTotal,
  values,
  onChangeValues,
  onRowClicked,
}: MonthlyTableProps) {
  return (
    <div style={{ flex: 1, minWidth: 0 }} className="table-group">
      <TableTitleComponent
        leftCont={<CountArea search={listItems.length} total={listTotal} />}
        rightCont={
          <SearchFields config={showNumberConfig} values={values} onChange={onChangeValues} />
        }
      />
      <div style={tableWrapStyle}>
        <AgGridComponent
          rowData={listItems}
          columnDefs={monthlyColumnDefs}
          onRowClicked={onRowClicked}
        />
      </div>
    </div>
  );
}

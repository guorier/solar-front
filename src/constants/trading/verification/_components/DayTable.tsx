import { AgGridComponent, ButtonComponent, Icons, TableTitleComponent } from '@/components';
import type { KepcoListItem, KepcoDayItem } from '@/services/trading/verification/type';
import { dayColumnDefs } from '../_constants/columns';
import { dayTableWrapStyle } from '../_constants/styles';

interface DayTableProps {
  selectedRow: KepcoListItem;
  dayItems: KepcoDayItem[];
  onClose: () => void;
}

export function DayTable({ selectedRow, dayItems, onClose }: DayTableProps) {
  return (
    <div style={{ width: 420, flexShrink: 0, marginTop: '10px' }} className="table-group">
      <TableTitleComponent
        leftCont={
          <strong style={{ fontSize: 'var(--font-size-15)' }}>
            {selectedRow.vrfyYmText} 일별 발전량
          </strong>
        }
        rightCont={
          <ButtonComponent variant="none" onPress={onClose}>
            <Icons iName="del" size={32} color="#666" />
          </ButtonComponent>
        }
      />
      <div style={dayTableWrapStyle}>
        <AgGridComponent rowData={dayItems} columnDefs={dayColumnDefs} isPagination={false} />
      </div>
    </div>
  );
}

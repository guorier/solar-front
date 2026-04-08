import { Cell, Column, Label, Modal, Row, Table, TableBody, TableHeader } from '@/components';
import { ResizableTableContainer } from 'react-aria-components';
import { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';

const chartData = {
  categories: ['1월', '2월', '3월', '4월', '5월', '6월'],
  series: [
    {
      name: '서울 발전소',
      data: [120, 132, 101, 134, 90, 230],
    },
    {
      name: '부산 발전소',
      data: [220, 182, 191, 234, 290, 330],
    },
  ],
};

const option1: EChartsOption = {
  tooltip: {
    trigger: 'axis',
  },

  legend: {
    bottom: 0,
  },

  grid: {
    top: '5%',
    left: '1%',
    right: '1%',
    bottom: '10%',
    containLabel: true,
  },

  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: chartData.categories,
  },

  yAxis: {
    type: 'value',
  },

  series: chartData.series.map((item) => ({
    name: item.name,
    type: 'line',
    data: item.data,
    areaStyle: {},
  })),
};

export default function CumulativeRevenueModal({
  isOpen,
  onOpen,
}: {
  isOpen: boolean;
  onOpen: () => void;
}) {
  return (
    <Modal
      title="계약 시작 이후 누적 매출"
      isOpen={isOpen}
      onOpenChange={onOpen}
      primaryButton="닫기"
      secondaryButton=""
    >
      <ResizableTableContainer>
        <Table type="vertical" aria-labelledby="table-title" aria-describedby="table-summary">
          <TableHeader>
            <Column isRowHeader width={200} />
            <Column />
          </TableHeader>
          <TableBody>
            <Row>
              <Cell>
                <Label>계약 이후 총 누적 매출</Label>
              </Cell>
              <Cell>85,000,000</Cell>
            </Row>
            <Row>
              <Cell>
                <Label>계약 기간</Label>
              </Cell>
              <Cell>2024-01 ~ 2027-01</Cell>
            </Row>
          </TableBody>
        </Table>
      </ResizableTableContainer>

      <div style={{ width: '100%', height: 400 }}>
        <ReactECharts option={option1} style={{ width: '100%', height: '100%' }} />
      </div>
    </Modal>
  );
}

'use client';

import {
  AgGridComponent,
  ButtonComponent,
  Cell,
  Column,
  Icons,
  Label,
  Row,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableHeader,
  TableTitleComponent,
  TitleComponent,
} from '@/components';
import { Group, ResizableTableContainer } from 'react-aria-components';
import { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import { PERFORMANCE_COLUMN, PERFORMANCE_ROW_DATA } from '@/constants/analysis/sale/performance';
import { useState } from 'react';
import CumulativeRevenueModal from './_components/cumulativeRevenue';

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
  title: {
    text: '월별 SMP/REC 매출 추이',
    left: 'left',
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    bottom: 0,
  },
  grid: {
    top: '18%',
    left: '1%',
    right: '1%',
    bottom: '10%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    boundaryGap: true,
    data: chartData.categories,
  },
  yAxis: {
    type: 'value',
  },
  series: chartData.series.map((item, index) => ({
    name: item.name,
    type: index === 0 ? 'bar' : 'line',
    data: item.data,
  })),
};

const option2: EChartsOption = {
  title: {
    text: '평균 실현단가 추이',
    left: 'left',
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    bottom: 0,
  },
  grid: {
    top: '18%',
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
  })),
};

export default function PerformancePage() {
  const [isRevenueOpen, setIsRevenueOpen] = useState<boolean>(false);

  return (
    <>
      <div className="title-group">
        <TitleComponent
          title="분석 관리"
          subTitle="판매 분석"
          thirdTitle="계별 성광 분석"
          desc="거래/정산 수익 데이터 기반 운영 분석 및 판매 분석"
        />
      </div>

      <div className="content-group" style={{ paddingTop: 'var(--spacing-10)' }}>
        <TableTitleComponent
          leftCont={<h3>계약별 성과/수익성 분석</h3>}
          rightCont={
            <>
              <Select style={{ minWidth: '200px' }} aria-label="발전소 선택">
                <SelectItem>와이어블 1호기</SelectItem>
                <SelectItem>와이어블 2호기</SelectItem>
              </Select>
              <ButtonComponent
                minWidth={100}
                icon={<Icons iName="download" color="white" size={12} />}
              >
                리포트
              </ButtonComponent>
            </>
          }
        />

        <div>
          <TableTitleComponent leftCont={<h4>계약 기본 정보</h4>} />
          <ResizableTableContainer>
            <Table type="vertical" aria-labelledby="table-title" aria-describedby="table-summary">
              <TableHeader>
                <Column isRowHeader width={140} />
                <Column />
                <Column isRowHeader width={140} />
                <Column />
                <Column isRowHeader width={140} />
                <Column />
                <Column isRowHeader width={140} />
                <Column />
              </TableHeader>
              <TableBody>
                <Row>
                  <Cell>
                    <Label>계약 번호</Label>
                  </Cell>
                  <Cell>CNT-2024-001</Cell>
                  <Cell>
                    <Label>발전소</Label>
                  </Cell>
                  <Cell>와이어블 1호기</Cell>
                  <Cell>
                    <Label>계약 유형</Label>
                  </Cell>
                  <Cell>고정가격 정기</Cell>
                  <Cell>
                    <Label>상태</Label>
                  </Cell>
                  <Cell>진행중</Cell>
                </Row>

                <Row>
                  <Cell>
                    <Label>계약 시작일</Label>
                  </Cell>
                  <Cell>2024-01</Cell>
                  <Cell>
                    <Label>계약 종료일</Label>
                  </Cell>
                  <Cell>2027-01</Cell>
                  <Cell>
                    <Label>누적 매출</Label>
                  </Cell>
                  <Cell>83,382,922원</Cell>
                  <Cell>
                    <Label>월 평균 매출</Label>
                  </Cell>
                  <Cell>7,212,927원</Cell>
                </Row>
              </TableBody>
            </Table>
          </ResizableTableContainer>
        </div>

        <Group>
          <div style={{ width: '100%', height: 400 }}>
            <ReactECharts option={option1} style={{ width: '100%', height: '100%' }} />
          </div>
          <div style={{ width: '100%', height: 400 }}>
            <ReactECharts option={option2} style={{ width: '100%', height: '100%' }} />
          </div>
        </Group>

        <div>
          <TableTitleComponent
            leftCont={<h4>월별 상세 성과</h4>}
            rightCont={
              <ButtonComponent
                icon={<Icons iName="thunder" color="white" size={12} />}
                onClick={() => setIsRevenueOpen(true)}
              >
                누적매출
              </ButtonComponent>
            }
          />
          <AgGridComponent rowData={PERFORMANCE_ROW_DATA} columnDefs={PERFORMANCE_COLUMN} />
        </div>
      </div>

      <CumulativeRevenueModal
        isOpen={isRevenueOpen}
        onOpen={() => setIsRevenueOpen((prev) => !prev)}
      />
    </>
  );
}

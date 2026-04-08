'use client';

import {
  AgGridComponent,
  ButtonComponent,
  Label,
  Select,
  SelectItem,
  TableTitleComponent,
  TitleComponent,
} from '@/components';
import Icons from '@/components/icon/Icons';
import { useState } from 'react';
import { Group } from 'react-aria-components';
import styled from 'styled-components';
import KPIManagementForm from './_components/managementForm';
import {
  OPERATION_KPI_MANAGEMENT_COLUMN,
  OPERATION_KPI_MANAGEMENT_ROW_DATA,
} from '@/constants/operation/kpi-management';
import { SummaryCard, SummaryCardItem, SummarySection } from '../_components';

const ListWrap = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: var(--radius);
  border: 1px solid var(--border-color);
  background: var(--gray-A100);
`;

const ListHeader = styled(Group)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-10);
  padding: var(--spacing-10) var(--spacing-15);
`;

const HeaderGroup = styled(Group)`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--spacing-15);
  width: 100%;
`;

const FilterItem = styled(Group)`
  display: flex;
  align-items: center;
  gap: var(--spacing-10);
`;

const StyledLabel = styled(Label)`
  margin: 0;
  width: fit-content;
  white-space: nowrap;
`;

const Row = ({ label, value, color }: { label: string; value: string; color?: string }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <p style={{ color }}>{label}</p>
    <p>{value}</p>
  </div>
);

const CARD_ITEMS: SummaryCardItem[] = [
  {
    title: '총 KPI 수',
    value: '7',
    description: '활성화: 7개',
    icon: 'dust',
  },
  {
    title: '정상',
    value: '5',
    description: '정상: 5개',
    icon: 'check',
    valueColor: 'var(--normal)',
  },
  {
    title: '주의',
    value: '2',
    description: '개선 검토 필요',
    icon: 'delete',
    valueColor: 'var(--minor)',
  },
  {
    title: '위험',
    value: '0',
    description: '즉시 조치 필요',
    icon: 'delete',
    valueColor: 'var(--critical)',
  },
];

const CARD_ITEMS2: SummaryCardItem[] = [
  {
    title: 'PV',
    description: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
        <Row label="총 KPI" value="7개" />
        <Row label="정상" value="6개" color="green" />
        <Row label="경고" value="1개" color="orange" />
        <Row label="위험" value="0개" color="red" />
      </div>
    ),
  },
  {
    title: 'VCB',
    description: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
        <Row label="총 KPI" value="7개" />
        <Row label="정상" value="6개" color="green" />
        <Row label="경고" value="1개" color="orange" />
        <Row label="위험" value="0개" color="red" />
      </div>
    ),
  },
  {
    title: '계전기',
    description: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
        <Row label="총 KPI" value="7개" />
        <Row label="정상" value="6개" color="green" />
        <Row label="경고" value="1개" color="orange" />
        <Row label="위험" value="0개" color="red" />
      </div>
    ),
  },
  {
    title: '-',
    description: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
        <Row label="총 KPI" value="7개" />
        <Row label="정상" value="6개" color="green" />
        <Row label="경고" value="1개" color="orange" />
        <Row label="위험" value="0개" color="red" />
      </div>
    ),
  },
];

export default function KpiManagementPage() {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  return (
    <>
      <div className="title-group">
        <TitleComponent
          title="운영 관리"
          subTitle="발전 장비 성능 지표 설정"
          desc="발전소 운영 효율성 및 현장 장비 핵심 성과지표 통합 관리"
        />
      </div>

      <div className="content-group" style={{ paddingTop: 'var(--spacing-10)' }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-10)' }}>
          <SummarySection title="운영 현황" noWrap>
            {CARD_ITEMS.map((item) => (
              <SummaryCard
                key={item.title}
                title={item.title}
                value={item.value}
                description={item.description}
                icon={item.icon}
                footer={item.footer}
                valueColor={item.valueColor}
              />
            ))}
          </SummarySection>
          <SummarySection title="카테고리별 성과 요약" noWrap fitContent>
            {CARD_ITEMS2.map((item) => (
              <SummaryCard
                key={item.title}
                title={item.title}
                value={item.value}
                description={item.description}
                icon={item.icon}
                footer={item.footer}
                valueColor={item.valueColor}
              />
            ))}
          </SummarySection>
        </div>

        <TableTitleComponent leftCont={<h3>성능 지표 관리</h3>} />

        <ListWrap>
          <ListHeader>
            <HeaderGroup>
              <FilterItem>
                <StyledLabel>발전소</StyledLabel>
                <Select aria-label="발전소 선택">
                  <SelectItem id="plant1">발전소 1</SelectItem>
                  <SelectItem id="plant2">발전소 2</SelectItem>
                </Select>
              </FilterItem>

              <FilterItem>
                <StyledLabel>장비</StyledLabel>
                <Select aria-label="장비 선택">
                  <SelectItem id="type1">장비 1</SelectItem>
                  <SelectItem id="type2">장비 2</SelectItem>
                </Select>
              </FilterItem>

              <FilterItem>
                <StyledLabel>상태</StyledLabel>
                <Select aria-label="상태 선택">
                  <SelectItem id="Y">사용</SelectItem>
                  <SelectItem id="N">미사용</SelectItem>
                </Select>
              </FilterItem>
            </HeaderGroup>

            <ButtonComponent
              icon={<Icons iName="plus" color="white" />}
              onClick={() => setIsFormOpen(true)}
            >
              지표 추가
            </ButtonComponent>
          </ListHeader>

          <div style={{ height: 640 }}>
            <AgGridComponent
              rowData={OPERATION_KPI_MANAGEMENT_ROW_DATA}
              columnDefs={OPERATION_KPI_MANAGEMENT_COLUMN}
              onRowClicked={() => setIsFormOpen(true)}
            />
          </div>
        </ListWrap>
      </div>

      <KPIManagementForm isOpen={isFormOpen} onOpen={() => setIsFormOpen((prev) => !prev)} />
    </>
  );
}

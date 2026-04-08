'use client';

import {
  ButtonComponent,
  Icons,
  Label,
  Meter,
  Select,
  SelectItem,
  TableTitleComponent,
  TitleComponent,
} from '@/components';
import { useState } from 'react';
import KPISetupForm from './_components/setupForm';
import { SummaryCard, SummaryCardItem, SummarySection } from '../_components';
import { ListCard, ListCardItem } from './_components/listCard';
import styled from 'styled-components';
import { Group } from 'react-aria-components';

const ListWrap = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: var(--radius);
  border: 1px solid var(--border-color);
  background: var(--gray-A100);
  height: 750px;
  min-height: 0;
`;

const ListHeader = styled(Group)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-10);
  padding: var(--spacing-10) var(--spacing-15);
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
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

const ListBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-10);
  padding: var(--spacing-10) var(--spacing-15);
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`;

const KPI_LIST: ListCardItem[] = Array.from({ length: 8 }, () => ({
  id: 'warning',
  title: '일간 발전량',
  desc: '발전 성능: 와이어블 1호기 / 일간',
  status: '양호',
  progress: 98,
  currentValue: '현재: 5,120kWh',
}));

const CARD_ITEMS: SummaryCardItem[] = [
  {
    title: '총 성능 지표',
    value: '7',
    description: '활성화: 7개',
    icon: 'dust',
  },
  {
    title: '목표 달성률',
    value: '88.2%',
    description: '평균 달성률',
    icon: 'power',
    valueColor: 'var(--normal)',
  },
  {
    title: '주의 상태',
    value: '2',
    description: '주의 필요 지표',
    icon: 'delete',
    valueColor: 'var(--critical)',
  },
  {
    title: '정상 상태',
    value: '4',
    description: '정상 운영 지표',
    icon: 'check',
    valueColor: 'var(--normal)',
  },
];

const CARD_ITEMS2: SummaryCardItem[] = [
  {
    title: '발전 성능',
    value: '75%',
    footer: <Meter aria-label="발전 성능" value={75} />,
  },
  {
    title: '운용 효율',
    value: '98%',
    footer: <Meter aria-label="운용 효율" value={98} />,
  },
];

export default function KpiSetupPage() {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  return (
    <>
      <div className="title-group">
        <TitleComponent
          title="운영 관리"
          subTitle="발전 운영 성능 지표 설정"
          desc="성능 지표 설정, 사용자 관리 및 시스템 운영 전반을 관리"
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
                <StyledLabel>카테고리</StyledLabel>
                <Select aria-label="카테고리 선택">
                  <SelectItem id="type1">카테고리 1</SelectItem>
                  <SelectItem id="type2">카테고리 2</SelectItem>
                </Select>
              </FilterItem>

              <FilterItem>
                <StyledLabel>사용 여부</StyledLabel>
                <Select aria-label="사용 여부 선택">
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

          <ListBody>
            {KPI_LIST.map((item, idx) => (
              <ListCard
                key={`${item.title}-${idx}`}
                onClick={() => setIsFormOpen(true)}
                {...item}
              />
            ))}
          </ListBody>
        </ListWrap>
      </div>

      <KPISetupForm isOpen={isFormOpen} onOpen={() => setIsFormOpen((prev) => !prev)} />
    </>
  );
}

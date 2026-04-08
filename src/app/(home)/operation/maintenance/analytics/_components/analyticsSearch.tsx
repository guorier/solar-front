import { ButtonComponent, DatePicker, Label, Select, SelectItem } from '@/components';
import { Group } from 'react-aria-components';
import styled from 'styled-components';

const SearchFormGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-10) var(--spacing-15);
  border-radius: var(--radius);
  border: 1px solid var(--border-color);
  background: var(--gray-A100);
`;

const SearchGrid = styled(Group)`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--spacing-15);
  width: 100%;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const ButtonGroup = styled(Group)`
  flex: none;
  padding-left: var(--spacing-16);
  border-left: 1px solid var(--border-color);
`;

type SearchValues = {
  searchType: string;
  valueType: string;
  start: string;
  end: string;
};

export default function AnalyticsSearch({
  searchValues,
  onSearchChange,
  onSearch,
}: {
  searchValues: SearchValues;
  onSearchChange: (key: keyof SearchValues, value: string | number) => void;
  onSearch: () => void;
}) {
  return (
    <SearchFormGroup>
      <SearchGrid>
        <FieldGroup>
          <Label>검색 영역</Label>

          <Group>
            <Select
              aria-label="검색 유형 선택"
              onChange={(key) => onSearchChange('searchType', String(key))}
            >
              <SelectItem id="plantName">발전소</SelectItem>
              <SelectItem id="deviceName">장치</SelectItem>
              <SelectItem id="alarmCount">알림</SelectItem>
              <SelectItem id="dispatchCount">출동</SelectItem>
            </Select>

            <Select
              aria-label="값 유형 선택"
              onChange={(key) => onSearchChange('valueType', String(key))}
            >
              <SelectItem id="generation">발전량</SelectItem>
              <SelectItem id="operationTime">가동시간</SelectItem>
              <SelectItem id="loss">손실</SelectItem>
              <SelectItem id="lossRate">손실률</SelectItem>
            </Select>
          </Group>
        </FieldGroup>

        <FieldGroup>
          <Label style={{ marginBottom: 'var(--spacing-6)' }} className="imp">
            기간
          </Label>

          <Group style={{ alignItems: 'center', gap: 'var(--spacing-4)' }}>
            <DatePicker
              value={searchValues.start}
              onChange={(value) => onSearchChange('start', String(value))}
              aria-label="시작일 선택"
            />

            <span>-</span>

            <DatePicker
              value={searchValues.end}
              onChange={(value) => onSearchChange('end', String(value))}
              aria-label="종료일 선택"
            />
          </Group>
        </FieldGroup>
      </SearchGrid>

      <ButtonGroup>
        <ButtonComponent onClick={onSearch}>검색</ButtonComponent>
      </ButtonGroup>
    </SearchFormGroup>
  );
}

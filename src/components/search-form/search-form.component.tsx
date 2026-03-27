'use client';

import React from 'react';
import { Group } from 'react-aria-components';
import styled from 'styled-components';
import { SearchFieldConfig, SearchFields, ButtonComponent, Icons } from '@/components';

type SearchFormProps = {
  config: SearchFieldConfig[];
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  onSearch: () => void;
};

const SearchFormGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-10) var(--spacing-15);
  border-radius: var(--radius);
  border: 1px solid var(--border-color);
  background: var(--gray-A100);

  .react-aria-Group{
    flex: 1;

    > div {
      flex: 1; 
    }
  }
`;
const ButtonGroup = styled(Group)`
  flex: none;
  padding-left: var(--spacing-16);
  border-left: 1px solid var(--border-color);
`;

export const SearchForm = ({ config, values, onChange, onSearch }: SearchFormProps) => {
  return (
    <SearchFormGroup
      role="search"
      onKeyDownCapture={(e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          onSearch();
        }
      }}
    >
      <Group>
        <SearchFields config={config} values={values} onChange={onChange} />
      </Group>
      <ButtonGroup>
        <ButtonComponent
          variant="contained"
          icon={<Icons iName="search" color="#fff" size={16} />}
          iconPosition="left"
          onClick={onSearch}
        >
          조회
        </ButtonComponent>
      </ButtonGroup>
    </SearchFormGroup>
  );
};
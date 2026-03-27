'use client';

import React from 'react';
import { Group } from 'react-aria-components';
import styled from 'styled-components';

type TableTitleComponentProps = {
  leftCont?: React.ReactNode;
  rightCont?: React.ReactNode;
};

const TableTitleGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: var(--spacing-5);
  padding: var(--spacing-5) var(--spacing-6);

  + div {
    border-top: 1px solid var(--gray-30);
  }
`;


const StyledGroup = styled(Group)`
  display: flex;
  align-items: center;
  gap: var(--spacing-4);

  & > div {
    display: flex !important;
    flex-direction: row !important;
    flex-wrap: nowrap !important;
    gap: var(--spacing-4) !important;
    grid-template-columns: none !important;
  }

  /* SearchFields 내부의 각 필드 컨테이너 정렬 */
  .react-aria-TextField, 
  .react-aria-Select {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
`;
export const TableTitleComponent: React.FC<TableTitleComponentProps> = ({ leftCont, rightCont }) => {
  return (
    <TableTitleGroup>
      <StyledGroup>
        {leftCont}
      </StyledGroup>
      <StyledGroup>
        {rightCont}
      </StyledGroup>
    </TableTitleGroup>
  );
};
export default TableTitleComponent;

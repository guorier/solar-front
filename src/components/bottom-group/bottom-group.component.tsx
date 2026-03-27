'use client';

'use client';

import React from 'react';
import { Group } from 'react-aria-components';
import styled from 'styled-components';

type BottomGroupComponentProps = {
  leftCont?: React.ReactNode;
  centerCont?: React.ReactNode;
  rightCont?: React.ReactNode;
};

const BottomGroup = styled.div`
  display: flex;
  justify-content: space-between;
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
`;
export const BottomGroupComponent: React.FC<BottomGroupComponentProps> = ({
  leftCont,
  centerCont,
  rightCont,
}) => {
  return (
    <BottomGroup>
      <StyledGroup>{leftCont}</StyledGroup>
      <StyledGroup>{centerCont}</StyledGroup>
      <StyledGroup>{rightCont}</StyledGroup>
    </BottomGroup>
  );
};

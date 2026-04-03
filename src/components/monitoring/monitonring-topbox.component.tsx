'use client';

import React from 'react';
import styled from 'styled-components';

interface TopInfoBoxComponentProps {
  bg?: string;
  color?: string;
  title?: string;
  totalLabel?: string;
  totalValue?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const TopInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  min-height: 114px;
  padding: 8px 12px;
  border-radius: var(--radius);
  background: var(--point-pink-5);
`;
const TitleRow = styled.div`
  height: 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;
const Title = styled.div`
  padding-top: 3px;
  color: #a91c50;
  font-family: 'GmarketSans';
  font-size: var(--font-size-19);
  font-weight: 500;
`;
const TotalArea = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
`;
const TotalLabel = styled.span`
  font-size: var(--font-size-15);
  color: var(--gray-100);
`;
const TotalValue = styled.strong`
  font-size: var(--font-size-20);
  font-weight: 700;
  color: var(--gray-100);
  line-height: 1;
`;
const Content = styled.div``;

export const TopInfoBoxComponent: React.FC<TopInfoBoxComponentProps> = ({
  bg,
  color,
  title,
  totalLabel,
  totalValue,
  children,
  className,
  style,
}) => {
  return (
    <TopInfoBox style={{ backgroundColor: bg, ...style }} className={className}>
      <TitleRow>
        <Title style={{ color: color }}>{title}</Title>
        {(totalLabel || totalValue) && (
          <TotalArea>
            {totalLabel && <TotalLabel>{totalLabel}</TotalLabel>}
            {totalValue && <TotalValue>{totalValue}</TotalValue>}
          </TotalArea>
        )}
      </TitleRow>
      <Content>{children}</Content>
    </TopInfoBox>
  );
};

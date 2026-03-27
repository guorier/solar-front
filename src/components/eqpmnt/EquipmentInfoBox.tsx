// src/components/eqpmnt/EquipmentInfoBox.tsx
'use client';

import React, { useCallback } from 'react';
import styled from 'styled-components';
import { ButtonComponent, Icons } from '@/components';

interface TopInfoBoxComponentProps {
  bg?: string;
  color?: string;
  title?: string;
  children?: React.ReactNode;
  className?: string;
  count?: number;

  groupTitleId?: string;
  onAdd?: () => void;
  onRemove?: () => void;
}

const TopInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  height: 114px;
  border-radius: var(--radius);
  background: var(--point-pink-5);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Title = styled.div`
  height: 24px;
  padding-top: 3px;
  color: #a91c50;
  
  font-family: 'GmarketSans';
  font-size: var(--font-size-19);
  font-weight: 500;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-16);
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

export const EquipmentInfoBox: React.FC<TopInfoBoxComponentProps> = ({
  bg,
  color,
  title,
  children,
  className,
  count,
  groupTitleId,
  onAdd,
  onRemove,
}) => {
  const handleAdd = useCallback(() => {
    onAdd?.();
  }, [onAdd]);

  const handleRemove = useCallback(() => {
    onRemove?.();
  }, [onRemove]);

  return (
    <TopInfoBox style={{ backgroundColor: bg, height: 'auto' }} className={className}>
      <Header>
        <Title style={{ color: color }}>
          {title} {count}
        </Title>

        <Actions id={groupTitleId}>
          <ButtonComponent
            variant="contained"
            icon={<Icons iName="plus" size={16} color="#fff" />}
            onClick={handleAdd}
          >
            추가
          </ButtonComponent>

          <ButtonComponent
            variant="delete"
            icon={<Icons iName="delete" size={16} color="#fff" />}
            onClick={handleRemove}
          >
            삭제
          </ButtonComponent>
        </Actions>
      </Header>

      <Content>{children}</Content>
    </TopInfoBox>
  );
};

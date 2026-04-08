import { ReactNode } from 'react';
import styled from 'styled-components';

const ListCardWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-10);
  padding: var(--spacing-15);
  border-radius: var(--radius);
  border: 1px solid var(--border-color);
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  cursor: pointer;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-10);
`;

const CardDesc = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  color: var(--gray-50);
`;

const CardRightSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
`;

const CardBottomSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-6);
`;

export type ListCardItem = {
  title: ReactNode;
  desc: ReactNode;
  rightSection?: ReactNode;
  bottomSection?: ReactNode;
  onClick?: () => void;
};

export function ListCard({ title, desc, rightSection, bottomSection, onClick }: ListCardItem) {
  return (
    <ListCardWrap onClick={onClick}>
      <CardHeader>
        <h3>{title}</h3>

        <CardRightSection>{rightSection}</CardRightSection>
      </CardHeader>

      <CardDesc>{desc}</CardDesc>

      <CardBottomSection>{bottomSection}</CardBottomSection>
    </ListCardWrap>
  );
}

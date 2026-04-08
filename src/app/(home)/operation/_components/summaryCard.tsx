import Icons, { iName } from '@/components/icon/Icons';
import { ReactNode } from 'react';
import { Group } from 'react-aria-components';
import styled from 'styled-components';

const CardLayout = styled.div<{ $background?: string }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--spacing-10);
  border-radius: var(--radius);
  padding: var(--spacing-10);
  background: ${({ $background }) => $background || 'var(--gray-0)'};
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RightTopGroup = styled(Group)`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const CardBottom = styled.div`
  display: flex;
  gap: var(--spacing-2);
`;

const Description = styled.div`
  color: var(--gray-40);
  font-size: 14px;
`;

export type SummaryCardItem = {
  title: string;
  value?: string;
  description?: ReactNode;
  icon?: iName;
  rightTop?: ReactNode;
  footer?: ReactNode;
  valueColor?: string;
  background?: string;
};

export function SummaryCard({
  title,
  value,
  description,
  icon,
  rightTop,
  footer,
  valueColor,
  background,
}: SummaryCardItem) {
  return (
    <CardLayout $background={background}>
      <CardHeader>
        <h3>{title}</h3>
        <RightTopGroup>
          {icon && <Icons iName={icon} />}
          {rightTop && rightTop}
        </RightTopGroup>
      </CardHeader>

      <CardContent>
        <h2 style={{ color: valueColor }}>{value}</h2>
        {description && <Description>{description}</Description>}
      </CardContent>

      {footer && <CardBottom>{footer}</CardBottom>}
    </CardLayout>
  );
}

import { Icons, Meter } from '@/components';
import { Tag, TagGroup, TagList } from 'react-aria-components';
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

const CardTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CardDesc = styled.p`
  color: var(--gray-30);
`;

const CardActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-10);
`;

export type ListCardItem = {
  id: string;
  title: string;
  desc: string;
  status: string;
  progress: number;
  currentValue: string;
  onClick?: () => void;
};

export function ListCard({
  id,
  title,
  desc,
  status,
  progress,
  currentValue,
  onClick,
}: ListCardItem) {
  return (
    <ListCardWrap onClick={onClick}>
      <CardHeader>
        <CardTitleGroup>
          <h3>{title}</h3>
          <CardDesc>{desc}</CardDesc>
        </CardTitleGroup>

        <CardActionGroup>
          <TagGroup aria-label="상태">
            <TagList>
              <Tag id={id}>{status}</Tag>
            </TagList>
          </TagGroup>
          <Icons iName="feedback" />
          <Icons iName="delete" />
        </CardActionGroup>
      </CardHeader>

      <Meter aria-label="진행률" value={progress} />

      <h3>{currentValue}</h3>
    </ListCardWrap>
  );
}

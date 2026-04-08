import { ReactNode } from 'react';
import { Group } from 'react-aria-components';
import styled from 'styled-components';

const SectionContainer = styled.div<{
  $padding?: string;
  $background?: string;
  $fitContent?: boolean;
}>`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-10);
  padding: ${({ $padding }) => $padding || 'var(--spacing-10)'};
  background: ${({ $background }) => $background || 'var(--gray-A100)'};

  ${({ $fitContent }) => ($fitContent ? ` flex: 0 0 auto; ` : `flex: 1 1 0;`)}
`;

const ContentRow = styled.div`
  display: flex;
  align-items: stretch;
  gap: var(--spacing-10);
  height: 100%;
`;

const SectionGrid = styled.div<{
  $noWrap?: boolean;
  $columns?: number;
  $minColumnWidth?: string;
}>`
  flex: 1;
  display: grid;
  gap: var(--spacing-10);
  align-items: stretch;

  ${({ $noWrap, $columns, $minColumnWidth }) => {
    if ($noWrap) {
      return `
        grid-auto-flow: column;
        grid-auto-columns: minmax(${$minColumnWidth || '200px'}, 1fr);
      `;
    }

    if ($columns) {
      return `
        grid-template-columns: repeat(${$columns}, minmax(0, 1fr));
      `;
    }

    return `
      grid-template-columns: repeat(auto-fit, minmax(${$minColumnWidth || '200px'}, 1fr));
    `;
  }}
`;

const SectionTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.div`
  height: 24px;
  padding-top: 3px;
  font-family: 'GmarketSans';
  font-size: var(--font-size-19);
  font-weight: 500;
`;

const SideSectionWrapper = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
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

type SummarySectionProps = {
  title?: string;
  children: ReactNode;
  sideSection?: ReactNode;
  titleRight?: ReactNode;
  background?: string;
  padding?: string;
  fitContent?: boolean;
  noWrap?: boolean;
  columns?: number;
  minColumnWidth?: string;
};

export function SummarySection({
  title,
  children,
  sideSection,
  titleRight,
  background,
  padding,
  fitContent,
  noWrap,
  columns,
  minColumnWidth,
}: SummarySectionProps) {
  return (
    <SectionContainer $padding={padding} $background={background} $fitContent={fitContent}>
      {(title || titleRight) && (
        <SectionTitle>
          <StyledGroup>
            <Title>{title}</Title>
          </StyledGroup>
          <StyledGroup>{titleRight}</StyledGroup>
        </SectionTitle>
      )}

      <ContentRow>
        <SectionGrid $noWrap={noWrap} $columns={columns} $minColumnWidth={minColumnWidth}>
          {children}
        </SectionGrid>
        {sideSection && <SideSectionWrapper>{sideSection}</SideSectionWrapper>}
      </ContentRow>
    </SectionContainer>
  );
}

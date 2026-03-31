/* eslint-disable react-refresh/only-export-components */
'use client';

import React, { type ReactNode } from 'react';
import styled from 'styled-components';

interface HeaderRowProps {
  $isSpread: boolean;
}

interface ProgressbarGroupProps {
  gap?: number;
}

interface ProgressbarProps {
  width?: string;
  flex?: string;
  bg?: string;
  title: string;
  count: number | string;
  totalCount?: number | string;
  unit?: string;
  tag?: string;
  rightSide?: ReactNode;
  children?: ReactNode;
  direction?: string;
  fractionDigits?: number;
}

//style
export const ProgressbarGroup = styled.div<ProgressbarGroupProps>`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: ${({ gap }) => (gap !== undefined ? `${gap}px` : '10px')};
  flex: 1;
  width: 100%;
  min-width: 0;

  &.row-type {
    > div {
      > div {
        justify-content: center;

        > div {
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
        }
      }
    }

    .track {
      border-color: var(--gray-A100);
      background: var(--gray-A100);
    }
  }
`;

// const Progressbar = styled.div`
//   position: relative;
//   min-width: 140px;
//   min-height: 62px;
//   max-height: 66px;
//   padding: var(--spacing-6) var(--spacing-8);
//   border-radius: var(--radius);
//   background: rgba(232, 228, 235, 0.45);
//   display: flex;
//   flex-direction: column;
//   flex: 1;
//   gap: var(--spacing-3);
// `;

const HeaderRow = styled.div<HeaderRowProps>`
  display: flex;
  flex-direction: ${({ $isSpread }) => ($isSpread ? 'row' : 'column')};
  justify-content: ${({ $isSpread }) => ($isSpread ? 'space-between' : 'flex-start')};
  align-items: ${({ $isSpread }) => ($isSpread ? 'baseline' : 'flex-start')};
  gap: 6px;
  width: 100%;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
  font-size: var(--font-size-14);
  font-weight: 500;
  line-height: 1.2;
  color: #8e878c;
  white-space: nowrap;
`;

const Count = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  gap: 2px;
  min-width: 0;
  font-size: var(--font-size-20);
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.03em;
  color: #222222;
  white-space: nowrap;

  span {
    color: #acacac;

    b {
      font-weight: 400;
      margin: 0 2px;
    }
  }

  small {
    display: inline-flex;
    align-items: flex-end;
    font-size: 15px;
    font-weight: 500;
    line-height: 1;
    margin-left: 2px;
    margin-bottom: 4px;
    color: #555;
    text-transform: none;
  }

  p {
    height: 19px;
    line-height: 19px;
    padding: 0 var(--spacing-2);
    border-radius: var(--radius-sm);
    background: var(--gray-A100);
    color: var(--gray-70);
    font-size: var(--font-size);
    font-weight: 400;
    margin-bottom: var(--spacing-2);
  }
`;

const Content = styled.div`
  width: 100%;
`;

export const ProgressbarComponent: React.FC<ProgressbarProps> = ({
  flex,
  title,
  count,
  totalCount,
  unit,
  tag,
  rightSide,
  children,
  fractionDigits,
}) => {
  const formatNumber = (value: number | string) => {
    if (value === undefined || value === null) return '';
    const num = typeof value === 'string' ? Number(value.replace(/[^0-9.-]+/g, '')) : value;
    return Number.isNaN(num)
      ? value
      : num.toLocaleString(
          undefined,
          fractionDigits !== undefined
            ? { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits }
            : { maximumFractionDigits: 1 },
        );
  };

  return (
    <ProgressbarGroup style={{ width: '100%', flex }}>
      <HeaderRow $isSpread={!!rightSide}>
        <Title>{title}</Title>
        <Count>
          {tag && <p>{tag}</p>}
          {formatNumber(count)}
          {totalCount !== undefined && totalCount !== null && (
            <span>
              <b>/</b>
              {formatNumber(totalCount)}
            </span>
          )}
          {unit && <small>{unit}</small>}
        </Count>
      </HeaderRow>
      {children && <Content>{children}</Content>}
    </ProgressbarGroup>
  );
};

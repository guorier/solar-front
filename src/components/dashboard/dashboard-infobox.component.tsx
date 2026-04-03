/* eslint-disable react-refresh/only-export-components */
'use client';

import React, { type ReactNode } from 'react';
import styled from 'styled-components';
import Icons, { type iName } from '@/components/icon/Icons';

interface HeaderRowProps {
  $isSpread: boolean;
}

interface InfoBoxGroupProps {
  gap?: number;
}

interface InfoBoxProps {
  width?: string;
  flex?: string;
  bg?: string;
  icon: iName; // ✅ string -> iName (Icons iName 타입과 맞춤)
  title: string;
  count: number | string;
  totalCount?: number | string;
  unit?: string;
  tag?: string;
  rightSide?: ReactNode;
  children?: ReactNode;
  direction?: string;
}

//style
export const InfoBoxGroup = styled.div<InfoBoxGroupProps>`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ gap }) => (gap !== undefined ? `${gap}px` : 'var(--spacing-4)')};
  flex: 1;

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

const InfoBox = styled.div`
  position: relative;
  min-width: 140px;
  min-height: 62px;
  padding: var(--spacing-6) var(--spacing-8);
  border-radius: var(--radius);
  background: rgba(232, 228, 235, 0.45);
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: var(--spacing-3);
`;

const HeaderRow = styled.div<HeaderRowProps>`
  display: flex;
  flex-direction: ${({ $isSpread }) => ($isSpread ? 'row' : 'column')};
  justify-content: ${({ $isSpread }) => ($isSpread ? 'space-between' : 'flex-start')};
  gap: var(--spacing-3);
  width: 100%;
`;

const Title = styled.div`
  display: flex;
  gap: 4px;
  color: var(--gray-100);
`;

const Count = styled.div`
  font-size: var(--font-size-20);
  font-weight: 700;
  line-height: 1;
  margin-left: 4px;

  span {
    color: #acacac;

    b {
      font-weight: 400;
      margin: 0 2px;
    }
  }

  small {
    font-size: var(--font-size);
    font-weight: normal;
    margin-left: 2px;
    color: #555;
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
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-4);
  width: fit-content;
  font-weight: 400;
  font-size: var(--font-size-15);
  color: #555555;
  border-radius: var(--radius-sm);
  background: #f4f3f6;
`;

export const InfoBoxComponent: React.FC<InfoBoxProps> = ({
  width,
  flex,
  bg,
  icon,
  title,
  count,
  totalCount,
  unit,
  tag,
  rightSide,
  children,
}) => {
  const formatNumber = (value: number | string) => {
    if (value === undefined || value === null) return '';

    if (typeof value === 'string') {
      return value;
    }

    return Number.isFinite(value) ? value.toLocaleString() : '';
  };

  return (
    <InfoBoxGroup style={{ width: width, flex: flex }}>
      <InfoBox style={{ background: bg }}>
        <HeaderRow $isSpread={!!rightSide}>
          <Title>
            <Icons iName={icon} size={20} color="#8B8888" />
            <span>{title}</span>
          </Title>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-8)',
              alignItems: 'flex-end',
            }}
          >
            {children && <Content>{children}</Content>}
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
          </div>
        </HeaderRow>
      </InfoBox>
    </InfoBoxGroup>
  );
};

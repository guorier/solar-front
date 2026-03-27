'use client';

import React from 'react';
import styled from 'styled-components';

interface StatusItem {
  title: string;
  count: number | string;
  unit?: string;
  titleCount?: number;
  titleCountUnit?: string;
}

interface StatusContComponentProps {
  items: StatusItem[];
}

const StatusContGroup = styled.div`
  display: flex;
  align-items: center;
  height: 100%;

  div {
    flex: 1;
  }

  strong {
    display: block;
    font-size: 1rem;
    font-weight: 500;
    color: var(--gray-100);
    margin-bottom: 12px;
    line-height: 1;
  }

  .title-count {
    display: inline-block;
    color: #d70251;
    font-family: 'GmarketSans';
    font-size: var(--font-size-16);
    font-weight: 700;
    line-height: 1;
    margin: 0 0 0 6px;
  }

  .title-count-unit {
    display: inline-block;
    color: #555;
    font-family: var(--font-family);
    font-size: 1rem;
    font-weight: 400;
    line-height: 1;
  }

  span {
    display: block;
    color: #d70251;
    font-family: 'GmarketSans';
    font-size: var(--font-size-24);
    font-weight: 700;
    line-height: 1;
  }

  small {
    color: #555;
    font-family: var(--font-family);
    font-size: 1rem;
    font-weight: 400;
    line-height: 1;
    margin-left: 2px;
  }
`;

export const StatusContComponent: React.FC<StatusContComponentProps> = ({ items }) => {
  return (
    <StatusContGroup>
      {items.map((item, index) => (
        <div key={index}>
          <strong>
            {item.title}
            {item.titleCount !== undefined && <span className="title-count">{item.titleCount}</span>}
            {item.titleCountUnit && <small className="title-count-unit">{item.titleCountUnit}</small>}
          </strong>
          <span>
            {item.count}
            {item.unit && <small>{item.unit}</small>}
          </span>
        </div>
      ))}
    </StatusContGroup>
  );
};

'use client';

import React from 'react';
import styled from 'styled-components';

type TitleComponentProps = {
  title?: string;
  subTitle?: string;
  thirdTitle?: string;
  desc?: string;
};

const TitleGroup = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-4);
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-family: 'GmarketSans';
  font-size: var(--font-size-24);
  font-weight: 500;
`;

const Span = styled.span`
  color: var(--gray-70);
  font-family: var(--font-family);
  font-size: var(--font-size-17);
  font-weight: 400;
  line-height: 1.5;

  &::before {
    display: inline-block;
    content: '';
    width: 1px; 
    height: 12px;
    background: var(--gray-40);
    vertical-align: middle;
    margin: -4px 8px 0 0;
  }
`;

const Text = styled.p`
  color: var(--gray-70);
  font-size: var(--font-size-17);
  margin-top: -12px;
  line-height: 1;
`;

export const TitleComponent: React.FC<TitleComponentProps> = ({
  title,
  subTitle,
  thirdTitle,
  desc,
}) => {
  return (
    <div>
      <TitleGroup>
        <Title>{title}</Title> {subTitle && <Span>{subTitle}</Span>}{' '}
        {thirdTitle && <Span>{thirdTitle}</Span>}
      </TitleGroup>
      <Text>{desc}</Text>
    </div>
  );
};
export default TitleComponent;

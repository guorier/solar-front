/* eslint-disable react-refresh/only-export-components */
'use client';

import React from 'react';
import styled from 'styled-components';

interface TextBoxGroupProps {
  $gap?: number;
}

interface TextBoxProps {
  width?: number | string;
  title: string | React.ReactNode;
  content: string;
  fontSize?: number | string;
}

//style
export const TextBoxGroup = styled.div<TextBoxGroupProps>`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ $gap }) => ($gap !== undefined ? `${$gap}px` : '4px')};
`;

const TextBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 26px;
  padding: 8px;
  border-radius: var(--radius-sm);
  background: var(--gray-A100);
  width: calc(50% - 4px);
`;

const Title = styled.div`
  color: #555;
  font-size: var(--font-size-14);
`;

const Content = styled.div`
  font-size: var(--font-size-14);
  font-weight: 500;
  max-width: 60%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
export const TextBoxComponent: React.FC<TextBoxProps> = ({ width, title, content, fontSize }) => {
  return (
    <TextBox style={{ width: width }}>
      <Title>{title}</Title>
      <Content style={{ fontSize: fontSize }}>{content}</Content>
    </TextBox>
  );
};

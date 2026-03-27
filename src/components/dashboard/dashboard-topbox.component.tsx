'use client';

import React from 'react';
import styled from 'styled-components';

interface TopBoxComponentProps {
  children?: React.ReactNode;
}

const TopBox = styled.div`
  position: relative;
  height: 112px;
  padding: 12px 265px 12px 40px;
  border-radius: 12px;
  background:
    linear-gradient(180deg, rgba(192, 43, 46, 0) 62.98%, rgba(192, 43, 46, 0.1) 100%),
    linear-gradient(90deg, rgba(215, 2, 81, 0.1) 0%, rgba(237, 117, 26, 0.16) 100%);
`;

export const TopBoxComponent: React.FC<TopBoxComponentProps> = ({ children }) => {
  return (
    <TopBox>
      {children}
      <img
        src={'/images/img_panel.png'}
        alt=""
        style={{ position: 'absolute', right: 44, top: -10 }}
      />
    </TopBox>
  );
};

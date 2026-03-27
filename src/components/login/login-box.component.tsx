'use client';

import React from 'react';
import styled from 'styled-components';
import { ButtonComponent } from '@/components';

interface LoginBoxComponentProps {
  width?: number;
  bg?: string;
  color?: string;
  title?: string;
  descriptions?: string[];
  children?: React.ReactNode;
  primaryButton?: string;
  onPrimaryClick?: () => void;
  secondaryButton?: string;
  onSecondaryClick?: () => void;
  isPrimaryDisabled?: boolean;
}

const LoginBox = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-16);
  width: 480px;
  min-height: 480px;
  padding: var(--spacing-20);
  border-radius: var(--radius-xl);
  box-shadow:
    0 4px 8px 0 rgba(0, 0, 0, 0.04),
    0 30px 80px 0 rgba(0, 0, 0, 0.06);

    > .flex-1 {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: var(--spacing-16);
    }
`;

const LoginTitle = styled.h2`
  font-size: var(--font-size-28);
  font-weight: 700;
  line-height: 1.2;
  white-space: pre-wrap;
`;

const LoginDescList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
`;

const LoginDescItem = styled.li`
  background-image: url("data:image/svg+xml;utf8,<svg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M11.79 4.268L10.109 1.568L7.63646 3.108V0H4.36346V3.108L1.89096 1.568L0.209961 4.268L2.99146 6L0.209961 7.732L1.89096 10.432L4.36346 8.892V12H7.63646V8.892L10.109 10.432L11.79 7.732L9.00846 6L11.79 4.268Z' fill='%23D70251'/></svg>");
  background-repeat: no-repeat;
  background-position: 0 4px;
  padding-left: 16px;
  color: var(--text-color);
  line-height: 1.4;
  white-space: pre-wrap;
`;

export const LoginBoxComponent: React.FC<LoginBoxComponentProps> = ({
  width = 480,
  bg = 'var(--gray-0)',
  title,
  descriptions = [],
  children,
  primaryButton,
  onPrimaryClick,
  secondaryButton,
  onSecondaryClick,
  isPrimaryDisabled
}) => {
  return (
    <LoginBox style={{ width: width, background: bg }}>
      {title && 
        <>
          <LoginTitle>{title}</LoginTitle>
          
          {descriptions.length > 0 && (
            <LoginDescList>
              {descriptions.map((text, index) => (
                <LoginDescItem key={index}>{text}</LoginDescItem>
              ))}
            </LoginDescList>
          )}
        </>
      }
      <div className="flex-1">{children}</div>
      {(primaryButton || secondaryButton) && (
          <div className="button-group">
            {primaryButton && (
              <ButtonComponent 
                variant="contained" 
                onClick={onPrimaryClick}
                isDisabled={isPrimaryDisabled}
              >
                {primaryButton}
              </ButtonComponent>
            )}
            {secondaryButton && (
              <ButtonComponent 
                variant="outlined" 
                onClick={onSecondaryClick}
              >
                {secondaryButton}
              </ButtonComponent>
            )}
          </div>
        )}
    </LoginBox>
  );
};

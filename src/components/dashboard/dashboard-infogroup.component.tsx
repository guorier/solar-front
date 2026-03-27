'use client';

import React, { type ReactNode, useState, isValidElement, useId, cloneElement } from 'react';
import { Heading } from 'react-aria-components';

interface InfoGroupComponentProps {
  minHeight?: number | string;
  title?: ReactNode;
  extra?: ReactNode;
  children?: ReactNode;
  defaultOpen?: boolean;
  flex?: number;
  isCollapsible?: boolean;
}

type ExtraElementProps = {
  onClick?: (e: React.MouseEvent) => void;
  'aria-expanded'?: boolean;
  'aria-controls'?: string;
  children?: ReactNode;
};

type DataRoleChildProps = {
  'data-role'?: string;
  children?: ReactNode;
};

export const InfoGroupComponent: React.FC<InfoGroupComponentProps> = ({
  flex,
  minHeight,
  title,
  extra,
  children,
  defaultOpen = true,
  isCollapsible = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = useId();

  const toggleContent = () => {
    setIsOpen((prev) => !prev);

    if (typeof window !== 'undefined') {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 50);
    }
  };

  const canToggle = isCollapsible;

  function hasDataRole(
    element: React.ReactNode,
  ): element is React.ReactElement<DataRoleChildProps> {
    return isValidElement(element) && 'data-role' in (element.props as object);
  }

  const extraWithHandler =
    isValidElement(extra) && canToggle
      ? cloneElement(extra as React.ReactElement<ExtraElementProps>, {
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation();
            toggleContent();
          },
          'aria-expanded': isOpen,
          'aria-controls': contentId,
          children: React.Children.map(
            (extra as React.ReactElement<ExtraElementProps>).props.children,
            (child) => {
              if (hasDataRole(child) && child.props['data-role'] === 'arrow') {
                return (
                  <span
                    style={{
                      display: 'inline-flex',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    {child}
                  </span>
                );
              }
              return child;
            },
          ),
        })
      : extra;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: canToggle ? (isOpen ? flex : 0) : flex,
        minHeight: canToggle ? (isOpen ? minHeight : 'auto') : minHeight,
        transition: 'flex 0.2s ease, min-height 0.2s ease',
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 32,
          borderBottom: canToggle && isOpen ? '1px solid var(--border-color)' : 'none',
        }}
      >
        <Heading
          style={{
            fontFamily: 'GmarketSans',
            fontSize: 'var(--font-size-19)',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {title}
        </Heading>

        {extraWithHandler && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              transition: 'transform 0.2s ease',
            }}
          >
            {extraWithHandler}
          </div>
        )}
      </div>

      {/* 컨텐츠 */}
      <div
        id={contentId}
        role="region"
        style={{
          display: isOpen ? 'flex' : 'none',
          flexDirection: 'column',
          flex: 1,
          paddingTop: 'var(--spacing-6)',
          gap: 'var(--spacing-6)',
          minHeight: 0,
        }}
      >
        {children}
      </div>
    </div>
  );
};

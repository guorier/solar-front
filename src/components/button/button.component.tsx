'use client';

import React, { ReactNode } from 'react';
import { Button, ButtonProps, ButtonRenderProps } from 'react-aria-components';
import './button.component.scss';

type RadiusVariant = 'none' | 'sm' | 'md' | 'lg' | 'full';
type ButtonVariant = 'contained' | 'outlined' | 'third' | 'delete' | 'excel' | 'none';

interface ButtonComponentProps extends ButtonProps {
  children?: ReactNode;
  variant?: ButtonVariant;
  radius?: RadiusVariant | number;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  minWidth?: number | string;
  height?: number | string;
  underline?: boolean;
  mt?: number | string;
  ls?: number | string;
  textColor?: string;
}

type VariantStateStyle = {
  bg?: string;
  border?: string;
  color?: string;
};

type VariantConfig = {
  base: Required<Pick<VariantStateStyle, 'bg' | 'border' | 'color'>>;
  hover: VariantStateStyle;
  active: VariantStateStyle;
};

const VARIANT_CONFIG: Record<ButtonVariant, VariantConfig> = {
  contained: {
    base: { bg: 'var(--gray-70)', border: '1px solid var(--gray-70)', color: 'var(--gray-0)' },
    hover: { bg: 'var(--gray-80)', border: '1px solid var(--gray-70)' },
    active: { bg: 'var(--gray-80)', border: '1px solid var(--gray-70)' },
  },
  outlined: {
    base: {
      bg: 'var(--background-color)',
      border: '1px solid var(--gray-50)',
      color: 'var(--text-color)',
    },
    hover: { bg: 'var(--gray-5)', border: '1px solid var(--gray-50)' },
    active: { bg: 'var(--gray-5)', border: '1px solid var(--gray-50)' },
  },
  third: {
    base: { bg: '#ED751A', border: '#ED751A', color: 'var(--gray-0)' },
    hover: { bg: '#D66416', border: '#D66416' },
    active: { bg: '#BF5512', border: '#BF5512' },
  },
  delete: {
    base: {
      bg: 'var(--point-pink-70)',
      border: '1px solid var(--point-pink-70)',
      color: 'var(--gray-0)',
    },
    hover: { bg: 'var(--point-pink-70)', border: '1px solid var(--point-pink-70)' },
    active: { bg: 'var(--point-pink-70)', border: '1px solid var(--point-pink-70)' },
  },
  excel: {
    base: { bg: '#11763E', border: '#11763E', color: 'var(--gray-0)' },
    hover: { bg: '#0A6734' },
    active: { bg: '#0A6734' },
  },
  none: {
    base: { bg: 'transparent', border: 'transparent', color: 'var(--text-color)' },
    hover: { color: 'var(--gray-90)' },
    active: { color: 'var(--gray-90)' },
  },
};

export const ButtonComponent: React.FC<ButtonComponentProps> = ({
  children,
  variant = 'contained',
  radius = 8,
  icon,
  iconPosition = 'right',
  minWidth = 58,
  height = 42,
  underline = false,
  mt,
  ls,
  textColor,
  ...props
}) => {
  const getButtonStyle = (values: ButtonRenderProps): React.CSSProperties => {
    const config = VARIANT_CONFIG[variant];
    const isNone = variant === 'none';

    const baseStyle: React.CSSProperties = {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--spacing-2)',
      minWidth: isNone ? 'auto' : typeof minWidth === 'number' ? `${minWidth}px` : minWidth,
      height: isNone ? 'auto' : typeof height === 'number' ? `${height}px` : height,
      padding: isNone ? 0 : '0 var(--spacing-8)',
      cursor: 'pointer',
      transition: 'all 0.2s ease-out',
      color: textColor || config.base.color,
      fontSize: 'var(--font-size)',
      fontWeight: 500,
      backgroundColor: config.base.bg,
      border: config.base.border,
      borderRadius: radius as React.CSSProperties['borderRadius'],
      textDecoration: underline ? 'underline' : 'none',
      textUnderlineOffset: 2,
      marginTop: mt as React.CSSProperties['marginTop'],
      letterSpacing: ls as React.CSSProperties['letterSpacing'],
      textWrap: 'nowrap',
    };

    const { isPressed, isHovered, isFocused, isFocusVisible, isDisabled } = values;

    // 상태별 스타일 적용
    if (isHovered) {
      if (config.hover.bg) baseStyle.backgroundColor = config.hover.bg;
      if (config.hover.border) baseStyle.border = config.hover.border;
      if (config.hover.color) baseStyle.color = config.hover.color;
    }

    if (isPressed) {
      if (config.active.bg) baseStyle.backgroundColor = config.active.bg;
      if (config.active.border) baseStyle.border = config.active.border;
      if (config.active.color) baseStyle.color = config.active.color;
    }

    if (isFocused) {
      if (config.active.bg) baseStyle.backgroundColor = config.active.bg;
      if (config.active.border) baseStyle.border = config.active.border;
      if (config.active.color) baseStyle.color = config.active.color;
    }

    if (isFocusVisible) {
      return {
        ...baseStyle,
        outline: '-webkit-focus-ring-color auto 0.5px',
      };
    }

    if (isDisabled) {
      baseStyle.backgroundColor = 'var(--gray-20)';
      baseStyle.color = 'var(--gray-40)';
      baseStyle.border = '1px solid var(--gray-40)';
      baseStyle.cursor = 'not-allowed';
    }

    const externalStyle: React.CSSProperties | undefined =
      typeof props.style === 'function'
        ? (props.style as (v: ButtonRenderProps) => React.CSSProperties)(values)
        : (props.style as React.CSSProperties | undefined);

    return {
      ...baseStyle,
      ...(externalStyle ?? {}),
    };
  };

  return (
    <Button {...props} style={getButtonStyle}>
      <>
        {icon && iconPosition === 'left' && (
          <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
        )}
        {children}
        {icon && iconPosition === 'right' && (
          <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
        )}
      </>
    </Button>
  );
};

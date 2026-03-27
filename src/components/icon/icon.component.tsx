'use client';

import React from 'react';
import { ICON_MAP, IconName } from '@/styles/icons/icon-map';

type IconComponentProps = {
  name: IconName | string;
  size?: number | string;
  color?: string;
  alt?: string;
  styles?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void;
};

export const IconComponent: React.FC<IconComponentProps> = ({
  name,
  size = 24,
  color,
  alt,
  styles,
  onClick,
}) => {
  const SvgIcon = ICON_MAP[name as IconName];

  if (!SvgIcon) {
    console.error(`Icon "icon_${name}.svg" not found`);
    return null;
  }

  return (
    <span
      role={onClick ? 'button' : undefined}
      aria-label={alt ?? name}
      onClick={onClick}
      style={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color,
        ...styles,
      }}
    >
      <SvgIcon width="100%" height="100%" style={ color ? { fill: color } : undefined} />
    </span>
  );
};

export default IconComponent;

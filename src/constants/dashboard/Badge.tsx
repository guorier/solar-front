'use client';

import { type ReactNode } from 'react';

const BADGE_STYLES = {
  observatory: { background: 'var(--point-pink-5)', color: 'var(--point-pink-60)' },
  plant: { background: 'var(--point-orange-5)', color: 'var(--point-orange-50)' },
};

const badgeStyle = {
  display: 'inline-block',
  height: 20,
  padding: '2px 4px',
  borderRadius: 'var(--radius-sm)',
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--font-size-13)',
  margin: '-2px 0 0 6px',
};

export function Badge({
  children,
  variant = 'observatory',
}: {
  children: ReactNode;
  variant?: 'observatory' | 'plant';
}) {
  return <span style={{ ...badgeStyle, ...BADGE_STYLES[variant] }}>{children}</span>;
}
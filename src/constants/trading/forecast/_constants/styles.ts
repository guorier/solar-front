import type { CSSProperties } from 'react';

export const chartSectionStyle: CSSProperties = {
  border: '1px solid #d9dde5',
  borderRadius: 'var(--radius)',
  background: '#fff',
  padding: '16px',
};

export const chartTitleStyle: CSSProperties = {
  fontSize: 'var(--font-size-15)',
  fontWeight: 600,
  color: 'var(--gray-100)',
  marginBottom: 4,
};

export const chartSubStyle: CSSProperties = {
  fontSize: 'var(--font-size)',
  color: 'var(--gray-70)',
  marginBottom: 12,
};

export const statsBadgeStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '8px 16px',
  borderRadius: 'var(--radius)',
  background: '#fff',
  border: '1px solid #d9dde5',
  fontSize: 'var(--font-size-13)',
  color: 'var(--gray-70)',
};

export const statsValueStyle = (color: string): CSSProperties => ({
  fontSize: 'var(--font-size-19)',
  fontWeight: 700,
  color,
  lineHeight: 1,
});

export const algorithmBoxStyle: CSSProperties = {
  border: '1px solid #d9dde5',
  borderRadius: 'var(--radius)',
  background: '#f9f9fb',
  padding: '16px 20px',
  fontSize: 'var(--font-size)',
  color: 'var(--gray-70)',
  lineHeight: 1.25,
  whiteSpace: 'pre-line',
};

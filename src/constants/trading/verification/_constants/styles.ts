import type { CSSProperties } from 'react';

export const formCardStyle: CSSProperties = {
  border: '1px solid #d9dde5',
  borderRadius: 'var(--radius)',
  background: '#fff',
  padding: '16px 20px',
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
};

export const formCardTitleStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 'var(--font-size-15)',
  fontWeight: 600,
  color: 'var(--gray-100)',
};

export const formRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '280px 1fr auto',
  gap: '12px',
  alignItems: 'flex-end',
};

export const fieldRowStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
};

export const labelStyle: CSSProperties = {
  fontSize: '13px',
  fontWeight: 600,
  color: '#333',
};

export const systemGenBoxStyle: CSSProperties = {
  padding: '14px 20px',
  borderRadius: 'var(--radius)',
  background: '#EBF4FF',
  border: '1px solid #C5DEFF',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

export const tableWrapStyle: CSSProperties = {
  width: '100%',
  height: 'calc(100dvh - 540px)',
  minHeight: 260,
  border: '1px solid #d9dde5',
  background: '#fff',
};

export const dayTableWrapStyle: CSSProperties = {
  width: '100%',
  height: 'calc(100dvh - 540px)',
  minHeight: 260,
  border: '1px solid #d9dde5',
  background: '#fff',
};

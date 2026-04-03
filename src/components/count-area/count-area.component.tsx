import type { CSSProperties } from 'react';

const wrapStyle: CSSProperties = {
  fontSize: 'var(--font-size-15)',
  fontWeight: 500,
  color: '#222222',
  lineHeight: 1,
  gap: 'var(--spacing-2)',
};

const highlightStyle: CSSProperties = { fontWeight: 700 };

type CountAreaProps = {
  search?: number | string;
  total?: number | string;
};

export function CountArea({ search, total }: CountAreaProps) {
  return (
    <div style={wrapStyle}>
      전체 <span style={highlightStyle}>{total ?? '-'}</span> / {search ?? '-'}
    </div>
  );
}

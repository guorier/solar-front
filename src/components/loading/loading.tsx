'use client';

import React from 'react';

interface LoadingOverlayProps {
  loadingText?: string;
}

export const Loading = ({ loadingText = '로딩중...' }: LoadingOverlayProps) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '6px solid var(--gray-20)',
          borderTopColor: 'var(--point-pink-60)',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <span style={{ fontSize: 'var(--font-size-14)', color: 'var(--gray-60)' }}>
        {loadingText}
      </span>
    </div>
  );
};

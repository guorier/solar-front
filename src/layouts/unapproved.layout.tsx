'use client';

type UnApprovedLayoutProps = {
  children: React.ReactNode;
};

const layoutContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  width: '100%',
  backgroundColor: 'var(--gray-5)',
};

export function UnApproveLayout({ children }: UnApprovedLayoutProps) {

  return <div style={layoutContainerStyle}>{children}</div>;
}

export default UnApproveLayout;

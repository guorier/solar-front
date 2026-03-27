'use client';

import React, { useEffect, useState } from 'react';
import { SidebarLayout, HeaderLayout } from '@/layouts';
import { useRouter } from 'next/navigation';
import { useSessionExpiry } from '@/hooks/useSessionExpiry';
import { ButtonComponent } from '@/components';

export interface HeaderInfo {
  title: string;
  breadcrumbs: string[];
}

export interface HeaderContextType {
  setHeaderInfo: React.Dispatch<React.SetStateAction<HeaderInfo>>;
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDrawerToggle = () => setOpen((prev) => !prev);

  // 레이아웃 스타일 정의
  const layoutContainerStyle: React.CSSProperties = {
    display: 'flex',
    minHeight: '100vh',
    minWidth: 1600,
    backgroundColor: '#ffffff',
  };

  const mainContentStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    marginLeft: open ? 260 : 72,
    transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    minWidth: 0,
  };

  const pageBodyStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    padding: 32,
    paddingTop: 0,
    flex: 1,
    overflowY: 'auto',
  };

  const { isOpen, close, extend } = useSessionExpiry();

  const handleNavigate = (path: string) => {
    console.log('handleNavigate called with:', path); // 디버깅
    console.log('Current location:', location.pathname); // 현재 위치
    router.push(path);
  };

  // 토큰 연장 핸들러
  const handleExtendSession = async () => {
    try {
      await extend();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div style={layoutContainerStyle}>
        {/* 왼쪽 사이드바 */}
        {mounted ? (
          <SidebarLayout
            open={open}
            handleDrawerToggle={handleDrawerToggle}
            onNavigate={handleNavigate}
          />
        ) : (
          ''
        )}

        {/* 오른쪽 메인 영역 */}
        <main style={mainContentStyle}>
          {/* 상단 헤더 영역 */}
          {mounted ? <HeaderLayout /> : <div style={{ height: 72, flexShrink: 0 }} />}

          {/* 하단 실제 컨텐츠 영역 */}
          <section style={pageBodyStyle}>{children}</section>
        </main>
      </div>

      {/* 임시 토큰 연장 모달 */}
      {mounted && isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: '#fff',
              padding: 24,
              borderRadius: 8,
              width: 320,
              textAlign: 'center',
            }}
          >
            <h3>세션 만료 예정</h3>
            <p style={{ marginTop: 12 }}>
              5분 후 자동 로그아웃됩니다. <br /> 세션을 연장하시겠습니까?{' '}
            </p>
            <div style={{ marginTop: 20, display: 'flex', gap: 12, justifyContent: 'center' }}>
              <ButtonComponent onClick={close}>취소</ButtonComponent>
              <ButtonComponent onClick={handleExtendSession}>연장하기</ButtonComponent>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainLayout;

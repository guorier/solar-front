// src/app/login/signup-agree/term/TermPageClient.tsx
'use client';

import { Suspense } from 'react';
import { LoginBoxComponent, Tab, TabList, TabPanel, TabPanels, Tabs } from '@/components';
import { useRouter, useSearchParams } from 'next/navigation';
import TermPrivacyPage from '../term-privacy/page';
import TermServicePage from '../term-service/page';
import TermMarketingPage from '../term-marketing/page';

function TermPageClientInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTab = searchParams.get('tab') || 'service';

  return (
    <LoginBoxComponent
      title={'Wiable Powerfabric\n 이용약관'}
      secondaryButton="로그인 화면"
      onSecondaryClick={() => router.push('/login')}
    >
      <Tabs selectedKey={activeTab} style={{ marginTop: 'calc(var(--spacing-5) * -1)' }}>
        <TabList aria-label="이용약관" style={{ height: 64 }}>
          <Tab id="service" style={{ flex: 1 }}>
            WIABLE
            <br /> 이용약관
          </Tab>
          <Tab id="privacy" style={{ flex: 1 }}>
            개인정보 수집
            <br /> 및 이용
          </Tab>
          <Tab id="marketing" style={{ flex: 1 }}>
            광고성 정보
            <br /> 수신 동의
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel id="service" style={{ paddingTop: 'var(--spacing-16)' }}>
            <TermServicePage />
          </TabPanel>
          <TabPanel id="privacy" style={{ paddingTop: 'var(--spacing-16)' }}>
            <TermPrivacyPage />
          </TabPanel>
          <TabPanel id="marketing" style={{ paddingTop: 'var(--spacing-16)' }}>
            {/* 내용 받은 뒤 작업 예정 */}
            <TermMarketingPage />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </LoginBoxComponent>
  );
}

export default function TermPageClient() {
  return (
    <Suspense fallback={null}>
      <TermPageClientInner />
    </Suspense>
  );
}
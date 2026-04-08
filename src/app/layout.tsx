/* eslint-disable react-refresh/only-export-components */
// src/app/layout.tsx

import type { Metadata } from 'next';
import '@/styles/global/global.scss';
// import { MainLayout } from '@/layouts';
import Script from 'next/script';
import StyledComponentsRegistry from '@/lib/registry.lib';
import { Providers } from '@/providers/providers';
import { ToastRegionComponent } from '@/components/toast/toast';

export const metadata: Metadata = {
  title: 'Wireable',
  description: 'Wireable Frontend',
};

// src/app/layout.tsx

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>
          <Script
            src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=8f4fb41ba7be1b8154a0758cfcc34c80&autoload=false"
            strategy="beforeInteractive"
          />
          {/* 임시 아이콘 불러오기 (추후 삭제) */}
          <link
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
            rel="stylesheet"
          />
          <StyledComponentsRegistry>
            <ToastRegionComponent />
            {children} {/* 🔥 여기만 남김 */}
          </StyledComponentsRegistry>
        </Providers>
      </body>
    </html>
  );
}

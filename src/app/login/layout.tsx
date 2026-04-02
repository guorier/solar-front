'use client';

import { styled } from 'styled-components';

const BodyWrap = styled.div.attrs({ className: 'login-body-wrap' })`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <BodyWrap>{children}</BodyWrap>;
}

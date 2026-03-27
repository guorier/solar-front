'use client';

import { LoginBoxComponent } from '@/components';
import { useRouter } from 'next/navigation';
import { styled } from 'styled-components';

const IDTitle = styled.h4`
  color: var(--text-color);
  font-size: var(--font-size-17);
  font-weight: 400
`;
const IDText = styled.p`
  color: var(--point-pink-70);
  font-size: var(--font-size-24);
  font-weight: 600;
  margin-top: 10px;
`;

export default function FindIdConfirmPage() {
  const router = useRouter();
  
  return (
    <LoginBoxComponent
      title="아이디 찾기"
      primaryButton="비밀번호 찾기"
      secondaryButton="로그인 화면"
      onPrimaryClick={() => router.push('/login/find-pw')}
      onSecondaryClick={() => router.push('/login')}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--gray-5)' }}>
         <IDTitle>정보와 일치하는 아이디입니다.</IDTitle>
         <IDText>nsonesoft@nsonesoft.com</IDText>
      </div>
    </LoginBoxComponent>
  );
}

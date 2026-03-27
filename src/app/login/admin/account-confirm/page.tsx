'use client';

import { FieldError, Form, Label, LoginBoxComponent } from '@/components';
import { useRouter } from 'next/navigation';
import { TextField, Input } from 'react-aria-components';


export default function AccountConfirmPage() {
  const router = useRouter();

  return (
    <LoginBoxComponent
      title="신청상태 확인"
      primaryButton="검색"
      secondaryButton="로그인 화면"
      onPrimaryClick={() => router.push('/login/find-pw')}
      onSecondaryClick={() => router.push('/login')}
    >
      <Form>
        <TextField isRequired>
          <Label>아이디</Label>
          <Input placeholder="아이디를 입력해 주세요" />
          <FieldError>
            {({ validationDetails }) =>
              validationDetails.valueMissing ? '아이디를 입력해 주세요' : ''
            }
          </FieldError>
        </TextField>
        <TextField isRequired>
          <Label>연락처</Label>
          <Input placeholder="-없이 숫자만 입력해 주세요" />
          <FieldError>
            {({ validationDetails }) =>
              validationDetails.valueMissing ? '연락처를 입력해 주세요' : ''
            }
          </FieldError>
        </TextField>
      </Form>

      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 100, padding: 'var(--spacing-8)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--gray-5)' }}>
        <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <li style={{ display: 'flex', lineHeight: '28px' }}>
            <span style={{ width: 80, color: 'var(--text-color)' }}>신청계정</span>
            <strong style={{ color: 'var(--point-pink-70)' }}>nsonesoft</strong>
          </li>
          <li style={{ display: 'flex', lineHeight: '28px' }}>
            <span style={{ width: 80, color: 'var(--text-color)' }}>신청자</span>
            <strong style={{ color: 'var(--point-pink-70)' }}>엔에스원</strong>
          </li>
          <li style={{ display: 'flex', lineHeight: '28px' }}>
            <span style={{ width: 80, color: 'var(--text-color)' }}>상태</span>
            <strong style={{ color: 'var(--point-pink-70)' }}>승인대기</strong>
          </li>
          <li style={{ display: 'flex', lineHeight: '28px' }}>
            <span style={{ width: 80, color: 'var(--text-color)' }}>요청일자</span>
            <strong style={{ color: 'var(--point-pink-70)' }}>yyyy.mm.dd</strong>
          </li>
        </ul>
        {/* 데이터 없을 경우 */}
        {/* <p style={{ color: 'var(--gray-50)', fontSize: 'var(--font-size-17)', textAlign: 'center' }}>데이터가 없습니다.</p> */}
      </div>
    </LoginBoxComponent>
  );
}

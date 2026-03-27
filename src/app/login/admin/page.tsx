'use client';

import {
  ButtonComponent,
  LoginBoxComponent,
  SearchFormFieldConfig,
  SearchFormFields,
} from '@/components';
import { Form } from 'react-aria-components';
import { styled } from 'styled-components';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AdminLoginForm, adminLoginSchema } from '@/schemas/auth/auth';
import { usePostSignUpKey } from '@/services/auth/query';
import { encryptString } from '@/utils/encrypto';
import { signIn } from 'next-auth/react';
import { toast } from '@/stores/toast';

const LoginWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 23px;
  width: 960px;
`;
const LoginGroup = styled.div`
  display: flex;
`;

const LinkGroup = styled.div`
  display: flex;
  margin-left: auto;

  button {
    + button {
      &::before {
        display: inline-block;
        content: '';
        width: 1px;
        height: 10px;
        background: var(--gray-40);
        margin: 0 8px;
      }
    }
  }
`;

export default function LoginPage() {
  const router = useRouter();

  const form = useForm<AdminLoginForm>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      acntId: '',
      pswd: '',
      uuId: '',
      seCd: '',
      hashKey: '',
      classify: '',
    },
  });

  const adminLoginConfig: (
    | SearchFormFieldConfig<AdminLoginForm>
    | SearchFormFieldConfig<AdminLoginForm>[]
  )[] = [
    {
      key: 'acntId',
      label: '아이디',
      type: 'text',
      required: true,
      placeholder: '비밀번호를 입력해 주세요',
      gridSize: 12,
    },
    {
      key: 'pswd',
      label: '비밀번호',
      type: 'password',
      required: true,
      placeholder: '비밀번호를 입력해 주세요',
      gridSize: 12,
    },
  ];

  // 로그인 폼 제출  (로그인 인증 → JWT 발급 → 세션 저장)
  const signupKey = usePostSignUpKey();

  const onSubmit = async () => {
    // 키 발급
    const key = await signupKey.mutateAsync();

    // 비밀번호 암호화
    const encrypted = await encryptString(form.getValues('pswd'), key.publicKey);

    const result = await signIn('credentials', {
      acntId: form.getValues('acntId'),
      pswd: encrypted,
      seCd: 'A',
      uuId: key.uuId,
      classify: 'A',
      redirect: false,
    });

    if (result?.error) return toast.error(result.code ?? '오류가 발생했습니다.');

    router.push('/');
  };

  return (
    <LoginWrap>
      <LoginGroup>
        <LoginBoxComponent
          title="시스템 관리자 로그인"
          descriptions={[
            '허가 받은 사용자 외 사용 할 수 없습니다.',
            '권한 특징상 계정 및 비밀번호 노출에 유의 해서 사용 해주세요.',
          ]}
          bg={`
                url('/images/bg_login_admin.png') no-repeat left bottom / auto, 
                linear-gradient(104deg, var(--point-pink-5) 10%, var(--point-orange-5) 90%)
              `}
        >
          <img
            src={'/images/logo.svg'}
            alt=""
            style={{ position: 'absolute', left: 40, bottom: 40, width: 170 }}
          />
        </LoginBoxComponent>
        <LoginBoxComponent>
          <Form onSubmit={form.handleSubmit(onSubmit)}>
            <SearchFormFields
              config={adminLoginConfig}
              control={form.control}
              errors={form.formState.errors}
              columnSpacing={0}
            />
            <div className="side-group">
              <LinkGroup>
                <ButtonComponent variant="none" onClick={() => router.push('/login/find-id')}>
                  아이디찾기
                </ButtonComponent>
                <ButtonComponent variant="none" onClick={() => router.push('/login/find-pw')}>
                  비밀번호 찾기
                </ButtonComponent>
              </LinkGroup>
            </div>
            <ButtonComponent type="submit" variant="contained" mt={20}>
              로그인
            </ButtonComponent>
            <div className="button-group" style={{ marginTop: -4 }}>
              <ButtonComponent
                variant="outlined"
                className="flex-1"
                onClick={() => router.push('/login/admin/account')}
              >
                계정 신청
              </ButtonComponent>
              <ButtonComponent
                variant="outlined"
                className="flex-1"
                onClick={() => router.push('/login/admin/account-confirm')}
              >
                계정 신청 확인
              </ButtonComponent>
            </div>
          </Form>
        </LoginBoxComponent>
      </LoginGroup>
      <div className="side-group">
        <p style={{ color: 'var(--gray-50)' }}>
          Copyright © 2025 Wiable Corp. All Rights Reserved.
        </p>
      </div>
    </LoginWrap>
  );
}

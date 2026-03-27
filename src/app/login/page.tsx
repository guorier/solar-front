'use client';

import {
  ButtonComponent,
  Checkbox,
  Icons,
  LoginBoxComponent,
  SearchFormFieldConfig,
  SearchFormFields,
} from '@/components';
import { Form } from 'react-aria-components';
import { styled } from 'styled-components';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { LoginForm, loginSchema } from '@/schemas/auth/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { encryptString } from '@/utils/encrypto';
import { usePostSignUpKey } from '@/services/auth/query';
import { useEffect, useState } from 'react';
import { deleteCookie, getCookie, setCookie } from '@/utils/rememberId';
import { toast } from '@/stores/toast';

const BodyWrap = styled.div.attrs({ className: 'login-body-wrap' })`
  display: flex;
  align-items: center;
  justify-content: center;
`;
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

const REMEMBER_ID_COOKIE = 'remember_acntId';

export default function LoginPage() {
  const router = useRouter();

  const [rememberId, setRememberId] = useState<boolean>(false);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      acntId: '',
      pswd: '',
      uuId: '',
      seCd: '',
      hashKey: '',
    },
  });

  // 진입 시 쿠키 있으면 자동 입력
  useEffect(() => {
    const saved = getCookie(REMEMBER_ID_COOKIE);
    if (saved) {
      form.setValue('acntId', saved, { shouldValidate: true });
      setRememberId(true);
    }
  }, [form]);

  const loginConfig: (SearchFormFieldConfig<LoginForm> | SearchFormFieldConfig<LoginForm>[])[] = [
    {
      key: 'acntId',
      label: '아이디',
      type: 'text',
      required: true,
      placeholder: '아이디를 입력해 주세요',
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

    const acntId = form.getValues('acntId');

    const result = await signIn('credentials', {
      acntId,
      pswd: encrypted,
      seCd: 'BN',
      uuId: key.uuId,
      classify: '',
      redirect: false,
    });

    console.log('signIn result:', result);

    if (result?.error) {
      if (result.error === 'CredentialsSignin')
        return toast.error('로그인 실패', '아이디 또는 비밀번호를 확인해 주세요.');

      return toast.error(result.error);
    }

    if (rememberId) setCookie(REMEMBER_ID_COOKIE, acntId, 30);
    else deleteCookie(REMEMBER_ID_COOKIE);

    router.push('/');
  };

  return (
    <BodyWrap>
      <LoginWrap>
        <LoginGroup>
          <LoginBoxComponent
            title="Wiable Powerfabric"
            descriptions={[
              'SNS 계정으로 가입&로그인 하실 경우, 일부 서비스 이용에\n제한이 있을 수 있습니다.',
            ]}
            bg={`
                url('/images/bg_login.png') no-repeat left bottom / auto, 
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
                config={loginConfig}
                control={form.control}
                errors={form.formState.errors}
                columnSpacing={0}
              />
              <div className="side-group">
                <Checkbox
                  isSelected={rememberId}
                  onChange={(checked: boolean) => setRememberId(checked)}
                >
                  아이디 저장
                </Checkbox>
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
                  icon={<Icons iName="naver" size={16} original />}
                  iconPosition="left"
                  ls={-1.1}
                  className="flex-1"
                  onClick={() => signIn('naver')}
                >
                  네이버 로그인
                </ButtonComponent>
                <ButtonComponent
                  variant="outlined"
                  icon={
                    <Icons
                      iName="google"
                      size={16}
                      original
                      style={{ backgroundColor: 'transparent' }}
                    />
                  }
                  iconPosition="left"
                  ls={-1.1}
                  className="flex-1"
                  onClick={() => signIn('google')}
                >
                  구글 로그인
                </ButtonComponent>
                <ButtonComponent
                  variant="outlined"
                  icon={
                    <Icons
                      iName="kakao"
                      size={16}
                      original
                      style={{ backgroundColor: 'transparent' }}
                    />
                  }
                  iconPosition="left"
                  ls={-1.1}
                  className="flex-1"
                  onClick={() => signIn('kakao')}
                >
                  카카오 로그인
                </ButtonComponent>
              </div>
            </Form>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 'var(--spacing-4)',
              }}
            >
              <p style={{ color: 'var(--gray-50)' }}>아직 계정이 없으신가요?</p>
              <ButtonComponent
                variant="none"
                textColor="var(--point-pink-70)"
                underline
                onClick={() => router.push('/login/signup-agree')}
              >
                회원가입
              </ButtonComponent>
            </div>
          </LoginBoxComponent>
        </LoginGroup>
        <div className="side-group">
          <p style={{ color: 'var(--gray-50)' }}>
            Copyright © 2025 Wiable Corp. All Rights Reserved.
          </p>
          <LinkGroup>
            <ButtonComponent variant="none" underline>
              이용약관
            </ButtonComponent>
            <ButtonComponent variant="none" underline>
              개인정보처리방침
            </ButtonComponent>
          </LinkGroup>
        </div>
      </LoginWrap>
    </BodyWrap>
  );
}

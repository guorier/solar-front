// src/app/login/signup/SignUpPageClient.tsx
'use client';

import { Suspense, useState } from 'react';
import { Form, LoginBoxComponent, SearchFormFields } from '@/components';
import { UserSignupForm, userSignupSchema } from '@/schemas/auth/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { encryptFields } from '@/utils/encrypto';
import { getUserSignupConfig } from '@/constants/auth/signup';
import DaumPostcode, { DaumAddressValue } from '@/components/address/DaumPostcode';
import {
  usePostAccountIdDuplicate,
  usePostSignUpInfo,
  usePostSignUpKey,
} from '@/services/auth/query';
import { UserSignUpReq } from '@/services/auth/type';
import { toast } from '@/stores/toast';

function SignUpPageClientInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const agreYn = searchParams.get('agreYn') === 'Y' ? 'Y' : 'N';
  const chcYn = searchParams.get('chcYn') === 'Y' ? 'Y' : 'N';

  const [isAddressOpen, setIsAddressOpen] = useState<boolean>(false);
  const [addressType, setAddressType] = useState<'address' | 'businessAddress' | null>(null);
  const [idCheckStatus, setIdCheckStatus] = useState<'unchecked' | 'available' | 'duplicated'>(
    'unchecked',
  );
  const [lastCheckedAcntId, setLastCheckedAcntId] = useState<string>('');

  const form = useForm<UserSignupForm>({
    resolver: zodResolver(userSignupSchema),
    defaultValues: {
      name: '',
      publicKey: '',
      uuId: '',
      seCd: '',
      snsToken: '',
      acntId: '',
      pswd: '',
      pswdConfirm: '',
      gndr: '',
      birth: '',
      eml: '',
      phone: '',
      zip: '',
      lotnoAddr: '',
      roadNmAddr: '',
      lctnDtlAddr: '',
      bzmnNo: '',
      bzmnNm: '',
      bzmnZip: '',
      bzmnLotnoAddr: '',
      bzmnRoadAddr: '',
      bzmnDtlAddr: '',
      agreYn,
      chcYn,
    },
  });

  // 이메일 중복 확인
  const accountDuplicateCheck = usePostAccountIdDuplicate();

  const handleDuplicateCheck = async () => {
    const acntId = form.getValues('acntId');
    if (!acntId) return;

    const res = await accountDuplicateCheck.mutateAsync({ acntId });

    setLastCheckedAcntId(acntId);

    if (res.statusCode === 'S101') {
      setIdCheckStatus('duplicated');
      return toast.error('이미 사용 중인 아이디입니다.');
    }

    if (res.statusCode === 'S102') {
      setIdCheckStatus('available');
      return toast.success('사용 가능한 아이디입니다.');
    }
  };

  // 사업자 번호 유효성 체크
  const handleValidityCheck = () => {
    console.log('유효성 체크:');
  };

  // 주소 검색
  const handleAddressSearch = (field: 'businessAddress' | 'address') => {
    setAddressType(field);
    setIsAddressOpen(true);
  };

  // 선택한 주소 필드 세팅
  const onAddressSelect = (data: DaumAddressValue) => {
    if (addressType === 'address') {
      form.setValue('zip', data.zonecode);
      form.setValue('roadNmAddr', data.roadAddress);
      form.setValue('lotnoAddr', data.jibunAddress);
    } else {
      form.setValue('bzmnZip', data.zonecode);
      form.setValue('bzmnRoadAddr', data.roadAddress);
      form.setValue('bzmnLotnoAddr', data.jibunAddress);
    }

    setIsAddressOpen(false);
    setAddressType(null);
  };

  // 회원가입 config
  const seCd = form.watch('seCd');
  const signupConfig = getUserSignupConfig(seCd === 'B', {
    onDuplicateCheck: handleDuplicateCheck,
    onValidityCheck: handleValidityCheck,
    onAddressSearch: handleAddressSearch,
  });

  // 회원가입 폼 제출
  const signupKey = usePostSignUpKey();
  const signUp = usePostSignUpInfo<UserSignUpReq>();

  const onSubmit = async () => {
    if (form.getValues('acntId') !== lastCheckedAcntId)
      return toast.error('아이디 중복 확인을 다시 진행해주세요.');

    if (idCheckStatus === 'unchecked') return toast.error('아이디 중복 확인을 진행해주세요.');
    if (idCheckStatus === 'duplicated') return toast.error('이미 사용 중인 아이디입니다.');

    const values = form.getValues();
    delete values.pswdConfirm;

    // 키 발급
    const key = await signupKey.mutateAsync();

    const payload: UserSignUpReq = {
      ...values,
      uuId: key.uuId,
      phone: form.getValues('phone').replace(/\D/g, ''),
    };

    // 비밀번호 암호화
    const encryptedValues = await encryptFields(payload, ['pswd'], key.publicKey);

    const signupRes = await signUp.mutateAsync(encryptedValues);

    if (signupRes.statusCode === '000') {
      router.push('/login');
    } else {
      toast.error(signupRes.statusMessage);
    }
  };

  return (
    <>
      <LoginBoxComponent
        title="회원가입"
        primaryButton="회원가입 하기"
        secondaryButton="로그인 화면"
        onPrimaryClick={form.handleSubmit(onSubmit)}
        onSecondaryClick={() => router.push('/login')}
        width={920}
      >
        <Form onSubmit={form.handleSubmit(onSubmit)}>
          <SearchFormFields
            config={signupConfig}
            control={form.control}
            errors={form.formState.errors}
          />
        </Form>
      </LoginBoxComponent>

      {isAddressOpen && (
        <DaumPostcode
          open={isAddressOpen}
          onClose={() => {
            setIsAddressOpen(false);
            setAddressType(null);
          }}
          onSelect={onAddressSelect}
        />
      )}
    </>
  );
}

export default function SignUpPageClient() {
  return (
    <Suspense fallback={null}>
      <SignUpPageClientInner />
    </Suspense>
  );
}

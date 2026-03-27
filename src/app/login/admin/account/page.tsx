'use client';

import {
  LoginBoxComponent,
  Modal,
  OrgSearchForm,
  OrgTreeNode,
  SearchFormFields,
} from '@/components';
import { Form } from 'react-aria-components';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getAdminSignupConfig } from '@/constants/auth/signup';
import {
  usePostAccountIdDuplicate,
  usePostSignUpInfo,
  usePostSignUpKey,
} from '@/services/auth/query';
import { encryptFields } from '@/utils/encrypto';
import { AdminSignupForm, adminSignupSchema } from '@/schemas/auth/auth';
import { toast } from '@/stores/toast';

export default function AccountPage() {
  const router = useRouter();
  const [isOrgSearchOpen, setIsOrgSearchOpen] = useState<boolean>(false);
  const [idCheckStatus, setIdCheckStatus] = useState<'unchecked' | 'available' | 'duplicated'>(
    'unchecked',
  );
  const [lastCheckedAcntId, setLastCheckedAcntId] = useState<string>('');
  const [selectedOrg, setSelectedOrg] = useState<OrgTreeNode | null>(null);

  const form = useForm<AdminSignupForm>({
    resolver: zodResolver(adminSignupSchema),
    defaultValues: {
      name: '',
      publicKey: '',
      uuId: '',
      seCd: 'A',
      acntId: '',
      pswd: '',
      pswdConfirm: '',
      eml: '',
      phone: '',
      deptCd: '',
      deptName: '',
      jbgdName: '',
      taskCn: '',
    },
  });

  const accountDuplicateCheck = usePostAccountIdDuplicate();
  const signupKey = usePostSignUpKey();
  const signUp = usePostSignUpInfo();

  // 이메일 중복 확인
  const handleDuplicateCheck = async () => {
    const acntId = form.getValues('acntId');
    if (!acntId) return;

    const res = await accountDuplicateCheck.mutateAsync({ acntId, classify: 'A' });

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

  // 관리자 계정 생성 config
  const accountConfig = getAdminSignupConfig({
    onDuplicateCheck: handleDuplicateCheck,
    onOrgNameSearch: () => setIsOrgSearchOpen(true),
  });

  // 회원가입 폼 제출
  const onSubmit = async () => {
    if (form.getValues('acntId') !== lastCheckedAcntId)
      return toast.error('아이디 중복 확인을 다시 진행해주세요.');
    if (idCheckStatus === 'unchecked') return toast.error('아이디 중복 확인을 진행해주세요.');
    if (idCheckStatus === 'duplicated') return toast.error('이미 사용 중인 아이디입니다.');

    const values = form.getValues();
    delete values.pswdConfirm;

    // 키 발급
    const key = await signupKey.mutateAsync();

    const payload = {
      ...values,
      uuId: key.uuId,
      phone: form.getValues('phone').replace(/\D/g, ''),
    };

    const encryptedValues = await encryptFields(payload, ['pswd'], key.publicKey);

    const signupRes = await signUp.mutateAsync(encryptedValues);

    if (signupRes.statusCode === '000') {
      router.push('/login/admin');
    } else {
      toast.error(signupRes.statusMessage);
    }
  };

  return (
    <>
      <LoginBoxComponent
        title="계정 신청"
        primaryButton="신청"
        secondaryButton="로그인 화면"
        onPrimaryClick={form.handleSubmit(onSubmit)}
        onSecondaryClick={() => router.push('/login/admin')}
      >
        <Form onSubmit={form.handleSubmit(onSubmit)}>
          <SearchFormFields
            config={accountConfig}
            control={form.control}
            errors={form.formState.errors}
            columnSpacing={0}
          />
          {/* popup: 조직(부서) 검색 */}
          <Modal
            isOpen={isOrgSearchOpen}
            onOpenChange={setIsOrgSearchOpen}
            title="조직(부서) 검색"
            primaryButton="적용"
            onPrimaryPress={() => {
              if (!selectedOrg) return toast.error('조직을 선택해주세요.');

              setIsOrgSearchOpen(false);

              form.setValue('deptCd', selectedOrg?.id);
              form.setValue('deptName', selectedOrg?.title);
            }}
          >
            <OrgSearchForm onTreeItemClick={(item) => setSelectedOrg(item)} />
          </Modal>
        </Form>
      </LoginBoxComponent>
    </>
  );
}

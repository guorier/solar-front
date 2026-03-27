import { InputComponent, Modal } from '@/components';
import { ResetPasswordForm, resetPasswordSchema } from '@/schemas/auth/auth';
import { usePostPasswordUpdate, usePostSignUpKey } from '@/services/auth/query';
import { toast } from '@/stores/toast';
import { encryptString } from '@/utils/encrypto';
import { zodResolver } from '@hookform/resolvers/zod';
import { signOut, useSession } from 'next-auth/react';
import { Group } from 'react-aria-components';
import { Controller, FieldErrors, useForm } from 'react-hook-form';

export function PasswordUpdateForm({
  isOpen,
  onOpen,
  verifiedCode,
}: {
  isOpen: boolean;
  onOpen: (open: boolean) => void;
  verifiedCode: string;
}) {
  const { data: user } = useSession();

  const passwordForm = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPswd: '',
      newPswdCheck: '',
    },
  });

  // 새 비밀번호 Submit 시 발생하는 오류 토스트 띄우기
  const handleFormError = (errors: FieldErrors<ResetPasswordForm>) => {
    const firstError = Object.values(errors)[0];

    if (firstError?.message) {
      toast.error('입력값 확인', firstError.message as string);
    }
  };

  const publicKey = usePostSignUpKey();
  const pwdUpdate = usePostPasswordUpdate();

  // 비밀번호 업데이트
  const handlePasswordUpdate = async () => {
    if (!user?.user) return;

    // 키 발급
    const key = await publicKey.mutateAsync();

    // 비밀번호 암호화
    const encrypted = await encryptString(passwordForm.getValues('newPswd'), key.publicKey);

    const payload = {
      publicKey: key.publicKey,
      uuId: key.uuId,
      acntId: user.user.pridtfScrtyId,
      pswd: encrypted,
      classify: user.user.classify ?? '',
      verifiedCode: verifiedCode,
    };

    const updateRes = await pwdUpdate.mutateAsync(payload);
    if (updateRes.statusCode !== 'S002') return toast.error(updateRes.statusCause);

    onOpen(false);
    passwordForm.reset();
    toast.success('비밀번호 변경 완료');

    return signOut({ callbackUrl: '/login' });
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpen}
      title="비밀번호 변경"
      primaryButton="변경"
      onPrimaryPress={passwordForm.handleSubmit(handlePasswordUpdate, handleFormError)}
    >
      <Group style={{ flexDirection: 'column' }}>
        <Controller
          control={passwordForm.control}
          name="newPswd"
          render={({ field }) => (
            <InputComponent
              {...field}
              id="newPswd"
              type="password"
              label="새 비밀번호"
              placeholder="변경할 비밀번호 입력"
              aria-label="비밀번호 입력"
              title="비밀번호"
            />
          )}
        />
      </Group>
      <Group style={{ flexDirection: 'column' }}>
        <Controller
          control={passwordForm.control}
          name="newPswdCheck"
          render={({ field }) => (
            <InputComponent
              {...field}
              id="newPswdCheck"
              type="password"
              label="새 비밀번호 확인"
              placeholder="비밀번호 재입력"
              aria-label="비밀번호 재입력"
              title="비밀번호 확인"
            />
          )}
        />
      </Group>
    </Modal>
  );
}

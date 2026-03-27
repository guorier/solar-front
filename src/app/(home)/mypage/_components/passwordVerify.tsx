import { InputComponent, Modal } from '@/components';
import { usePostPasswordVerify, usePostSignUpKey } from '@/services/auth/query';
import { toast } from '@/stores/toast';
import { encryptString } from '@/utils/encrypto';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export function PasswordVerifyModal({
  isOpen,
  onOpen,
  onPrimaryAction,
}: {
  isOpen: boolean;
  onOpen: (open: boolean) => void;
  onPrimaryAction: (verifiedCode: string) => void;
}) {
  const { data: user } = useSession();

  const [oldPswd, setOldPswd] = useState<string>('');

  const publicKey = usePostSignUpKey();
  const pwdVerify = usePostPasswordVerify();

  // 모달 상태 변경
  const handleOpenChange = (open: boolean) => {
    setOldPswd('');
    onOpen(open);
  };

  // 기존 비밀번호 확인 (인증)
  const handlePasswordVerify = async () => {
    if (!user?.user) return;

    // 키 발급
    const key = await publicKey.mutateAsync();

    // 비밀번호 암호화
    const encrypted = await encryptString(oldPswd, key.publicKey);

    const payload = {
      publicKey: key.publicKey,
      uuId: key.uuId,
      acntId: user.user.pridtfScrtyId,
      pswd: encrypted,
      classify: user.user.classify ?? '',
      verificationCode: user.accessToken ?? '',
    };

    const verifyRes = await pwdVerify.mutateAsync(payload);

    if (!verifyRes || verifyRes.statusCode !== 'S000') return toast.error(verifyRes.statusCause);

    onPrimaryAction(verifyRes.verifiedCode);
    setOldPswd('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      title="사용자 확인"
      primaryButton="확인"
      onPrimaryPress={handlePasswordVerify}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <InputComponent
          label="비밀번호"
          type="password"
          value={oldPswd}
          onChange={(e) => setOldPswd(e.target.value)}
          placeholder="기존 비밀번호를 입력해주세요"
          aria-label="비밀번호 확인"
          title="비밀번호"
        />
      </div>
    </Modal>
  );
}

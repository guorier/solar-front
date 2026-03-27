import { ButtonComponent, Modal } from '@/components';
import { InputComponent } from '@/components/input/input';
import { Group } from 'react-aria-components';

export function EmailVerifyModal({
  isOpen,
  onOpen,
  verifiedCode,
}: {
  isOpen: boolean;
  onOpen: (open: boolean) => void;
  verifiedCode: string;
}) {
  // 이메일 변경
  const handleEmailUpdate = () => {
    onOpen(false);
    console.log(verifiedCode);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpen}
      title="이메일 인증"
      primaryButton="인증 확인"
      onPrimaryPress={handleEmailUpdate}
    >
      * 변경하고자 하는 메일 주소를 입력한 후 인증번호를 입력해주세요.
      <Group style={{ alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <InputComponent
            label="변경 ID"
            placeholder="example@mail.com"
            aria-label="이메일 입력"
            title="이메일"
          />
        </div>
        <ButtonComponent>인증하기</ButtonComponent>
      </Group>
      <InputComponent
        placeholder="인증번호 6자리를 입력해주세요"
        aria-label="인증번호 입력"
        title="인증번호"
      />
    </Modal>
  );
}

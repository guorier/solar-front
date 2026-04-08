import { ButtonComponent, Icons, Modal } from '@/components';
import { Group } from 'react-aria-components';

export function CodeDownloadModal({ isOpen, onOpen }: { isOpen: boolean; onOpen: () => void }) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpen}
      title="코드 다운로드"
      primaryButton="취소"
      secondaryButton=""
    >
      * 원하시는 항목을 클릭하여 다운로드할 수 있습니다.
      <br />
      <br />
      검색된 조건에 따라 다운로드 되지 않으며,
      <br />
      선택한 코드 전체를 모두 엑셀 파일로 다운로드하게 됩니다.
      <Group>
        <ButtonComponent
          style={{ flex: 1 }}
          height={64}
          variant="excel"
          icon={<Icons iName="download" color="white" />}
        >
          Download
          <br />
          Master Code
        </ButtonComponent>
        <ButtonComponent
          style={{ flex: 1 }}
          height={64}
          variant="excel"
          icon={<Icons iName="download" color="white" />}
        >
          Download
          <br />
          Sub Code
        </ButtonComponent>
      </Group>
    </Modal>
  );
}

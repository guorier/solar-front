import { Cell, Column, Label, Modal, Row, Table, TableBody, TableHeader } from '@/components';
import { ResizableTableContainer, TextArea } from 'react-aria-components';

export default function AddSearchValueModal({
  isOpen,
  onOpen,
}: {
  isOpen: boolean;
  onOpen: () => void;
}) {
  return (
    <Modal title="검색 단어 추가" isOpen={isOpen} onOpenChange={onOpen} primaryButton="등록">
      <p>뉴스 피드에 표시할 검색어를 추가합니다.</p>
      <div className="react-aria-TextField" style={{ maxWidth: '100%' }}>
        <TextArea placeholder="단어와 단어 사이 ,를 추가해서 입력해주세요. 예) 태양광, 발전소" />
      </div>
      <ResizableTableContainer>
        <Table type="vertical" aria-labelledby="acc-info-title" aria-describedby="acc-info-summary">
          <TableHeader>
            <Column isRowHeader width={100} />
            <Column />
            <Column isRowHeader width={100} />
            <Column />
          </TableHeader>
          <TableBody>
            <Row>
              <Cell>
                <Label>등록자 ID</Label>
              </Cell>
              <Cell>admin01</Cell>
              <Cell>
                <Label>등록일</Label>
              </Cell>
              <Cell>2026-03-25</Cell>
            </Row>
          </TableBody>
        </Table>
      </ResizableTableContainer>
    </Modal>
  );
}

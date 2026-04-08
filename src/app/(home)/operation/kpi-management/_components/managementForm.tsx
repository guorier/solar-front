import {
  Cell,
  Column,
  InputComponent,
  Label,
  Modal,
  Row,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableHeader,
} from '@/components';
import { Group, ResizableTableContainer, TextArea } from 'react-aria-components';

export default function KPIManagementForm({
  isOpen,
  onOpen,
}: {
  isOpen: boolean;
  onOpen: () => void;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpen}
      title="성능 지표 추가"
      primaryButton="등록"
      width={900}
    >
      <ResizableTableContainer>
        <Table type="vertical" aria-labelledby="table-title" aria-describedby="table-summary">
          <TableHeader>
            <Column isRowHeader width={140} />
            <Column />
            <Column isRowHeader width={140} />
            <Column />
          </TableHeader>
          <TableBody>
            <Row>
              <Cell>
                <Label className="imp">지표 명</Label>
              </Cell>
              <Cell>
                <InputComponent aria-label="지표 명 입력" placeholder="입력하세요" />
              </Cell>
              <Cell>
                <Label className="imp">발전소</Label>
              </Cell>
              <Cell>
                <Select aria-label="발전소 선택">
                  <SelectItem id="1">발전소 1</SelectItem>
                  <SelectItem id="2">발전소 2</SelectItem>
                </Select>
              </Cell>
            </Row>

            <Row>
              <Cell>
                <Label className="imp">장비 유형</Label>
              </Cell>
              <Cell>
                <Select aria-label="장비 유형 선택">
                  <SelectItem id="1">장비 유형 1</SelectItem>
                  <SelectItem id="2">장비 유형 2</SelectItem>
                </Select>
              </Cell>
              <Cell>
                <Label>지표 유형</Label>
              </Cell>
              <Cell>
                <Select aria-label="지표 유형 선택">
                  <SelectItem id="1">지표 유형 1</SelectItem>
                  <SelectItem id="2">지표 유형 2</SelectItem>
                </Select>
              </Cell>
            </Row>

            <Row>
              <Cell>
                <Label>계산식</Label>
              </Cell>
              <Cell colSpan={3}>
                <InputComponent aria-label="계산식 입력" readOnly value="P / S" />
              </Cell>
            </Row>

            <Row>
              <Cell>
                <Label>설명</Label>
              </Cell>
              <Cell colSpan={3}>
                <div className="react-aria-TextField" style={{ maxWidth: '100%' }}>
                  <TextArea readOnly value="성능 비율" />
                </div>
              </Cell>
            </Row>

            <Row>
              <Cell>
                <Label>단위</Label>
              </Cell>
              <Cell>
                <InputComponent aria-label="단위 입력" readOnly value="퍼센트(%)" />
              </Cell>
              <Cell>
                <Label>사용 여부</Label>
              </Cell>
              <Cell>
                <Select aria-label="사용 여부 선택">
                  <SelectItem id="1">사용</SelectItem>
                  <SelectItem id="2">미사용</SelectItem>
                </Select>
              </Cell>
            </Row>
          </TableBody>
        </Table>
      </ResizableTableContainer>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-5' }}>
        <h3>임계 값 설정</h3>
        <Group style={{ alignItems: 'center', gap: 'var(--spacing-5)' }}>
          <InputComponent label="정상" aria-label="정상 임계 값 입력" placeholder="0.0" />
          <InputComponent label="경고" aria-label="경고 임계 값 입력" placeholder="0.0" />
          <InputComponent label="위험" aria-label="위험 임계 값 입력" placeholder="0.0" />
        </Group>
      </div>
    </Modal>
  );
}

import {
  Cell,
  Column,
  InputComponent,
  Label,
  Modal,
  Radio,
  Row,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableHeader,
} from '@/components';
import { ResizableTableContainer } from 'react-aria-components';

export default function KPISetupForm({ isOpen, onOpen }: { isOpen: boolean; onOpen: () => void }) {
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
                <Label className="imp">카테고리</Label>
              </Cell>
              <Cell>
                <Select aria-label="카테고리 선택">
                  <SelectItem id="1">카테고리 1</SelectItem>
                  <SelectItem id="2">카테고리 2</SelectItem>
                </Select>
              </Cell>
              <Cell>
                <Label>임계치 대상</Label>
              </Cell>
              <Cell>
                <Select aria-label="임계치 대상 선택">
                  <SelectItem id="1">인버터</SelectItem>
                  <SelectItem id="2">접속반</SelectItem>
                  <SelectItem id="3">수배전반</SelectItem>
                  <SelectItem id="4">RTU</SelectItem>
                </Select>
              </Cell>
            </Row>

            <Row>
              <Cell>
                <Label className="imp">지표 기준</Label>
              </Cell>
              <Cell>
                <Select aria-label="지표 기준 선택">
                  <SelectItem id="1">일간</SelectItem>
                  <SelectItem id="2">주간</SelectItem>
                  <SelectItem id="3">월간</SelectItem>
                  <SelectItem id="4">년간</SelectItem>
                </Select>
              </Cell>
              <Cell>
                <Label>목표 값</Label>
              </Cell>
              <Cell>
                <InputComponent aria-label="목표 값 입력" placeholder="입력하세요" />
              </Cell>
            </Row>

            <Row>
              <Cell>
                <Label>주의 임계 값(%)</Label>
              </Cell>
              <Cell>
                <InputComponent aria-label="주의 임계 값(%) 입력" placeholder="입력하세요" />
              </Cell>
              <Cell>
                <Label>위험 임계 값(%)</Label>
              </Cell>
              <Cell>
                <InputComponent aria-label="위험 임계 값(%) 입력" placeholder="입력하세요" />
              </Cell>
            </Row>

            <Row>
              <Cell>
                <Label>사용 상태</Label>
              </Cell>
              <Cell>
                <Radio label="사용" />
                <Radio label="중지" />
              </Cell>
              <Cell></Cell>
              <Cell></Cell>
            </Row>
          </TableBody>
        </Table>
      </ResizableTableContainer>
    </Modal>
  );
}

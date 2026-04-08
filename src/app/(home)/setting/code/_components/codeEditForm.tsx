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
import { Group, ResizableTableContainer } from 'react-aria-components';

export function CodeEditFormModal({ isOpen, onOpen }: { isOpen: boolean; onOpen: () => void }) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpen} title="코드 상세" primaryButton="수정">
      <ResizableTableContainer>
        <Table type="vertical" aria-labelledby="table-title" aria-describedby="table-summary">
          <TableHeader>
            <Column isRowHeader width={120} />
            <Column />
            <Column isRowHeader width={120} />
            <Column />
          </TableHeader>
          <TableBody>
            <Row>
              <Cell>
                <Label htmlFor="cdType" className="imp">
                  코드 구분
                </Label>
              </Cell>
              <Cell colSpan={3}>하위 코드</Cell>
            </Row>

            <Row>
              <Cell>
                <Label htmlFor="masterNm">마스터 명</Label>
              </Cell>
              <Cell>발전소 유형</Cell>
              <Cell>
                <Label htmlFor="masterCd">마스터 코드</Label>
              </Cell>
              <Cell>P01</Cell>
            </Row>

            <Row>
              <Cell>
                <Label htmlFor="codeNm" className="imp">
                  코드명
                </Label>
              </Cell>
              <Cell colSpan={3}>태양열</Cell>
            </Row>

            <Row>
              <Cell>
                <Label htmlFor="code" className="imp">
                  코드
                </Label>
              </Cell>
              <Cell colSpan={3}>001</Cell>
            </Row>

            <Row>
              <Cell>
                <Label htmlFor="status">상태/정렬</Label>
              </Cell>
              <Cell colSpan={3}>
                <Group style={{ alignItems: 'center', gap: 'var(--spacing-8)' }}>
                  <Select style={{ flex: 1 }} id="status" aria-label="상태 선택">
                    <SelectItem id="Y">사용</SelectItem>
                    <SelectItem id="N">미사용</SelectItem>
                  </Select>
                  /
                  <InputComponent
                    style={{ flex: 1 }}
                    id="sort"
                    aria-label="정렬 입력"
                    placeholder="정렬 입력"
                  />
                </Group>
              </Cell>
            </Row>

            <Row>
              <Cell>
                <Label htmlFor="description">설명</Label>
              </Cell>
              <Cell colSpan={3}>
                <InputComponent
                  id="description"
                  aria-label="설명 입력"
                  placeholder="설명을 입력해주세요"
                />
              </Cell>
            </Row>
          </TableBody>
        </Table>
      </ResizableTableContainer>
    </Modal>
  );
}

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

export function CodeCreateFormModal({ isOpen, onOpen }: { isOpen: boolean; onOpen: () => void }) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpen} title="코드 추가" primaryButton="등록">
      <ResizableTableContainer>
        <Table type="vertical" aria-labelledby="table-title" aria-describedby="table-summary">
          <TableHeader>
            <Column isRowHeader width={160} />
            <Column />
          </TableHeader>
          <TableBody>
            <Row>
              <Cell>
                <Label htmlFor="cdType" className="imp">
                  등록 구분
                </Label>
              </Cell>
              <Cell>
                <Select id="cdType" aria-label="등록 구분 선택">
                  <SelectItem id="1">마스터 코드</SelectItem>
                  <SelectItem id="2">서브 코드</SelectItem>
                </Select>
              </Cell>
            </Row>

            <Row>
              <Cell>
                <Label htmlFor="masterCd">마스터 코드</Label>
              </Cell>
              <Cell>
                <Select id="masterCd" aria-label="마스터 코드 선택" isDisabled>
                  <SelectItem id="1">발전소 유형</SelectItem>
                  <SelectItem id="2">발전소 형태</SelectItem>
                </Select>
              </Cell>
            </Row>

            <Row>
              <Cell>
                <Label htmlFor="codeNm" className="imp">
                  코드명
                </Label>
              </Cell>
              <Cell>
                <InputComponent
                  id="codeNm"
                  aria-label="코드명 입력"
                  placeholder="코드명을 입력해주세요"
                />
              </Cell>
            </Row>

            <Row>
              <Cell>
                <Label htmlFor="code" className="imp">
                  코드
                </Label>
              </Cell>
              <Cell>
                <InputComponent
                  id="code"
                  aria-label="코드 입력"
                  placeholder="코드를 입력해주세요"
                />
              </Cell>
            </Row>

            <Row>
              <Cell>
                <Label htmlFor="status">상태/정렬</Label>
              </Cell>
              <Cell>
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
              <Cell>
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

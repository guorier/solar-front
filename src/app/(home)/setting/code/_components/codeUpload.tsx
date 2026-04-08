import {
  ButtonComponent,
  Cell,
  Column,
  Icons,
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

export function CodeUploadModal({ isOpen, onOpen }: { isOpen: boolean; onOpen: () => void }) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpen} title="코드 업로드" primaryButton="등록">
      * 엑셀 파일로 일괄 코드를 업로드 할 수 있습니다.
      <br />
      확장자는 xls, xlsx만 업로드 가능합니다.
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
                  코드 구분
                </Label>
              </Cell>
              <Cell>
                <Select id="cdType" aria-label="코드 구분 선택">
                  <SelectItem id="1">마스터 코드</SelectItem>
                  <SelectItem id="2">서브 코드</SelectItem>
                </Select>
              </Cell>
            </Row>

            <Row>
              <Cell>
                <Label htmlFor="category" className="imp">
                  구분
                </Label>
              </Cell>
              <Cell>
                <Select id="category" aria-label="구분 선택">
                  <SelectItem id="1">붙여쓰기</SelectItem>
                  <SelectItem id="2">덮어쓰기</SelectItem>
                </Select>
              </Cell>
            </Row>

            <Row>
              <Cell>
                <Label htmlFor="file" className="imp">
                  파일
                </Label>
              </Cell>
              <Cell>
                <Group>
                  <InputComponent
                    id="file"
                    aria-label="파일 선택"
                    placeholder="파일을 선택해주세요"
                    readOnly
                  />
                  <ButtonComponent variant="excel" icon={<Icons iName="save" color="white" />} />
                </Group>
              </Cell>
            </Row>
          </TableBody>
        </Table>
      </ResizableTableContainer>
    </Modal>
  );
}

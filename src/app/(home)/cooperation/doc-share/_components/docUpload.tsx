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
import { Group, ResizableTableContainer, TextArea } from 'react-aria-components';

export default function DocUploadModal({
  isOpen,
  onOpen,
}: {
  isOpen: boolean;
  onOpen: () => void;
}) {
  return (
    <Modal
      title="문서 업로드"
      isOpen={isOpen}
      onOpenChange={onOpen}
      primaryButton="등록"
      width={800}
    >
      <p>새 문서를 업로드합니다. (doc, docs, csv, xls, xlsx, ppt, pptx 지원)</p>

      <ResizableTableContainer>
        <Table type="vertical" aria-labelledby="acc-info-title" aria-describedby="acc-info-summary">
          <TableHeader>
            <Column isRowHeader width={120} />
            <Column />
            <Column isRowHeader width={120} />
            <Column />
          </TableHeader>
          <TableBody>
            <Row>
              <Cell>
                <Label htmlFor="title" className="imp">
                  제목
                </Label>
              </Cell>
              <Cell colSpan={3}>
                <InputComponent
                  id="title"
                  aria-label="제목 입력"
                  placeholder="제목을 입력해주세요."
                  maxWidth="100%"
                />
              </Cell>
            </Row>

            <Row>
              <Cell>
                <Label htmlFor="category" className="imp">
                  카테고리
                </Label>
              </Cell>
              <Cell>
                <Select aria-label="카테고리 선택">
                  <SelectItem id="001">운영 매뉴얼</SelectItem>
                  <SelectItem id="002">점검 보고서</SelectItem>
                </Select>
              </Cell>
              <Cell>
                <Label htmlFor="plant" className="imp">
                  발전소
                </Label>
              </Cell>
              <Cell>
                <Select aria-label="발전소 선택">
                  <SelectItem id="001">발전소 A</SelectItem>
                  <SelectItem id="002">발전소 B</SelectItem>
                </Select>
              </Cell>
            </Row>

            <Row>
              <Cell>
                <Label htmlFor="description">설명</Label>
              </Cell>
              <Cell colSpan={3}>
                <div className="react-aria-TextField" style={{ maxWidth: '100%' }}>
                  <TextArea placeholder="설명을 입력해주세요" />
                </div>
              </Cell>
            </Row>

            <Row>
              <Cell>
                <Label htmlFor="tags" className="imp">
                  태그(쉼표구분)
                </Label>
              </Cell>
              <Cell colSpan={3}>
                <InputComponent
                  id="tags"
                  aria-label="태그 입력"
                  placeholder="예) 매뉴얼, 운영 보고서"
                  maxWidth="100%"
                />
              </Cell>
            </Row>

            <Row>
              <Cell>
                <Label htmlFor="file" className="imp">
                  등록자 ID
                </Label>
              </Cell>
              <Cell colSpan={3}>
                <Group>
                  <InputComponent
                    id="file"
                    aria-label="파일 선택"
                    placeholder="파일을 선택해주세요"
                    readOnly
                    maxWidth="100%"
                  />
                  <ButtonComponent icon={<Icons iName="save" color="white" />} />
                </Group>
              </Cell>
            </Row>
          </TableBody>
        </Table>
      </ResizableTableContainer>
    </Modal>
  );
}

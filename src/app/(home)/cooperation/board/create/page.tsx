'use client';

import {
  BottomGroupComponent,
  ButtonComponent,
  Cell,
  Column,
  Icons,
  InputComponent,
  Label,
  Row,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableHeader,
  TitleComponent,
} from '@/components';
import BoardEditor from '@/components/editor/boardEditor';
import { useRouter } from 'next/navigation';
import { Group, ResizableTableContainer } from 'react-aria-components';

export default function BoardCreatePage() {
  const router = useRouter();

  return (
    <>
      <div className="title-group">
        <TitleComponent
          title="공유/협력"
          subTitle="게시판"
          thirdTitle="게시판 등록"
          desc="발전소 운영 정보를 공유하고 소통"
        />
      </div>

      <div className="content-group" style={{ paddingTop: 'var(--spacing-10)' }}>
        <ResizableTableContainer>
          <Table
            type="vertical"
            aria-labelledby="acc-info-title"
            aria-describedby="acc-info-summary"
          >
            <TableHeader>
              <Column isRowHeader width={100} />
              <Column />
              <Column isRowHeader width={100} />
              <Column />
              <Column isRowHeader width={100} />
              <Column />
              <Column isRowHeader width={100} />
              <Column />
            </TableHeader>
            <TableBody>
              <Row>
                <Cell>
                  <Label htmlFor="title" className="imp">
                    제목
                  </Label>
                </Cell>
                <Cell>
                  <InputComponent
                    id="title"
                    aria-label="제목 입력"
                    placeholder="제목을 입력해주세요"
                  />
                </Cell>
                <Cell>
                  <Label htmlFor="category" className="imp">
                    카테고리
                  </Label>
                </Cell>
                <Cell>
                  <Select aria-label="카테고리 선택">
                    <SelectItem>공지사항</SelectItem>
                    <SelectItem>자유게시판</SelectItem>
                    <SelectItem>유지보수</SelectItem>
                  </Select>
                </Cell>
                <Cell>
                  <Label htmlFor="file">첨부 파일</Label>
                </Cell>
                <Cell>
                  <Group>
                    <InputComponent
                      id="file"
                      aria-label="첨부파일 선택"
                      placeholder="첨부파일을 선택해주세요"
                      readOnly
                    />
                    <ButtonComponent icon={<Icons iName="save" color="white" />} />
                  </Group>
                </Cell>
                <Cell>
                  <Label htmlFor="pinned">상단 고정</Label>
                </Cell>
                <Cell>
                  <Select aria-label="상단 고정 여부 선택">
                    <SelectItem>선택</SelectItem>
                    <SelectItem>고정</SelectItem>
                  </Select>
                </Cell>
              </Row>
            </TableBody>
          </Table>
        </ResizableTableContainer>
        <div style={{ height: '900px' }}>
          <BoardEditor />
        </div>
      </div>

      <BottomGroupComponent
        rightCont={
          <div className="button-group">
            <ButtonComponent variant="delete">삭제</ButtonComponent>
            <ButtonComponent variant="outlined" onClick={() => router.push('/cooperation/board')}>
              목록
            </ButtonComponent>
            <ButtonComponent
              variant="contained"
              icon={<Icons iName="plus" size={16} color="#fff" />}
            >
              등록
            </ButtonComponent>
          </div>
        }
      />
    </>
  );
}

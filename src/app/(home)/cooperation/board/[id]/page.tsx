'use client';

import {
  BottomGroupComponent,
  ButtonComponent,
  Cell,
  Column,
  Label,
  Row,
  Table,
  TableBody,
  TableHeader,
  TitleComponent,
} from '@/components';
import BoardEditor from '@/components/editor/boardEditor';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { ResizableTableContainer, TextArea } from 'react-aria-components';
import styled from 'styled-components';

const ContentGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-10);
  height: calc(100vh - 280px);
  min-height: 0;
`;

const EditorArea = styled.div`
  flex: 0 0 500px;
  min-height: 0;
`;

const CommentSection = styled.section`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  background: var(--gray-A100);
  overflow: hidden;
`;

const CommentHeader = styled.p`
  flex: 0 0 auto;
  padding: var(--spacing-5) var(--spacing-10) 0;
`;

const CommentWriteBox = styled.div`
  display: flex;
  gap: var(--spacing-10);
  align-items: center;
  padding: var(--spacing-4) var(--spacing-6);
  border-bottom: 1px solid var(--border-color);
  flex: 0 0 auto;
`;

const CommentList = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`;

const CommentRow = styled.div`
  display: grid;
  grid-template-columns: 260px 1fr auto;
  align-items: center;
  min-height: 64px;
  border-top: 1px solid var(--border-color);

  &:first-child {
    border-top: none;
  }
`;

const CommentMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
`;

const CommentActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
`;

type CommentItem = {
  id: number;
  writer: string;
  date: string;
  content: string;
};

export default function BoardDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<CommentItem[]>([
    {
      id: 1,
      writer: 'dkie2',
      date: '01.03. 11:24:22',
      content: '아하! 좋은 정보 감사합니다.',
    },
    {
      id: 2,
      writer: 'd83ksjk',
      date: '01.02. 11:22:10',
      content: '추가 되는 내용이 또 있을 까요?',
    },
    {
      id: 3,
      writer: 'dkie2',
      date: '01.03. 11:24:22',
      content: '아하! 좋은 정보 감사합니다.',
    },
    {
      id: 4,
      writer: 'd83ksjk',
      date: '01.02. 11:22:10',
      content: '추가 되는 내용이 또 있을 까요?',
    },
    {
      id: 5,
      writer: 'dkie2',
      date: '01.03. 11:24:22',
      content: '아하! 좋은 정보 감사합니다.',
    },
    {
      id: 6,
      writer: 'd83ksjk',
      date: '01.02. 11:22:10',
      content: '추가 되는 내용이 또 있을 까요?',
    },
  ]);

  const handleAddComment = () => {
    if (!comment.trim()) return;

    const newComment: CommentItem = {
      id: Date.now(),
      writer: 'admin',
      date: '2026.03.31 16:20:00',
      content: comment.trim(),
    };

    setComments((prev) => [newComment, ...prev]);
    setComment('');
  };

  const handleDeleteComment = (id: number) => {
    setComments((prev) => prev.filter((item) => item.id !== id));
  };

  console.log(id);

  return (
    <>
      <div className="title-group">
        <TitleComponent
          title="공유/협력"
          subTitle="게시판"
          thirdTitle="게시판 상세"
          desc="발전소 운영 정보를 공유하고 소통"
        />
      </div>

      <div className="content-group" style={{ paddingTop: 'var(--spacing-10)' }}>
        <ContentGroup>
          <ResizableTableContainer>
            <Table
              type="vertical"
              aria-labelledby="acc-info-title"
              aria-describedby="acc-info-summary"
            >
              <TableHeader>
                <Column isRowHeader width={120} />
                <Column />
                <Column isRowHeader width={120} />
                <Column />
                <Column isRowHeader width={120} />
                <Column />
                <Column isRowHeader width={120} />
                <Column />
              </TableHeader>
              <TableBody>
                <Row>
                  <Cell>
                    <Label htmlFor="title">제목</Label>
                  </Cell>
                  <Cell colSpan={7}>
                    왜 1년 중 7월과 8월만이 유일하게 연속으로 31일 존재하는가?
                  </Cell>
                </Row>
                <Row>
                  <Cell>
                    <Label htmlFor="category">카테고리</Label>
                  </Cell>
                  <Cell>자유게시판</Cell>
                  <Cell>
                    <Label htmlFor="file">첨부 파일</Label>
                  </Cell>
                  <Cell>XX 매뉴얼.pdf</Cell>
                  <Cell>
                    <Label htmlFor="registId">등록 ID</Label>
                  </Cell>
                  <Cell>amdin</Cell>
                  <Cell>
                    <Label htmlFor="registDt">등록 일시</Label>
                  </Cell>
                  <Cell>2026-03-31 16:20</Cell>
                </Row>
              </TableBody>
            </Table>
          </ResizableTableContainer>

          <EditorArea>
            <BoardEditor
              content="원래 로마 달력에서는 율리우스 카이사르를 기리는 7월(July)이 31일이었고, 그 다음 달은 30일이었습니다. 이후 아구스투스 황제를 기리기 위해 그의 달인 8월(August)의 일수가 7월보다 짧은 것을 용납할 수 없다고 여겨, 2월에서 하루를 가져와 8월도 31일로 만들었다는 일화가 널리 알려져있습니다."
              isEditMode={isEditMode}
            />
          </EditorArea>

          <CommentSection>
            <CommentHeader>현재 {comments.length}개의 댓글 등록 되었습니다.</CommentHeader>

            <CommentWriteBox>
              <div className="react-aria-TextField" style={{ flex: 1 }}>
                <TextArea
                  placeholder="댓글을 입력해주세요."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              <ButtonComponent onClick={handleAddComment}>댓글 입력</ButtonComponent>
            </CommentWriteBox>

            <CommentList>
              {comments.map((item) => (
                <CommentRow key={item.id}>
                  <CommentMeta>
                    <p>{item.writer}</p>
                    <p>({item.date})</p>
                  </CommentMeta>

                  <p>{item.content}</p>

                  <CommentActions>
                    <ButtonComponent variant="delete" onClick={() => handleDeleteComment(item.id)}>
                      삭제
                    </ButtonComponent>
                    <ButtonComponent>수정</ButtonComponent>
                  </CommentActions>
                </CommentRow>
              ))}
            </CommentList>
          </CommentSection>
        </ContentGroup>
      </div>

      <BottomGroupComponent
        rightCont={
          <div className="button-group">
            <ButtonComponent variant="delete">삭제</ButtonComponent>
            <ButtonComponent variant="outlined" onClick={() => setIsEditMode((prev) => !prev)}>
              수정
            </ButtonComponent>
            <ButtonComponent variant="contained" onClick={() => router.push('/cooperation/board')}>
              목록
            </ButtonComponent>
          </div>
        }
      />
    </>
  );
}

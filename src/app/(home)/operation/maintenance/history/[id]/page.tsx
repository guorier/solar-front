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
import { useParams, useRouter } from 'next/navigation';
import { Group, Heading, ResizableTableContainer, TextArea } from 'react-aria-components';

export default function HistoryDetailPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id;

  console.log(id);

  return (
    <>
      <div className="title-group">
        <TitleComponent
          title="운영 관리"
          subTitle="유지보수"
          thirdTitle="정비 이력"
          desc="유지보수 중 장애 접수에 출동 처리 된 이력 조회"
        />
      </div>

      <div className="content-group" style={{ paddingTop: 'var(--spacing-10)' }}>
        <Group className="row-group" style={{ gap: 'var(--spacing-16)' }}>
          <div>
            <Heading level={3} id="acc-info-title">
              Work Order 상세 정보
            </Heading>
            <p id="acc-info-summary" className="sr-only">
              장애 발생 상세 내용을 확인할 수 있는 표입니다.
            </p>
            <ResizableTableContainer>
              <Table
                type="vertical"
                aria-labelledby="acc-info-title"
                aria-describedby="acc-info-summary"
              >
                <TableHeader>
                  <Column isRowHeader width={160} />
                  <Column />
                  <Column isRowHeader width={160} />
                  <Column />
                </TableHeader>
                <TableBody>
                  <Row>
                    <Cell>
                      <Label>작업 코드</Label>
                    </Cell>
                    <Cell>WO-2550-002-001</Cell>
                    <Cell>
                      <Label>접수 일시</Label>
                    </Cell>
                    <Cell>2026-03-25 11:22:33</Cell>
                  </Row>

                  <Row>
                    <Cell>
                      <Label>상태</Label>
                    </Cell>
                    <Cell>완료</Cell>
                    <Cell>
                      <Label>작업 유형</Label>
                    </Cell>
                    <Cell>부품 교체</Cell>
                  </Row>

                  <Row>
                    <Cell>
                      <Label>현장</Label>
                    </Cell>
                    <Cell>와이어블 발전소 1호기</Cell>
                    <Cell>
                      <Label>담당자</Label>
                    </Cell>
                    <Cell>신짱구</Cell>
                  </Row>

                  <Row>
                    <Cell>
                      <Label>예상 소요 시간</Label>
                    </Cell>
                    <Cell>1시간 30분</Cell>
                    <Cell>
                      <Label>실제 소요 시간</Label>
                    </Cell>
                    <Cell>1시간 20분</Cell>
                  </Row>

                  <Row>
                    <Cell>
                      <Label>장애 명</Label>
                    </Cell>
                    <Cell>전압 편차 발생</Cell>
                    <Cell>
                      <Label>장치 명</Label>
                    </Cell>
                    <Cell>인버터 #1</Cell>
                  </Row>

                  <Row>
                    <Cell>
                      <Label>발생 일시</Label>
                    </Cell>
                    <Cell>2026-03-25 11:22:33</Cell>
                    <Cell>
                      <Label>장애 코드</Label>
                    </Cell>
                    <Cell>A2500</Cell>
                  </Row>

                  <Row>
                    <Cell>
                      <Label>제조사</Label>
                    </Cell>
                    <Cell>삼성전자</Cell>
                    <Cell>
                      <Label>발생 등급</Label>
                    </Cell>
                    <Cell>Critical</Cell>
                  </Row>

                  <Row>
                    <Cell colSpan={4} style={{ backgroundColor: 'white', height: '16px' }} />
                  </Row>

                  <Row>
                    <Cell>
                      <Label>접수 상황 내용</Label>
                    </Cell>
                    <Cell colSpan={3}>
                      <div className="react-aria-TextField" style={{ maxWidth: '100%' }}>
                        <TextArea value="장애 상황이었음" readOnly />
                      </div>
                    </Cell>
                  </Row>

                  <Row>
                    <Cell colSpan={4} style={{ backgroundColor: 'white', height: '16px' }} />
                  </Row>

                  <Row>
                    <Cell>
                      <Label>작업 내용</Label>
                    </Cell>
                    <Cell colSpan={3}>
                      <div className="react-aria-TextField" style={{ maxWidth: '100%' }}>
                        <TextArea value="작업하였음" readOnly />
                      </div>
                    </Cell>
                  </Row>

                  <Row>
                    <Cell colSpan={4} style={{ backgroundColor: 'white', height: '16px' }} />
                  </Row>

                  <Row>
                    <Cell>
                      <Label>현장 점검 결과</Label>
                    </Cell>
                    <Cell colSpan={3}>
                      <div className="react-aria-TextField" style={{ maxWidth: '100%' }}>
                        <TextArea value="현장 점검 성공" readOnly />
                      </div>
                    </Cell>
                  </Row>

                  <Row>
                    <Cell colSpan={4} style={{ backgroundColor: 'white', height: '16px' }} />
                  </Row>

                  <Row>
                    <Cell>
                      <Label>조치 사항</Label>
                    </Cell>
                    <Cell colSpan={3}>
                      <div className="react-aria-TextField" style={{ maxWidth: '100%' }}>
                        <TextArea value="조치하였음" readOnly />
                      </div>
                    </Cell>
                  </Row>
                </TableBody>
              </Table>
            </ResizableTableContainer>
          </div>
        </Group>
      </div>

      <BottomGroupComponent
        rightCont={
          <div className="button-group">
            <ButtonComponent
              variant="outlined"
              onClick={() => router.push('/operation/maintenance/history')}
            >
              목록
            </ButtonComponent>
            <ButtonComponent variant="contained">보고서</ButtonComponent>
          </div>
        }
      />
    </>
  );
}

'use client';

import {
  BottomGroupComponent,
  ButtonComponent,
  Cell,
  Column,
  Label,
  Row,
  Radio,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableHeader,
  TitleComponent,
} from '@/components';
import { useParams, useRouter } from 'next/navigation';
import {
  Group,
  Heading,
  ResizableTableContainer,
  TextArea,
  RadioGroup,
} from 'react-aria-components';

export default function DispatchDetailPage() {
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
          thirdTitle="출동 관리"
          desc="장애 발생 내용에 대한 장애 접수 기능"
        />
      </div>

      <div className="content-group" style={{ paddingTop: 'var(--spacing-10)' }}>
        <Group className="row-group" style={{ gap: 'var(--spacing-16)' }}>
          <div>
            <Heading level={3} id="acc-info-title">
              Work Order 상세 정보
            </Heading>
            <p id="acc-info-summary" className="sr-only">
              장애 발생 상세 내용 확인 및 수정할 수 있는 표입니다.
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
                    <Cell>
                      <RadioGroup>
                        <Radio value="1" label="진행중" />
                        <Radio value="2" label="대기중" />
                        <Radio value="3" label="완료" />
                      </RadioGroup>
                    </Cell>
                    <Cell>
                      <Label className="imp">작업 유형</Label>
                    </Cell>
                    <Cell>
                      <Select aria-label="작업유형 선택" placeholder="작업유형 선택">
                        <SelectItem>부품 교체 작업</SelectItem>
                        <SelectItem>그냥 작업</SelectItem>
                      </Select>
                    </Cell>
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
                      <Label className="imp">실제 소요 시간</Label>
                    </Cell>
                    <Cell>
                      <Group style={{ gap: 'var(--spacing-6)' }}>
                        <Group style={{ alignItems: 'center' }}>
                          <Select aria-label="시간 선택">
                            <SelectItem>01</SelectItem>
                            <SelectItem>02</SelectItem>
                            <SelectItem>03</SelectItem>
                          </Select>
                          <span style={{ width: '100%' }}>시간</span>
                        </Group>

                        <Group style={{ alignItems: 'center' }}>
                          <Select aria-label="분 선택">
                            <SelectItem>10</SelectItem>
                            <SelectItem>20</SelectItem>
                            <SelectItem>30</SelectItem>
                          </Select>
                          <span style={{ width: '100%' }}>분</span>
                        </Group>
                      </Group>
                    </Cell>
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
                        <TextArea placeholder="장애 접수 상황을 상세히 기술해주세요." />
                      </div>
                    </Cell>
                  </Row>

                  <Row>
                    <Cell colSpan={4} style={{ backgroundColor: 'white', height: '16px' }} />
                  </Row>

                  <Row>
                    <Cell>
                      <Label className="imp">작업 내용</Label>
                    </Cell>
                    <Cell colSpan={3}>
                      <div className="react-aria-TextField" style={{ maxWidth: '100%' }}>
                        <TextArea placeholder="작업 내용을 입력해주세요" />
                      </div>
                    </Cell>
                  </Row>

                  <Row>
                    <Cell colSpan={4} style={{ backgroundColor: 'white', height: '16px' }} />
                  </Row>

                  <Row>
                    <Cell>
                      <Label className="imp">현장 점검 결과</Label>
                    </Cell>
                    <Cell colSpan={3}>
                      <div className="react-aria-TextField" style={{ maxWidth: '100%' }}>
                        <TextArea placeholder="현장 점검 결과를 입력해주세요" />
                      </div>
                    </Cell>
                  </Row>

                  <Row>
                    <Cell colSpan={4} style={{ backgroundColor: 'white', height: '16px' }} />
                  </Row>

                  <Row>
                    <Cell>
                      <Label className="imp">조치 사항</Label>
                    </Cell>
                    <Cell colSpan={3}>
                      <div className="react-aria-TextField" style={{ maxWidth: '100%' }}>
                        <TextArea placeholder="조치 사항 내용을 입력해주세요" />
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
              onClick={() => router.push('/operation/maintenance/dispatch')}
            >
              목록
            </ButtonComponent>
            <ButtonComponent variant="contained">수정</ButtonComponent>
          </div>
        }
      />
    </>
  );
}

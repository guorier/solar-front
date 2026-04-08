'use client';

import {
  BottomGroupComponent,
  ButtonComponent,
  Icons,
  Cell,
  Column,
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
import { useRouter } from 'next/navigation';
import { Group, Heading, ResizableTableContainer, TextArea } from 'react-aria-components';
import ErrorSearchModal from './_components/errorSearch';
import TaskSearchModal from './_components/taskSearch';
import { useState } from 'react';

export default function DispatchCreatePage() {
  const router = useRouter();

  const [isErrSearchOpen, setIsErrSearchOpen] = useState<boolean>(false);
  const [isTaskSearchOpen, setIsTaskSearchOpen] = useState<boolean>(false);

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
              장애 접수
            </Heading>
            <p id="acc-info-summary" className="sr-only">
              장애 발생 내용을 입력하는 표입니다.
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
                      <Label className="imp">장애 접수 명</Label>
                    </Cell>
                    <Cell colSpan={3} style={{ width: '100%' }}>
                      <InputComponent
                        aria-label="장애 접수 명"
                        placeholder="장애 접수 명 입력"
                        title="장애 접수 명 입력"
                        value=""
                        maxWidth="100%"
                      />
                    </Cell>
                  </Row>

                  <Row>
                    <Cell>
                      <Label className="imp">발전소</Label>
                    </Cell>
                    <Cell>
                      <Select aria-label="발전소 선택" placeholder="발전소 선택">
                        <SelectItem>와이어블 1호기</SelectItem>
                        <SelectItem>와이어블 2호기</SelectItem>
                        <SelectItem>와이어블 3호기</SelectItem>
                      </Select>
                    </Cell>
                    <Cell>
                      <Label className="imp">점검유형</Label>
                    </Cell>
                    <Cell>
                      <Select aria-label="점검유형 선택" placeholder="점검유형 선택">
                        <SelectItem>단순 점검</SelectItem>
                        <SelectItem>장애 점검</SelectItem>
                      </Select>
                    </Cell>
                  </Row>

                  <Row>
                    <Cell>
                      <Label className="imp">장애 명</Label>
                    </Cell>
                    <Cell>
                      <Group>
                        <InputComponent
                          aria-label="장애명"
                          placeholder="장애명을 검색해주세요"
                          title="장애명 검색"
                          readOnly
                          value=""
                        />
                        <ButtonComponent
                          variant="contained"
                          onClick={() => setIsErrSearchOpen(true)}
                        >
                          검색
                        </ButtonComponent>
                      </Group>
                    </Cell>
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
                    <Cell>
                      <Label>상위 작업 명</Label>
                    </Cell>
                    <Cell>
                      <Group>
                        <InputComponent
                          aria-label="상위 작업 명"
                          placeholder="상위 작업 명을 검색해주세요"
                          title="상위 작업 명 검색"
                          readOnly
                          value=""
                        />
                        <ButtonComponent
                          variant="contained"
                          onClick={() => setIsTaskSearchOpen(true)}
                        >
                          검색
                        </ButtonComponent>
                      </Group>
                    </Cell>
                    <Cell>
                      <Label>상위 작업 코드</Label>
                    </Cell>
                    <Cell>WO-2550-002-001</Cell>
                  </Row>

                  <Row>
                    <Cell>
                      <Label className="imp">담당자</Label>
                    </Cell>
                    <Cell>
                      <InputComponent
                        aria-label="담당자"
                        placeholder="담당자를 입력해주세요"
                        title="담당자 입력"
                        value=""
                      />
                    </Cell>
                    <Cell>
                      <Label className="imp">작업 예상 시간</Label>
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
                    <Cell colSpan={4} style={{ backgroundColor: 'white', height: '16px' }} />
                  </Row>

                  <Row>
                    <Cell>
                      <Label className="imp">상세 설명</Label>
                    </Cell>
                    <Cell colSpan={3}>
                      <div className="react-aria-TextField" style={{ maxWidth: '100%' }}>
                        <TextArea placeholder="장애 접수 상황을 상세히 기술해주세요." />
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
            <ButtonComponent
              variant="contained"
              icon={<Icons iName="plus" size={16} color="#fff" />}
            >
              등록
            </ButtonComponent>
          </div>
        }
      />

      <ErrorSearchModal
        isOpen={isErrSearchOpen}
        onOpen={() => setIsErrSearchOpen((prev) => !prev)}
      />
      <TaskSearchModal
        isOpen={isTaskSearchOpen}
        onOpen={() => setIsTaskSearchOpen((prev) => !prev)}
      />
    </>
  );
}

'use client';

import {
  BottomGroupComponent,
  ButtonComponent,
  Cell,
  Column,
  Icons,
  Label,
  Row,
  Table,
  TableBody,
  TableHeader,
  TitleComponent,
} from '@/components';
import { Group, Heading, Input, ResizableTableContainer } from 'react-aria-components';
import { styled } from 'styled-components';

const DescBox = styled.div`
  padding: var(--spacing-10);
  border-radius: var(--radius);
  border: 1px solid var(--border-color);
  background: var(--gray-5);
  line-height: 1.4;
  color: var(--text-color);

  p {
    font-weight: 700;
  }

  ul {
    li {
      padding-left: var(--spacing-5);
      font-weight: 500;

      &::before {
        display: inline-block;
        content: '';
        width: 4px;
        height: 4px;
        border-radius: var(--radius-full);
        background: var(--gray-70);
        vertical-align: middle;
        margin: -2px 10px 0 0;
      }

      a {
        display: inline-block;
      }
    }
  }
`;

export default function FormulaPage() {
  return (
    <>
      <div className="title-group">
        <TitleComponent
          title="설정 관리"
          subTitle="수식 설정"
          desc="REC 정산에 사용하는 가중치 기준 값 및 기타 비율 설정을 등록 설정한다."
        />
      </div>

      <div className="content-group">
        <Group className="row-group" style={{ gap: 'var(--spacing-16)' }}>
          
          {/* 가중치 table */}
          <div>
            <Heading level={3} id="rec-title">
              REC 기본 가중치
            </Heading>
            <p id="rec-summary" className="sr-only">
              일반 부지, 건축물, 수상 태양광 등 값을 입력하는 표입니다.
            </p>
            <ResizableTableContainer>
              <Table type="vertical" aria-labelledby="rec-title" aria-describedby="rec-summary">
                <TableHeader>
                  <Column isRowHeader width={240} />
                  <Column />
                  <Column isRowHeader width={240} />
                  <Column />
                  <Column isRowHeader width={240} />
                  <Column />
                </TableHeader>
                <TableBody>
                  <Row>
                    <Cell>
                      <Label htmlFor="">일반 부지(99kW)</Label>
                    </Cell>
                    <Cell>
                      <div className="react-aria-TextField ta-r">
                        <Input id="" aria-label="일반 부지 99kW 값 입력" placeholder="예)1.2" />
                      </div>
                    </Cell>
                    <Cell>
                      <Label htmlFor="">일반 부지(100kW ~ 3MW)</Label>
                    </Cell>
                    <Cell>
                      <div className="react-aria-TextField ta-r">
                        <Input id="" aria-label="일반 부지 100kW부터 3MW 값 입력" placeholder="예)1.2" />
                      </div>
                    </Cell>
                    <Cell>
                      <Label htmlFor="">일반 부지(3MW 이상)</Label>
                    </Cell>
                    <Cell>
                      <div className="react-aria-TextField ta-r">
                        <Input id="" aria-label="일반 부지 3MW 이상 값 입력" placeholder="예)1.2" />
                      </div>
                    </Cell>
                  </Row>
                  <Row>
                    <Cell>
                      <Label htmlFor="">건축물 (3MW) 上</Label>
                    </Cell>
                    <Cell>
                      <div className="react-aria-TextField ta-r">
                        <Input id="" aria-label="일반 부지 건축물 3MW 상 값 입력" placeholder="예)1.2" />
                      </div>
                    </Cell>
                    <Cell>
                      <Label htmlFor="">건축물(3MW) 下</Label>
                    </Cell>
                    <Cell>
                      <div className="react-aria-TextField ta-r">
                        <Input id="" aria-label="일반 부지 건축물 3MW 하 값 입력" placeholder="예)1.2" />
                      </div>
                    </Cell>
                    <Cell>
                      <Label htmlFor="">수상 태양광</Label>
                    </Cell>
                    <Cell>
                      <div className="react-aria-TextField ta-r">
                        <Input id="" aria-label="수상 태양광 값 입력" placeholder="예)1.2" />
                      </div>
                    </Cell>
                  </Row>
                </TableBody>
              </Table>
            </ResizableTableContainer>
          </div>

         {/* desc box */}
          <DescBox>
            <p>태양광 가중치 요약표 (2024년 기준)</p>
            <ul>
              <li>건축물 ▶ 3000kW 이하 경우 1.5 적용, 3000kW 이상의 경우 1.0 적용</li>
              <li>수상 태양광 ▶ 댐, 저수지 등 수면 위 1.5 적용</li>
              <li>
                일반 부지 ▶ 99kW 1.2 적용, 100kW 이상~3MW 이하 경우 1.0 적용 , 3MW 초과시 0.7 적용
              </li>
              <li>
                행정 규칙{' '}
                <a
                  href="https://www.law.go.kr/admRulLsInfoP.do?admRulId=2044168&efYd=0"
                  target="_blank"
                >
                  https://www.law.go.kr/admRulLsInfoP.do?admRulId=2044168&efYd=0
                </a>{' '}
                하단 “신·재생에너지원별 가중치” 파일 참조
              </li>
            </ul>
          </DescBox>

          {/* 가중치 table */}
          <div>
            <Heading level={3} id="ratio-title">
              수식 비율 
            </Heading>
            <p id="ratio-summary" className="sr-only">
              
            </p>
            <ResizableTableContainer>
              <Table aria-labelledby="rec-title" aria-describedby="rec-summary">
                <TableHeader>
                  <Column width={300} isRowHeader>구분 명</Column>
                  <Column width={300}>가중치</Column>
                  <Column>설명</Column>
                </TableHeader>
                <TableBody>
                  <Row>
                    <Cell>
                      <Label htmlFor="">배출 계수</Label>
                    </Cell>
                    <Cell>
                      <div className="react-aria-TextField ta-r">
                        <Input id="" aria-label="배출계수 가중치 입력" placeholder="예)1.2" />
                      </div>
                    </Cell>
                    <Cell>CO2 배출 계수 가중치</Cell>
                  </Row>
                  <Row>
                    <Cell>
                      <Label htmlFor="">수수료</Label>
                    </Cell>
                    <Cell>
                      <div className="react-aria-TextField ta-r">
                        <Input id="" aria-label="수수료 가중치 입력" placeholder="예)1.2" />
                      </div>
                    </Cell>
                    <Cell>수수료 계산 비율 5% 이면 5를 입력, 소수점 까지 입력 가능</Cell>
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
              variant="contained"
              icon={<Icons iName="save" size={16} color="#fff" />}
            >
              저장
            </ButtonComponent>
          </div>
        }
      />
    </>
  );
}

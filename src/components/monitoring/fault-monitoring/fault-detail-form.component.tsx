'use client';

import { ButtonComponent, Cell, Column, Row, Table, TableBody, TableHeader } from '@/components';
import { Heading, TextArea, TextField } from 'react-aria-components';

type FaultDetailFormProps = object;

const FaultInfoTable = () => (
  <div>
    <Heading level={3} id="info-title">장애정보</Heading>
    <p id="info-summary" className="sr-only">
      장애 상태, 장치명, 임계치, 등급, 위치, 코드 등 장애의 상세 내용을 확인하는 표입니다.
    </p>
    <Table type="vertical" aria-labelledby="info-title" aria-describedby="info-summary">
      <TableHeader className="sr-only">
        <Column isRowHeader />
        <Column />
        <Column isRowHeader />
        <Column />
        <Column isRowHeader />
        <Column />
      </TableHeader>
      <TableBody>
        <Row>
          <Cell>장애 상태</Cell>
          <Cell>발생</Cell>
          <Cell>장치 명</Cell>
          <Cell>DEJN_BB_SW</Cell>
          <Cell>임계치</Cell>
          <Cell>-</Cell>
        </Row>
        <Row>
          <Cell>장애 등급</Cell>
          <Cell>critical</Cell>
          <Cell>장애발생위치</Cell>
          <Cell colSpan={3}>if_Index.38305792</Cell>
        </Row>
        <Row>
          <Cell>장애코드</Cell>
          <Cell>A9990</Cell>
          <Cell>장애 명</Cell>
          <Cell>3003</Cell>
          <Cell>발생 시간</Cell>
          <Cell>2025-01-10 10:50:45</Cell>
        </Row>
        <Row>
          <Cell>인지 시간</Cell>
          <Cell>-</Cell>
          <Cell>복구 시간</Cell>
          <Cell>-</Cell>
          <Cell>복구자 명</Cell>
          <Cell>-</Cell>
        </Row>
        <Row>
          <Cell>장비 제조사</Cell>
          <Cell>삼성전자</Cell>
          <Cell>이장 시간</Cell>
          <Cell></Cell>
          <Cell></Cell>
          <Cell></Cell>
        </Row>
        <Row>
          <Cell>장애 설명</Cell>
          <Cell colSpan={5}>ENB ACCESS FAIL ALARM ENB와 접속이 불가</Cell>
        </Row>
        <Row>
          <Cell>서비스 영향</Cell>
          <Cell colSpan={5}>일부 전력 생산 추적 불가</Cell>
        </Row>
        <Row>
          <Cell>발생 원인</Cell>
          <Cell colSpan={5}>연결불량</Cell>
        </Row>
        <Row>
          <Cell>확인 방법</Cell>
          <Cell colSpan={5}>연결 확인</Cell>
        </Row>
        <Row>
          <Cell>조치 방법</Cell>
          <Cell colSpan={5}>연결 상태 확인 체크 진행 필요</Cell>
        </Row>
      </TableBody>
    </Table>
  </div>
);
const FaultMaintainTable = () => (
  <div>
    <Heading id="maint-title" level={3}>유지보수</Heading>
    <p id="maint-summary" className="sr-only">
      장애상태, 장치명, 임계치, 장애등급, 위치, 코드 등을 표시한 표입니다.
    </p>
    <Table type="vertical" cellWidth={180} aria-labelledby="maint-title" aria-describedby="maint-summary">
      <TableHeader className="sr-only">
        <Column isRowHeader />
        <Column />
        <Column isRowHeader />
        <Column />
        <Column isRowHeader />
        <Column />
      </TableHeader>
      <TableBody>
        <Row>
          <Cell>유지보수 담당자(정)</Cell>
          <Cell>-</Cell>
          <Cell>유지보수사(정)</Cell>
          <Cell>-</Cell>
          <Cell>유지보수사(부)</Cell>
          <Cell>-</Cell>
        </Row>
        <Row>
          <Cell>유지보수 담당자(정)</Cell>
          <Cell>-</Cell>
          <Cell>유지보수 연락처(정)</Cell>
          <Cell>-</Cell>
          <Cell>유지보수 연락처 (부)</Cell>
          <Cell>-</Cell>
        </Row>
      </TableBody>
    </Table>
  </div>
);

const FaultContTable = () => (
  <div>
    <Heading level={3}>장애 내역</Heading>
    <TextField isReadOnly>
      <TextArea
        value="[eNB]
GURO-EMS-LSM12 2024-11-20 11:42:22.000 ** A2116378 OPTIC TRANSCEIVER RX LOS ALARM
NETWORKELEMENT = DU008030268811 LOCATION =
DU008030268811/eNB_67615/RACK[0]/SHELF[0]/SLOT[1]-ECP[0]/A_SIDE/CPRI_PORT[4] EVENTTYPE =
EQUIPMENT ALARM PROBABLECAUSE = LINE INTERFACE FAILURE SPECIFICPROBLEM = OPTIC TRANSCEIVER
RX LOS"
      />
    </TextField>
  </div>
);

export const FaultDetailForm: React.FC<FaultDetailFormProps> = () => {
  return (
    <>
      <FaultInfoTable />
      <FaultMaintainTable />
      <FaultContTable />

      <div>
        <div className="button-group">
          <ButtonComponent variant="contained">메모 저장</ButtonComponent>
        </div>
        <TextField>
          <TextArea value="" />
        </TextField>
      </div>
    </>
  );
};
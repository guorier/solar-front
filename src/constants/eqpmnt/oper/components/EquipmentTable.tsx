'use client';

import React, { useMemo, useCallback } from 'react';
import {
  Table,
  TableHeader,
  Column,
  TableBody,
  Row,
  Cell,
  Label,
  Select,
  SelectItem,
} from '@/components';
import { EquipmentInfoBox } from '@/components/eqpmnt/EquipmentInfoBox';
import { Heading, ResizableTableContainer } from 'react-aria-components';

export type MasterCode =
  | 'RTU' // 원격 단말 장치
  | 'CTD' // 제어 장치
  | 'GAT' // 게이트웨이
  | 'HMI' // 운영 인터페이스 장치
  | 'INS' // 점검 장치
  | 'ICF' // 구내 통신 장치
  | 'RCA' // 원격 통신 장치
  | 'SRC' // 직렬 통신 장치
  | 'OPS' // 운영 서버 장치
  | 'DTS' // 데이터 서버 장치
  | 'MGS' // 관리 서버 장치
  | 'UPS' // 무정전 전원 장치
  | 'PWS' // 전원 공급 장치
  | 'TMS' // 시간 동기 장치
  | 'LCC' // 로컬 제어 장치
  | 'RMC' // 원격 제어 장치
  | 'MTN' // 유지보수 접속
  | 'RMA' // 원격 접속 장치
  | 'OPM'; // 운영 계측 장치

type SubCodeOption = {
  code: string;
  name: string;
};

const SUB_CODE_OPTIONS: Record<MasterCode, SubCodeOption[]> = {
  RTU: [
    { code: '01', name: 'RTU' },
    { code: '02', name: '지능형전자장치' },
  ],
  CTD: [
    { code: '01', name: 'PLC' },
    { code: '02', name: 'PAC' },
  ],
  GAT: [
    { code: '01', name: '엣지게이트웨이' },
    { code: '02', name: '프로토콜변환기' },
    { code: '03', name: 'IoT게이트웨이' },
  ],
  HMI: [
    { code: '01', name: '로컬HMI' },
    { code: '02', name: '웹HMI' },
  ],
  INS: [
    { code: '01', name: '드론점검시스템' },
    { code: '02', name: '열화상카메라' },
    { code: '03', name: 'EL검사기' },
    { code: '04', name: 'I-V커브측정기' },
    { code: '05', name: '휴대용단말기' },
  ],
  ICF: [
    { code: '01', name: '네트워크스위치' },
    { code: '02', name: '허브' },
    { code: '03', name: '광컨버터' },
  ],
  RCA: [
    { code: '01', name: '라우터' },
    { code: '02', name: '방화벽' },
    { code: '03', name: 'VPN장비' },
    { code: '04', name: 'LTE모뎀' },
  ],
  SRC: [
    { code: '01', name: 'RS485컨버터' },
    { code: '02', name: 'RS232컨버터' },
  ],
  OPS: [
    { code: '01', name: 'SCADA서버' },
    { code: '02', name: 'EMS서버' },
    { code: '03', name: '웹서버' },
    { code: '04', name: '앱서버' },
  ],
  DTS: [
    { code: '01', name: '히스토리안' },
    { code: '02', name: 'DB서버' },
    { code: '03', name: '백업서버' },
  ],
  MGS: [
    { code: '01', name: 'NMS서버' },
    { code: '02', name: 'SMS서버' },
  ],
  UPS: [
    { code: '01', name: '온라인UPS' },
    { code: '02', name: '라인인터랙티브UPS' },
    { code: '03', name: 'UPS배터리' },
  ],
  PWS: [
    { code: '01', name: 'DC전원공급기' },
    { code: '02', name: 'AC전원공급기' },
  ],
  TMS: [
    { code: '01', name: 'GPS시계' },
    { code: '02', name: 'NTP서버' },
  ],
  LCC: [
    { code: '01', name: '로컬제어반' },
    { code: '02', name: '모터제어스테이션' },
  ],
  RMC: [
    { code: '01', name: '원격제어패널' },
    { code: '02', name: '인터록장치' },
  ],
  MTN: [
    { code: '01', name: '서비스포트' },
    { code: '02', name: '콘솔포트' },
  ],
  RMA: [
    { code: '01', name: '원격접속게이트웨이' },
    { code: '02', name: '아웃오브밴드' },
  ],
  OPM: [
    { code: '01', name: '패널미터' },
    { code: '02', name: '로컬미터' },
  ],
};

export type StructState = Record<MasterCode, string>;

type EquipmentTableProps = {
  value: StructState;
  onChange: (key: MasterCode, value: string) => void;
  onAdd?: () => void;
  onRemove?: () => void;
  count?: number;
};

const renderSubItems = (masterCode: MasterCode) => {
  return SUB_CODE_OPTIONS[masterCode].map((opt) => (
    <SelectItem key={opt.code} id={opt.code} textValue={opt.name}>
      {opt.name}
    </SelectItem>
  ));
};

const SECTION_CODES = {
  operate: ['RTU', 'CTD', 'GAT', 'HMI', 'INS'] as const,
  communication: ['ICF', 'RCA', 'SRC'] as const,
  server: ['OPS', 'DTS', 'MGS'] as const,
  power: ['UPS', 'PWS'] as const,
  time: ['TMS'] as const,
  control: ['LCC', 'RMC'] as const,
  access: ['MTN', 'RMA'] as const,
  measure: ['OPM'] as const,
};

const DEFAULT_SELECT_ITEM = (
  <SelectItem key="" id="" textValue="선택">
    선택
  </SelectItem>
);

const getSelectedKey = (value: StructState, code: MasterCode) => {
  return value[code] || undefined;
};

const createOnSelectionChange = (
  onChange: (key: MasterCode, value: string) => void,
  code: MasterCode,
) => {
  return (key: React.Key | null) => onChange(code, String(key ?? ''));
};

const renderSelectCellPair = (
  value: StructState,
  onChange: (key: MasterCode, value: string) => void,
  code: MasterCode,
  label: string,
  colSpan?: number,
) => {
  return (
    <>
      <Cell>
        <Label>{label}</Label>
      </Cell>
      <Cell colSpan={colSpan}>
        <Select
          aria-label={`${label} 선택`}
          selectedKey={getSelectedKey(value, code)}
          onSelectionChange={createOnSelectionChange(onChange, code)}
        >
          {DEFAULT_SELECT_ITEM}
          {renderSubItems(code)}
        </Select>
      </Cell>
    </>
  );
};

export default function EquipmentTable({
  value,
  onChange,
  onAdd,
  onRemove,
  count,
}: EquipmentTableProps) {
  const sectionCount = useMemo(() => {
    return typeof count === 'number' && Number.isFinite(count) ? count + 1 : 1;
  }, [count]);

  const groupTitleId = useMemo(() => `oper-equip-group-title-${sectionCount}`, [sectionCount]);

  const handleAdd = useCallback(() => {
    onAdd?.();
  }, [onAdd]);

  const handleRemove = useCallback(() => {
    onRemove?.();
  }, [onRemove]);

  return (
    <EquipmentInfoBox
      title="운영 관리 장비"
      color="#910036"
      className="flex-1"
      count={sectionCount}
      groupTitleId={groupTitleId}
      onAdd={handleAdd}
      onRemove={handleRemove}
      bg="#fff"
    >
      {/* 운영 장비 */}
      <div>
        <Heading
          level={3}
          id={`equip-title01-${sectionCount}`}
          style={{ color: 'var(--text-color-base)' }}
        >
          운영 장비
        </Heading>
        <p id="equip-summary01" className="sr-only">
          원격 단말, 제어 장치, 게이트웨이, 운영 인터페이스, 점검 장치 유형을 선택하는 표입니다.
        </p>
        <ResizableTableContainer>
          <Table
            type="vertical"
            aria-labelledby={`equip-title01-${sectionCount}`}
            aria-describedby={`equip-summary01-${sectionCount}`}
          >
            <TableHeader>
              <Column isRowHeader width={160} />
              <Column />
              <Column isRowHeader width={160} />
              <Column />
              <Column isRowHeader width={160} />
              <Column />
            </TableHeader>
            <TableBody>
              <Row>
                {renderSelectCellPair(value, onChange, SECTION_CODES.operate[0], '원격 단말')}
                {renderSelectCellPair(value, onChange, SECTION_CODES.operate[1], '제어 장치')}
                {renderSelectCellPair(value, onChange, SECTION_CODES.operate[2], '게이트웨이')}
              </Row>
              <Row>
                {renderSelectCellPair(value, onChange, SECTION_CODES.operate[3], '운영 인터페이스')}
                {renderSelectCellPair(value, onChange, SECTION_CODES.operate[4], '점검 장치',3)}
              </Row>
            </TableBody>
          </Table>
        </ResizableTableContainer>
      </div>

      <div>
        <Heading
          level={3}
          id={`equip-title02-${sectionCount}`}
          style={{ color: 'var(--text-color-base)' }}
        >
          통신 장비
        </Heading>
        <p id="equip-summary02" className="sr-only">
          구내 통신 장치, 원격 통신 장치, 직렬 통신 장치 유형을 선택하는 표입니다.
        </p>
        <ResizableTableContainer>
          <Table
            type="vertical"
            aria-labelledby={`equip-title02-${sectionCount}`}
            aria-describedby={`equip-summary02-${sectionCount}`}
          >
            <TableHeader>
              <Column isRowHeader width={160} />
              <Column />
              <Column isRowHeader width={160} />
              <Column />
              <Column isRowHeader width={160} />
              <Column />
            </TableHeader>
            <TableBody>
              <Row>
                {renderSelectCellPair(value, onChange, SECTION_CODES.communication[0], '구내 통신 장치',)}
                {renderSelectCellPair(value, onChange, SECTION_CODES.communication[1], '원격 통신 장치',)}
                {renderSelectCellPair(value, onChange, SECTION_CODES.communication[2], '직렬 통신 장치',)}
              </Row>
            </TableBody>
          </Table>
        </ResizableTableContainer>
      </div>

      {/* 서버 장비 */}
      <div>
        <Heading
          level={3}
          id={`equip-title03-${sectionCount}`}
          style={{ color: 'var(--text-color-base)' }}
        >
          서버 장비
        </Heading>
        <p id="equip-summary03" className="sr-only">
          운영 서버, 데이터 서버, 관리 서버 장치 유형을 선택하는 표입니다.
        </p>
        <ResizableTableContainer>
          <Table
            type="vertical"
            aria-labelledby={`equip-title03-${sectionCount}`}
            aria-describedby={`equip-summary03-${sectionCount}`}
          >
            <TableHeader>
              <Column isRowHeader width={160} />
              <Column />
              <Column isRowHeader width={160} />
              <Column />
              <Column isRowHeader width={160} />
              <Column />
            </TableHeader>
            <TableBody>
              <Row>
                {renderSelectCellPair(value, onChange, SECTION_CODES.server[0], '운영 서버')}
                {renderSelectCellPair(value, onChange, SECTION_CODES.server[1], '데이터 서버')}
                {renderSelectCellPair(value, onChange, SECTION_CODES.server[2], '관리 서버')}
              </Row>
            </TableBody>
          </Table>
        </ResizableTableContainer>
      </div>

      <div>
        <Heading
          level={3}
          id={`equip-title04-${sectionCount}`}
          style={{ color: 'var(--text-color-base)' }}
        >
          전원 장비
        </Heading>
        <p id="equip-summary04" className="sr-only">
          무정전 전원 장치 및 전원 공급 장치 유형을 선택하는 표입니다.
        </p>
        <ResizableTableContainer>
          <Table
            type="vertical"
            aria-labelledby={`equip-title04-${sectionCount}`}
            aria-describedby={`equip-summary04-${sectionCount}`}
          >
            <TableHeader>
              <Column isRowHeader width={160} />
              <Column />
              <Column isRowHeader width={160} />
              <Column />
              <Column isRowHeader width={160} />
              <Column />
            </TableHeader>
            <TableBody>
              <Row>
                {renderSelectCellPair(value, onChange, SECTION_CODES.power[0], '무정전 전원')}
                {renderSelectCellPair(value, onChange, SECTION_CODES.power[1], '전원 공급',3)}
              </Row>
            </TableBody>
          </Table>
        </ResizableTableContainer>
      </div>

      <div>
        <Heading
          level={3}
          id={`equip-title05-${sectionCount}`}
          style={{ color: 'var(--text-color-base)' }}
        >
          시간 동기 장비
        </Heading>
        <p id="equip-summary05" className="sr-only">
          시간 동기 장치 유형을 선택하는 표입니다.
        </p>
        <ResizableTableContainer>
          <Table
            type="vertical"
            aria-labelledby={`equip-title05-${sectionCount}`}
            aria-describedby={`equip-summary05-${sectionCount}`}
          >
            <TableHeader>
              <Column isRowHeader width={160} />
              <Column />
              <Column isRowHeader width={160} />
              <Column />
              <Column isRowHeader width={160} />
              <Column />
            </TableHeader>
            <TableBody>
              <Row>
                {renderSelectCellPair(value, onChange, SECTION_CODES.time[0], '시간 동기 장치',5)}
              </Row>
            </TableBody>
          </Table>
        </ResizableTableContainer>
      </div>

      <div>
        <Heading
          level={3}
          id={`equip-title06-${sectionCount}`}
          style={{ color: 'var(--text-color-base)' }}
        >
          제어장비
        </Heading>
        <p id="equip-summary06" className="sr-only">
          로컬 제어 장치 및 원격 제어 장치 유형을 선택하는 표입니다.
        </p>
        <ResizableTableContainer>
          <Table
            type="vertical"
            aria-labelledby={`equip-title06-${sectionCount}`}
            aria-describedby={`equip-summary06-${sectionCount}`}
          >
            <TableHeader>
              <Column isRowHeader width={160} />
              <Column />
              <Column isRowHeader width={160} />
              <Column />
              <Column isRowHeader width={160} />
              <Column />
            </TableHeader>
            <TableBody>
              <Row>
                {renderSelectCellPair(value, onChange, SECTION_CODES.control[0], '로컬 제어')}
                {renderSelectCellPair(value, onChange, SECTION_CODES.control[1], '원격 제어',3)}
              </Row>
            </TableBody>
          </Table>
        </ResizableTableContainer>
      </div>

      <div>
        <Heading
          level={3}
          id={`equip-title07-${sectionCount}`}
          style={{ color: 'var(--text-color-base)' }}
        >
          접속장비
        </Heading>
        <p id="equip-summary07" className="sr-only">
          유지보수 접속 및 원격 접속 장치 유형을 선택하는 표입니다.
        </p>
        <ResizableTableContainer>
          <Table
            type="vertical"
            aria-labelledby={`equip-title07-${sectionCount}`}
            aria-describedby={`equip-summary07-${sectionCount}`}
          >
            <TableHeader>
              <Column isRowHeader width={160} />
              <Column />
              <Column isRowHeader width={160} />
              <Column />
              <Column isRowHeader width={160} />
              <Column />
            </TableHeader>
            <TableBody>
              <Row>
                {renderSelectCellPair(value, onChange, SECTION_CODES.access[0], '유지보수 접속')}
                {renderSelectCellPair(value, onChange, SECTION_CODES.access[1], '원격 접속',3)}
              </Row>
            </TableBody>
          </Table>
        </ResizableTableContainer>
      </div>

      <div>
        <Heading
          level={3}
          id={`equip-title08-${sectionCount}`}
          style={{ color: 'var(--text-color-base)' }}
        >
          계측 장비
        </Heading>
        <p id="equip-summary08" className="sr-only">
          운영 계측 장치 유형을 선택하는 표입니다.
        </p>
        <ResizableTableContainer>
          <Table
            type="vertical"
            aria-labelledby={`equip-title08-${sectionCount}`}
            aria-describedby={`equip-summary08-${sectionCount}`}
          >
            <TableHeader>
              <Column isRowHeader width={160} />
              <Column />
              <Column isRowHeader width={160} />
              <Column />
              <Column isRowHeader width={160} />
              <Column />
            </TableHeader>
            <TableBody>
              <Row>
                {renderSelectCellPair(value, onChange, SECTION_CODES.measure[0], '운영 계측',5)}
              </Row>
            </TableBody>
          </Table>
        </ResizableTableContainer>
      </div>
    </EquipmentInfoBox>
  );
}

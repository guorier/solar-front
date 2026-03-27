// src/constants/eqpmnt/safety/components/EquipmentTable.tsx
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

/**
 * 보안방재설비 장치마스터코드
 */
export type MasterCode =
  | 'VDS'
  | 'ITD'
  | 'ACC'
  | 'ALD'
  | 'FDT'
  | 'FSP'
  | 'WDT'
  | 'EMD'
  | 'SGP'
  | 'LTP';

type SubCodeOption = {
  code: string;
  name: string;
};

const SUB_CODE_OPTIONS: Record<MasterCode, SubCodeOption[]> = {
  VDS: [
    { code: '01', name: 'PTZ카메라' },
    { code: '02', name: '고정카메라' },
    { code: '03', name: '열화상카메라' },
    { code: '04', name: '영상녹화장치' },
  ],
  ITD: [
    { code: '01', name: '동작감지센서' },
    { code: '02', name: '펜스감지기' },
    { code: '03', name: '빔센서' },
  ],
  ACC: [
    { code: '01', name: '카드리더기' },
    { code: '02', name: '생체인식기' },
    { code: '03', name: '인터폰' },
  ],
  ALD: [
    { code: '01', name: '사이렌' },
    { code: '02', name: '경광등' },
  ],
  FDT: [
    { code: '01', name: '연기감지기' },
    { code: '02', name: '열감지기' },
    { code: '03', name: '불꽃감지기' },
    { code: '04', name: '수동발신기' },
  ],
  FSP: [
    { code: '01', name: '스프링클러' },
    { code: '02', name: '가스소화설비' },
    { code: '03', name: '소화기' },
  ],
  WDT: [
    { code: '01', name: '침수센서' },
    { code: '02', name: '수위센서' },
  ],
  EMD: [
    { code: '01', name: '비상정지스위치' },
    { code: '02', name: '비상전원차단기' },
  ],
  SGP: [
    { code: '01', name: '서지보호기' },
    { code: '02', name: '과도전압억제기' },
  ],
  LTP: [
    { code: '01', name: '피뢰침' },
    { code: '02', name: '피뢰도선' },
    { code: '03', name: '접지시스템' },
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
  security: ['VDS', 'ITD', 'ACC', 'ALD'] as const,
  disaster: ['FDT', 'FSP', 'WDT', 'EMD'] as const,
  protect: ['SGP', 'LTP'] as const,
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

  const groupTitleId = useMemo(() => `safety-equip-group-title-${sectionCount}`, [sectionCount]);

  const handleAdd = useCallback(() => {
    onAdd?.();
  }, [onAdd]);

  const handleRemove = useCallback(() => {
    onRemove?.();
  }, [onRemove]);

  return (
    <EquipmentInfoBox
      title="보안방재 장비"
      color="#910036"
      className="flex-1"
      count={sectionCount}
      groupTitleId={groupTitleId}
      onAdd={handleAdd}
      onRemove={handleRemove}
      bg="#fff"
    >
      {/* 보안 장비 */}
      <div>
        <Heading
          level={3}
          id={`equip-title01-${sectionCount}`}
          style={{ color: 'var(--text-color-base)' }}
        >
          보안 장비
        </Heading>
        <p id="equip-summary01" className="sr-only">
          영상 감시, 침입 감지, 출입 통제 및 경보 장치의 세부 유형을 선택하는 표입니다..
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
                {renderSelectCellPair(value, onChange, SECTION_CODES.security[0], '영상 감시장치')}
                {renderSelectCellPair(value, onChange, SECTION_CODES.security[1], '침입 감지장치')}
                {renderSelectCellPair(value, onChange, SECTION_CODES.security[2], '출입통제 장치')}
              </Row>
              <Row>
                {renderSelectCellPair(value, onChange, SECTION_CODES.security[3], '경보 장치',5)}
              </Row>
            </TableBody>
          </Table>
        </ResizableTableContainer>
      </div>

      {/* 방재 장비 */}
      <div>
        <Heading
          level={3}
          id={`equip-title02-${sectionCount}`}
          style={{ color: 'var(--text-color-base)' }}
        >
          방재 장비
        </Heading>
        <p id="equip-summary02" className="sr-only">
          화재 감시, 소화 장치, 침수 감지 및 비상 장치의 세부 유형을 선택하는 표입니다.
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
                {renderSelectCellPair(value, onChange, SECTION_CODES.disaster[0], '화재감시 장치')}
                {renderSelectCellPair(value, onChange, SECTION_CODES.disaster[1], '소화 장치')}
                {renderSelectCellPair(value, onChange, SECTION_CODES.disaster[2], '침수 감지장치')}
              </Row>
              <Row>
                {renderSelectCellPair(value, onChange, SECTION_CODES.disaster[3], '비상 장치', 5)}
              </Row>
            </TableBody>
          </Table>
        </ResizableTableContainer>
      </div>

      {/* 설비 보호 */}
      <div>
        <Heading
          level={3}
          id={`equip-title03-${sectionCount}`}
          style={{ color: 'var(--text-color-base)' }}
        >
          설비 보호 장비
        </Heading>
        <p id="equip-summary03" className="sr-only">
          서지 보호 및 피뢰 설비 등 외부 충격으로부터 시스템을 보호하는 장비 유형을 선택하는
          표입니다.
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
                {renderSelectCellPair(value, onChange, SECTION_CODES.protect[0], '서지 보호장비')}
                {renderSelectCellPair(value, onChange, SECTION_CODES.protect[1], '피뢰 설비',3)}
              </Row>
            </TableBody>
          </Table>
        </ResizableTableContainer>
      </div>
    </EquipmentInfoBox>
  );
}

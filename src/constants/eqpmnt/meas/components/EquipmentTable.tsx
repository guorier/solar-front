// src/constants/eqpmnt/meas/components/EquipmentTable.tsx
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
 * 환경계측설비 장치마스터코드
 */
export type MasterCode = 'IDS' | 'TPS' | 'HDS' | 'WDS' | 'PRE' | 'ATM' | 'SLS' | 'WTS';

type SubCodeOption = {
  code: string;
  name: string;
};

const SUB_CODE_OPTIONS: Record<MasterCode, SubCodeOption[]> = {
  IDS: [
    { code: '01', name: '수평면일사량계' },
    { code: '02', name: '경사면일사량계' },
    { code: '03', name: '직달일사량계' },
    { code: '04', name: '레퍼런스셀' },
  ],
  TPS: [
    { code: '01', name: '모듈온도센서' },
    { code: '02', name: '대기온도센서' },
  ],
  HDS: [
    { code: '01', name: '상대습도센서' },
    { code: '02', name: '노점센서' },
  ],
  WDS: [
    { code: '01', name: '풍속계' },
    { code: '02', name: '풍향계' },
    { code: '03', name: '초음파풍속계' },
  ],
  PRE: [
    { code: '01', name: '강우량계' },
    { code: '02', name: '적설센서' },
  ],
  ATM: [
    { code: '01', name: '기압센서' },
    { code: '02', name: 'UV센서' },
    { code: '03', name: '미세먼지센서' },
  ],
  SLS: [
    { code: '01', name: '오염도센서' },
    { code: '02', name: '알베도센서' },
  ],
  WTS: [
    { code: '01', name: '자동기상관측장치' },
    { code: '02', name: '데이터로거' },
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
  weatherMeasure: ['IDS', 'TPS', 'HDS', 'WDS'] as const,
  envMeasure: ['PRE', 'ATM', 'SLS'] as const,
  weatherStation: ['WTS'] as const,
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

  const groupTitleId = useMemo(() => `meas-equip-group-title-${sectionCount}`, [sectionCount]);

  const handleAdd = useCallback(() => {
    onAdd?.();
  }, [onAdd]);

  const handleRemove = useCallback(() => {
    onRemove?.();
  }, [onRemove]);

  return (
    <EquipmentInfoBox
      title="환경계측설비 장비"
      color="#910036"
      className="flex-1"
      count={sectionCount}
      groupTitleId={groupTitleId}
      onAdd={handleAdd}
      onRemove={handleRemove}
      bg="#fff"
    >
      {/* 기상 계측 장비 */}
      <div>
        <Heading
          level={3}
          id={`equip-title01-${sectionCount}`}
          style={{ color: 'var(--text-color-base)' }}
        >
          기상 계측 장비
        </Heading>
        <p id={`equip-summary01-${sectionCount}`} className="sr-only">
          일사, 온도, 습도, 풍속풍향 등 기상 계측 장비 선택 표입니다.
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
                {renderSelectCellPair(value, onChange,  SECTION_CODES.weatherMeasure[0], '일사량계측기', )}
                {renderSelectCellPair(value, onChange, SECTION_CODES.weatherMeasure[1], '온도계측기', )}
                {renderSelectCellPair(value, onChange, SECTION_CODES.weatherMeasure[2], '습도계측기', )}
              </Row>
              <Row>
                {renderSelectCellPair(value, onChange, SECTION_CODES.weatherMeasure[3], '풍속풍향계',)}
                {renderSelectCellPair(value, onChange, SECTION_CODES.envMeasure[0], '강수계측기')}
                {renderSelectCellPair(value, onChange,SECTION_CODES.envMeasure[1], '대기환경계측기',)}
              </Row>
              <Row>
                {renderSelectCellPair(value, onChange, SECTION_CODES.envMeasure[2], '오염도계측기',5)}
              </Row>
            </TableBody>
          </Table>
        </ResizableTableContainer>
      </div>

      {/* 기상 관측 장비 */}
      <div>
        <Heading
          level={3}
          id={`equip-title02-${sectionCount}`}
          style={{ color: 'var(--text-color-base)' }}
        >
          기상 관측 장비
        </Heading>
        <p id={`equip-summary02-${sectionCount}`} className="sr-only">
          자동기상관측장치, 데이터로거 등 관측 장비 선택 표입니다.
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
                {renderSelectCellPair(value, onChange, SECTION_CODES.weatherStation[0], '기상관측장치',5)}
              </Row>
            </TableBody>
          </Table>
        </ResizableTableContainer>
      </div>
    </EquipmentInfoBox>
  );
}

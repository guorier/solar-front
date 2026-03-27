// src/constants/eqpmnt/Intrcon/components/EquipmentTable.tsx
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
 * 계통연계설비 장치마스터코드
 */
export type MasterCode =
  | 'PRR' //보호계전기
  | 'IFP' //인터페이스보호장치
  | 'PWT' //변압기
  | 'HVS' //고압스위치기어
  | 'LVS' //저압스위치기어
  | 'CCB' //차단기
  | 'PWM' //전력계측기
  | 'PQM' //전력품질계측기
  | 'RTC' //무효전력보상기
  | 'HAF'; //고조파필터기

type SubCodeOption = {
  code: string; // 서브코드
  name: string; // 서브코드명
};

const SUB_CODE_OPTIONS: Record<MasterCode, SubCodeOption[]> = {
  PRR: [
    { code: '01', name: '과전류계전기' },
    { code: '02', name: '과전압계전기' },
    { code: '03', name: '부족전압계전기' },
    { code: '04', name: '저주파수계전기' },
    { code: '05', name: '고주파수계전기' },
    { code: '06', name: '지략계전기' },
    { code: '07', name: '지락과전압계전기' },
  ],
  IFP: [
    { code: '01', name: '단독운전방지' },
    { code: '02', name: '동기화장치' },
  ],
  PWT: [
    { code: '01', name: '승압변압기' },
    { code: '02', name: '강압변압기' },
    { code: '03', name: '패드변압기' },
    { code: '04', name: '절연변압기' },
    { code: '05', name: '게기용변압기' },
    { code: '06', name: '변류기' },
    { code: '07', name: '영상변류기' },
  ],
  HVS: [
    { code: '01', name: '금속 패쇄형 스위치기어' },
    { code: '02', name: '금속외함형 스위치기어' },
    { code: '03', name: '가스절연개폐장치' },
    { code: '04', name: '링메인 유닛' },
  ],
  LVS: [
    { code: '01', name: '저압배전반' },
    { code: '02', name: '모터배전반' },
    { code: '03', name: 'AC콤바이너패널' },
    { code: '04', name: '보조전원반' },
  ],
  CCB: [
    { code: '01', name: '진공차단기' },
    { code: '02', name: '배선용 차단기' },
    { code: '03', name: '기중차단기' },
  ],
  PWM: [
    { code: '01', name: '전자식전력량계' },
    { code: '02', name: '다기능전력계' },
    { code: '03', name: '스마트미터' },
  ],
  PQM: [
    { code: '01', name: '전력품질분석기' },
    { code: '02', name: '고조파분석기' },
  ],
  RTC: [
    { code: '01', name: '정지형무효전력보상' },
    { code: '02', name: '스태트콤' },
    { code: '03', name: '전력용콘덴서' },
  ],
  HAF: [
    { code: '01', name: '능동필터' },
    { code: '02', name: '수동필터' },
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
  protect: ['PRR', 'IFP'] as const,
  switchgear: ['HVS', 'LVS', 'CCB'] as const,
  measure: ['PWM', 'PQM'] as const,
  powerQuality: ['RTC', 'HAF'] as const,
  transformer: ['PWT'] as const,
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

  const groupTitleId = useMemo(() => `intrcon-equip-group-title-${sectionCount}`, [sectionCount]);

  const handleAdd = useCallback(() => {
    onAdd?.();
  }, [onAdd]);

  const handleRemove = useCallback(() => {
    onRemove?.();
  }, [onRemove]);

  return (
    <EquipmentInfoBox
      title="계통 연계 장비"
      color="#910036"
      className="flex-1"
      count={sectionCount}
      groupTitleId={groupTitleId}
      onAdd={handleAdd}
      onRemove={handleRemove}
      bg="#fff"
    >
      {/* 보호장비 */}
      <div>
        <Heading
          level={3}
          id={`equip-title01-${sectionCount}`}
          style={{ color: 'var(--text-color-base)' }}
        >
          보호장비
        </Heading>
        <p id={`equip-summary01-${sectionCount}`} className="sr-only">
          보호계전기, 인터페이스 보호 장비 등 보호 관련 장비의 유형을 선택하는 표입니다.
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
                {renderSelectCellPair(value, onChange, SECTION_CODES.protect[0], '보호계전기')}
                {renderSelectCellPair(
                  value,
                  onChange,
                  SECTION_CODES.protect[1],
                  '인터페이스 보호 장비',
                  3,
                )}
              </Row>
            </TableBody>
          </Table>
        </ResizableTableContainer>
      </div>

      {/* 개폐장비 */}
      <div>
        <Heading
          level={3}
          id={`equip-title02-${sectionCount}`}
          style={{ color: 'var(--text-color-base)' }}
        >
          개폐장비
        </Heading>
        <p id={`equip-summary02-${sectionCount}`} className="sr-only">
          고압스위치 기어, 저압스위치 기어, 차단기 등 개폐 관련 장비의 유형을 선택하는 표입니다.
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
                {renderSelectCellPair(
                  value,
                  onChange,
                  SECTION_CODES.switchgear[0],
                  '고압스위치 기어',
                )}
                {renderSelectCellPair(
                  value,
                  onChange,
                  SECTION_CODES.switchgear[1],
                  '저압스위치 기어',
                )}
                {renderSelectCellPair(value, onChange, SECTION_CODES.switchgear[2], '차단기')}
              </Row>
            </TableBody>
          </Table>
        </ResizableTableContainer>
      </div>

      <div>
        <Heading
          level={3}
          id={`equip-title03-${sectionCount}`}
          style={{ color: 'var(--text-color-base)' }}
        >
          계측 장비
        </Heading>
        <p id={`equip-summary03-${sectionCount}`} className="sr-only">
          전력계측기, 전력품질계측기 등 계측 관련 장비의 유형을 선택하는 표입니다.
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
                {renderSelectCellPair(value, onChange, SECTION_CODES.measure[0], '전력계측기')}
                {renderSelectCellPair(
                  value,
                  onChange,
                  SECTION_CODES.measure[1],
                  '전력품질계측기',
                  3,
                )}
              </Row>
            </TableBody>
          </Table>
        </ResizableTableContainer>
      </div>

      {/* 전력품질 */}
      <div>
        <Heading
          level={3}
          id={`equip-title04-${sectionCount}`}
          style={{ color: 'var(--text-color-base)' }}
        >
          전력 품질 장비
        </Heading>
        <p id={`equip-summary04-${sectionCount}`} className="sr-only">
          무효전력보상기, 고조파 필터기 등 전력 품질 관련 장비의 유형을 선택하는 표입니다.
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
                {renderSelectCellPair(
                  value,
                  onChange,
                  SECTION_CODES.powerQuality[0],
                  '무효전력보상기',
                )}
                {renderSelectCellPair(
                  value,
                  onChange,
                  SECTION_CODES.powerQuality[1],
                  '고조파 필터기',
                  3,
                )}
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
          변압장비
        </Heading>
        <p id={`equip-summary05-${sectionCount}`} className="sr-only">
          변압기 등 변압 관련 장비의 유형을 선택하는 표입니다.
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
                {renderSelectCellPair(value, onChange, SECTION_CODES.transformer[0], '변압기', 5)}
              </Row>
            </TableBody>
          </Table>
        </ResizableTableContainer>
      </div>
    </EquipmentInfoBox>
  );
}

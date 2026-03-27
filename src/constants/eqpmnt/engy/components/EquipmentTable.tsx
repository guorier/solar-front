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
 * 에너지저장설비 장치마스터코드
 */
export type MasterCode =
  | 'BTC' // 배터리셀
  | 'BTM' // 배터리모듈
  | 'BTR' // 배터리랙
  | 'TMM' // 열관리시스템
  | 'BMS' // 배터리관리장치
  | 'FPT' // 소방장치
  | 'GDT' // 가스감지장치
  | 'ESP' // ESS보호장치
  | 'EST' // ESS변압기
  | 'ESS' // ESS스위치기어
  | 'EMS' // 에너지관리장치
  | 'PCS'; // 전력변환장치

type SubCodeOption = {
  code: string; // 서브코드
  name: string; // 서브코드명
};

const SUB_CODE_OPTIONS: Record<MasterCode, SubCodeOption[]> = {
  BTC: [
    { code: '01', name: 'LFP셀' },
    { code: '02', name: 'NMC셀' },
    { code: '03', name: 'NCA셀' },
    { code: '04', name: 'LTO셀' },
  ],
  BTM: [
    { code: '01', name: '표준모듈' },
    { code: '02', name: '고전압모듈' },
  ],
  BTR: [
    { code: '01', name: '표준랙' },
    { code: '02', name: '옥외랙' },
  ],
  TMM: [
    { code: '01', name: '공랭식' },
    { code: '02', name: '수랭식' },
    { code: '03', name: 'HVAC' },
  ],
  BMS: [
    { code: '01', name: '셀감시장치' },
    { code: '02', name: '모듈관리장치' },
    { code: '03', name: '랙관리장치' },
    { code: '04', name: '시스템관리장치' },
    { code: '05', name: '셀밸런싱장치' },
  ],
  FPT: [
    { code: '01', name: '소화시스템' },
    { code: '02', name: '화재감지시스템' },
    { code: '03', name: '배기시스템' },
  ],
  GDT: [
    { code: '01', name: '수소감지기' },
    { code: '02', name: 'VOC감지기' },
    { code: '03', name: 'CO2감지기' },
  ],
  ESP: [
    { code: '01', name: 'ESS보호계전기' },
    { code: '02', name: 'DC접촉기' },
    { code: '03', name: '프리퓨즈' },
  ],
  EST: [{ code: '01', name: 'ESS전용변압기' }],
  ESS: [
    { code: '01', name: 'ESS개폐장치' },
    { code: '02', name: '자동절체스위치' },
  ],
  EMS: [
    { code: '01', name: 'ESS-EMS' },
    { code: '02', name: '전력관리시스템' },
  ],
  PCS: [
    { code: '01', name: '양방향PCS' },
    { code: '02', name: '스키드형PCS' },
    { code: '03', name: '모듈형PCS' },
  ],
};

/**
 * 에너지저장설비 선택 상태
 * - value[마스터코드] = 서브코드 ("01" 등)
 */
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
  battery: ['BTC', 'BTM', 'BTR', 'TMM', 'BMS'] as const,
  safety: ['FPT', 'GDT', 'ESP'] as const,
  grid: ['EST', 'ESS'] as const,
  manage: ['EMS'] as const,
  convert: ['PCS'] as const,
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

  const groupTitleId = useMemo(() => `ess-equip-group-title-${sectionCount}`, [sectionCount]);

  const handleAdd = useCallback(() => {
    onAdd?.();
  }, [onAdd]);

  const handleRemove = useCallback(() => {
    onRemove?.();
  }, [onRemove]);

  return (
    <EquipmentInfoBox
      title="에너지저장설비 장비"
      color="#910036"
      className="flex-1"
      count={sectionCount}
      groupTitleId={groupTitleId}
      onAdd={handleAdd}
      onRemove={handleRemove}
      bg="#fff"
    >
      {/* 배터리설비 */}
      <div>
        <Heading
          level={3}
          id={`equip-title01-${sectionCount}`}
          style={{ color: 'var(--text-color-base)' }}
        >
          배터리설비 장비
        </Heading>
        <p id="equip-summary01" className="sr-only">
          배터리 셀, 배터리 모듈, 랙, 열관리시스템 등 입력하는 표입니다.
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
                {renderSelectCellPair(value, onChange, SECTION_CODES.battery[0], '배터리 셀')}
                {renderSelectCellPair(value, onChange, SECTION_CODES.battery[1], '배터리 모듈')}
                {renderSelectCellPair(value, onChange, SECTION_CODES.battery[2], '배터리 랙')}
              </Row>
              <Row>
                {renderSelectCellPair(value, onChange, SECTION_CODES.battery[3], '열관리시스템')}
                {renderSelectCellPair(value, onChange, SECTION_CODES.battery[4], '배터리관리장치',3)}
              </Row>
            </TableBody>
          </Table>
        </ResizableTableContainer>
      </div>

      {/* 안전설비 */}
      <div>
        <Heading
          level={3}
          id={`equip-title02-${sectionCount}`}
          style={{ color: 'var(--text-color-base)' }}
        >
          안전설비 장비
        </Heading>
        <p id={`equip-summary02-${sectionCount}`} className="sr-only">
          소방, 가스감지, ESS 보호장치 선택 표입니다.
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
                {renderSelectCellPair(value, onChange, SECTION_CODES.safety[0], '소방장치')}
                {renderSelectCellPair(value, onChange, SECTION_CODES.safety[1], '가스감지장치')}
                {renderSelectCellPair(value, onChange, SECTION_CODES.safety[2], 'ESS 보호장치')}
              </Row>
            </TableBody>
          </Table>
        </ResizableTableContainer>
      </div>

      {/* 계통연계 */}
      <div>
        <Heading
          level={3}
          id={`equip-title03-${sectionCount}`}
          style={{ color: 'var(--text-color-base)' }}
        >
          계통연계 장비
        </Heading>
        <p id={`equip-summary03-${sectionCount}`} className="sr-only">
          ESS 변압기, ESS 스위치기어 입력하는 표입니다.
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
                {renderSelectCellPair(value, onChange, SECTION_CODES.grid[0], 'ESS 변압기')}
                {renderSelectCellPair(value, onChange, SECTION_CODES.grid[1], 'ESS 스위치기어',3)}
              </Row>
            </TableBody>
          </Table>
        </ResizableTableContainer>
      </div>

      {/* 에너지관리 */}
      <div>
        <Heading
          level={3}
          id={`equip-title04-${sectionCount}`}
          style={{ color: 'var(--text-color-base)' }}
        >
          에너지관리장비
        </Heading>
        <p id={`equip-summary04-${sectionCount}`} className="sr-only">
          에너지관리 장치 입력하는 표입니다.
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
                {renderSelectCellPair(value, onChange, SECTION_CODES.manage[0], '에너지관리장치',5)}
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
          전력변환 장비
        </Heading>
        <p id={`equip-summary05-${sectionCount}`} className="sr-only">
          에너지관리 장치 입력하는 표입니다.
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
                {renderSelectCellPair(value, onChange, SECTION_CODES.convert[0], '전력변환장치',5)}
              </Row>
            </TableBody>
          </Table>
        </ResizableTableContainer>
      </div>
    </EquipmentInfoBox>
  );
}

// src/constants/eqpmnt/strct/components/EquipmentTable.tsx
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
  | 'BUI'
  | 'MOU'
  | 'FOU'
  | 'ANC'
  | 'BRE'
  | 'LIG'
  | 'EME'
  | 'ELR'
  | 'CTL'
  | 'TRA'
  | 'DIF';

type SubCodeOption = {
  code: string;
  name: string;
};

const SUB_CODE_OPTIONS: Record<MasterCode, SubCodeOption[]> = {
  BUI: [
    { code: '01', name: '공장건물' },
    { code: '02', name: '아파트건물' },
    { code: '03', name: '오피스건물' },
    { code: '04', name: '일반건물' },
    { code: '05', name: '축사건물' },
    { code: '06', name: '기타건물' },
  ],
  MOU: [
    { code: '01', name: '벽면설치' },
    { code: '02', name: '슬래브설치' },
    { code: '03', name: '지붕설치' },
    { code: '04', name: '지상설치' },
    { code: '05', name: '기타설치' },
  ],
  FOU: [
    { code: '01', name: '파일기초' },
    { code: '02', name: '콘크리트기초' },
    { code: '03', name: '프리캐스트기초' },
    { code: '04', name: '벨러스트기초' },
  ],
  ANC: [
    { code: '01', name: '배수시설' },
    { code: '02', name: '울타리' },
  ],
  BRE: [
    { code: '01', name: '배선용 차단기' },
    { code: '02', name: '누전차단기' },
  ],
  LIG: [
    { code: '01', name: '조명기기-LED 투광 등' },
    { code: '02', name: '조명기기-실내 등' },
  ],
  EME: [
    { code: '01', name: '발전기' },
    { code: '02', name: '연료탱크' },
    { code: '03', name: '배터리 뱅크' },
  ],
  ELR: [
    { code: '01', name: 'ESS' },
    { code: '02', name: '변압기실' },
    { code: '03', name: 'MV Switchgear실' },
  ],
  CTL: [
    { code: '01', name: '중앙제어실' },
    { code: '02', name: 'O&M실' },
  ],
  TRA: [
    { code: '01', name: '단축트래커' },
    { code: '02', name: '양축트래커' },
  ],
  DIF: [
    { code: '01', name: '건물내부출입' },
    { code: '02', name: '건물입구번호' },
    { code: '03', name: '건물옥상번호' },
    { code: '04', name: '건물외부출입' },
    { code: '05', name: '건물외부출입번호' },
    { code: '06', name: '발전소시건장치' },
    { code: '07', name: '발전소시건장치번호' },
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

const renderSubItems = (masterCode: MasterCode) =>
  SUB_CODE_OPTIONS[masterCode].map((opt) => (
    <SelectItem key={opt.code} id={opt.code} textValue={opt.name}>
      {opt.name}
    </SelectItem>
  ));

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

  const groupTitleId = useMemo(() => `strct-equip-group-title-${sectionCount}`, [sectionCount]);

  const handleAdd = useCallback(() => {
    onAdd?.();
  }, [onAdd]);

  const handleRemove = useCallback(() => {
    onRemove?.();
  }, [onRemove]);

  const rows = useMemo(
    () =>
      [
        [
          { code: 'BUI' as const, label: '건축 구조체' },
          { code: 'MOU' as const, label: '모듈설비' },
          { code: 'FOU' as const, label: '기초 구조물' },
        ],
        [
          { code: 'ANC' as const, label: '부대 장치' },
          { code: 'BRE' as const, label: '차단기 장치' },
          { code: 'LIG' as const, label: '조명 장치' },
        ],
        [
          { code: 'EME' as const, label: '비상전원 장치' },
          { code: 'ELR' as const, label: '전기실' },
          { code: 'CTL' as const, label: '중앙 제어실' },
        ],
        [
          { code: 'TRA' as const, label: '트래커' },
          { code: 'DIF' as const, label: '출입문 정보' },
          null,
        ],
      ] as const,
    [],
  );

  const handleSelectionChange = useCallback(
    (masterCode: MasterCode) => (key: React.Key | null) => {
      onChange(masterCode, String(key ?? ''));
    },
    [onChange],
  );

  const renderSelectCell = useCallback(
    (masterCode: MasterCode) => (
      <Select
        aria-label="유형 선택"
        selectedKey={value[masterCode] || undefined}
        onSelectionChange={handleSelectionChange(masterCode)}
      >
        <SelectItem key="" id="" textValue="선택">
          선택
        </SelectItem>
        {renderSubItems(masterCode)}
      </Select>
    ),
    [handleSelectionChange, value],
  );

  return (
    <EquipmentInfoBox
      title="빌전 구조 장비"
      color="#910036"
      className="flex-1"
      count={sectionCount}
      groupTitleId={groupTitleId}
      onAdd={handleAdd}
      onRemove={handleRemove}
      bg="#fff"
    >
      <div>
        <Heading
          level={3}
          id={`equip-title-${sectionCount}`}
          style={{ color: 'var(--text-color-base)' }}
        >
          구조물 장비
        </Heading>
        <p id={`equip-summary-${sectionCount}`} className="sr-only">
          건축 구조체, 모듈설비, 기초 구조물 등 주요 카테고리별 장비의 세부 유형을 선택할 수 있는
          입력 표입니다.
        </p>

        <ResizableTableContainer>
          <Table
            type="vertical"
            aria-labelledby={`equip-title-${sectionCount}`}
            aria-describedby={`equip-summary-${sectionCount}`}
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
              {rows.map((row, rowIdx) => (
                <Row key={`row-${rowIdx}`}>
                  {row.map((item, colIdx) => {
                    if (!item) {
                      if (rowIdx === rows.length - 1) return null;

                      return (
                        <React.Fragment key={`empty-${rowIdx}-${colIdx}`}>
                          <Cell />
                          <Cell />
                        </React.Fragment>
                      );
                    }

                    const isLastRow = rowIdx === rows.length - 1 && item.code === 'DIF';

                    return (
                      <React.Fragment key={`${item.code}-${rowIdx}-${colIdx}`}>
                        <Cell>
                          <Label>{item.label}</Label>
                        </Cell>

                        {isLastRow ? (
                          <Cell colSpan={3}>{renderSelectCell(item.code)}</Cell>
                        ) : (
                          <Cell>{renderSelectCell(item.code)}</Cell>
                        )}
                      </React.Fragment>
                    );
                  })}
                </Row>
              ))}
            </TableBody>
          </Table>
        </ResizableTableContainer>
      </div>
    </EquipmentInfoBox>
  );
}

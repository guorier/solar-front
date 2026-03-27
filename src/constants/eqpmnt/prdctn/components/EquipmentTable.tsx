// src/constants/eqpmnt/prdctn/components/EquipmentTable.tsx
'use client';

import React from 'react';
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
import { Input, ResizableTableContainer } from 'react-aria-components';
import { PrdctnEquipmentInfo } from '@/components/eqpmnt/PrdctnEquipmentInfo';

export type MasterCode = 'PVE' | 'PVA' | 'PVM' | 'CMB' | 'DCD' | 'CBL' | 'CON' | 'INV' | 'FIL';

export type StructState = Record<MasterCode, string>;

export type SolarItemState = {
  slrSeq?: number;
  value: Pick<StructState, 'PVE' | 'PVA' | 'PVM'>;
  mkrNm: string;
  mdlNm: string;
  serialNo: string;
  eqpmntKname: string;
};

export type ConvertItemState = {
  convSeq?: number;
  value: Pick<StructState, 'INV' | 'FIL'>;
  mkrNm: string;
  mdlNm: string;
  serialNo: string;
  eqpmntKname: string;
};

type CollectItemState = {
  status?: 'I' | 'U' | 'D';
  strtsSeq: number;
  value: StructState;
};

type SubCodeOption = {
  code: string;
  name: string;
};

type EquipmentTableProps = {
  collectList: CollectItemState[];
  commonValue: StructState;
  solarItems: SolarItemState[];
  convertItems: ConvertItemState[];
  onCollectChange: (index: number, key: MasterCode, value: string) => void;
  onSolarChange: (index: number, key: 'PVE' | 'PVA' | 'PVM', value: string) => void;
  onSolarItemChange: (index: number, key: keyof Omit<SolarItemState, 'value' | 'slrSeq'>, value: string) => void;
  onConvertChange: (index: number, key: 'INV' | 'FIL', value: string) => void;
  onConvertItemChange: (
    index: number,
    key: keyof Omit<ConvertItemState, 'value' | 'convSeq'>,
    value: string,
  ) => void;
  onAddCollect?: () => void;
  onRemoveCollect?: (index: number) => void;
  onAddSolar?: () => void;
  onRemoveSolar?: (index: number) => void;
  onAddConvert?: () => void;
  onRemoveConvert?: (index: number) => void;
};

const SUB_CODE_OPTIONS: Record<MasterCode, SubCodeOption[]> = {
  PVE: [
    { code: '01', name: '단결정 태양전지 셀' },
    { code: '02', name: '다결정 태양전지 셀' },
    { code: '03', name: '하프컷 태양전지 셀' },
    { code: '04', name: '헤테로접합 태양전지 셀' },
    { code: '05', name: '탑콥 태양전지 셀' },
    { code: '06', name: '후면전극 태양전지 셀' },
    { code: '07', name: '박막 태양전지 셀' },
  ],
  PVA: [
    { code: '01', name: '스트링 어레이' },
    { code: '02', name: '구조형 어레이' },
    { code: '03', name: '전기 어레이 블록' },
    { code: '04', name: '인버터 입력 어레이' },
  ],
  PVM: [
    { code: '01', name: '표준모듈' },
    { code: '02', name: '양면모듈' },
    { code: '03', name: '건물일체형' },
  ],
  CMB: [
    { code: '01', name: '스트링접속반' },
    { code: '02', name: '리콤바이너' },
    { code: '03', name: '메인콤바이너' },
  ],
  DCD: [
    { code: '01', name: 'DC배전반' },
    { code: '02', name: 'DC차단기' },
    { code: '03', name: 'DC퓨즈' },
    { code: '04', name: 'DC서지보호기' },
  ],
  CBL: [
    { code: '01', name: 'DC 트렁크케이블' },
    { code: '02', name: 'DC 전력케이블' },
    { code: '03', name: 'AC케이블' },
    { code: '04', name: '접지케이블' },
  ],
  CON: [
    { code: '01', name: 'DC 커넥터/단자' },
    { code: '02', name: 'AC 커넥터/단자' },
  ],
  INV: [
    { code: '01', name: '고용량 인버터' },
    { code: '02', name: '중소형 인버터' },
    { code: '03', name: '초소형 인버터' },
    { code: '04', name: '스키드/컨테이너형 인버터' },
    { code: '05', name: '인버터보조전원' },
    { code: '06', name: 'MPPT' },
  ],
  FIL: [
    { code: '01', name: 'EMC 필터' },
    { code: '02', name: 'LCL 필터' },
    { code: '03', name: '교류 리액터' },
  ],
};

const SECTION_CODES = {
  collect: ['CMB', 'DCD', 'CBL', 'CON'] as const,
  solar: ['PVE', 'PVA', 'PVM'] as const,
  convert: ['INV', 'FIL'] as const,
};

const DEFAULT_SELECT_ITEM = (
  <SelectItem key="" id="" textValue="선택">
    선택
  </SelectItem>
);

const renderSubItems = (masterCode: MasterCode) => {
  return SUB_CODE_OPTIONS[masterCode].map((opt) => (
    <SelectItem key={opt.code} id={opt.code} textValue={opt.name}>
      {opt.name}
    </SelectItem>
  ));
};

const getSelectedKey = (value: Record<string, string>, code: string) => {
  return value[code] || undefined;
};

const renderSelectCellPair = (
  value: Record<string, string>,
  onChange: (key: string, value: string) => void,
  code: string,
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
          onSelectionChange={(key) => onChange(code, String(key ?? ''))}
        >
          {DEFAULT_SELECT_ITEM}
          {renderSubItems(code as MasterCode)}
        </Select>
      </Cell>
    </>
  );
};

export default function EquipmentTable({
  collectList,
  commonValue,
  solarItems,
  convertItems,
  onCollectChange,
  onSolarChange,
  onSolarItemChange,
  onConvertChange,
  onConvertItemChange,
  onAddCollect,
  onRemoveCollect,
  onAddSolar,
  onRemoveSolar,
  onAddConvert,
  onRemoveConvert,
}: EquipmentTableProps) {
  const safeCollectList = collectList.length > 0 ? collectList : [{ strtsSeq: 0, value: commonValue }];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-16)' }}>
      {safeCollectList.map((item, index) => {
        const sectionCount = index + 1;
        const groupTitleId = `prdctn-equip-group-title-collect-${sectionCount}`;

        return (
          <PrdctnEquipmentInfo
            key={`collect-${item.strtsSeq}-${index}`}
            title="집전장비"
            className="flex-1"
            count={sectionCount}
            groupTitleId={groupTitleId}
            onAdd={onAddCollect}
            onRemove={() => onRemoveCollect?.(index)}
            bg="#fff"
          >
            <p id={`equip-summary01-${sectionCount}`} className="sr-only">
              접속반 장치, DC배전장치, 케이블 등 집전 관련 장비의 유형을 선택하는 표입니다.
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
                    {renderSelectCellPair(
                      item.value,
                      (key, value) => onCollectChange(index, key as MasterCode, value),
                      SECTION_CODES.collect[0],
                      '접속반 장치',
                    )}
                    {renderSelectCellPair(
                      item.value,
                      (key, value) => onCollectChange(index, key as MasterCode, value),
                      SECTION_CODES.collect[1],
                      'DC배전장치',
                    )}
                    {renderSelectCellPair(
                      item.value,
                      (key, value) => onCollectChange(index, key as MasterCode, value),
                      SECTION_CODES.collect[2],
                      '케이블',
                    )}
                  </Row>
                  <Row>
                    {renderSelectCellPair(
                      item.value,
                      (key, value) => onCollectChange(index, key as MasterCode, value),
                      SECTION_CODES.collect[3],
                      '커넥터',
                      5,
                    )}
                  </Row>
                </TableBody>
              </Table>
            </ResizableTableContainer>
          </PrdctnEquipmentInfo>
        );
      })}

      {solarItems.map((item, index) => {
        const sectionCount = index + 1;
        const groupTitleId = `prdctn-equip-group-title-solar-${sectionCount}`;

        return (
          <PrdctnEquipmentInfo
            key={`solar-${item.slrSeq ?? index}-${index}`}
            title="태양광장비"
            className="flex-1"
            count={sectionCount}
            groupTitleId={groupTitleId}
            onAdd={onAddSolar}
            onRemove={() => onRemoveSolar?.(index)}
            bg="#fff"
          >
            <p id={`equip-summary02-${sectionCount}`} className="sr-only">
              태양전지장치, 어레이장치, 태양광모듈장치 등 태양광 발전 핵심 장비의 유형을 선택하는 표입니다.
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
                      item.value,
                      (key, value) => onSolarChange(index, key as 'PVE' | 'PVA' | 'PVM', value),
                      SECTION_CODES.solar[0],
                      '태양전지장치',
                    )}
                    {renderSelectCellPair(
                      item.value,
                      (key, value) => onSolarChange(index, key as 'PVE' | 'PVA' | 'PVM', value),
                      SECTION_CODES.solar[1],
                      '어레이장치',
                    )}
                    {renderSelectCellPair(
                      item.value,
                      (key, value) => onSolarChange(index, key as 'PVE' | 'PVA' | 'PVM', value),
                      SECTION_CODES.solar[2],
                      '태양광모듈장치',
                    )}
                  </Row>

                  <Row>
                    <Cell>
                      <Label>제조사</Label>
                    </Cell>
                    <Cell>
                      <div className="react-aria-TextField">
                        <Input
                          placeholder="입력해 주세요"
                          aria-label={`제조사 ${index + 1}`}
                          value={item.mkrNm}
                          onChange={(e) => onSolarItemChange(index, 'mkrNm', e.target.value)}
                        />
                      </div>
                    </Cell>
                    <Cell>
                      <Label>모델</Label>
                    </Cell>
                    <Cell>
                      <div className="react-aria-TextField">
                        <Input
                          placeholder="입력해 주세요"
                          aria-label={`모델 ${index + 1}`}
                          value={item.mdlNm}
                          onChange={(e) => onSolarItemChange(index, 'mdlNm', e.target.value)}
                        />
                      </div>
                    </Cell>
                    <Cell>
                      <Label>시리얼</Label>
                    </Cell>
                    <Cell>
                      <div className="react-aria-TextField">
                        <Input
                          placeholder="입력해 주세요"
                          aria-label={`시리얼 ${index + 1}`}
                          value={item.serialNo}
                          onChange={(e) => onSolarItemChange(index, 'serialNo', e.target.value)}
                        />
                      </div>
                    </Cell>
                  </Row>

                  <Row>
                    <Cell>
                      <Label>장비 명</Label>
                    </Cell>
                    <Cell colSpan={5}>
                      <div className="react-aria-TextField">
                        <Input
                          placeholder="입력해 주세요"
                          aria-label={`장비 명 ${index + 1}`}
                          value={item.eqpmntKname}
                          onChange={(e) => onSolarItemChange(index, 'eqpmntKname', e.target.value)}
                        />
                      </div>
                    </Cell>
                  </Row>
                </TableBody>
              </Table>
            </ResizableTableContainer>
          </PrdctnEquipmentInfo>
        );
      })}

      {convertItems.map((item, index) => {
        const sectionCount = index + 1;
        const groupTitleId = `prdctn-equip-group-title-convert-${sectionCount}`;

        return (
          <PrdctnEquipmentInfo
            key={`convert-${item.convSeq ?? index}-${index}`}
            title="변환장비"
            className="flex-1"
            count={sectionCount}
            groupTitleId={groupTitleId}
            onAdd={onAddConvert}
            onRemove={() => onRemoveConvert?.(index)}
            bg="#fff"
          >
            <p id={`equip-summary03-${sectionCount}`} className="sr-only">
              인버터장치, 필터장치 등 전력 변환 장비의 유형을 선택하는 표입니다.
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
                    {renderSelectCellPair(
                      item.value,
                      (key, value) => onConvertChange(index, key as 'INV' | 'FIL', value),
                      SECTION_CODES.convert[0],
                      '인버터장치',
                    )}
                    {renderSelectCellPair(
                      item.value,
                      (key, value) => onConvertChange(index, key as 'INV' | 'FIL', value),
                      SECTION_CODES.convert[1],
                      '필터장치',
                      3,
                    )}
                  </Row>

                  <Row>
                    <Cell>
                      <Label>제조사</Label>
                    </Cell>
                    <Cell>
                      <div className="react-aria-TextField">
                        <Input
                          placeholder="입력해 주세요"
                          aria-label={`제조사 ${index + 1}`}
                          value={item.mkrNm}
                          onChange={(e) => onConvertItemChange(index, 'mkrNm', e.target.value)}
                        />
                      </div>
                    </Cell>
                    <Cell>
                      <Label>모델</Label>
                    </Cell>
                    <Cell>
                      <div className="react-aria-TextField">
                        <Input
                          placeholder="입력해 주세요"
                          aria-label={`모델 ${index + 1}`}
                          value={item.mdlNm}
                          onChange={(e) => onConvertItemChange(index, 'mdlNm', e.target.value)}
                        />
                      </div>
                    </Cell>
                    <Cell>
                      <Label>시리얼</Label>
                    </Cell>
                    <Cell>
                      <div className="react-aria-TextField">
                        <Input
                          placeholder="입력해 주세요"
                          aria-label={`시리얼 ${index + 1}`}
                          value={item.serialNo}
                          onChange={(e) => onConvertItemChange(index, 'serialNo', e.target.value)}
                        />
                      </div>
                    </Cell>
                  </Row>

                  <Row>
                    <Cell>
                      <Label>장비 명</Label>
                    </Cell>
                    <Cell colSpan={5}>
                      <div className="react-aria-TextField">
                        <Input
                          placeholder="입력해 주세요"
                          aria-label={`장비 명 ${index + 1}`}
                          value={item.eqpmntKname}
                          onChange={(e) => onConvertItemChange(index, 'eqpmntKname', e.target.value)}
                        />
                      </div>
                    </Cell>
                  </Row>
                </TableBody>
              </Table>
            </ResizableTableContainer>
          </PrdctnEquipmentInfo>
        );
      })}
    </div>
  );
}
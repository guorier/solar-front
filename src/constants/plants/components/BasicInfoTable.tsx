// src/containers/plants/sections/BasicInfoTable.tsx
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
import { Heading, Input, ResizableTableContainer } from 'react-aria-components';
import type { PlantBaseCreateReq } from '@/services/plants/type';
import type { ComCodeItem } from '@/services/common/type';

type FieldKey = keyof PlantBaseCreateReq;

type Props = {
  form: PlantBaseCreateReq;
  isRequired: (k: FieldKey) => boolean;
  setValue: <K extends FieldKey>(k: K, v: PlantBaseCreateReq[K]) => void;

  loadTypeCodes: () => void;
  loadStatusCodes: () => void;
  loadScaleCodes: () => void;

  typeCodes: ComCodeItem[];
  statusCodes: ComCodeItem[];
  scaleCodes: ComCodeItem[];
};

export default function BasicInfoTable({
  form,
  isRequired,
  setValue,
  loadTypeCodes,
  loadStatusCodes,
  loadScaleCodes,
  typeCodes,
  statusCodes,
  scaleCodes,
}: Props) {
  return (
    <div>
      <Heading level={3} id="basic-info-title">기본 정보</Heading>
      <p id="basic-info-desc" className="sr-only">발전소의 명칭, 발전 유형, 현재 운영 상태 및 시설 규모 정보를 입력하는 표입니다.</p>
      <ResizableTableContainer>
        <Table type="vertical" aria-labelledby="basic-info-title" aria-describedby="basic-info-desc">
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
              <Cell>
                <Label className={isRequired('pwplNm') ? 'imp' : undefined}>발전소</Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Input
                    aria-label="발전소명"
                    title="발전소명"
                    placeholder="입력해 주세요"
                    value={form.pwplNm}
                    onChange={(e) => setValue('pwplNm', (e.target as HTMLInputElement).value)}
                  />
                </div>
              </Cell>
              <Cell>
                <Label className={isRequired('pwplTypeCd') ? 'imp' : undefined}>유형</Label>
              </Cell>
              <Cell>
                <Select
                  aria-label="유형"
                  selectedKey={form.pwplTypeCd}
                  onSelectionChange={(key) => setValue('pwplTypeCd', String(key ?? ''))}
                  onFocus={loadTypeCodes}
                >
                  <SelectItem id="">선택</SelectItem>
                  {typeCodes.map((c) => (
                    <SelectItem key={c.comSubCd} id={c.comSubCd}>
                      {c.comSubCdNm}
                    </SelectItem>
                  ))}
                </Select>
              </Cell>
              <Cell>
                <Label className={isRequired('pwplSttsCd') ? 'imp' : undefined}>상태</Label>
              </Cell>
              <Cell>
                <Select
                  aria-label="상태"
                  selectedKey={form.pwplSttsCd}
                  onSelectionChange={(key) => setValue('pwplSttsCd', String(key ?? ''))}
                  onFocus={loadStatusCodes}
                >
                  <SelectItem id="">선택</SelectItem>
                  {statusCodes.map((c) => (
                    <SelectItem key={c.comSubCd} id={c.comSubCd}>
                      {c.comSubCdNm}
                    </SelectItem>
                  ))}
                </Select>
              </Cell>
            </Row>
            <Row>
              <Cell>
                <Label className={isRequired('pwplSclCd') ? 'imp' : undefined}>규모</Label>
              </Cell>
              <Cell colSpan={5}>
                <Select
                  aria-label="규모"
                  selectedKey={form.pwplSclCd}
                  onSelectionChange={(key) => setValue('pwplSclCd', String(key ?? ''))}
                  onFocus={loadScaleCodes}
                >
                  <SelectItem id="">선택</SelectItem>
                  {scaleCodes.map((c) => (
                    <SelectItem key={c.comSubCd} id={c.comSubCd}>
                      {c.comSubCdNm}
                    </SelectItem>
                  ))}
                </Select>
              </Cell>
            </Row>
          </TableBody>
        </Table>
      </ResizableTableContainer>
    </div>
  );
}

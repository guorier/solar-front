// src/containers/plants/sections/StructureInfoTable.tsx
'use client';

import React from 'react';
import { Table, TableHeader, Column, TableBody, Row, Cell, Label } from '@/components';
import { Heading, Input, ResizableTableContainer } from 'react-aria-components';
import type { PlantBaseCreateReq } from '@/services/plants/type';

type FieldKey = keyof PlantBaseCreateReq;

type Props = {
  form: PlantBaseCreateReq;
  setValue: <K extends FieldKey>(k: K, v: PlantBaseCreateReq[K]) => void;
};

export default function StructureInfoTable({ form, setValue }: Props) {
  return (
    <div>
      <Heading level={3} id="str-info-title">건물 구조/설치 위치</Heading>
      <p id="str-info-summary" className="sr-only">발전 설비가 위치한 건물의 구조와 구체적인 설치 장소 정보를 입력하는 표입니다.</p>
      <ResizableTableContainer>
        <Table type="vertical" aria-labelledby="str-info-title" aria-describedby="str-info-summary">
          <TableHeader>
            <Column isRowHeader width={160} />
            <Column />
            <Column isRowHeader width={160} />
            <Column />
          </TableHeader>
          <TableBody>
            <Row>
              <Cell>
                <Label>건물 구조</Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Input
                    aria-label="건물 구조"
                    placeholder="입력해 주세요"
                    title="건물 구조 입력"
                    maxLength={30}
                    value={form.bldgStrctNm ?? ''}
                    onChange={(e) => setValue('bldgStrctNm', (e.target as HTMLInputElement).value)}
                  />
                </div>
              </Cell>
              <Cell>
                <Label>설치</Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Input
                    aria-label="설치"
                    placeholder="입력해 주세요"
                    title="설치 입력"
                    maxLength={30}
                    value={form.instlPlcNm ?? ''}
                    onChange={(e) => setValue('instlPlcNm', (e.target as HTMLInputElement).value)}
                  />
                </div>
              </Cell>
            </Row>
          </TableBody>
        </Table>
      </ResizableTableContainer>
    </div>
  );
}

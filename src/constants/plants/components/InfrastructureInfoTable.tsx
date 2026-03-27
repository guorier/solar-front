// src/containers/plants/sections/InfrastructureInfoTable.tsx
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

export default function InfrastructureInfoTable({ form, setValue }: Props) {
  return (
    <div>
      <Heading level={3} id="infra-title">기반/보조 시설</Heading>
      <p id="infra-summary" className="sr-only">발전소의 주요 기반 시설 명칭과 보조 시설의 명칭 정보를 입력하는 표입니다.</p>
      <ResizableTableContainer>
        <Table type="vertical" aria-labelledby="infra-title" aria-describedby="infra-summary">
          <TableHeader>
            <Column isRowHeader width={160} />
            <Column />
            <Column isRowHeader width={160} />
            <Column />
          </TableHeader>
          <TableBody>
            <Row>
              <Cell>
                <Label>기반</Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Input
                    aria-label="기반"
                    placeholder="입력해 주세요"
                    title="기반 입력"
                    maxLength={30}
                    value={form.infraNm ?? ''}
                    onChange={(e) => setValue('infraNm', (e.target as HTMLInputElement).value)}
                  />
                </div>
              </Cell>
              <Cell>
                <Label>보조 시설</Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Input
                    aria-label="보조 시설"
                    placeholder="입력해 주세요"
                    title="보조 시설 입력"
                    maxLength={30}
                    value={form.asstFlctNm ?? ''}
                    onChange={(e) => setValue('asstFlctNm', (e.target as HTMLInputElement).value)}
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

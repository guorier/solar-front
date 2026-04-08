// src/constants/plants/components/WeightInfoTable.tsx
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

export default function WeightInfoTable({ form, setValue }: Props) {
  return (
    <div>
      <Heading level={3} id="weight-title">
        가중치
      </Heading>
      <ResizableTableContainer>
        <Table type="vertical" aria-labelledby="weight-title">
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
                <Label>가중치</Label>
              </Cell>
              <Cell colSpan={5}>
                <div className="react-aria-TextField">
                  <Input
                    aria-label="가중치"
                    type="number"
                    inputMode="decimal"
                    step="any"
                    placeholder="입력해 주세요"
                    title="가중치 입력"
                    value={
                      form.weight === null || form.weight === undefined ? '' : String(form.weight)
                    }
                    onChange={(e) =>
                      setValue(
                        'weight',
                        Number(
                          (e.target as HTMLInputElement).value,
                        ) as PlantBaseCreateReq['weight'],
                      )
                    }
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

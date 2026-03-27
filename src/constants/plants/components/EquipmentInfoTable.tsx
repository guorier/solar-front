// src/containers/plants/sections/EquipmentInfoTable.tsx
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

export default function EquipmentInfoTable({ form, setValue }: Props) {
  return (
    <div>
      <Heading level={3} id="equip-title">
        설비 정보
      </Heading>
      <p id="equip-summary" className="sr-only">
        부지 면적, 장비 수량, 계통 전압, 경사각, 방위각 및 PR 성능비를 수치로 입력하는 표입니다.
      </p>
      <ResizableTableContainer>
        <Table type="vertical" aria-labelledby="equip-title" aria-describedby="equip-summary">
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
                <Label>부지 면적</Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Input
                    aria-label="부지 면적"
                    type="number"
                    inputMode="decimal"
                    step="any"
                    placeholder="입력해 주세요"
                    title="부지 면적 입력"
                    value={
                      form.pltar === null || form.pltar === undefined ? '' : String(form.pltar)
                    }
                    onChange={(e) =>
                      setValue(
                        'pltar',
                        Number((e.target as HTMLInputElement).value) as PlantBaseCreateReq['pltar'],
                      )
                    }
                  />
                </div>
              </Cell>
              <Cell>
                <Label>장비 수량</Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Input
                    aria-label="장비 수량"
                    type="number"
                    inputMode="decimal"
                    step="any"
                    placeholder="입력해 주세요"
                    title="장비 수량 입력"
                    value={
                      form.eqpmntQty === null || form.eqpmntQty === undefined
                        ? ''
                        : String(form.eqpmntQty)
                    }
                    onChange={(e) =>
                      setValue(
                        'eqpmntQty',
                        Number(
                          (e.target as HTMLInputElement).value,
                        ) as PlantBaseCreateReq['eqpmntQty'],
                      )
                    }
                  />
                </div>
              </Cell>
              <Cell>
                <Label>계통 전압</Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Input
                    aria-label="계통 전압"
                    type="number"
                    inputMode="decimal"
                    step="any"
                    placeholder="입력해 주세요"
                    title="계통 전압 입력"
                    value={
                      form.systmVltg === null || form.systmVltg === undefined
                        ? ''
                        : String(form.systmVltg)
                    }
                    onChange={(e) =>
                      setValue(
                        'systmVltg',
                        Number(
                          (e.target as HTMLInputElement).value,
                        ) as PlantBaseCreateReq['systmVltg'],
                      )
                    }
                  />
                </div>
              </Cell>
            </Row>
            <Row>
              <Cell>
                <Label>경사각</Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Input
                    aria-label="경사각"
                    type="number"
                    inputMode="decimal"
                    step="any"
                    placeholder="입력해 주세요"
                    title="경사각 입력"
                    value={
                      form.grdnt === null || form.grdnt === undefined ? '' : String(form.grdnt)
                    }
                    onChange={(e) =>
                      setValue(
                        'grdnt',
                        Number((e.target as HTMLInputElement).value) as PlantBaseCreateReq['grdnt'],
                      )
                    }
                  />
                </div>
              </Cell>
              <Cell>
                <Label>방위각</Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Input
                    aria-label="방위각"
                    type="number"
                    inputMode="decimal"
                    step="any"
                    placeholder="입력해 주세요"
                    title="방위각 입력"
                    value={form.az === null || form.az === undefined ? '' : String(form.az)}
                    onChange={(e) =>
                      setValue(
                        'az',
                        Number((e.target as HTMLInputElement).value) as PlantBaseCreateReq['az'],
                      )
                    }
                  />
                </div>
              </Cell>
              <Cell>
                <Label className="imp">PR 성능비 (%)</Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Input
                    aria-label="PR 성능비 (%)"
                    type="number"
                    min={1}
                    max={100}
                    title="PR 성능비 입력"
                    value={form.pr === 0 ? 85 : (form.pr ?? 85)}
                    onChange={(e) => {
                      const raw = Number((e.target as HTMLInputElement).value);
                      const normalized = isNaN(raw) ? 85 : Math.max(1, Math.min(100, raw));
                      setValue('pr', normalized as PlantBaseCreateReq['pr']);
                    }}
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

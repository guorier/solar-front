// src/containers/plants/sections/CapacityInfoTable.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Table, TableHeader, Column, TableBody, Row, Cell, Label } from '@/components';
import { Heading, Input, ResizableTableContainer } from 'react-aria-components';
import type { PlantBaseCreateReq } from '@/services/plants/type';

type FieldKey = keyof PlantBaseCreateReq;

type Props = {
  form: PlantBaseCreateReq;
  setValue: <K extends FieldKey>(k: K, v: PlantBaseCreateReq[K]) => void;
};

export default function CapacityInfoTable({ form, setValue }: Props) {
  const [designCpctInput, setDesignCpctInput] = useState(String(form.designCpct ?? ''));
  const [instlCpctInput, setInstlCpctInput] = useState(String(form.instlCpct ?? ''));

  useEffect(() => {
    setDesignCpctInput(String(form.designCpct ?? ''));
  }, [form.designCpct]);

  useEffect(() => {
    setInstlCpctInput(String(form.instlCpct ?? ''));
  }, [form.instlCpct]);

  const handleDecimalChange = <K extends 'designCpct' | 'instlCpct'>(
    key: K,
    value: string,
    setInput: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    if (!/^\d*\.?\d*$/.test(value)) {
      return;
    }

    setInput(value);

    if (value === '' || value === '.') {
      setValue(key, 0 as PlantBaseCreateReq[K]);
      return;
    }

    setValue(key, Number(value) as PlantBaseCreateReq[K]);
  };

  return (
    <div>
      <Heading level={3} id="cp-info-title">
        용량 정보
      </Heading>
      <p id="cp-info-summary" className="sr-only">
        발전소의 설계 용량과 설치 용량을 kW(킬로와트) 단위로 입력하고 관리하는 표입니다.
      </p>
      <ResizableTableContainer>
        <Table type="vertical" aria-labelledby="cp-info-title" aria-describedby="cp-info-summary">
          <TableHeader>
            <Column isRowHeader width={160} />
            <Column />
            <Column isRowHeader width={160} />
            <Column />
          </TableHeader>
          <TableBody>
            <Row>
              <Cell>
                <Label className="imp">설계 용량 (kW)</Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Input
                    title="설계 용량 (kW)"
                    placeholder="설계 용량 (kW)"
                    minLength={1}
                    maxLength={10}
                    inputMode="decimal"
                    value={designCpctInput}
                    onChange={(e) =>
                      handleDecimalChange(
                        'designCpct',
                        (e.target as HTMLInputElement).value,
                        setDesignCpctInput,
                      )
                    }
                  />
                </div>
              </Cell>
              <Cell>
                <Label className="imp">설치 용량 (kW)</Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Input
                    title="설치 용량 (kW)"
                    placeholder="설치 용량 (kW)"
                    minLength={1}
                    maxLength={10}
                    inputMode="decimal"
                    value={instlCpctInput}
                    onChange={(e) =>
                      handleDecimalChange(
                        'instlCpct',
                        (e.target as HTMLInputElement).value,
                        setInstlCpctInput,
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

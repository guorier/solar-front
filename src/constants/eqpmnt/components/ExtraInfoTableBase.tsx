'use client';

import React from 'react';
import { Table, TableHeader, Column, TableBody, Row, Cell, Label } from '@/components';
import { Heading, ResizableTableContainer, Input, TextArea } from 'react-aria-components';

type ExtraInfoTableProps<
  T extends {
    bldrNm: string;
    bldrCnpl: string;
    mngrNm: string;
    mngrCnpl: string;
    optrNm: string;
    optrCnpl: string;
    assoptrNm: string;
    assoptrCnpl: string;
    memo: string;
  },
> = {
  form: T;
  setValue: <K extends keyof T>(key: K, value: T[K]) => void;
};

export default function EquipmentInfoTable<
  T extends {
    bldrNm: string;
    bldrCnpl: string;
    mngrNm: string;
    mngrCnpl: string;
    optrNm: string;
    optrCnpl: string;
    assoptrNm: string;
    assoptrCnpl: string;
    memo: string;
  },
>({ form, setValue }: ExtraInfoTableProps<T>) {
  const formatPhoneNumber = (value: string): string => {
    const onlyNumber = value.replace(/[^0-9]/g, '');

    if (onlyNumber.length <= 3) return onlyNumber;
    if (onlyNumber.length <= 7) return `${onlyNumber.slice(0, 3)}-${onlyNumber.slice(3)}`;
    if (onlyNumber.length <= 11)
      return `${onlyNumber.slice(0, 3)}-${onlyNumber.slice(3, 7)}-${onlyNumber.slice(7)}`;

    return `${onlyNumber.slice(0, 3)}-${onlyNumber.slice(3, 7)}-${onlyNumber.slice(7, 11)}`;
  };

  const createOnInputChange = <K extends keyof T>(key: K) => {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setValue(key, (e.target as HTMLInputElement).value as T[K]);
  };

  const createOnPhoneChange = <K extends keyof T>(key: K) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatPhoneNumber((e.target as HTMLInputElement).value);
      setValue(key, formatted as T[K]);
    };
  };

  const createOnTextAreaChange = <K extends keyof T>(key: K) => {
    return (e: React.ChangeEvent<HTMLTextAreaElement>) =>
      setValue(key, (e.target as HTMLTextAreaElement).value as T[K]);
  };

  return (
    <div>
      <Heading level={3} id="add-info-title">
        추가 정보
      </Heading>
      <p id="add-info-summary" className="sr-only">
        시공자 명, 관리자 명, 부운영자 명, 연락처 등 입력하는 표입니다.
      </p>
      <ResizableTableContainer>
        <Table type="vertical" aria-labelledby="add-info-title" aria-describedby="add-info-summary">
          <TableHeader>
            <Column isRowHeader width={160} />
            <Column />
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
                <Label>시공자 명</Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Input
                    placeholder="입력해 주세요"
                    aria-label="입력"
                    title="입력"
                    value={form.bldrNm}
                    onChange={createOnInputChange('bldrNm')}
                  />
                </div>
              </Cell>
              <Cell>
                <Label>연락처</Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Input
                    placeholder="입력해 주세요"
                    aria-label="입력"
                    title="입력"
                    value={form.bldrCnpl}
                    onChange={createOnPhoneChange('bldrCnpl')}
                    maxLength={13}
                  />
                </div>
              </Cell>
              <Cell>
                <Label>관리자 명</Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Input
                    placeholder="입력해 주세요"
                    aria-label="입력"
                    title="입력"
                    value={form.mngrNm}
                    onChange={createOnInputChange('mngrNm')}
                  />
                </div>
              </Cell>
              <Cell>
                <Label>연락처</Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Input
                    placeholder="입력해 주세요"
                    aria-label="입력"
                    title="입력"
                    value={form.mngrCnpl}
                    onChange={createOnPhoneChange('mngrCnpl')}
                    maxLength={13}
                  />
                </div>
              </Cell>
            </Row>

            <Row>
              <Cell>
                <Label>운영자 명</Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Input
                    placeholder="입력해 주세요"
                    aria-label="입력"
                    title="입력"
                    value={form.optrNm}
                    onChange={createOnInputChange('optrNm')}
                  />
                </div>
              </Cell>
              <Cell>
                <Label>연락처</Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Input
                    placeholder="입력해 주세요"
                    aria-label="입력"
                    title="입력"
                    value={form.optrCnpl}
                    onChange={createOnPhoneChange('optrCnpl')}
                    maxLength={13}
                  />
                </div>
              </Cell>
              <Cell>
                <Label>부 운영자 명</Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Input
                    placeholder="입력해 주세요"
                    aria-label="입력"
                    title="입력"
                    value={form.assoptrNm}
                    onChange={createOnInputChange('assoptrNm')}
                  />
                </div>
              </Cell>
              <Cell>
                <Label>연락처</Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Input
                    placeholder="입력해 주세요"
                    aria-label="입력"
                    title="입력"
                    value={form.assoptrCnpl}
                    onChange={createOnPhoneChange('assoptrCnpl')}
                    maxLength={13}
                  />
                </div>
              </Cell>
            </Row>

            <Row>
              <Cell>
                <Label>설명</Label>
              </Cell>
              <Cell colSpan={7}>
                <div className="react-aria-TextField" style={{ maxWidth: '100%' }}>
                  <TextArea
                    aria-label="설명"
                    placeholder="입력해 주세요"
                    title="설명 입력"
                    value={form.memo}
                    onChange={createOnTextAreaChange('memo')}
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

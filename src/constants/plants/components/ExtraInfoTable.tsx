// src/containers/plants/sections/ExtraInfoTable.tsx
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
  DatePicker,
  ButtonComponent,
} from '@/components';
import {
  Group,
  Heading,
  Input,
  ResizableTableContainer,
  TextArea,
} from 'react-aria-components';
import type { PlantBaseCreateReq } from '@/services/plants/type';

type FieldKey = keyof PlantBaseCreateReq;

type Props = {
  form: PlantBaseCreateReq;
  setValue: <K extends FieldKey>(k: K, v: PlantBaseCreateReq[K]) => void;
};

export default function ExtraInfoTable({ form, setValue, }: Props) {
  return (
    <div>
      <Heading level={3} id="ex-info-title">기타 정보</Heading>
      <p id="ex-info-summary" className="sr-only">발전소 소유자, 운영 및 시공 회사 정보와 설치일, 상업 운전 시작일, 관련 파일 및 상세 설명을 관리하는 표입니다.</p>
      <ResizableTableContainer>
        <Table type="vertical" aria-labelledby="ex-info-title" aria-describedby="ex-info-summary">
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
                <Label>소유자</Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Input
                    aria-label="소유자"
                    placeholder="입력해 주세요"
                    title="소유자 입력"
                    value={form.ownrNm ?? ''}
                    onChange={(e) => setValue('ownrNm', (e.target as HTMLInputElement).value)}
                  />
                </div>
              </Cell>

              <Cell>
                <Label>운영 회사</Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Input
                    aria-label="운영 회사"
                    placeholder="입력해 주세요"
                    title="운영 회사 입력"
                    value={form.operCoNm ?? ''}
                    onChange={(e) => setValue('operCoNm', (e.target as HTMLInputElement).value)}
                  />
                </div>
              </Cell>
              <Cell>
                <Label>시공 회사</Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Input
                    aria-label="시공 회사"
                    placeholder="입력해 주세요"
                    title="시공 회사 입력"
                    value={form.cnstCoNm ?? ''}
                    onChange={(e) => setValue('cnstCoNm', (e.target as HTMLInputElement).value)}
                  />
                </div>
              </Cell>
            </Row>
            <Row>
              <Cell>
                <Label>설치일</Label>
              </Cell>
              <Cell>
                <DatePicker
                  aria-label="설치일"
                  value={form.instlYmd ?? ''}
                  onChange={(v: string) => setValue('instlYmd', v)}
                />
              </Cell>
              <Cell><Label>상업 운전 일</Label></Cell>
              <Cell>
                <DatePicker
                  aria-label="상업 운전 일"
                  value={form.cmrcoprYmd ?? ''}
                  onChange={(v: string) => setValue('cmrcoprYmd', v)}
                />
              </Cell>
              <Cell>
                <Label>파일 업로드</Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField" style={{ maxWidth: '100%' }}>
                  <Group style={{ flex: 'none' }}>
                    <Input
                      aria-label="업로드 파일"
                      placeholder=""
                      title="파일 업로드"
                      readOnly
                      style={{ width: 160 }}
                    />
                    <ButtonComponent type="button" aria-label="파일 업로드">
                      파일 업로드
                    </ButtonComponent>
                  </Group>
                </div>
              </Cell>
            </Row>
            <Row>
              <Cell>
                <Label>설명</Label>
              </Cell>
              <Cell colSpan={5}>
                <div className="react-aria-TextField"style={{ maxWidth: '100%' }}>
                  <TextArea
                    aria-label="설명"
                    placeholder="입력해 주세요"
                    title="설명 입력"
                    value={form.pwplExpln ?? ''}
                    onChange={(e) => setValue('pwplExpln', (e.target as HTMLTextAreaElement).value)}
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

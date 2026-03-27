// src/containers/plants/sections/LocationInfoTable.tsx
'use client';

import React from 'react';
import {
  ButtonComponent,
  Table,
  TableHeader,
  Column,
  TableBody,
  Row,
  Cell,
  Label,
} from '@/components';
import { Group, Heading, Input, ResizableTableContainer } from 'react-aria-components';
import type { PlantBaseCreateReq } from '@/services/plants/type';
import AddressField, { AddressFieldValue } from '@/components/address/AddressField';

type FieldKey = keyof PlantBaseCreateReq;

type Props = {
  form: PlantBaseCreateReq;
  isRequired: (k: FieldKey) => boolean;
  setValue: <K extends FieldKey>(k: K, v: PlantBaseCreateReq[K]) => void;

  addressOpen: boolean;
  setAddressOpen: (v: boolean) => void;
  onAddressChange: (v: AddressFieldValue) => void;
  isEdit?: boolean;
};

export default function LocationInfoTable({
  form,
  isRequired,
  setValue,
  addressOpen,
  setAddressOpen,
  onAddressChange,
  isEdit,
}: Props) {
  return (
    <div>
      <Heading level={3} id="loc-info-title">
        위치 정보
      </Heading>
      <p id="loc-info-summary" className="sr-only">
        우편번호 검색 버튼을 통해 도로명 및 지번 주소를 입력하고, 하단 필드에 상세 주소를 직접
        입력하는 표입니다.
      </p>
      <ResizableTableContainer>
        <Table type="vertical" aria-labelledby="loc-info-title" aria-describedby="loc-info-summary">
          <TableHeader>
            <Column isRowHeader width={160} />
            <Column />
            <Column isRowHeader width={160} />
            <Column />
          </TableHeader>
          <TableBody>
            <Row>
              <Cell>
                <Label className={isRequired('zonecode') ? 'imp' : undefined}>우편 번호</Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Group style={{ flex: 'none' }}>
                    <Input
                      aria-label="우편번호"
                      placeholder="우편번호 검색"
                      title="우편번호 검색"
                      readOnly
                      style={{ width: 160 }}
                      value={form.zonecode ?? ''}
                    />
                    <ButtonComponent
                      type="button"
                      onClick={() => setAddressOpen(true)}
                      isDisabled={isEdit}
                    >
                      검색
                    </ButtonComponent>
                  </Group>
                </div>
              </Cell>

              <Cell>
                <Label className={isRequired('roadAddress') ? 'imp' : undefined}>도로명 주소</Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Input
                    aria-label="도로명주소"
                    placeholder="도로명주소"
                    title="도로명주소 입력"
                    readOnly
                    value={form.roadNmAddr ?? ''}
                  />
                </div>
              </Cell>
            </Row>

            <Row>
              <Cell>
                <Label className={isRequired('jibunAddress') ? 'imp' : undefined}>지번 주소</Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Input
                    aria-label="지번주소"
                    title="지번주소 입력"
                    readOnly
                    value={form.lctnLotnoAddr ?? ''}
                  />
                </div>
              </Cell>

              <Cell>
                <Label>상세 주소</Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Input
                    aria-label="상세 주소 입력"
                    title="상세 주소 입력"
                    value={form.lctnDtlAddr ?? ''}
                    onChange={(e) =>
                      setValue(
                        'lctnDtlAddr',
                        (e.target as HTMLInputElement).value as PlantBaseCreateReq['lctnDtlAddr'],
                      )
                    }
                    disabled={isEdit}
                  />
                </div>
              </Cell>
            </Row>
          </TableBody>
        </Table>

        <AddressField
          open={addressOpen}
          onClose={() => setAddressOpen(false)}
          onChange={onAddressChange}
        />
      </ResizableTableContainer>
    </div>
  );
}

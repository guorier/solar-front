'use client';

import React, { useState } from 'react';
import { ButtonComponent, Icons, TitleComponent, BottomGroupComponent } from '@/components';
import { Group } from 'react-aria-components';
import AccountTable from './components/AccountTable';
import { AddressFieldValue } from '@/components/address/AddressField';
import { ModalPlantSelect } from './components/ModalPlantSelect';
import { PlantBase } from '@/services/plants/type';

// const REQUIRED = ['pwplNm', 'address'] as const;
// type FieldKey = string;

type FormState = {
  bcode?: string;
  roadAddress?: string;
  jibunAddress?: string;
  zonecode?: string;
  sido?: string;
  address?: string;
  lctnZip?: string;
  roadNmAddr?: string;
  lctnLotnoAddr?: string;
  pwplId?: string;
  pwplNm?: string;
};

export default function AccountDetailForm() {
  const [addressOpen, setAddressOpen] = useState(false);
  const [isPlantSelectModalOpen, setIsPlantSelectModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>({});

  // const requiredSet = useMemo(() => new Set<FieldKey>(REQUIRED), []);
  // const isRequired = (k: FieldKey) => requiredSet.has(k);

  // const setValue = <K extends keyof FormState>(k: K, v: FormState[K]) => {
  //   setForm((prev) => ({ ...prev, [k]: v }));
  // };

  const onAddressChange = (v: AddressFieldValue) => {
    setForm((prev) => ({
      ...prev,
      bcode: v.bcode,
      roadAddress: v.roadAddress || v.address,
      jibunAddress: v.jibunAddress,
      zonecode: v.zonecode,
      sido: v.sido,
      address: v.address,
      lctnZip: v.zonecode,
      roadNmAddr: v.roadAddress || v.address,
      lctnLotnoAddr: v.jibunAddress,
    }));
  };

  return (
    <>
      <div className="title-group">
        <TitleComponent
          title="설정 관리"
          subTitle="계정 관리"
          desc="사용자 상세 정보 확인 및 메뉴에 대한 권한 제어 가능하다."
        />
      </div>

      <div className="content-group" style={{ paddingTop: 'var(--spacing-10)' }}>
        <Group className="row-group" style={{ gap: 'var(--spacing-16)' }}>
          <AccountTable
            addressOpen={addressOpen}
            setAddressOpen={setAddressOpen}
            onAddressChange={onAddressChange}
            setIsPlantSelectModalOpen={setIsPlantSelectModalOpen}
          />
        </Group>
      </div>

      <BottomGroupComponent
        rightCont={
          <div className="button-group">
            <ButtonComponent
              variant="contained"
              icon={<Icons iName="edit" size={16} color="#fff" />}
              onClick={() => console.log('수정 데이터:', form)}
            >
              수정
            </ButtonComponent>
            <ButtonComponent
              variant="delete"
              icon={<Icons iName="delete" size={16} color="#fff" />}
            >
              삭제
            </ButtonComponent>
            <ButtonComponent
              variant="outlined"
              icon={<Icons iName="list" size={16} color="#8B8888" />}
            >
              취소
            </ButtonComponent>
          </div>
        }
      />

      <ModalPlantSelect
        isOpen={isPlantSelectModalOpen}
        onOpenChange={setIsPlantSelectModalOpen}
        onApply={(plant: PlantBase) => {
          setForm((prev) => ({
            ...prev,
            pwplId: plant.pwplId,
            pwplNm: plant.pwplNm,
          }));
        }}
      />
    </>
  );
}
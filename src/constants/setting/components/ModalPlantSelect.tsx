'use client';

import { useState } from 'react';
import { Modal } from '@/components/modal/modal.component';
import type { PlantBase } from '@/services/plants/type';
import { CheckboxGroup, Group, Label, ListBoxItem } from 'react-aria-components';
import { styled } from 'styled-components';
import { ButtonComponent, Checkbox, Icons } from '@/components';

interface ModalPlantSelectProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (plant: PlantBase) => void;
}

const TransferBox = styled.div`
  flex: 1;

  .react-aria-Label {
    line-height: 23px;
    margin-bottom: var(--spacing-4);
    font-weight: 700;
  }

  .react-aria-CheckboxGroup {
    height: 360px;
    max-height: 360px;
    padding: var(--spacing-5);
    border-radius: var(--radius);
    border: 1px solid var(--border-color);
    background: var(--gray-A100);
    overflow-y: auto;

    label {
      height: 32px;
      padding: 0 var(--spacing-5);
      border-radius: var(--radius-sm);
      &[data-selected='true'] {
        background: var(--point-pink-5);
      }
    }
  }
`;

const TransferButton = styled(ButtonComponent)`
  width: 40px !important;
  height: 40px !important;
  border: 1px solid var(--border-color) !important;

  &:hover {
    background: var(--gray-5) !important;
  }
`;

export const ModalPlantSelect = ({ isOpen, onOpenChange, onApply }: ModalPlantSelectProps) => {
  const [selected, setSelected] = useState<PlantBase | null>(null);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="발전소 지정"
      primaryButton="추가"
      secondaryButton="취소"
      onPrimaryPress={() => {
        if (!selected) return;
        onApply(selected);
        onOpenChange(false);
      }}
      isPrimaryDisabled={!setSelected}
    >
      <Group style={{ gap: 'var(--spacing-4)' }}>
        {/* 🔒 ListBoxItem 사용 처리 (구조 유지, 숨김) */}
        <ListBoxItem id="__noop__" style={{ display: 'none' }}>
          noop
        </ListBoxItem>

        <TransferBox>
          <Label>발전소 목록</Label>
          <CheckboxGroup aria-label="발전소 목록">
            <Checkbox value="1">와이어블1호기</Checkbox>
            <Checkbox value="2">와이어블1호기</Checkbox>
            <Checkbox value="3">와이어블1호기</Checkbox>
            <Checkbox value="4">와이어블1호기</Checkbox>
            <Checkbox value="5">와이어블1호기</Checkbox>
            <Checkbox value="6">와이어블1호기</Checkbox>
            <Checkbox value="7">와이어블1호기</Checkbox>
            <Checkbox value="8">와이어블1호기</Checkbox>
            <Checkbox value="9">와이어블1호기</Checkbox>
            <Checkbox value="10">와이어블1호기</Checkbox>
            <Checkbox value="11">와이어블1호기</Checkbox>
            <Checkbox value="12">와이어블1호기</Checkbox>
            <Checkbox value="13">와이어블1호기</Checkbox>
            <Checkbox value="14">와이어블1호기</Checkbox>
            <Checkbox value="15">와이어블1호기</Checkbox>
            <Checkbox value="16">와이어블1호기</Checkbox>
            <Checkbox value="17">와이어블1호기</Checkbox>
            <Checkbox value="18">와이어블1호기</Checkbox>
          </CheckboxGroup>
        </TransferBox>

        <Group style={{ flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <TransferButton variant="none" icon={<Icons iName="transfer_right" color="#444242" />} />
          <TransferButton variant="none" icon={<Icons iName="transfer_left" color="#444242" />} />
        </Group>

        <TransferBox>
          <Label>내 발전소</Label>
          <CheckboxGroup aria-label="발전소 목록">
            <Checkbox value="1">와이어블1호기</Checkbox>
            <Checkbox value="2">와이어블1호기</Checkbox>
            <Checkbox value="3">와이어블1호기</Checkbox>
            <Checkbox value="4">와이어블1호기</Checkbox>
          </CheckboxGroup>
        </TransferBox>
      </Group>
    </Modal>
  );
};
// src\components\modal\alert.modal.tsx
'use client';

import { Modal } from '@/components';
import styled from 'styled-components';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  primaryButton?: string;
  secondaryButton?: string;
  width?: number;
}

const Content = styled.div`
  font-size: var(--font-size-15);
  line-height: 1.6;
  color: var(--text-color-base);
  padding-top: var(--spacing-4);
  padding-bottom: var(--spacing-8);
`;

export function Alert({
  isOpen,
  onClose,
  title = '알림',
  description,
  primaryButton = '확인',
  secondaryButton = '취소',
  width = 400,
}: AlertModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
      title={title}
      primaryButton={primaryButton}
      secondaryButton={secondaryButton}
      width={width}
    >
      <Content>{description}</Content>
    </Modal>
  );
}
// src/components/address/DaumPostcode.tsx
'use client';

import { useEffect, useRef } from 'react';
import { Modal } from '@/components';

declare global {
  interface Window {
    daum?: {
      Postcode?: new (options: { oncomplete: (data: DaumAddressValue) => void }) => {
        embed: (element: HTMLElement) => void;
      };
    };
  }
}

export type DaumAddressValue = {
  zonecode: string;
  address: string;
  bcode?: string;
  jibunAddress?: string;
  roadAddress?: string;
  sido?: string;
};


type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (data: DaumAddressValue) => void;
};

const SCRIPT_SRC = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

export default function DaumPostcode({ open, onClose, onSelect }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const el = ref.current;

    const load = () => {
      if (!el || !window.daum?.Postcode) return;
      el.innerHTML = '';
      new window.daum.Postcode({
        oncomplete: (data: DaumAddressValue) => {
          onSelect(data);
          onClose();
        },
      }).embed(el);
    };

    if (window.daum?.Postcode) {
      load();
    } else {
      const script = document.createElement('script');
      script.src = SCRIPT_SRC;
      script.onload = load;
      document.body.appendChild(script);
    }

    return () => {
      if (el) el.innerHTML = '';
    };
  }, [open, onClose, onSelect]);

  return (
    <Modal
      isOpen={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
      title="주소 검색"
      primaryButton="닫기"
    >
      <div ref={ref} style={{ width: '100%', minHeight: 480 }} />
    </Modal>
  );
}

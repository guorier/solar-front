'use client';

import { type CSSProperties, useState, useMemo } from 'react';
import { Label } from 'react-aria-components';
import { DatePicker, InputComponent, Modal, Select, SelectItem } from '@/components';

interface FormState {
  contractName: string;
  buyer: string;
  recQty: string;
  startDate: string;
  endDate: string;
  status: string;
}

const initialForm: FormState = {
  contractName: '',
  buyer: '',
  recQty: '',
  startDate: '',
  endDate: '',
  status: '',
};

const MOCK_UNIT_PRICE = 45000;

const buyerOptions = [
  { id: 'sk', label: 'SK E&S' },
  { id: 'kepco', label: '한국전력' },
  { id: 'gs', label: 'GS에너지' },
  { id: 'kpx', label: '한국 전력 거래소' },
  { id: 'etc', label: '기타' },
];

const statusOptions = [
  { id: 'active', label: '진행 중' },
  { id: 'done', label: '완료 됨' },
  { id: 'wait', label: '대기' },
];

const fieldRowStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
};

const rowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px',
};

const labelStyle: CSSProperties = {
  fontSize: '13px',
  fontWeight: 600,
  color: '#333',
};

const readonlyBoxStyle: CSSProperties = {
  height: '36px',
  padding: '0 10px',
  display: 'flex',
  alignItems: 'center',
  background: '#f5f6f8',
  border: '1px solid #d9dde5',
  borderRadius: '4px',
  fontSize: '13px',
  color: '#555',
};


const headerRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '12px',
};

const statusLabelStyle: CSSProperties = {
  fontSize: '13px',
  fontWeight: 600,
  color: '#333',
  whiteSpace: 'nowrap',
};

const formWrapStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RecContractRegisterModal({ isOpen, onOpenChange }: Props) {
  const [form, setForm] = useState<FormState>(initialForm);

  const contractAmount = useMemo(() => {
    const qty = parseInt(form.recQty, 10);
    if (!qty || qty <= 0) return '';
    return (qty * MOCK_UNIT_PRICE).toLocaleString('ko-KR') + ' 원';
  }, [form.recQty]);

  const unitPriceDisplay = MOCK_UNIT_PRICE.toLocaleString('ko-KR') + ' 원';

  const set = (key: keyof FormState) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleRegister = () => {
    if (!form.contractName.trim() || form.contractName.trim().length < 5) {
      alert('계약자 명은 5자리 이상 입력해주세요.');
      return;
    }
    if (!form.buyer) {
      alert('구매 대상을 선택해주세요.');
      return;
    }
    const qty = parseInt(form.recQty, 10);
    if (!form.recQty || isNaN(qty) || qty < 1) {
      alert('REC 수량은 1 이상 입력해주세요.');
      return;
    }
    if (!form.startDate) {
      alert('계약 시작일을 선택해주세요.');
      return;
    }
    if (!form.endDate) {
      alert('계약 종료일을 선택해주세요.');
      return;
    }
    if (form.endDate < form.startDate) {
      alert('계약 종료일은 시작일보다 빠를 수 없습니다.');
      return;
    }
    if (!form.status) {
      alert('상태를 선택해주세요.');
      return;
    }
    // 등록 처리 후 닫기
    setForm(initialForm);
    onOpenChange(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) setForm(initialForm);
        onOpenChange(open);
      }}
      title="장기 REC 계약"
      subTitle='매달 자동으로 "계약 REC 수량" 만큼 처리되는 장기계약을 등록 합니다.'
      primaryButton="등록"
      secondaryButton="취소"
      onPrimaryPress={handleRegister}
      width={560}
    >
      <div style={headerRowStyle}>
        <span style={statusLabelStyle}>상태</span>
        <Select
          aria-label="상태 선택"
          selectedKey={form.status || null}
          onSelectionChange={(key) => set('status')(key as string)}
          style={{ width: '120px' }}
        >
          {statusOptions.map((opt) => (
            <SelectItem key={opt.id} id={opt.id}>
              {opt.label}
            </SelectItem>
          ))}
        </Select>
      </div>

      <div style={formWrapStyle}>
        {/* 계약자 명 */}
        <div style={fieldRowStyle}>
          <Label style={labelStyle} className="imp">
            계약자 명
          </Label>
          <InputComponent
            aria-label="계약자 명 입력"
            placeholder="계약자 명을 입력해주세요 (최대 30자)"
            maxLength={30}
            value={form.contractName}
            onChange={(e) => set('contractName')((e.target as HTMLInputElement).value)}
          />
        </div>

        {/* 구매 대상 / REC 수량 */}
        <div style={rowStyle}>
          <div style={fieldRowStyle}>
            <Label style={labelStyle} className="imp">
              구매 대상
            </Label>
            <Select
              aria-label="구매 대상 선택"
              selectedKey={form.buyer || null}
              onSelectionChange={(key) => set('buyer')(key as string)}
            >
              {buyerOptions.map((opt) => (
                <SelectItem key={opt.id} id={opt.id}>
                  {opt.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div style={fieldRowStyle}>
            <Label style={labelStyle} className="imp">
              REC 수량
            </Label>
            <InputComponent
              aria-label="REC 수량 입력"
              placeholder="수량 입력"
              type="number"
              min="1"
              max="99999999"
              value={form.recQty}
              onChange={(e) => {
                const val = (e.target as HTMLInputElement).value;
                if (val.length <= 8) set('recQty')(val);
              }}
            />
          </div>
        </div>

        {/* 계약 시작 / 계약 종료 */}
        <div style={rowStyle}>
          <div style={fieldRowStyle}>
            <Label style={labelStyle} className="imp">
              계약 시작
            </Label>
            <DatePicker
              aria-label="계약 시작일"
              value={form.startDate}
              onChange={set('startDate')}
              max={form.endDate || undefined}
            />
          </div>

          <div style={fieldRowStyle}>
            <Label style={labelStyle} className="imp">
              계약 종료
            </Label>
            <DatePicker
              aria-label="계약 종료일"
              value={form.endDate}
              onChange={set('endDate')}
              min={form.startDate || undefined}
            />
          </div>
        </div>

        {/* REC 단가 / 계약 금액 */}
        <div style={rowStyle}>
          <div style={fieldRowStyle}>
            <Label style={labelStyle}>REC 단가</Label>
            <div style={readonlyBoxStyle}>{unitPriceDisplay}</div>
          </div>

          <div style={fieldRowStyle}>
            <Label style={labelStyle}>계약 금액</Label>
            <div style={readonlyBoxStyle}>{contractAmount || '-'}</div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

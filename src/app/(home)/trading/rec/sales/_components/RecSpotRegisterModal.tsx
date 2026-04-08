'use client';

import { type CSSProperties, useState, useMemo } from 'react';
import { Label } from 'react-aria-components';
import { DatePicker, InputComponent, Modal, Select, SelectItem } from '@/components';

interface FormState {
  buyer: string;
  tradeDate: string;
  saleQty: string;
  status: string;
}

const TODAY = new Date().toISOString().slice(0, 10);

const initialForm: FormState = {
  buyer: '',
  tradeDate: TODAY,
  saleQty: '',
  status: '',
};

const MOCK_UNIT_PRICE = 45000;
const COMMISSION_RATE = 0.05;

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
  justifyContent: 'flex-end',
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

const hintStyle: CSSProperties = {
  fontSize: '12px',
  color: '#888',
  marginTop: '4px',
};

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RecSpotRegisterModal({ isOpen, onOpenChange }: Props) {
  const [form, setForm] = useState<FormState>(initialForm);

  const set = (key: keyof FormState) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const unitPriceDisplay = MOCK_UNIT_PRICE.toLocaleString('ko-KR') + ' 원';

  const amount = useMemo(() => {
    const qty = parseInt(form.saleQty, 10);
    if (!qty || qty <= 0) return 0;
    return qty * MOCK_UNIT_PRICE;
  }, [form.saleQty]);

  const amountDisplay = amount > 0 ? amount.toLocaleString('ko-KR') + ' 원' : '-';

  const commissionDisplay =
    amount > 0 ? (amount * COMMISSION_RATE).toLocaleString('ko-KR') + ' 원' : '-';

  const handleRegister = () => {
    if (!form.buyer) {
      alert('거래 대상을 선택해주세요.');
      return;
    }
    if (!form.tradeDate) {
      alert('거래 날짜를 선택해주세요.');
      return;
    }
    const qty = parseInt(form.saleQty, 10);
    if (!form.saleQty || isNaN(qty) || qty < 1) {
      alert('판매 수량은 1 이상 입력해주세요.');
      return;
    }
    if (!form.status) {
      alert('상태를 선택해주세요.');
      return;
    }
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
      title="현물 시장 거래"
      subTitle="현물 시장에서 체결가 REC 거래 정보를 등록 합니다."
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
        {/* 거래 대상 / 거래 날짜 */}
        <div style={rowStyle}>
          <div style={fieldRowStyle}>
            <Label style={labelStyle} className="imp">
              거래 대상
            </Label>
            <Select
              aria-label="거래 대상 선택"
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
              거래 날짜
            </Label>
            <DatePicker
              aria-label="거래 날짜"
              value={form.tradeDate}
              onChange={set('tradeDate')}
            />
          </div>
        </div>

        {/* 판매 수량 / REC 단가 */}
        <div style={rowStyle}>
          <div style={fieldRowStyle}>
            <Label style={labelStyle} className="imp">
              판매 수량
            </Label>
            <InputComponent
              aria-label="판매 수량 입력"
              placeholder="수량 입력"
              type="number"
              min="1"
              max="99999999"
              value={form.saleQty}
              onChange={(e) => {
                const val = (e.target as HTMLInputElement).value;
                if (val.length <= 8) set('saleQty')(val);
              }}
            />
          </div>

          <div style={fieldRowStyle}>
            <Label style={labelStyle}>REC 단가</Label>
            <div style={readonlyBoxStyle}>{unitPriceDisplay}</div>
          </div>
        </div>

        {/* 수수료 / 금액 */}
        <div style={rowStyle}>
          <div style={fieldRowStyle}>
            <Label style={labelStyle}>수수료</Label>
            <div style={readonlyBoxStyle}>{commissionDisplay}</div>
          </div>

          <div style={fieldRowStyle}>
            <Label style={labelStyle}>금액</Label>
            <div style={readonlyBoxStyle}>{amountDisplay}</div>
          </div>
        </div>

        <p style={hintStyle}>일반적으로 거래금액의 5% 수수료가 발생 합니다.</p>
      </div>
    </Modal>
  );
}

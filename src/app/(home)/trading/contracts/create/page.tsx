'use client';

import { Suspense, useEffect, useRef, useState, type CSSProperties } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Label } from 'react-aria-components';
import {
  BottomGroupComponent,
  ButtonComponent,
  Icons,
  Cell,
  Column,
  DatePicker,
  Row,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableHeader,
  TitleComponent,
} from '@/components';
import {
  contractTypeOptions,
  findContractDetail,
  settlementTypeOptions,
  tradeStatusOptions,
} from '@/mockup/contracts.mock';
import { Group, Heading, Input, ResizableTableContainer } from 'react-aria-components';

// ── 스타일 ────────────────────────────────

const textareaStyle: CSSProperties = {
  width: '100%',
  minHeight: '88px',
  padding: '8px 10px',
  border: '1px solid #d9dde5',
  borderRadius: '4px',
  fontSize: '13px',
  color: '#333',
  resize: 'vertical',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};

const noteSectionStyle: CSSProperties = {
  border: '1px solid #d9dde5',
  borderRadius: '6px',
  padding: '16px 20px',
  background: '#fafbfc',
};

const noteListStyle: CSSProperties = {
  margin: '8px 0 0 0',
  paddingLeft: '20px',
  fontSize: '13px',
  color: '#555',
  lineHeight: '1.8',
};

// ── 폼 컴포넌트 ───────────────────────────

interface FormState {
  plant: string;
  contractType: string;
  contractNo: string;
  counterparty: string;
  startDate: string;
  endDate: string;
  contractQty: string;
  tradeStatus: string;
  settlementType: string;
  fixedUnitPrice: string;
  memo: string;
}

const initialForm: FormState = {
  plant: '',
  contractType: '',
  contractNo: '',
  counterparty: '',
  startDate: '',
  endDate: '',
  contractQty: '',
  tradeStatus: '',
  settlementType: '',
  fixedUnitPrice: '',
  memo: '',
};

function ContractRegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const isEdit = !!id;

  const [form, setForm] = useState<FormState>(initialForm);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!id) return;
    const detail = findContractDetail(id);
    if (!detail) return;
    const [start, end] = detail.contractPeriod.split(' ~ ');
    setForm({
      plant: detail.plant,
      contractType: '',
      contractNo: detail.tradeNo,
      counterparty: detail.counterparty,
      startDate: start?.trim() ?? '',
      endDate: end?.trim() ?? '',
      contractQty: detail.contractQty.replace('kW', '').trim(),
      tradeStatus: detail.status,
      settlementType: detail.settlementType,
      fixedUnitPrice: '',
      memo: '',
    });
  }, [id]);

  const set = (key: keyof FormState) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const isFixedPrice = form.settlementType === '고정 단가';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      alert('파일 용량은 5MB를 초과할 수 없습니다.');
      e.target.value = '';
      return;
    }
    setFileName(f.name);
  };

  const handleSubmit = () => {
    if (!form.plant.trim()) {
      alert('발전소를 입력해주세요.');
      return;
    }
    if (!form.contractType) {
      alert('계약 유형을 선택해주세요.');
      return;
    }
    if (!form.counterparty.trim()) {
      alert('거래처를 입력해주세요.');
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
    const qty = parseInt(form.contractQty, 10);
    if (!form.contractQty || isNaN(qty) || qty < 1) {
      alert('약정 용량은 1 이상 입력해주세요.');
      return;
    }
    if (!form.tradeStatus) {
      alert('거래 상태를 선택해주세요.');
      return;
    }
    if (!form.settlementType) {
      alert('정산 유형을 선택해주세요.');
      return;
    }
    router.push('/trading/contracts');
  };

  return (
    <>
      <div className="title-group">
        <TitleComponent
          title="전력 거래"
          subTitle="계약 관리"
          desc="전력 거래 계약 등록 및 현황 조회"
        />
      </div>
      <div className="content-group" style={{ paddingTop: 'var(--spacing-10)' }}>
        <Group className="row-group" style={{ gap: 'var(--spacing-16)' }}>
          <Heading level={3}>기본 정보</Heading>
          <ResizableTableContainer>
            <Table type="vertical" aria-label="계약 기본 정보">
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
                    <Label className="imp">발전소</Label>
                  </Cell>
                  <Cell>
                    <div className="react-aria-TextField" style={{ maxWidth: '284px' }}>
                      <Group style={{ flex: 'none' }}>
                        <Input
                          value={form.plant}
                          placeholder="발전소를 입력해주세요"
                          aria-label="발전소 입력"
                          onChange={(e) => set('plant')((e.target as HTMLInputElement).value)}
                        />
                        <ButtonComponent onPress={() => undefined}>검색</ButtonComponent>
                      </Group>
                    </div>
                  </Cell>
                  <Cell>
                    <Label className="imp">계약 유형</Label>
                  </Cell>
                  <Cell>
                    <Select
                      aria-label="계약 유형 선택"
                      selectedKey={form.contractType || null}
                      onSelectionChange={(key) => set('contractType')(key as string)}
                      placeholder="선택"
                    >
                      {contractTypeOptions.map((opt) => (
                        <SelectItem key={opt.id} id={opt.id}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </Cell>
                  <Cell>
                    <Label>계약 번호</Label>
                  </Cell>
                  <Cell>
                    <div className="react-aria-TextField">
                      <Input
                        aria-label="계약 번호"
                        value={form.contractNo || (isEdit ? '' : '등록 후 발급')}
                        readOnly
                      />
                    </div>
                  </Cell>
                </Row>

                {/* 계약 번호 / 거래처 */}
                <Row>
                  <Cell>
                    <Label className="imp">거래처</Label>
                  </Cell>
                  <Cell>
                    <div className="react-aria-TextField">
                      <Input
                        aria-label="거래처 입력"
                        placeholder="거래처를 입력해주세요"
                        maxLength={15}
                        value={form.counterparty}
                        onChange={(e) => set('counterparty')((e.target as HTMLInputElement).value)}
                      />
                    </div>
                  </Cell>

                  <Cell>
                    <Label className="imp">계약 시작</Label>
                  </Cell>
                  <Cell>
                    <DatePicker
                      aria-label="계약 시작일"
                      value={form.startDate}
                      onChange={set('startDate')}
                      max={form.endDate || undefined}
                    />
                  </Cell>
                  <Cell>
                    <Label className="imp">계약 종료</Label>
                  </Cell>
                  <Cell>
                    <DatePicker
                      aria-label="계약 종료일"
                      value={form.endDate}
                      onChange={set('endDate')}
                      min={form.startDate || undefined}
                    />
                  </Cell>
                </Row>

                {/* 약정 용량 / 거래 상태 */}
                <Row>
                  <Cell>
                    <Label className="imp">약정 용량</Label>
                  </Cell>
                  <Cell>
                    <div className="react-aria-TextField">
                      <Input
                        aria-label="약정 용량 입력"
                        placeholder="용량 입력"
                        type="number"
                        inputMode="numeric"
                        value={form.contractQty}
                        onChange={(e) => {
                          const val = (e.target as HTMLInputElement).value;
                          if (val.length <= 8) set('contractQty')(val);
                        }}
                      />
                    </div>
                  </Cell>
                  <Cell>
                    <Label className="imp">거래 상태</Label>
                  </Cell>
                  <Cell>
                    <Select
                      aria-label="거래 상태 선택"
                      selectedKey={form.tradeStatus || null}
                      onSelectionChange={(key) => set('tradeStatus')(key as string)}
                      placeholder="선택"
                    >
                      {tradeStatusOptions.map((opt) => (
                        <SelectItem key={opt.id} id={opt.id}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </Cell>

                  <Cell>
                    <Label className="imp">정산 유형</Label>
                  </Cell>
                  <Cell>
                    <Select
                      aria-label="정산 유형 선택"
                      selectedKey={form.settlementType || null}
                      onSelectionChange={(key) => {
                        set('settlementType')(key as string);
                        if (key !== '고정 단가') set('fixedUnitPrice')('');
                      }}
                      placeholder="선택"
                    >
                      {settlementTypeOptions.map((opt) => (
                        <SelectItem key={opt.id} id={opt.id}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </Cell>
                </Row>

                <Row>
                  <Cell>
                    <Label>고정 단가</Label>
                  </Cell>
                  <Cell>
                    <div className="react-aria-TextField">
                      {isFixedPrice ? (
                        <Input
                          aria-label="고정 단가 입력"
                          placeholder="단가 입력"
                          type="number"
                          inputMode="numeric"
                          value={form.fixedUnitPrice}
                          onChange={(e) =>
                            set('fixedUnitPrice')((e.target as HTMLInputElement).value)
                          }
                        />
                      ) : (
                        <Input aria-label="고정 단가" value="-" readOnly />
                      )}
                    </div>
                  </Cell>

                  <Cell>
                    <Label>계약서 파일</Label>
                  </Cell>
                  <Cell colSpan={3}>
                    <div className="react-aria-TextField" style={{ maxWidth: '100%' }}>
                      <Group style={{ flex: 'none' }}>
                        <Input
                          aria-label="계약서 파일"
                          placeholder="파일 선택"
                          value={fileName}
                          readOnly
                        />
                        <ButtonComponent onPress={() => fileInputRef.current?.click()}>
                          파일
                        </ButtonComponent>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.svg,.png"
                          style={{ display: 'none' }}
                          onChange={handleFileChange}
                        />
                      </Group>
                    </div>
                  </Cell>
                </Row>

                {/* 비고 */}
                <Row>
                  <Cell>
                    <Label>비고</Label>
                  </Cell>
                  <Cell colSpan={5}>
                    <textarea
                      style={textareaStyle}
                      placeholder="비고를 입력해주세요"
                      value={form.memo}
                      onChange={(e) => set('memo')(e.target.value)}
                    />
                  </Cell>
                </Row>
              </TableBody>
            </Table>
          </ResizableTableContainer>
          {/* 참고 */}
          <div style={noteSectionStyle}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#333' }}>참고</span>
            <p style={{ fontSize: '13px', color: '#555', margin: '8px 0 0 0' }}>
              ※ 계약 등록 시 자동으로 유효성 검증으로 수행합니다
            </p>
            <ul style={noteListStyle}>
              <li>동일 발전소의 기간 중복 확인</li>
              <li>계약 시작일/종료일 유효성 확인</li>
              <li>필수 정산 정보 입력 확인</li>
            </ul>
          </div>
        </Group>
      </div>

      <BottomGroupComponent
        rightCont={
          <>
            <ButtonComponent variant="outlined" onPress={() => router.push('/trading/contracts')}>
              취소
            </ButtonComponent>
            <ButtonComponent
              variant="contained"
              icon={<Icons iName={isEdit ? 'edit' :'plus'} size={16} color="#fff" />}
              onPress={handleSubmit}
            >
              {isEdit ? '수정' : '등록'}
            </ButtonComponent>
          </>
        }
      />
    </>
  );
}

export default function ContractRegisterPage() {
  return (
    <Suspense>
      <ContractRegisterContent />
    </Suspense>
  );
}

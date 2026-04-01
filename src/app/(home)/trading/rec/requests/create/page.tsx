// src/app/(home)/trading/rec/requests/create/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ButtonComponent,
  Icons,
  TitleComponent,
  BottomGroupComponent,
  Table,
  TableHeader,
  TableBody,
  Column,
  Row,
  Cell,
  Label,
  Select,
  SelectItem,
  DatePicker,
} from '@/components';
import { Group, Heading, Input, ResizableTableContainer } from 'react-aria-components';

type Mode = 'create' | 'edit';

type RecHistoryItem = {
  type: 'submit' | 'issued';
  date: string;
  description: string;
  submitter: string;
};

type RecForm = {
  plantNm: string;
  plantId: string;
  generation: string;
  targetMonth: string;
  recQty: string;
  weight: string;
  appliedRec: string;
  status: string;
  rpsFile: File | null;
  certFile: File | null;
};

export default function RecCreatePage() {
  const router = useRouter();
  const [mode] = useState<Mode>('create');
  const [form, setForm] = useState<RecForm>({
    plantNm: '',
    plantId: '',
    generation: '',
    targetMonth: '',
    recQty: '',
    weight: '',
    appliedRec: '',
    status: '신청',
    rpsFile: null,
    certFile: null,
  });

  const [histories] = useState<RecHistoryItem[]>([]);

  const setValue = <K extends keyof RecForm>(key: K, value: RecForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // 적용 REC = REC수량 × 가중치
  const calcAppliedRec = (recQty: string, weight: string) => {
    const qty = parseFloat(recQty);
    const w = parseFloat(weight);
    if (isNaN(qty) || isNaN(w)) return '';
    return (qty * w).toFixed(2);
  };

  const handleGenerationChange = (value: string) => {
    const cleaned = value.replace(/[^0-9]/g, '').slice(0, 8);
    setForm((prev) => ({ ...prev, generation: cleaned }));
  };

  const handleRecQtyChange = (value: string) => {
    const cleaned = value.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    let result = cleaned;
    if (parts.length > 2) result = parts[0] + '.' + parts.slice(1).join('');
    if (parts.length === 2 && parts[1].length > 2) result = parts[0] + '.' + parts[1].slice(0, 2);
    if (result.replace('.', '').length > 5) return;
    const newApplied = calcAppliedRec(result, form.weight);
    setForm((prev) => ({ ...prev, recQty: result, appliedRec: newApplied }));
  };

  const handleWeightChange = (value: string) => {
    const cleaned = value.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    let result = cleaned;
    if (parts.length > 2) result = parts[0] + '.' + parts.slice(1).join('');
    if (parts.length === 2 && parts[1].length > 2) result = parts[0] + '.' + parts[1].slice(0, 2);
    if (result.replace('.', '').length > 5) return;
    const newApplied = calcAppliedRec(form.recQty, result);
    setForm((prev) => ({ ...prev, weight: result, appliedRec: newApplied }));
  };

  const onGoList = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }
    router.replace('/trading/rec/requests');
  };

  const onSubmit = async () => {
    if (!form.plantId) {
      alert('발전소를 선택하세요.');
      return;
    }
    if (!form.generation) {
      alert('발전량을 입력하세요.');
      return;
    }
    if (!form.targetMonth) {
      alert('대상 월을 선택하세요.');
      return;
    }
    if (!form.recQty || parseFloat(form.recQty) < 0.1) {
      alert('REC 수량을 올바르게 입력하세요.');
      return;
    }
    if (!form.weight || parseFloat(form.weight) < 0.1) {
      alert('가중치를 올바르게 입력하세요. (최소 0.1)');
      return;
    }
    // TODO: API 연동
    alert(mode === 'create' ? '등록되었습니다.' : '수정되었습니다.');
    router.replace('/trading/rec/requests');
  };

  const onDelete = async () => {
    if (!window.confirm('정말 삭제 하시겠습니까?')) return;
    // TODO: API 연동
    router.replace('/trading/rec/requests');
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      style={{ display: 'contents' }}
    >
      <div className="title-group">
        <TitleComponent
          title="전력 거래"
          subTitle="REC 발급 관리"
          thirdTitle="신청 관리"
          desc="REC 신청 등록 및 목록 조회"
        />
      </div>

      <div className="content-group" style={{ paddingTop: 'var(--spacing-10)' }}>
        <Group className="row-group" style={{ gap: 'var(--spacing-16)' }}>
          {/* REC 신청 정보 */}
          <div>
            <Heading level={3}>REC 신청 정보</Heading>
            <ResizableTableContainer>
              <Table type="vertical" aria-label="REC 신청 정보">
                <TableHeader>
                  <Column isRowHeader width={160} />
                  <Column />
                  <Column isRowHeader width={160} />
                  <Column />
                </TableHeader>
                <TableBody>
                  {/* 발전소 / 발전소 ID */}
                  <Row>
                    <Cell>
                      <Label className="imp">발전소</Label>
                    </Cell>
                    <Cell>
                      <div className="react-aria-TextField">
                        <Input aria-label="발전소" placeholder="입력해 주세요" title="발전소" />
                      </div>
                    </Cell>
                    <Cell>
                      <Label>발전소 ID</Label>
                    </Cell>
                    <Cell>
                      <div className="react-aria-TextField">
                        <Input aria-label="발전소 ID" value={form.plantId} readOnly />
                      </div>
                    </Cell>
                  </Row>

                  {/* 발전량 / 대상 월 */}
                  <Row>
                    <Cell>
                      <Label className="imp">발전량 (kWh)</Label>
                    </Cell>
                    <Cell>
                      <div className="react-aria-TextField">
                        <Input
                          aria-label="발전량"
                          placeholder="100"
                          inputMode="numeric"
                          value={form.generation}
                          onChange={(e) =>
                            handleGenerationChange((e.target as HTMLInputElement).value)
                          }
                        />
                      </div>
                    </Cell>
                    <Cell>
                      <Label className="imp">대상 월</Label>
                    </Cell>
                    <Cell>
                      <DatePicker aria-label="상업 운전 일" />
                    </Cell>
                  </Row>

                  {/* REC 수량 / 가중치 */}
                  <Row>
                    <Cell>
                      <Label className="imp">REC 수량 (REC)</Label>
                    </Cell>
                    <Cell>
                      <div className="react-aria-TextField">
                        <Input
                          aria-label="REC 수량"
                          placeholder="20"
                          inputMode="decimal"
                          value={form.recQty}
                          onChange={(e) => handleRecQtyChange((e.target as HTMLInputElement).value)}
                        />
                      </div>
                    </Cell>
                    <Cell>
                      <Label className="imp">가중치</Label>
                    </Cell>
                    <Cell>
                      <div className="react-aria-TextField">
                        <Input
                          aria-label="가중치"
                          placeholder="0.1"
                          inputMode="decimal"
                          value={form.weight}
                          onChange={(e) => handleWeightChange((e.target as HTMLInputElement).value)}
                        />
                      </div>
                    </Cell>
                  </Row>

                  {/* 적용 REC / 현재 상태 */}
                  <Row>
                    <Cell>
                      <Label>적용 REC</Label>
                    </Cell>
                    <Cell>
                      <div className="react-aria-TextField">
                        <Input aria-label="적용 REC" value={form.appliedRec} readOnly />
                      </div>
                    </Cell>
                    <Cell>
                      <Label className="imp">현재 상태</Label>
                    </Cell>
                    <Cell>
                      <Select
                        aria-label="현재 상태"
                        selectedKey={form.status}
                        onSelectionChange={(key) => setValue('status', String(key))}
                      >
                        <SelectItem id="신청">신청</SelectItem>
                        {mode === 'edit' && <SelectItem id="발급 완료">발급 완료</SelectItem>}
                      </Select>
                    </Cell>
                  </Row>

                  {/* RPS 업로드 / REC 인증서 */}
                  <Row>
                    <Cell>
                      <Label className="imp">RPS 업로드</Label>
                    </Cell>
                    <Cell>
                      <div className="react-aria-TextField" style={{ maxWidth: '100%' }}>
                        <Group style={{ flex: 'none' }}>
                          <Input
                            aria-label="RPS 파일"
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
                    <Cell>
                      <Label>REC 인증서</Label>
                    </Cell>
                    <Cell>
                      <div className="react-aria-TextField" style={{ maxWidth: '100%' }}>
                        <Group style={{ flex: 'none' }}>
                          <Input
                            aria-label="REC 인증서 파일"
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
                </TableBody>
              </Table>
            </ResizableTableContainer>
          </div>

          {/* 처리 이력 */}
          <div>
            <Heading level={3}>처리 이력</Heading>
            {histories.length === 0 ? null : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {histories.map((h, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: `1px solid ${h.type === 'issued' ? 'var(--point-green-60, #2ca05a)' : 'var(--gray-30)'}`,
                      borderRadius: 8,
                      padding: '12px 16px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      {h.type === 'issued' && <Icons iName="check" size={16} color="#2ca05a" />}
                      <strong style={{ fontSize: 14 }}>
                        {h.type === 'submit' ? '신청 접수' : '발급 완료'}
                      </strong>
                    </div>
                    <div style={{ color: 'var(--gray-60)', fontSize: 13, marginBottom: 4 }}>
                      접수 일시 &nbsp; {h.date}
                    </div>
                    <div style={{ fontSize: 13 }}>{h.description}</div>
                    <div style={{ textAlign: 'right', color: 'var(--gray-50)', fontSize: 12 }}>
                      접수자 {h.submitter}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Group>
      </div>

      <BottomGroupComponent
        rightCont={
          <div className="button-group">
            <ButtonComponent
              variant="contained"
              icon={<Icons iName="edit" size={16} color="#fff" />}
              type="button"
              onPress={onSubmit}
            >
              {mode === 'create' ? '등록' : '수정'}
            </ButtonComponent>

            <ButtonComponent
              variant="delete"
              icon={<Icons iName="delete" size={16} color="#fff" />}
              type="button"
              onPress={onDelete}
              isDisabled={mode === 'create'}
            >
              삭제
            </ButtonComponent>

            <ButtonComponent
              variant="outlined"
              icon={<Icons iName="list" size={16} color="#8B8888" />}
              type="button"
              onPress={onGoList}
            >
              목록
            </ButtonComponent>
          </div>
        }
      />
    </form>
  );
}

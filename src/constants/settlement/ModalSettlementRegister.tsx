'use client';

import { type CSSProperties, useRef, useState, useMemo } from 'react';
import { Label } from 'react-aria-components';
import { Modal, Select, SelectItem } from '@/components';
import { DatePicker } from '@/components/datepicker/datepicker';
import { useGetPlantBaseCombo } from '@/services/plants/query';

const headerRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  width: '50%',
};

const labelStyle: CSSProperties = {
  fontSize: '13px',
  fontWeight: 600,
  color: '#333',
  whiteSpace: 'nowrap',
};

const tableStyle: CSSProperties = {
  overflow: 'hidden',
  padding: '10px',
  backgroundColor: '#F4F3F6',
  border: '1px solid #BFBBBB',
  borderRadius: '16px',
};

const tableHeaderStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '218px 1fr',
  borderBottom: '1px solid #BFBBBB',
};

const tableHeaderCellStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '32px',
  fontWeight: 600,
  fontSize: '15px',
  color: '#444242',
};

const tableRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '218px 1fr',
  borderBottom: '1px solid #e0e0e0',
};

const tableCellStyle: CSSProperties = {
  height: '52px',
  padding: '0 8px',
  display: 'flex',
  alignItems: 'center',
};

const fileTriggerBaseStyle: CSSProperties = {
  flex: 1,
  height: '40px',
  padding: '0 10px',
  border: '1px solid #d8d8d8',
  borderRadius: '4px',
  background: '#f9f9f9',
  fontSize: '13px',
  color: '#aaa',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  userSelect: 'none',
};

interface RowState {
  plantId: string;
  file: File | null;
}

const INITIAL_ROWS: RowState[] = Array(5)
  .fill(null)
  .map(() => ({ plantId: '', file: null }));

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ModalSettlementRegister({ isOpen, onOpenChange }: Props) {
  const [date, setDate] = useState('');
  const [rows, setRows] = useState<RowState[]>(INITIAL_ROWS);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { data: plantData } = useGetPlantBaseCombo();
  const plants = useMemo(() => plantData ?? [], [plantData]);

  const handlePlantChange = (index: number, value: string) => {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, plantId: value, file: null } : row)),
    );
  };

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, file } : row)));
  };

  const handleFileTriggerClick = (index: number) => {
    if (!rows[index].plantId) return;
    fileInputRefs.current[index]?.click();
  };

  const handleRegister = () => {
    if (!date) {
      alert('날짜를 선택해주세요.');
      return;
    }
    const validRows = rows.filter((row) => row.plantId);
    if (validRows.length === 0) {
      alert('발전소를 하나 이상 선택해주세요.');
      return;
    }
    const missingFile = validRows.find((row) => !row.file);
    if (missingFile) {
      alert('발전소를 선택한 경우 파일을 업로드해주세요.');
      return;
    }
    // TODO: API 연결
    handleReset();
  };

  const handleReset = () => {
    setDate('');
    setRows(INITIAL_ROWS);
    onOpenChange(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) handleReset();
        onOpenChange(open);
      }}
      title="정산 데이터 등록"
      subTitle={`한전 AMI 데이터 파일을 업로드하여 정산 데이터를 자동으로 업데이트합니다.\n엑셀 CSV, XLS, XLSX 확장자만 가능 합니다`}
      primaryButton="등록"
      secondaryButton="취소"
      onPrimaryPress={handleRegister}
      width={580}
    >
      <div style={headerRowStyle}>
        <Label style={labelStyle} className="imp">
          날짜
        </Label>
        <DatePicker value={date} onChange={setDate} aria-label="날짜 선택" />
      </div>

      <div style={tableStyle}>
        <div style={tableHeaderStyle}>
          <span style={tableHeaderCellStyle}>발전소</span>
          <span style={tableHeaderCellStyle}>파일</span>
        </div>
        {rows.map((row, i) => (
          <div
            key={i}
            style={{
              ...tableRowStyle,
              borderBottom: i === rows.length - 1 ? 'none' : '1px solid #e0e0e0',
            }}
          >
            <div style={tableCellStyle}>
              <Select
                placeholder="선택"
                selectedKey={row.plantId || null}
                onSelectionChange={(key) => handlePlantChange(i, String(key))}
                aria-label={`발전소 선택 ${i + 1}`}
                style={{ width: '100%', overflow: 'hidden', borderRadius: '8px' }}
              >
                {plants.map((p) => (
                  <SelectItem key={p.pwplId} id={p.pwplId}>
                    {p.pwplNm}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div style={tableCellStyle}>
              <div
                style={{
                  ...fileTriggerBaseStyle,
                  ...(row.file ? { color: '#333', background: '#fff' } : {}),
                  ...(!row.plantId ? { cursor: 'not-allowed' } : {}),
                }}
                onClick={() => handleFileTriggerClick(i)}
                title={row.file?.name}
              >
                {row.file ? row.file.name : '선택 된 파일 없음'}
              </div>
              <input
                ref={(el) => {
                  fileInputRefs.current[i] = el;
                }}
                type="file"
                accept=".csv,.xls,.xlsx"
                style={{ display: 'none' }}
                onChange={(e) => handleFileChange(i, e)}
              />
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

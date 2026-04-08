import { Label } from 'react-aria-components';
import { ButtonComponent, Icons, InputComponent, MonthPicker } from '@/components';
import {
  fieldRowStyle,
  formCardStyle,
  formCardTitleStyle,
  formRowStyle,
  labelStyle,
  systemGenBoxStyle,
} from '../_constants/styles';

interface KepcoInputCardProps {
  selectedMonth: string;
  onMonthChange: (v: string) => void;
  kepcoMeterValue: string;
  onMeterValueChange: (v: string) => void;
  displayEgqty?: number;
  onSave: () => void;
  isSaving: boolean;
}

export function KepcoInputCard({
  selectedMonth,
  onMonthChange,
  kepcoMeterValue,
  onMeterValueChange,
  displayEgqty,
  onSave,
  isSaving,
}: KepcoInputCardProps) {
  return (
    <div style={formCardStyle}>
      <div style={formCardTitleStyle}>한전 계량기 정보 입력</div>

      <div style={formRowStyle}>
        <div style={fieldRowStyle}>
          <Label style={labelStyle}>검증 기간</Label>
          <MonthPicker
            aria-label="검증 기간"
            value={selectedMonth}
            onChange={(v) => onMonthChange(v ?? '')}
          />
        </div>
        <div style={fieldRowStyle}>
          <Label style={labelStyle}>한전 계량기 값 (kWh)</Label>
          <InputComponent
            aria-label="한전 계량기 값 입력"
            type="number"
            value={kepcoMeterValue}
            onChange={(e) => onMeterValueChange((e.target as HTMLInputElement).value)}
            placeholder="예: 10500.50"
          />
        </div>
        <div style={fieldRowStyle}>
          <Label style={{ ...labelStyle, visibility: 'hidden' }}>액션</Label>
          <ButtonComponent
            variant="excel"
            icon={<Icons iName="save" size={16} color="#fff" />}
            iconPosition="left"
            onPress={onSave}
            isDisabled={isSaving}
          >
            저장
          </ButtonComponent>
        </div>
      </div>

      {/* 시스템 월간 발전량 */}
      <div style={systemGenBoxStyle}>
        <div>
          <div style={{ fontSize: 'var(--font-size)', color: '#1565C0', marginBottom: 6 }}>
            시스템 월간 발전량 (자동 계산)
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#1565C0', lineHeight: 1 }}>
            {displayEgqty != null ? displayEgqty.toLocaleString('ko-KR') : '-'} kWh
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 'var(--font-size)', color: '#1565C0', marginBottom: 4 }}>
            선택 기간
          </div>
          <div style={{ fontSize: 'var(--font-size-15)', fontWeight: 600, color: '#1565C0' }}>
            {selectedMonth}
          </div>
        </div>
      </div>
    </div>
  );
}

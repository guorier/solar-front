import React, { useEffect, useState } from 'react';
import { TextField, Label, Input, TextArea, Group } from 'react-aria-components';
import { ButtonComponent, DatePicker, FieldButton, Icons, Select, SelectItem } from '@/components';
// import { parseDate } from '@internationalized/date';
import './search-fields.component.scss';

export type FieldType = 'text' | 'select' | 'date' | 'search-text' | 'password' | 'textarea';

export interface SearchFieldOption {
  label: string;
  value: string | number;
}

export interface SearchFieldConfig {
  key: string;
  label?: string;
  type?: FieldType;
  options?: SearchFieldOption[];
  onSearchClick?: (value: unknown) => void;
  isBreak?: boolean;
  required?: boolean;
  height?: number;
  gridSize?: number;
  searchText?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  width?: number | string;
}

interface SearchFieldsProps {
  config: (SearchFieldConfig | SearchFieldConfig[])[];
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  rowSpacing?: number;
  columnSpacing?: number;
  spacing?: number;
  gridSize?: number;
}

export const SearchFields = ({
  config,
  values,
  onChange,
  rowSpacing = 12,
  columnSpacing = 40,
}: SearchFieldsProps) => {
  const [passwordVisibleMap, setPasswordVisibleMap] = useState<Record<string, boolean>>({});

  // ✅ hydration mismatch 방지 (react-aria auto id SSR/CSR 불일치)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const togglePasswordVisibility = (key: string) => {
    setPasswordVisibleMap((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderControl = (field: SearchFieldConfig) => {
    const { disabled = false, readOnly = false, width } = field;

    if (field.type === 'select') {
      return (
        <Select
          selectedKey={(values[field.key] as string | number | null) ?? null}
          onSelectionChange={(key) => onChange(field.key, key)}
          isDisabled={disabled}
          placeholder={field.placeholder || '유형 선택'}
          style={{
            width: width ? (typeof width === 'number' ? `${width}px` : width) : '100%',
          }}
        >
          {field.options?.map((opt) => (
            <SelectItem key={opt.value} id={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </Select>
      );
    }

    if (field.type === 'text' || field.type === 'search-text') {
      return (
        <TextField
          aria-label="검색"
          value={(values[field.key] as string) || ''}
          onChange={(value) => onChange(field.key, value)}
          isDisabled={disabled}
          isReadOnly={readOnly}
          style={{
            width: width ? (typeof width === 'number' ? `${width}px` : width) : '100%',
            flexDirection: field.type === 'search-text' ? 'row' : undefined,
          }}
        >
          <Input placeholder={field.placeholder || '입력하세요'} />
          {field.type === 'search-text' && (
            <ButtonComponent
              variant="contained"
              onPress={() => field.onSearchClick?.(values[field.key])}
            >
              {field.searchText || '검색'}
            </ButtonComponent>
          )}
        </TextField>
      );
    }

    if (field.type === 'password') {
      const isPasswordVisible = Boolean(passwordVisibleMap[field.key]);

      return (
        <TextField
          aria-label="비밀번호"
          value={(values[field.key] as string) || ''}
          onChange={(value) => onChange(field.key, value)}
          isDisabled={disabled}
        >
          <Group>
            <Input
              type={isPasswordVisible ? 'text' : 'password'}
              placeholder={field.placeholder || '비밀번호를 입력해 주세요'}
              style={{ paddingRight: 56 }}
            />

            <FieldButton
              aria-label={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
              onClick={() => togglePasswordVisibility(field.key)}
            >
              <Icons iName={isPasswordVisible ? 'eye' : 'eye_off'} color="#8B8888" />
            </FieldButton>
          </Group>
        </TextField>
      );
    }

    if (field.type === 'textarea') {
      return (
        <TextField
          aria-label="설명"
          value={(values[field.key] as string) || ''}
          onChange={(value) => onChange(field.key, value)}
          isDisabled={disabled}
        >
          <TextArea
            placeholder={field.placeholder || '설명을 입력하세요'}
            style={field.height ? { height: field.height } : undefined}
          />
        </TextField>
      );
    }

    if (field.type === 'date') {
      const raw = values[field.key];
      const value = typeof raw === 'string' ? raw : undefined;

      return (
        <DatePicker value={value} onChange={(v) => onChange(field.key, v)} isDisabled={disabled} />
      );
    }

    return null;
  };

  if (!mounted) return null;

  return (
    <div
      suppressHydrationWarning
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        rowGap: `${rowSpacing}px`,
        columnGap: `${columnSpacing}px`,
        alignItems: 'start',
      }}
    >
      {config.map((item, index) => {
        const isArray = Array.isArray(item);
        const firstField = isArray ? item[0] : item;

        // gridSize가 2.4 등 소수점일 경우를 대비해 span 계산
        const gridCols = Math.round(firstField.gridSize || 2.4);

        return (
          <React.Fragment key={`field-group-${index}`}>
            <div style={{ gridColumn: `span ${gridCols}` }}>
              {firstField.label && (
                <Label style={{ display: 'block', marginBottom: 'var(--spacing-4)' }}>
                  {firstField.label}
                  {firstField.required && (
                    <span style={{ color: 'var(--point-pink-50)', marginLeft: 'var(--spacing)' }}>
                      *
                    </span>
                  )}
                </Label>
              )}

              {isArray
                ? item.map((subField) => (
                    <div key={subField.key} style={{ flex: subField.gridSize || 1, minWidth: 0 }}>
                      {renderControl(subField)}
                    </div>
                  ))
                : renderControl(item)}
            </div>

            {/* 🔥 isBreak가 true일 때 12컬럼을 다 차지하는 빈 요소를 넣어 줄바꿈 유도 */}
            {!isArray && item.isBreak && <div style={{ height: 0, border: 'none' }} />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { TextField, Label, Input, TextArea, Group } from 'react-aria-components';
import { Controller, Control, FieldErrors, FieldValues, Path } from 'react-hook-form';
import { ButtonComponent, FieldButton, Icons, Select, SelectItem } from '@/components';
import './search-fields.component.scss';
export interface SearchFormFieldConfig<TFieldValues extends FieldValues> {
  key: Path<TFieldValues>;
  label?: string;
  type?: 'text' | 'select' | 'search-text' | 'password' | 'textarea' | 'mobile';
  options?: { label: string; value: string | number }[];
  onSearchClick?: (value: unknown) => void;
  isBreak?: boolean;
  required?: boolean;
  height?: number;
  gridSize?: number;
  searchText?: string;
  placeholder?: string;
  disabled?: boolean;
  btnDisabled?: boolean;
  readOnly?: boolean;
  width?: number | string;
}

interface SearchFormFieldsProps<TFieldValues extends FieldValues> {
  config: (SearchFormFieldConfig<TFieldValues> | SearchFormFieldConfig<TFieldValues>[])[];
  control: Control<TFieldValues>;
  errors?: FieldErrors<TFieldValues>;
  rowSpacing?: number;
  columnSpacing?: number;
}

export const SearchFormFields = <TFieldValues extends FieldValues>({
  config,
  control,
  errors,
  rowSpacing = 12,
  columnSpacing = 40,
}: SearchFormFieldsProps<TFieldValues>) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<Record<string, boolean>>({});

  const renderControl = (field: SearchFormFieldConfig<TFieldValues>) => {
    const { disabled = false, readOnly = false, width } = field;

    const togglePasswordVisibility = (key: string) => {
      setIsPasswordVisible((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
    };

    const formatMobile = (value: string) => {
      const numbers = value.replace(/\D/g, '');

      // 최대 11자리
      const sliced = numbers.slice(0, 11);

      // 02 지역번호
      if (sliced.startsWith('02')) {
        if (sliced.length <= 2) return sliced;
        if (sliced.length <= 6) return `${sliced.slice(0, 2)}-${sliced.slice(2)}`;
        if (sliced.length <= 10)
          return `${sliced.slice(0, 2)}-${sliced.slice(2, 6)}-${sliced.slice(6)}`;
        return `${sliced.slice(0, 2)}-${sliced.slice(2, 6)}-${sliced.slice(6, 10)}`;
      }

      // 휴대폰 / 기타 지역번호 (010, 031 등)
      if (sliced.length <= 3) return sliced;
      if (sliced.length <= 7) return `${sliced.slice(0, 3)}-${sliced.slice(3)}`;
      if (sliced.length <= 11)
        return `${sliced.slice(0, 3)}-${sliced.slice(3, 7)}-${sliced.slice(7)}`;

      return sliced;
    };

    return (
      <Controller
        name={field.key}
        control={control}
        render={({ field: rhfField }) => {
          if (field.type === 'select') {
            return (
              <Select
                aria-label={field.label ?? field.key}
                onChange={rhfField.onChange}
                isDisabled={disabled}
                placeholder={field.placeholder}
                style={{
                  width: width ? (typeof width === 'number' ? `${width}px` : width) : '100%',
                }}
                isInvalid={!!errors?.[field.key]}
              >
                {field.options?.map((opt) => (
                  <SelectItem key={opt.value} id={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </Select>
            );
          }

          if (field.type === 'mobile') {
            return (
              <TextField
                aria-label={field.label ?? field.key}
                value={rhfField.value || ''}
                onChange={rhfField.onChange}
                isDisabled={disabled}
                isReadOnly={readOnly}
                isInvalid={!!errors?.[field.key]}
                style={{
                  width: width ? (typeof width === 'number' ? `${width}px` : width) : '100%',
                }}
              >
                <Input
                  inputMode="numeric"
                  maxLength={13}
                  placeholder={field.placeholder || '입력하세요'}
                  onChange={(e) => {
                    rhfField.onChange(formatMobile(e.target.value));
                  }}
                />
              </TextField>
            );
          }

          if (field.type === 'text' || field.type === 'search-text') {
            return (
              <TextField
                aria-label={field.label ?? field.key}
                value={rhfField.value || ''}
                onChange={rhfField.onChange}
                isDisabled={disabled}
                isReadOnly={readOnly}
                isInvalid={!!errors?.[field.key]}
                style={{
                  width: width ? (typeof width === 'number' ? `${width}px` : width) : '100%',
                }}
              >
                <Input placeholder={field.placeholder || '입력하세요'} />
                {field.type === 'search-text' && (
                  <ButtonComponent
                    isDisabled={field.btnDisabled}
                    variant="contained"
                    onPress={() => field.onSearchClick?.(rhfField.value)}
                  >
                    {field.searchText || '검색'}
                  </ButtonComponent>
                )}
              </TextField>
            );
          }

          if (field.type === 'password') {
            const visible = !!isPasswordVisible[field.key];

            return (
              <TextField
                aria-label={field.label ?? field.key}
                value={rhfField.value || ''}
                onChange={rhfField.onChange}
                isDisabled={disabled}
                isInvalid={!!errors?.[field.key]}
              >
                <Group>
                  <Input
                    type={visible ? 'text' : 'password'}
                    placeholder="비밀번호를 입력해 주세요"
                    style={{ paddingRight: 56 }}
                  />
                  <FieldButton
                    aria-label={visible ? '비밀번호 숨기기' : '비밀번호 보기'}
                    onClick={() => togglePasswordVisibility(field.key)}
                  >
                    <Icons iName={visible ? 'eye' : 'eye_off'} color="#8B8888" />
                  </FieldButton>
                </Group>
              </TextField>
            );
          }

          if (field.type === 'textarea') {
            return (
              <TextField
                aria-label={field.label ?? field.key}
                value={rhfField.value || ''}
                onChange={rhfField.onChange}
                isDisabled={disabled}
                isInvalid={!!errors?.[field.key]}
              >
                <TextArea
                  placeholder={field.placeholder || '설명을 입력하세요'}
                  style={field.height ? { height: field.height } : undefined}
                />
              </TextField>
            );
          }

          return <></>;
        }}
      />
    );
  };

  return (
    <div
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
        const gridCols = Math.round(firstField.gridSize || 2.4);

        return (
          <React.Fragment key={`field-group-${index}`}>
            <div style={{ gridColumn: `span ${gridCols}` }}>
              {firstField.label && (
                <Label style={{ display: 'block', marginBottom: 'var(--spacing-4)' }}>
                  {firstField.label}
                  {firstField.required && (
                    <span
                      style={{
                        color: 'var(--point-pink-50)',
                        marginLeft: 'var(--spacing)',
                      }}
                    >
                      *
                    </span>
                  )}
                </Label>
              )}

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-4)',
                }}
              >
                {isArray ? (
                  item.map((subField) => (
                    <div
                      key={subField.key}
                      style={{
                        flex: subField.gridSize || 1,
                        minWidth: 0,
                      }}
                    >
                      {renderControl(subField)}
                      {errors?.[subField.key] && (
                        <p style={{ color: 'red', fontSize: 12 }}>
                          {errors[subField.key]?.message as string}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <>
                    {renderControl(item)}
                    {errors?.[item.key] && (
                      <p style={{ color: 'red', fontSize: 12 }}>
                        {errors[item.key]?.message as string}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>

            {!isArray && item.isBreak && <div style={{ height: 0 }} />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

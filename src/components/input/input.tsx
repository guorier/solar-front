'use client';

import { Group, Input, Label, type InputProps } from 'react-aria-components';
import './input.scss';
import { useState } from 'react';
import { Icons } from '../icon';
import { FieldButton } from '../metor';

type InputComponentProps = InputProps & {
  label?: string;
  type?: Pick<InputProps, 'type'>;
  isRequired?: boolean;
};

export function InputComponent({
  id,
  type = 'text',
  label,
  isRequired = false,
  ...props
}: InputComponentProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  return (
    <>
      {label && (
        <Label
          htmlFor={id}
          className={isRequired ? 'imp' : ''}
          style={{ marginBottom: 'var(--spacing-4)' }}
        >
          {label}
        </Label>
      )}
      <div className="react-aria-TextField">
        {type === 'password' ? (
          <Group>
            <Input
              type={isPasswordVisible ? 'text' : 'password'}
              id={id}
              required={isRequired}
              {...props}
            />
            <FieldButton
              aria-label={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
              onClick={() => setIsPasswordVisible((prev) => !prev)}
            >
              <Icons iName={isPasswordVisible ? 'eye' : 'eye_off'} color="#8B8888" />
            </FieldButton>
          </Group>
        ) : (
          <Input id={id} type={type} required={isRequired} {...props} />
        )}
      </div>
    </>
  );
}

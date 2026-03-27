// src/components/radio/radio.tsx
'use client';

import React, { ComponentProps, forwardRef, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './radio.scss';

type NativeInputProps = Omit<ComponentProps<'input'>, 'ref' | 'type'>;

interface RadioProps extends NativeInputProps {
  label?: string;
  ariaLabel?: string;
  className?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, id, ariaLabel, onChange, readOnly, ...props }, ref) => {
    const [uuid, setUuid] = useState(id || '');

    useEffect(() => {
      if (!id) setUuid(uuidv4());
    }, [id]);

    return (
      <label
        htmlFor={uuid}
        className={className ? `radio ${className}` : 'radio'}
      >
        <input
          ref={ref}
          type="radio"
          id={uuid}
          className="radio__input"
          aria-label={ariaLabel}
          onChange={onChange}      // ✅ 추가
          readOnly={readOnly}      // ✅ 필요 시 대응
          {...props}
        />
        {label && <span className="radio__text">{label}</span>}
      </label>
    );
  },
);

Radio.displayName = 'Radio';
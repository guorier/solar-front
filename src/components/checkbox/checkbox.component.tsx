'use client';

import { Checkbox as AriaCheckbox, type CheckboxProps } from 'react-aria-components';
import './checkbox.component.scss';
import { Icons } from '@/components';

export function Checkbox({
  children,
  ...props
}: Omit<CheckboxProps, 'children'> & {
  children?: React.ReactNode;
}) {
  return (
    <AriaCheckbox {...props}>
      {({ isSelected, isIndeterminate }) => (
        <>
          <div className="indicator">
            {isIndeterminate ? null : isSelected && (
              <Icons iName="check" size={12} color="#fff" aria-hidden />
            )}
          </div>
          {children}
        </>
      )}
    </AriaCheckbox>
  );
}
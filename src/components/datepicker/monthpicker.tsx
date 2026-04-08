import { Input, TextField } from 'react-aria-components';
import './datepicker.scss';

export interface MonthPickerProps {
  value?: string;
  onChange?: (value: string) => void;

  isDisabled?: boolean;
  min?: string;
  max?: string;
  name?: string;
  className?: string;

  'aria-label'?: string;
  'aria-labelledby'?: string;
}

export function MonthPicker({
  value,
  onChange,
  isDisabled,
  min,
  max,
  name,
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
}: MonthPickerProps) {
  return (
    <TextField
      className={className}
      isDisabled={isDisabled}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
    >
      <Input
        type="month"
        name={name}
        min={min}
        max={max}
        value={value ?? ''}
        onChange={(e) => onChange?.((e.target as HTMLInputElement).value)}
      />
    </TextField>
  );
}

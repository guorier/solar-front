'use client';

import type { CSSProperties } from 'react';
import { Meter as AriaMeter, MeterProps as AriaMeterProps } from 'react-aria-components';
import './progressbar.scss';

export interface ProgressbarProps extends AriaMeterProps {
  label?: string;
  fillColor?: string;
  trackColor?: string;
  height?: number;
  radius?: number;
}

type ProgressbarFillStyle = CSSProperties & {
  ['--fill-color']?: string;
  ['--track-color']?: string;
  ['--track-height']?: string;
  ['--track-radius']?: string;
};

export function Progressbar({
  fillColor,
  trackColor,
  height,
  radius,
  maxValue = 100000,
  ...props
}: ProgressbarProps) {
  return (
    <AriaMeter {...props} maxValue={maxValue}>
      {({ percentage }) => (
        <div
          className="track inset"
          style={
            {
              '--track-color': trackColor ?? '#ece8eb',
              '--track-height': `${height ?? 14}px`,
              '--track-radius': `${radius ?? 2}px`,
            } as ProgressbarFillStyle
          }
        >
          <div
            className="fill"
            style={
              {
                width: `${Math.max(0, Math.min(percentage, 100))}%`,
                '--fill-color': fillColor ?? '#d70251',
                '--track-radius': `${radius ?? 2}px`,
              } as ProgressbarFillStyle
            }
          />
        </div>
      )}
    </AriaMeter>
  );
}

import React from 'react';
import {SANS} from '../fonts';
import {C, rgba} from '../theme';

/** Small sans label pill — the site's eyebrow / tag style. */
export const Pill: React.FC<{children: React.ReactNode; tone?: 'soft' | 'solid' | 'outline'; style?: React.CSSProperties}> = ({
  children,
  tone = 'soft',
  style,
}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 14,
      padding: '14px 26px',
      borderRadius: 999,
      fontFamily: SANS,
      fontWeight: 600,
      fontSize: 24,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      color: tone === 'solid' ? C.white : C.crimson,
      background: tone === 'solid' ? C.crimson : tone === 'soft' ? rgba(C.crimson, 0.07) : 'transparent',
      border: `1.5px solid ${tone === 'outline' ? rgba(C.crimson, 0.35) : 'transparent'}`,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Dot: React.FC<{color?: string; size?: number}> = ({color = C.crimson, size = 10}) => (
  <span style={{width: size, height: size, borderRadius: size, background: color, display: 'inline-block'}} />
);

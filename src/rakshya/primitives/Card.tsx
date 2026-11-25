import React from 'react';
import {C, mix, rgba} from '../theme';

/** White editorial card with hairline border; `p` (0→1) lifts it in with a soft elevation. */
export const Card: React.FC<{p: number; children: React.ReactNode; style?: React.CSSProperties; tint?: 'white' | 'blush'}> = ({
  p,
  children,
  style,
  tint = 'white',
}) => (
  <div
    style={{
      background: tint === 'white' ? C.card : C.cardBlush,
      border: `1.5px solid ${C.hairline}`,
      borderRadius: 34,
      opacity: p,
      transform: `translateY(${mix(46, 0, p)}px)`,
      boxShadow: `0 ${mix(4, 26, p)}px ${mix(10, 60, p)}px ${rgba(C.crimson, 0.07 * p)}, 0 2px 6px ${rgba(C.ink, 0.03)}`,
      ...style,
    }}
  >
    {children}
  </div>
);

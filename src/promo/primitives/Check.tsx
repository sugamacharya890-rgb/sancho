import React from 'react';
import {C} from '../theme';

/** Round status dot that fills teal and draws a check as `p` goes 0→1. */
export const Check: React.FC<{p: number; size?: number}> = ({p, size = 34}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      flexShrink: 0,
      boxSizing: 'border-box',
      border: `2.5px solid ${p > 0.05 ? C.teal : '#CBD5E1'}`,
      background: p > 0.05 ? C.teal : C.white,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transform: `scale(${1 + Math.sin(Math.min(1, p) * Math.PI) * 0.18})`,
    }}
  >
    <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 24 24">
      <path
        d="M5 12.5l4.5 4.5L19 7.5"
        fill="none"
        stroke={C.white}
        strokeWidth={3.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - Math.min(1, p)}
      />
    </svg>
  </div>
);

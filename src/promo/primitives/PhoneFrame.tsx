import React from 'react';
import {C, rgba} from '../theme';

/** Minimal, brand-neutral smartphone frame with a light screen. */
export const PhoneFrame: React.FC<{width?: number; height?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  width = 420,
  height = 860,
  children,
  style,
}) => (
  <div
    style={{
      width,
      height,
      borderRadius: 64,
      padding: 13,
      boxSizing: 'border-box',
      background: '#0B1220',
      boxShadow: `0 50px 100px ${rgba(C.tealDeep, 0.28)}, 0 20px 40px ${rgba(C.ink, 0.18)}, inset 0 0 0 2px #334155`,
      ...style,
    }}
  >
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: 52,
        overflow: 'hidden',
        background: C.canvas,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 14,
          left: '50%',
          width: 110,
          height: 30,
          marginLeft: -55,
          borderRadius: 20,
          background: '#0B1220',
          zIndex: 5,
        }}
      />
      {children}
    </div>
  </div>
);

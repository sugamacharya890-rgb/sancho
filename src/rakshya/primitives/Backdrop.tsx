import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, rgba} from '../theme';

/** Persistent blush canvas: two slow-drifting warm glows and a whisper of paper grain. */
export const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  const ax = 78 + Math.sin(f / 140) * 6;
  const ay = 14 + Math.cos(f / 170) * 4;
  const bx = 18 + Math.cos(f / 160) * 6;
  const by = 86 + Math.sin(f / 130) * 4;
  return (
    <AbsoluteFill style={{background: C.canvas}}>
      <AbsoluteFill
        style={{
          background: [
            `radial-gradient(60% 38% at ${ax}% ${ay}%, ${rgba(C.crimson, 0.075)} 0%, transparent 70%)`,
            `radial-gradient(55% 34% at ${bx}% ${by}%, ${rgba('#E9B9BE', 0.32)} 0%, transparent 72%)`,
            `radial-gradient(70% 45% at 50% 48%, ${rgba(C.white, 0.7)} 0%, transparent 70%)`,
          ].join(', '),
        }}
      />
      <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, opacity: 0.05, mixBlendMode: 'multiply'}}>
        <filter id="rk-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 0.48  0 0 0 0 0.11  0 0 0 0 0.14  0 0 0 0.9 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#rk-grain)" />
      </svg>
    </AbsoluteFill>
  );
};

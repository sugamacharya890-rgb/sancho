import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, EASE_IO, ease, lerp, rgba} from '../theme';

/**
 * Crisp pointer that glides from `from` to `to`, then taps at `clickAt`
 * (press-in scale + expanding ripple).
 */
export const PointerCursor: React.FC<{
  from: [number, number];
  to: [number, number];
  start: number;
  travel?: number;
  clickAt: number;
  exitAt?: number;
}> = ({from, to, start, travel = 26, clickAt, exitAt}) => {
  const frame = useCurrentFrame();
  const m = ease(frame, start, travel, EASE_IO);
  const appear = ease(frame, start - 4, 10);
  const exit = exitAt === undefined ? 0 : ease(frame, exitAt, 12);
  // slight arc on the way in
  const x = lerp(from[0], to[0], m);
  const y = lerp(from[1], to[1], m) - Math.sin(m * Math.PI) * 40;
  const press = frame >= clickAt ? Math.max(0, 1 - Math.abs(frame - clickAt - 3) / 4) : 0;
  const ripple = ease(frame, clickAt, 22);
  return (
    <>
      {frame >= clickAt && (
        <div
          style={{
            position: 'absolute',
            left: to[0] - 60,
            top: to[1] - 60,
            width: 120,
            height: 120,
            borderRadius: '50%',
            border: `3px solid ${rgba(C.teal, 1 - ripple)}`,
            background: rgba(C.teal, 0.15 * (1 - ripple)),
            transform: `scale(${0.2 + ripple})`,
          }}
        />
      )}
      <svg
        width={44}
        height={52}
        viewBox="0 0 22 26"
        style={{
          position: 'absolute',
          left: x - 3,
          top: y - 2,
          opacity: appear * (1 - exit),
          transform: `scale(${1 - press * 0.18})`,
          transformOrigin: '3px 2px',
          filter: `drop-shadow(0 6px 10px ${rgba(C.ink, 0.25)})`,
        }}
      >
        <path
          d="M2 1.5 L2 20 L7 15.6 L10.4 23.4 L13.8 22 L10.5 14.4 L17.4 14.2 Z"
          fill={C.ink}
          stroke={C.white}
          strokeWidth={1.6}
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
};

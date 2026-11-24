import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, EASE_IO, ease} from '../theme';

/**
 * Thick curved Sancho-teal ribbon sweeping diagonally across the frame.
 * `start`/`duration` control the draw-on; `exitAt` sweeps the tail off.
 */
export const BrandRibbon: React.FC<{start: number; duration?: number; exitAt?: number; width?: number}> = ({
  start,
  duration = 34,
  exitAt,
  width = 150,
}) => {
  const frame = useCurrentFrame();
  const head = ease(frame, start, duration, EASE_IO);
  const tail = exitAt === undefined ? 0 : ease(frame, exitAt, duration, EASE_IO);
  const wave = Math.sin(frame / 30) * 24;
  const d = `M -200 ${980 + wave} C 420 ${1060 - wave}, 520 ${360 + wave}, 1000 ${470 - wave} S 1700 ${80 + wave}, 2140 ${-80 - wave}`;
  // pathLength=1 lets us sweep head and tail along the curve
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <defs>
        <linearGradient id="ribbonGrad" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor={C.tealDeep} />
          <stop offset="0.55" stopColor={C.teal} />
          <stop offset="1" stopColor="#7EE0D6" />
        </linearGradient>
      </defs>
      <path
        d={d}
        pathLength={1}
        fill="none"
        stroke="url(#ribbonGrad)"
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={`${Math.max(0.0001, head - tail)} 2`}
        strokeDashoffset={-tail}
      />
      {/* soft highlight sheen riding the ribbon */}
      <path
        d={d}
        pathLength={1}
        fill="none"
        stroke="white"
        strokeOpacity={0.28}
        strokeWidth={width * 0.18}
        strokeLinecap="round"
        strokeDasharray={`${Math.max(0.0001, head - tail) * 0.92} 2`}
        strokeDashoffset={-tail - 0.02}
        transform="translate(0 -28)"
      />
    </svg>
  );
};

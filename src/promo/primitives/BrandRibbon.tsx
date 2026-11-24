import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
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
  const {width: W, height: H} = useVideoConfig();
  // curve authored on a 1920x1080 grid; scaled to the frame so it still sweeps corner to corner
  const X = (x: number) => (x * W) / 1920;
  const Y = (y: number) => (y * H) / 1080;
  const head = ease(frame, start, duration, EASE_IO);
  const tail = exitAt === undefined ? 0 : ease(frame, exitAt, duration, EASE_IO);
  const wave = Math.sin(frame / 30) * 24;
  const d = `M ${X(-200)} ${Y(980) + wave} C ${X(420)} ${Y(1060) - wave}, ${X(520)} ${Y(360) + wave}, ${X(1000)} ${Y(470) - wave} S ${X(1700)} ${Y(80) + wave}, ${X(2140)} ${Y(-80) - wave}`;
  // pathLength=1 lets us sweep head and tail along the curve
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
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

import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {COLORS, HEIGHT, WIDTH, hexA, mixHex} from '../theme/theme';

type Props = {
  /** 0 = calm teal atmosphere, 1 = warm amber friction atmosphere. */
  warmth: number;
  /** Overall glow strength multiplier. */
  glow?: number;
};

/**
 * Persistent background layer: deep slate canvas, slowly drifting dot grid,
 * two breathing glow orbs and a soft vignette. Never static.
 */
export const AmbientGrid: React.FC<Props> = ({warmth, glow = 1}) => {
  const frame = useCurrentFrame();
  const spacing = 48;
  const dx = (frame * 0.18) % spacing;
  const dy = (frame * 0.09) % spacing;

  const orbA = mixHex(COLORS.tealBlue, COLORS.amber, warmth * 0.85);
  const orbB = mixHex(COLORS.teal, COLORS.coral, warmth * 0.8);
  const breathe = 1 + Math.sin(frame / 48) * 0.04;

  const ax = 1420 + Math.sin(frame / 110) * 60;
  const ay = 380 + Math.cos(frame / 130) * 40;
  const bx = 420 + Math.cos(frame / 120) * 50;
  const by = 820 + Math.sin(frame / 100) * 30;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.slate, overflow: 'hidden'}}>
      <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute'}}>
        <defs>
          <pattern
            id="dots"
            width={spacing}
            height={spacing}
            patternUnits="userSpaceOnUse"
            patternTransform={`translate(${dx} ${dy})`}
          >
            <circle cx={spacing / 2} cy={spacing / 2} r={1.3} fill={hexA(COLORS.gray, 0.16)} />
          </pattern>
          <radialGradient id="orbA">
            <stop offset="0%" stopColor={orbA} stopOpacity={0.32 * glow} />
            <stop offset="100%" stopColor={orbA} stopOpacity={0} />
          </radialGradient>
          <radialGradient id="orbB">
            <stop offset="0%" stopColor={orbB} stopOpacity={0.18 * glow} />
            <stop offset="100%" stopColor={orbB} stopOpacity={0} />
          </radialGradient>
          <radialGradient id="vignette" cx="50%" cy="50%" r="75%">
            <stop offset="55%" stopColor={COLORS.slate} stopOpacity={0} />
            <stop offset="100%" stopColor="#060E17" stopOpacity={0.85} />
          </radialGradient>
          <linearGradient id="gridFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity={0.55} />
            <stop offset="50%" stopColor="white" stopOpacity={1} />
            <stop offset="100%" stopColor="white" stopOpacity={0.35} />
          </linearGradient>
          <mask id="gridMask">
            <rect width={WIDTH} height={HEIGHT} fill="url(#gridFade)" />
          </mask>
        </defs>
        <ellipse cx={ax} cy={ay} rx={760 * breathe} ry={560 * breathe} fill="url(#orbA)" />
        <ellipse cx={bx} cy={by} rx={680 / breathe} ry={480 / breathe} fill="url(#orbB)" />
        <rect width={WIDTH} height={HEIGHT} fill="url(#dots)" mask="url(#gridMask)" />
        <rect width={WIDTH} height={HEIGHT} fill="url(#vignette)" />
      </svg>
    </AbsoluteFill>
  );
};

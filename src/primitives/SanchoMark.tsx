import React from 'react';
import {useCurrentFrame} from 'remotion';
import {COLORS, hexA} from '../theme/theme';
import {FONT_DISPLAY} from '../theme/fonts';

/**
 * Placeholder Sancho brand mark (no logo asset exists in the repo yet):
 * an almost-closed teal ring — continuity — with a steady dot orbiting it.
 * Swap the <svg> for the official logo when available.
 */
export const SanchoMark: React.FC<{
  size?: number;
  /** 0..1 ring draw-on. */
  draw?: number;
  /** 0..1 wordmark reveal. */
  word?: number;
  showWord?: boolean;
  wordSize?: number;
  gap?: number;
}> = ({size = 64, draw = 1, word = 1, showWord = true, wordSize, gap}) => {
  const frame = useCurrentFrame();
  const r = 38;
  const c = 2 * Math.PI * r;
  const arc = 0.8 * draw;
  const orbit = -90 + 300 * draw + frame * 0.9; // keeps circling gently
  const ox = 50 + Math.cos((orbit * Math.PI) / 180) * r;
  const oy = 50 + Math.sin((orbit * Math.PI) / 180) * r;
  const ws = wordSize ?? size * 0.78;

  return (
    <div style={{display: 'flex', alignItems: 'center', gap: gap ?? size * 0.3}}>
      <svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: 'visible'}}>
        <circle cx={50} cy={50} r={r} fill="none" stroke={hexA(COLORS.tealBlue, 0.35)} strokeWidth={9} />
        <circle
          cx={50}
          cy={50}
          r={r}
          fill="none"
          stroke={COLORS.teal}
          strokeWidth={9}
          strokeLinecap="round"
          strokeDasharray={`${c * arc} ${c}`}
          transform={`rotate(${orbit - 360 * arc - 30} 50 50)`}
        />
        <circle cx={50} cy={50} r={13 * draw} fill={COLORS.teal} opacity={0.9} />
        <circle cx={ox} cy={oy} r={9 * Math.min(1, draw * 2)} fill={COLORS.white} />
      </svg>
      {showWord && (
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 800,
            fontSize: ws,
            color: COLORS.white,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            opacity: word,
            transform: `translateX(${(1 - word) * -16}px)`,
            filter: word < 1 ? `blur(${(1 - word) * 8}px)` : undefined,
            clipPath: `inset(-20% ${(1 - word) * 100}% -20% 0)`,
          }}
        >
          Sancho
        </div>
      )}
    </div>
  );
};

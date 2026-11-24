import React from 'react';
import {Img, staticFile, useCurrentFrame, useVideoConfig, spring} from 'remotion';
import {C, ease} from '../theme';
import {FONT_DISPLAY} from '../../theme/fonts';

/** Drop the official logo at public/brand/sancho-mark.svg (or change this path). */
export const LOGO_SRC = 'brand/sancho-mark.svg';

/**
 * Sancho lockup: spring-settled icon (scale + rotate) followed by a clip-reveal
 * wordmark. `start` is the frame the icon begins to settle.
 */
export const SanchoLogo: React.FC<{
  start: number;
  size?: number;
  showWord?: boolean;
  wordColor?: string;
}> = ({start, size = 140, showWord = true, wordColor = C.ink}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - start, fps, config: {stiffness: 160, damping: 13, mass: 0.9}});
  const word = ease(frame, start + 6, 22);
  const spin = Math.sin((frame - start) / 40) * 2; // living micro-motion after settle
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: size * 0.26}}>
      <Img
        src={staticFile(LOGO_SRC)}
        style={{
          width: size,
          height: size,
          transform: `scale(${s}) rotate(${(1 - s) * -120 + spin}deg)`,
          opacity: Math.min(1, s * 2),
        }}
      />
      {showWord && (
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 800,
            fontSize: size * 0.82,
            letterSpacing: '-0.045em',
            color: wordColor,
            lineHeight: 1,
            clipPath: `inset(-20% ${(1 - word) * 100}% -20% 0)`,
            transform: `translateX(${(1 - word) * -24}px)`,
          }}
        >
          Sancho
        </div>
      )}
    </div>
  );
};

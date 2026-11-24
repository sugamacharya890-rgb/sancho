import React from 'react';
import {useCurrentFrame, useVideoConfig, spring} from 'remotion';
import {C, ease, EASE_IO} from '../theme';
import {FONT_DISPLAY} from '../../theme/fonts';

/**
 * Snappy word-by-word headline. Wrap words in *asterisks* for an accent color,
 * ~strike~ for a coral word that gets struck through. \n breaks lines.
 */
export const KineticText: React.FC<{
  text: string;
  start: number;
  exitAt?: number;
  size?: number;
  weight?: number;
  color?: string;
  accent?: string;
  stagger?: number;
  align?: 'center' | 'left';
  lineHeight?: number;
  strikeAt?: number;
  style?: React.CSSProperties;
}> = ({
  text,
  start,
  exitAt,
  size = 104,
  weight = 800,
  color = C.ink,
  accent = C.tealDeep,
  stagger = 4,
  align = 'center',
  lineHeight = 1.06,
  strikeAt,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const exit = exitAt === undefined ? 0 : ease(frame, exitAt, 12, EASE_IO);
  const held = Math.max(0, frame - start);

  let idx = 0;
  let accentOn = false;
  const lines = text.split('\n');
  return (
    <div
      style={{
        fontFamily: FONT_DISPLAY,
        fontWeight: weight,
        fontSize: size,
        letterSpacing: '-0.045em',
        lineHeight,
        color,
        textAlign: align,
        opacity: 1 - exit,
        transform: `translateY(${-exit * 40}px) scale(${1 + held * 0.0004})`,
        filter: exit > 0 ? `blur(${exit * 10}px)` : undefined,
        ...style,
      }}
    >
      {lines.map((line, li) => (
        <div key={li} style={{whiteSpace: 'nowrap'}}>
          {line.split(' ').map((raw, wi) => {
            let w = raw;
            let acc = accentOn;
            let strike = false;
            if (w.startsWith('*')) {
              w = w.slice(1);
              acc = true;
              accentOn = true;
            }
            if (w.startsWith('~')) {
              w = w.slice(1);
              strike = true;
            }
            let tail = '';
            const m = w.match(/^(.*?)([*~])([.,!?]*)$/);
            if (m) {
              w = m[1];
              tail = m[3];
              if (m[2] === '*') accentOn = false;
            }
            const s = spring({frame: frame - start - idx++ * stagger, fps, config: {stiffness: 220, damping: 18}});
            const strikeP = strike && strikeAt !== undefined ? ease(frame, strikeAt, 12) : 0;
            return (
              <span
                key={wi}
                style={{
                  display: 'inline-block',
                  opacity: Math.min(1, s * 1.4),
                  transform: `translateY(${(1 - s) * 0.5 * size}px) scale(${0.9 + 0.1 * s})`,
                  filter: s < 0.98 ? `blur(${(1 - Math.min(1, s)) * 12}px)` : undefined,
                  marginRight: '0.24em',
                  position: 'relative',
                  color: strike ? C.coral : acc ? accent : undefined,
                }}
              >
                {w}
                {tail && <span style={{color}}>{tail}</span>}
                {strike && (
                  <span
                    style={{
                      position: 'absolute',
                      left: -4,
                      top: '54%',
                      height: size * 0.08,
                      width: `calc(${strikeP * 100}% + 8px)`,
                      background: C.teal,
                      borderRadius: 99,
                    }}
                  />
                )}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

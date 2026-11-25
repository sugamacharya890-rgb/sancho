import React from 'react';
import {useCurrentFrame} from 'remotion';
import {SERIF} from '../fonts';
import {C, ease} from '../theme';

export type Segment = {text: string; italic?: boolean; accent?: boolean} | {br: true};

export type SerifRevealProps = {
  segments: Segment[];
  /** Local frame the first word starts. */
  start: number;
  /** Frames between words. */
  stagger?: number;
  /** Frames each word takes to settle. */
  wordDur?: number;
  fontSize: number;
  lineHeight?: number;
  align?: 'left' | 'center';
  color?: string;
  style?: React.CSSProperties;
};

/** Slow word-by-word editorial reveal: each word rises 0.3em out of a soft blur. */
export const SerifReveal: React.FC<SerifRevealProps> = ({
  segments,
  start,
  stagger = 4,
  wordDur = 22,
  fontSize,
  lineHeight = 1.04,
  align = 'left',
  color = C.ink,
  style,
}) => {
  const frame = useCurrentFrame();
  let i = 0;
  return (
    <div
      style={{
        fontFamily: SERIF,
        fontSize,
        lineHeight,
        letterSpacing: '-0.012em',
        color,
        textAlign: align,
        fontWeight: 400,
        ...style,
      }}
    >
      {segments.map((seg, si) => {
        if ('br' in seg) return <br key={si} />;
        return seg.text
          .split(' ')
          .filter(Boolean)
          .map((word, wi) => {
            const p = ease(frame, start + i++ * stagger, wordDur);
            return (
              <React.Fragment key={`${si}-${wi}`}>
                <span
                  style={{
                    display: 'inline-block',
                    fontStyle: seg.italic ? 'italic' : 'normal',
                    color: seg.accent ? C.crimson : undefined,
                    opacity: p,
                    transform: `translateY(${(1 - p) * 0.3}em)`,
                    filter: `blur(${(1 - p) * 6}px)`,
                  }}
                >
                  {word}
                </span>{' '}
              </React.Fragment>
            );
          });
      })}
    </div>
  );
};

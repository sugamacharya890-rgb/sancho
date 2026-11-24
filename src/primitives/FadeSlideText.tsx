import React from 'react';
import {useCurrentFrame} from 'remotion';
import {COLORS, EASE_IN_OUT, EASE_OUT, progress} from '../theme/theme';
import {FONT_DISPLAY} from '../theme/fonts';

type Props = {
  /** Text. Wrap words in *asterisks* for the accent color. Use \n for a line break. */
  text: string;
  start: number;
  /** Frame at which the exit begins (omit to hold until the parent unmounts). */
  exitAt?: number;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  accent?: string;
  /** Frames between words. */
  stagger?: number;
  maxWidth?: number;
  align?: 'left' | 'center';
  lineHeight?: number;
  letterSpacing?: string;
  fontFamily?: string;
  style?: React.CSSProperties;
};

type Token = {word: string; accent: boolean; br: boolean; /** trailing punctuation outside the accent */ glue?: string};

const tokenize = (text: string): Token[] => {
  const out: Token[] = [];
  let inAccent = false;
  text.split('\n').forEach((line, li) => {
    if (li > 0) out.push({word: '', accent: false, br: true});
    line
      .split(' ')
      .filter(Boolean)
      .forEach((raw) => {
        let w = raw;
        let acc = inAccent;
        if (w.startsWith('*')) {
          w = w.slice(1);
          acc = true;
          inAccent = true;
        }
        const close = w.match(/^(.*)\*([.,!?;:\u2014-]*)$/);
        if (close) {
          inAccent = false;
          out.push({word: close[1], accent: acc, br: false, glue: close[2]});
          return;
        }
        out.push({word: w, accent: acc, br: false});
      });
  });
  return out;
};

/**
 * Word-by-word headline reveal: each word rises, sharpens from blur and fades in
 * on the brief's ease-out curve. While holding, the block breathes very gently so
 * no frame reads as static. Exit lifts and softens the whole block.
 */
export const FadeSlideText: React.FC<Props> = ({
  text,
  start,
  exitAt,
  fontSize = 64,
  fontWeight = 700,
  color = COLORS.white,
  accent = COLORS.teal,
  stagger = 3,
  maxWidth,
  align = 'left',
  lineHeight = 1.18,
  letterSpacing = '-0.02em',
  fontFamily = FONT_DISPLAY,
  style,
}) => {
  const frame = useCurrentFrame();
  const tokens = tokenize(text);

  const exit = exitAt === undefined ? 0 : progress(frame, exitAt, 16, EASE_IN_OUT);
  const held = Math.max(0, frame - start);
  const breathe = 1 + Math.sin(held / 34) * 0.008 + Math.min(held, 300) * 0.00004;
  const drift = Math.sin(held / 45) * 3;

  let wordIndex = 0;
  return (
    <div
      style={{
        fontFamily,
        fontSize,
        fontWeight,
        color,
        lineHeight,
        letterSpacing,
        maxWidth,
        textAlign: align,
        transform: `translateY(${drift - exit * 18}px) scale(${breathe})`,
        transformOrigin: align === 'center' ? '50% 50%' : '0% 50%',
        opacity: 1 - exit,
        filter: exit > 0 ? `blur(${exit * 8}px)` : undefined,
        ...style,
      }}
    >
      {tokens.map((t, i) => {
        if (t.br) return <br key={`br${i}`} />;
        const p = progress(frame, start + wordIndex++ * stagger, 24);
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              whiteSpace: 'pre',
              color: t.accent ? accent : undefined,
              opacity: p,
              transform: `translateY(${(1 - p) * 30}px)`,
              filter: p < 1 ? `blur(${(1 - p) * 10}px)` : undefined,
            }}
          >
            {t.glue ? (
              <>
                {t.word}
                <span style={{color}}>{t.glue}</span>{' '}
              </>
            ) : (
              t.word + ' '
            )}
          </span>
        );
      })}
    </div>
  );
};

import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {SANS, SERIF} from '../fonts';
import {Card} from '../primitives/Card';
import {Pill} from '../primitives/Pill';
import {SerifReveal} from '../primitives/SerifReveal';
import {C, HEIGHT, R, SAFE, ease, exitAt, mix} from '../theme';

const BARRIERS = [
  {label: 'Stigma', thought: '“What will people say?”'},
  {label: 'Fear of blame', thought: '“Will they think it was my fault?”'},
  {label: 'Distance from help', thought: '“Who would I even call?”'},
];

/** 0:05–0:11 — Silence is not safety. Why stories stay unspoken. */
export const Scene2SilenceNotSafety: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = ease(frame, 0, 26);
  const out = exitAt(frame, R.silence.duration);
  const rule = ease(frame, 40, 30);
  const sub = ease(frame, 52, 26);

  return (
    <AbsoluteFill
      style={{
        padding: `${SAFE.top}px ${SAFE.right}px ${HEIGHT - SAFE.bottom}px ${SAFE.left}px`,
        justifyContent: 'center',
        opacity: enter * (1 - out),
        transform: `translateY(${mix(60, 0, enter) - 60 * out}px)`,
      }}
    >
      <div style={{opacity: ease(frame, 2, 22)}}>
        <Pill tone="outline">Why silence isn’t safety</Pill>
      </div>

      <div style={{position: 'relative', marginTop: 40}}>
        <SerifReveal
          start={6}
          stagger={6}
          wordDur={26}
          fontSize={156}
          lineHeight={0.98}
          segments={[{text: 'Silence is'}, {br: true}, {text: 'not', italic: true, accent: true}, {text: 'safety.'}]}
        />
        {/* hand-drawn-feeling hairline under "not" */}
        <div
          style={{
            position: 'absolute',
            left: 4,
            top: 296,
            height: 4,
            width: 190 * rule,
            borderRadius: 4,
            background: C.crimson,
            opacity: 0.85,
          }}
        />
      </div>

      <p
        style={{
          margin: '44px 0 0',
          fontFamily: SANS,
          fontSize: 34,
          lineHeight: 1.45,
          color: C.inkSoft,
          maxWidth: 800,
          opacity: sub,
          transform: `translateY(${mix(16, 0, sub)}px)`,
        }}
      >
        Stigma, fear of blame and distance from help keep too many stories unspoken.
      </p>

      <div style={{display: 'flex', flexDirection: 'column', gap: 20, marginTop: 52}}>
        {BARRIERS.map(({label, thought}, i) => (
          <Card key={label} p={ease(frame, 76 + i * 16, 30)} tint={i === 1 ? 'blush' : 'white'} style={{padding: '30px 38px', display: 'flex', alignItems: 'baseline', gap: 28}}>
            <span style={{fontFamily: SERIF, fontSize: 40, color: C.crimson, minWidth: 54}}>0{i + 1}</span>
            <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
              <span style={{fontFamily: SANS, fontWeight: 600, fontSize: 23, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.crimson}}>{label}</span>
              <span style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 46, lineHeight: 1.1, color: C.ink}}>{thought}</span>
            </div>
          </Card>
        ))}
      </div>
    </AbsoluteFill>
  );
};

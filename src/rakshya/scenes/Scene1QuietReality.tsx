import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {SANS} from '../fonts';
import {Card} from '../primitives/Card';
import {BusIcon, ChildIcon, MessageIcon} from '../primitives/Icons';
import {Pill} from '../primitives/Pill';
import {SerifReveal} from '../primitives/SerifReveal';
import {C, HEIGHT, R, SAFE, ease, exitAt, mix, rgba} from '../theme';

const MOMENTS = [
  {Icon: BusIcon, title: 'The crowded commute home', note: 'Eyes down. Bag held close.'},
  {Icon: MessageIcon, title: 'Messages that don’t stop', note: 'Read, never answered.'},
  {Icon: ChildIcon, title: 'A child who has gone quiet', note: 'Something changed. No one asks.'},
];

/** 0:00–0:05 — The quiet reality. Everyday moments, held gently; nothing sensational. */
export const Scene1QuietReality: React.FC = () => {
  const frame = useCurrentFrame();
  const out = exitAt(frame, R.quiet.duration);
  const eyebrow = ease(frame, 0, 24);
  // the moments go quiet as the scene closes — the "silence" lands visually
  const hush = ease(frame, 118, 30);

  return (
    <AbsoluteFill
      style={{
        padding: `${SAFE.top}px ${SAFE.right}px ${HEIGHT - SAFE.bottom}px ${SAFE.left}px`,
        justifyContent: 'center',
        opacity: 1 - out,
        transform: `translateY(${-60 * out}px)`,
      }}
    >
      <div style={{opacity: eyebrow, transform: `translateY(${mix(14, 0, eyebrow)}px)`}}>
        <Pill>Nepal · Every day</Pill>
      </div>

      <SerifReveal
        start={8}
        stagger={4}
        fontSize={96}
        lineHeight={1.02}
        style={{marginTop: 44}}
        segments={[
          {text: 'Too many women and girls in Nepal carry their fear'},
          {text: 'in silence.', italic: true, accent: true},
        ]}
      />

      <Card p={ease(frame, 58, 30)} style={{marginTop: 64, padding: '14px 40px'}}>
        {MOMENTS.map(({Icon, title, note}, i) => {
          const p = ease(frame, 68 + i * 13, 26);
          const fade = 1 - hush * 0.45;
          return (
            <div
              key={title}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 30,
                padding: '30px 0',
                borderTop: i === 0 ? 'none' : `1.5px solid ${C.hairline}`,
                opacity: p * fade,
                transform: `translateX(${mix(-28, 0, p)}px)`,
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 24,
                  background: rgba(C.crimson, 0.06),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={42} />
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
                <span style={{fontFamily: SANS, fontWeight: 600, fontSize: 34, color: C.ink, letterSpacing: '-0.01em'}}>{title}</span>
                <span style={{fontFamily: SANS, fontWeight: 400, fontSize: 27, color: C.inkMute}}>{note}</span>
              </div>
            </div>
          );
        })}
      </Card>
    </AbsoluteFill>
  );
};

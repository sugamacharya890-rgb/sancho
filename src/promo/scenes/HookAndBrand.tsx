import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {AuraGlow} from '../primitives/AuraGlow';
import {KineticText} from '../primitives/KineticText';
import {SanchoLogo} from '../primitives/SanchoLogo';
import {C, EASE_IO, ease, pop, rgba} from '../theme';
import {FONT_DISPLAY, FONT_UI} from '../../theme/fonts';

/** The overload: everything a child abroad is quietly holding. */
const CHIPS: {label: string; x: number; y: number; r: number; depth: number; tone: string}[] = [
  {label: 'Appointments', x: 360, y: 250, r: -6, depth: 1, tone: C.coral},
  {label: 'Refills', x: 1540, y: 230, r: 5, depth: 0.8, tone: C.amber},
  {label: 'Lab results', x: 250, y: 800, r: 4, depth: 0.7, tone: C.amber},
  {label: 'Follow-ups', x: 1640, y: 790, r: -4, depth: 1, tone: C.coral},
  {label: 'Missed calls', x: 760, y: 150, r: 3, depth: 0.6, tone: C.coral},
  {label: 'New prescription', x: 1160, y: 905, r: -3, depth: 0.85, tone: C.amber},
  {label: "Doctor's notes", x: 1260, y: 140, r: -5, depth: 0.55, tone: C.amber},
  {label: 'Time zones', x: 640, y: 930, r: 5, depth: 0.65, tone: C.coral},
];

const CHIPS_AT = 46;
const CHIPS_OUT = 84;
const MEET_AT = 92;
export const LOGO_AT = 105; // lands on beat 7 — the score's first hit

export const HookAndBrand: React.FC = () => {
  const frame = useCurrentFrame();
  const warm = ease(frame, 44, 20) * (1 - ease(frame, 86, 16));
  const exit = ease(frame, 124, 11, EASE_IO);
  const meet = pop(frame, MEET_AT);

  return (
    <AbsoluteFill>
      <AuraGlow
        blobs={[
          {x: 960, y: 560, r: 520, color: C.teal, alpha: 0.28 * (1 - warm * 0.6)},
          {x: 620, y: 420, r: 320, color: C.coral, alpha: 0.32 * warm},
          {x: 1320, y: 660, r: 340, color: C.amber, alpha: 0.28 * warm},
          {x: 1450, y: 300, r: 260, color: C.tealDeep, alpha: 0.12},
        ]}
      />

      {/* overload chips burst out around the headline, then get pulled away */}
      {CHIPS.map((c, i) => {
        const s = pop(frame, CHIPS_AT + i * 4, 30, 210, 15);
        const out = ease(frame, CHIPS_OUT + i * 1.5, 14, EASE_IO);
        const jitter = Math.sin(frame / 4 + i * 2) * 3 * s * (1 - out);
        const x = 960 + (c.x - 960) * (0.4 + 0.6 * s) + (c.x - 960) * out * 0.5;
        const y = 540 + (c.y - 540) * (0.4 + 0.6 * s) + (c.y - 540) * out * 0.5;
        return (
          <div
            key={c.label}
            style={{
              position: 'absolute',
              left: x,
              top: y + jitter,
              transform: `translate(-50%, -50%) rotate(${c.r + jitter}deg) scale(${(0.75 + 0.25 * c.depth) * s})`,
              opacity: Math.min(1, s) * (1 - out),
              filter: `blur(${(1 - c.depth) * 6 + out * 8}px)`,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '16px 26px',
              borderRadius: 999,
              background: C.white,
              boxShadow: `0 16px 40px ${rgba(C.ink, 0.10)}`,
              border: `1.5px solid ${rgba(c.tone, 0.35)}`,
              fontFamily: FONT_UI,
              fontWeight: 600,
              fontSize: 30,
              color: C.ink,
              whiteSpace: 'nowrap',
            }}
          >
            <div style={{width: 14, height: 14, borderRadius: 7, background: c.tone, boxShadow: `0 0 0 ${5 + Math.sin(frame / 5 + i) * 3}px ${rgba(c.tone, 0.18)}`}} />
            {c.label}
          </div>
        );
      })}

      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{position: 'absolute'}}>
          <KineticText text={'Caring for parents\nfrom *abroad?*'} start={4} exitAt={42} size={124} />
        </div>
        <div style={{position: 'absolute'}}>
          <KineticText text={'*Too much* to hold\nall on your own.'} accent={C.coral} start={50} exitAt={84} size={116} stagger={3} />
        </div>
      </AbsoluteFill>

      {/* Meet [Sancho] */}
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 1 - exit,
          transform: `scale(${1 + exit * 0.08})`,
          filter: exit > 0 ? `blur(${exit * 12}px)` : undefined,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 44}}>
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 800,
              fontSize: 128,
              letterSpacing: '-0.045em',
              color: C.muted,
              opacity: Math.min(1, meet * 1.5),
              transform: `translateY(${(1 - meet) * 60}px)`,
              filter: meet < 0.98 ? `blur(${(1 - meet) * 10}px)` : undefined,
            }}
          >
            Meet
          </div>
          {frame >= LOGO_AT - 1 && <SanchoLogo start={LOGO_AT} size={150} />}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

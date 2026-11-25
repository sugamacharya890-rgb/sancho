import React from 'react';
import {useCurrentFrame} from 'remotion';
import {SANS, SERIF} from '../../fonts';
import {Card} from '../../primitives/Card';
import {ExitIcon, EyeOffIcon} from '../../primitives/Icons';
import {Pill} from '../../primitives/Pill';
import {SerifReveal} from '../../primitives/SerifReveal';
import {C, EASE_IO, ease, mix, rgba} from '../../theme';
import {CUES, R2, sp} from '../timeline';
import {SceneShell} from './SceneShell';

const at = (g: number) => g - R2.discreet.from;
const MOMENTS = ['Daily commutes', 'School & college', 'Online', 'At work', 'At home', 'Speaking up together'];

const Bar: React.FC<{w: number | string; h?: number; c?: string}> = ({w, h = 16, c = '#F1E3E5'}) => (
  <div style={{width: w, height: h, borderRadius: h, background: c}} />
);

/** 0:13–0:19 — Discreet & built for real life: quick exit, real moments, no shame to carry alone. */
export const Scene3DiscreetRealLife: React.FC = () => {
  const frame = useCurrentFrame();
  const tap = at(CUES.exitTap);
  const press = Math.sin(ease(frame, tap, 10) * Math.PI);
  const swap = ease(frame, tap + 4, 18, EASE_IO);
  const chipsAt = tap + 14;

  return (
    <SceneShell duration={R2.discreet.duration}>
      <div style={{opacity: ease(frame, 2, 22)}}>
        <Pill>
          <EyeOffIcon size={26} /> Privacy safeguards
        </Pill>
      </div>

      <SerifReveal
        start={6}
        stagger={5}
        wordDur={24}
        fontSize={118}
        lineHeight={1.0}
        style={{marginTop: 36}}
        segments={[{text: 'Discreet.'}, {br: true}, {text: 'Built for'}, {text: 'real life.', italic: true, accent: true}]}
      />

      {/* browser card — quick exit swaps the page for a neutral one */}
      <Card p={sp(frame, 40)} style={{marginTop: 46, overflow: 'hidden'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '20px 26px', borderBottom: `1.5px solid ${C.hairline}`, background: '#FDF6F6'}}>
          <div style={{display: 'flex', gap: 8}}>
            {[0, 1, 2].map((i) => (
              <span key={i} style={{width: 13, height: 13, borderRadius: 13, background: C.hairline}} />
            ))}
          </div>
          <div style={{position: 'relative', flex: 1, height: 44, borderRadius: 22, background: C.white, border: `1.5px solid ${C.hairline}`, overflow: 'hidden'}}>
            {['rakshyanp.com/community', 'Kathmandu weather · today'].map((t, i) => (
              <span
                key={t}
                style={{
                  position: 'absolute',
                  left: 20,
                  top: 7,
                  fontFamily: SANS,
                  fontSize: 22,
                  color: C.inkSoft,
                  opacity: i === 0 ? 1 - swap : swap,
                  transform: `translateY(${(i === 0 ? -swap : 1 - swap) * 20}px)`,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <div style={{position: 'relative', height: 300}}>
          {/* Rakshya page */}
          <div style={{position: 'absolute', inset: 0, padding: '30px 32px', opacity: 1 - swap, transform: `translateX(${-80 * swap}px)`}}>
            <span style={{fontFamily: SERIF, fontSize: 44, color: C.ink}}>Community</span>
            <div style={{display: 'flex', flexDirection: 'column', gap: 14, marginTop: 20}}>
              <Bar w="88%" />
              <Bar w="72%" />
              <Bar w="80%" />
            </div>
            <div
              style={{
                position: 'absolute',
                right: 30,
                bottom: 28,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '18px 28px',
                borderRadius: 999,
                background: C.crimson,
                color: C.white,
                fontFamily: SANS,
                fontWeight: 600,
                fontSize: 26,
                transform: `scale(${1 - press * 0.08})`,
                boxShadow: `0 0 0 ${press * 14}px ${rgba(C.crimson, 0.15)}, 0 12px 26px ${rgba(C.crimson, 0.25)}`,
              }}
            >
              <ExitIcon size={30} color={C.white} /> Quick exit
            </div>
          </div>
          {/* neutral page */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              padding: '34px 36px',
              opacity: swap,
              transform: `translateX(${80 * (1 - swap)}px)`,
              display: 'flex',
              alignItems: 'center',
              gap: 34,
            }}
          >
            <div style={{width: 120, height: 120, borderRadius: 60, background: 'radial-gradient(circle at 40% 40%, #F7D9A8, #EDB96A)', flexShrink: 0}} />
            <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
              <span style={{fontFamily: SANS, fontWeight: 600, fontSize: 64, color: '#3D4650'}}>22°</span>
              <span style={{fontFamily: SANS, fontSize: 26, color: '#6B7480'}}>Partly cloudy · Kathmandu</span>
            </div>
          </div>
        </div>
      </Card>
      <span style={{marginTop: 16, fontFamily: SANS, fontSize: 24, color: C.inkMute, opacity: ease(frame, tap + 10, 20)}}>
        One tap leaves instantly for a neutral page.
      </span>

      <span
        style={{
          marginTop: 40,
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 22,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: C.crimson,
          opacity: ease(frame, chipsAt - 6, 20),
        }}
      >
        Real moments across Nepal
      </span>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 16}}>
        {MOMENTS.map((m, i) => {
          const p = sp(frame, chipsAt + i * 4, 22);
          const last = i === MOMENTS.length - 1;
          return (
            <div
              key={m}
              style={{
                padding: '14px 24px',
                borderRadius: 999,
                fontFamily: SANS,
                fontWeight: 500,
                fontSize: 26,
                color: last ? C.white : C.ink,
                background: last ? C.crimson : C.white,
                border: `1.5px solid ${last ? C.crimson : C.hairline}`,
                opacity: p,
                transform: `translateY(${mix(18, 0, p)}px)`,
              }}
            >
              {m}
            </div>
          );
        })}
      </div>
      <span
        style={{
          marginTop: 34,
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 56,
          color: C.crimson,
          opacity: ease(frame, chipsAt + 34, 26),
          transform: `translateY(${mix(14, 0, ease(frame, chipsAt + 34, 26))}px)`,
        }}
      >
        No shame to carry alone.
      </span>
    </SceneShell>
  );
};

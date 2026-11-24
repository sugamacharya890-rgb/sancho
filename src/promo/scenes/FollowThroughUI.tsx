import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {AuraGlow} from '../primitives/AuraGlow';
import {BrandRibbon} from '../primitives/BrandRibbon';
import {Check} from '../primitives/Check';
import {KineticText} from '../primitives/KineticText';
import {PhoneFrame} from '../primitives/PhoneFrame';
import {LOGO_SRC} from '../primitives/SanchoLogo';
import {C, EASE_IO, SHADOW, ease, lerp, pop, rgba} from '../theme';
import {FONT_DISPLAY, FONT_UI} from '../../theme/fonts';

const PHONE_ROWS = [
  {title: 'Cardiology appointment', todo: 'Thu 10:30 · booking', done: 'Confirmed · Thu 10:30'},
  {title: 'Metformin refill', todo: '3 days left', done: 'Delivered to Mom'},
  {title: 'HbA1c lab test', todo: 'Results pending', done: 'Reviewed with doctor'},
  {title: 'Blood pressure check', todo: 'Due today', done: 'Done · 128/82'},
  {title: 'Eye exam', todo: 'Needs a slot', done: 'Booked · Mon 9:00'},
  {title: 'Physio session', todo: 'Twice weekly', done: 'Rides arranged'},
];
/** Completions land on the 120bpm beat grid (every 15 frames). */
const DONE_AT = [30, 45, 60, 75, 90, 105];
const PUSH_AT = 90;

const PhoneScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const scroll = ease(frame, 84, 24, EASE_IO) * 2 * 96; // feed keeps moving forward
  return (
    <div style={{padding: '70px 26px 0', fontFamily: FONT_UI}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
        <Img src={staticFile(LOGO_SRC)} style={{width: 34, height: 34}} />
        <div style={{color: C.muted, fontSize: 18, fontWeight: 500}}>Good morning</div>
      </div>
      <div style={{fontFamily: FONT_DISPLAY, fontSize: 38, fontWeight: 800, color: C.ink, letterSpacing: '-0.03em', marginTop: 10}}>
        Mom&apos;s care
      </div>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          marginTop: 12,
          padding: '8px 14px',
          borderRadius: 99,
          background: rgba(C.teal, 0.14),
          color: C.tealDeep,
          fontWeight: 600,
          fontSize: 17,
        }}
      >
        <div style={{width: 8, height: 8, borderRadius: 4, background: C.teal, transform: `scale(${1 + Math.sin(frame / 6) * 0.25})`}} />
        Everything on track
      </div>
      <div style={{marginTop: 22, height: 520, overflow: 'hidden', position: 'relative'}}>
        <div style={{transform: `translateY(${-scroll}px)`}}>
          {PHONE_ROWS.map((r, i) => {
            const p = ease(frame, DONE_AT[i], 14);
            const inP = ease(frame, 14 + i * 5, 20);
            return (
              <div
                key={r.title}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  height: 84,
                  marginBottom: 12,
                  padding: '0 16px',
                  borderRadius: 20,
                  background: C.white,
                  boxShadow: `0 6px 18px ${rgba(C.ink, 0.06)}`,
                  border: `1.5px solid ${p > 0.5 ? rgba(C.teal, 0.4) : C.line}`,
                  opacity: inP,
                  transform: `translateY(${(1 - inP) * 30}px)`,
                }}
              >
                <Check p={p} size={34} />
                <div style={{minWidth: 0}}>
                  <div style={{color: C.ink, fontSize: 19, fontWeight: 600, whiteSpace: 'nowrap'}}>{r.title}</div>
                  <div style={{position: 'relative', height: 22, marginTop: 3, fontSize: 16, whiteSpace: 'nowrap'}}>
                    <span style={{position: 'absolute', color: C.muted, opacity: 1 - p}}>{r.todo}</span>
                    <span style={{position: 'absolute', color: C.tealDeep, fontWeight: 600, opacity: p}}>{r.done}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Callout: React.FC<{eyebrow: string; text: string; at: number; side: 'left' | 'right'}> = ({eyebrow, text, at, side}) => {
  const frame = useCurrentFrame();
  const s = pop(frame, at);
  const out = ease(frame, PUSH_AT - 8, 12, EASE_IO);
  const dir = side === 'left' ? -1 : 1;
  return (
    <div
      style={{
        position: 'absolute',
        top: 430,
        [side]: 150,
        width: 540,
        textAlign: side === 'left' ? 'right' : 'left',
        opacity: Math.min(1, s * 1.3) * (1 - out),
        transform: `translateX(${(1 - s) * dir * 80 + out * dir * 60}px)`,
        filter: s < 0.97 || out > 0 ? `blur(${(1 - Math.min(1, s)) * 10 + out * 10}px)` : undefined,
      }}
    >
      <div style={{fontFamily: FONT_UI, fontWeight: 700, fontSize: 22, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.teal}}>
        {eyebrow}
      </div>
      <div style={{fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 66, letterSpacing: '-0.045em', lineHeight: 1.02, color: C.ink, marginTop: 10}}>
        {text}
      </div>
    </div>
  );
};

const FLOAT_ROWS = [
  {kind: 'Appointments', title: 'Cardiology · Thu 10:30', done: 'Confirmed'},
  {kind: 'Prescriptions', title: 'Metformin refill', done: 'Delivered'},
  {kind: 'Lab follow-ups', title: 'HbA1c results', done: 'Reviewed'},
];
const CARD_AT = 105;

const FloatingCard: React.FC = () => {
  const frame = useCurrentFrame();
  const s = pop(frame, CARD_AT, 30, 150, 16);
  const out = ease(frame, 182, 13, EASE_IO);
  const float = Math.sin(frame / 22) * 6;
  return (
    <div
      style={{
        position: 'absolute',
        left: 960 - 390,
        top: 410,
        width: 780,
        boxSizing: 'border-box',
        padding: '30px 34px 24px',
        borderRadius: 32,
        background: C.white,
        boxShadow: `0 40px 90px ${rgba(C.tealDeep, 0.22)}, 0 10px 30px ${rgba(C.ink, 0.08)}`,
        opacity: Math.min(1, s * 1.4) * (1 - out),
        transform: `translateY(${(1 - s) * 120 + float - out * 60}px) rotate(${(1 - s) * 4 + Math.sin(frame / 40) * 0.5}deg) scale(${0.9 + 0.1 * s})`,
        filter: s < 0.97 || out > 0 ? `blur(${(1 - Math.min(1, s)) * 10 + out * 12}px)` : undefined,
        fontFamily: FONT_UI,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14}}>
        <Img src={staticFile(LOGO_SRC)} style={{width: 40, height: 40}} />
        <div style={{fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 30, color: C.ink, letterSpacing: '-0.03em', flex: 1}}>
          This week, handled
        </div>
        <div style={{padding: '8px 16px', borderRadius: 99, background: rgba(C.teal, 0.14), color: C.tealDeep, fontWeight: 700, fontSize: 17}}>
          Keeps moving
        </div>
      </div>
      {FLOAT_ROWS.map((r, i) => {
        const bar = ease(frame, CARD_AT + 10 + i * 15, 22, EASE_IO);
        const done = ease(frame, CARD_AT + 30 + i * 15, 12);
        return (
          <div key={r.kind} style={{display: 'flex', alignItems: 'center', gap: 18, padding: '16px 0', borderTop: `1px solid ${C.line}`}}>
            <Check p={done} size={40} />
            <div style={{flex: 1}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                <div>
                  <span style={{color: C.muted, fontSize: 15, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase'}}>{r.kind}</span>
                  <div style={{color: C.ink, fontSize: 24, fontWeight: 600, marginTop: 2}}>{r.title}</div>
                </div>
                <div style={{color: done > 0.5 ? C.tealDeep : C.muted, fontWeight: 700, fontSize: 19}}>{done > 0.5 ? r.done : 'In motion'}</div>
              </div>
              <div style={{marginTop: 10, height: 6, borderRadius: 3, background: '#EEF2F6', overflow: 'hidden'}}>
                <div style={{width: `${bar * 100}%`, height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${C.tealDeep}, ${C.teal})`}} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const FollowThroughUI: React.FC = () => {
  const frame = useCurrentFrame();
  const rise = pop(frame, 2, 30, 120, 18);
  const push = ease(frame, PUSH_AT, 40, EASE_IO);
  const phoneY = lerp(560, 0, rise);
  // camera push-in on the phone, which then falls back out of focus behind the ribbon + card
  const camScale = lerp(1, 1.22, push);

  return (
    <AbsoluteFill>
      <AuraGlow
        blobs={[
          {x: 960, y: 620, r: 460, color: C.teal, alpha: 0.5},
          {x: 700, y: 300, r: 300, color: C.tealDeep, alpha: 0.16},
          {x: 1300, y: 820, r: 320, color: C.teal, alpha: 0.22},
        ]}
      />
      <AbsoluteFill style={{transform: `scale(${camScale})`, transformOrigin: '50% 55%'}}>
        <div
          style={{
            position: 'absolute',
            left: 960 - 210,
            top: 120,
            transform: `translateY(${phoneY + Math.sin(frame / 30) * 5}px)`,
            filter: push > 0 ? `blur(${push * 7}px)` : undefined,
            opacity: 1 - push * 0.45,
          }}
        >
          <PhoneFrame>
            <PhoneScreen />
          </PhoneFrame>
        </div>
      </AbsoluteFill>
      <Callout eyebrow="Ongoing care" text={"Steady follow\u2011through"} at={20} side="left" />
      <Callout eyebrow="Zero chasing" text="From afar" at={28} side="right" />

      <BrandRibbon start={PUSH_AT + 4} duration={32} exitAt={168} />
      <FloatingCard />
      <div style={{position: 'absolute', left: 0, right: 0, top: 150, display: 'flex', justifyContent: 'center'}}>
        <KineticText text={'A system that keeps *care moving.*'} start={CARD_AT + 4} exitAt={180} size={84} stagger={3} />
      </div>
    </AbsoluteFill>
  );
};

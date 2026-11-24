import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {AuraGlow} from '../../promo/primitives/AuraGlow';
import {KineticText} from '../../promo/primitives/KineticText';
import {C, EASE_IO, ease, pop, rgba} from '../../promo/theme';
import {FONT_UI} from '../../theme/fonts';
import {useLayout} from '../layout';

/** The same questions, again and again — and the hours between them. */
const QUESTIONS = [
  {text: 'Did you go?', time: '8:02 PM', at: 14},
  {text: 'What did they say?', time: '8:40 PM', at: 30},
  {text: 'Did they change the medicine?', time: '9:15 PM', at: 46},
  {text: 'Did you go?', time: '10:31 PM', at: 72},
  {text: 'Mom? Call me back', time: '11:58 PM', at: 92},
];
const ROW = 104;
const SNAP_AT = 150;

const Bubble: React.FC<{q: (typeof QUESTIONS)[number]; i: number}> = ({q, i}) => {
  const frame = useCurrentFrame();
  const s = pop(frame, q.at, 30, 230, 17);
  const newest = QUESTIONS.filter((x) => frame >= x.at).length - 1;
  const age = Math.max(0, newest - i); // older questions sink into blur (depth of field)
  const pulse = ((frame - q.at) % 30) / 30;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        height: ROW,
        opacity: Math.min(1, s * 1.4) * (1 - Math.min(age, 3) * 0.17),
        transform: `translateX(${(1 - s) * 80}px) scale(${0.86 + 0.14 * s - Math.min(age, 3) * 0.02})`,
        transformOrigin: '100% 50%',
        filter: age > 0 ? `blur(${Math.min(age, 3) * 1.6}px)` : s < 0.97 ? `blur(${(1 - s) * 8}px)` : undefined,
        fontFamily: FONT_UI,
      }}
    >
      <div style={{position: 'relative'}}>
        {age === 0 && frame >= q.at && (
          <div
            style={{
              position: 'absolute',
              inset: -6 - pulse * 14,
              borderRadius: 34 + pulse * 14,
              border: `2.5px solid ${rgba(C.coral, 0.55 * (1 - pulse))}`,
            }}
          />
        )}
        <div
          style={{
            padding: '18px 28px',
            borderRadius: 28,
            borderBottomRightRadius: 8,
            background: C.white,
            border: `2px solid ${rgba(C.coral, 0.4)}`,
            boxShadow: `0 16px 40px ${rgba(C.coral, 0.14)}`,
            fontSize: 32,
            fontWeight: 600,
            color: C.ink,
            whiteSpace: 'nowrap',
          }}
        >
          {q.text}
        </div>
      </div>
      <div style={{marginTop: 8, fontSize: 18, fontWeight: 600, color: C.muted}}>
        {q.time} · <span style={{color: C.coral}}>Delivered · no reply</span>
      </div>
    </div>
  );
};

export const ChasingLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const {pick} = useLayout();
  const shown = QUESTIONS.filter((x) => frame >= x.at).length;
  // the thread scrolls as questions keep piling up
  const scroll = ease(frame, 60, 50, EASE_IO) * ROW * 2;
  const snap = ease(frame, SNAP_AT, 10, EASE_IO);
  const typing = frame > 56 && frame < 70; // Mom starts typing… then doesn't
  const strain = ease(frame, 70, 40);

  return (
    <AbsoluteFill>
      <AuraGlow
        blobs={[
          {x: pick(1260, 700), y: pick(600, 1150), r: 420, color: C.coral, alpha: 0.2 + 0.12 * strain},
          {x: pick(640, 300), y: pick(420, 480), r: 380, color: C.amber, alpha: 0.12 + 0.08 * strain},
          {x: pick(960, 540), y: pick(980, 1700), r: 360, color: C.tealDeep, alpha: 0.08},
        ]}
      />
      <AbsoluteFill
        style={{
          opacity: 1 - snap,
          transform: `scale(${1 - snap * 0.06})`,
          filter: snap > 0 ? `blur(${snap * 14}px)` : undefined,
        }}
      >
        {/* headline beats (left column) */}
        <div style={{position: 'absolute', left: pick(150, 80), top: pick(350, 290)}}>
          <KineticText text={'Still texting to\nfind out what\nhappened?'} start={2} exitAt={66} size={pick(96, 100)} align="left" stagger={3} />
        </div>
        <div style={{position: 'absolute', left: pick(150, 80), top: pick(390, 330)}}>
          <KineticText text={'Chasing updates\ngets *exhausting.*'} accent={C.coral} start={75} size={pick(96, 100)} align="left" stagger={4} />
        </div>

        {/* the thread (right column) */}
        <div
          style={{
            position: 'absolute',
            right: pick(150, 80),
            top: pick(170, 700),
            width: pick(680, 920),
            height: pick(760, 900),
            overflow: 'hidden',
            maskImage: 'linear-gradient(180deg, transparent 0%, black 18%, black 100%)',
            WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, black 18%, black 100%)',
          }}
        >
          <div style={{paddingTop: 200, transform: `translateY(${-scroll}px)`}}>
            {QUESTIONS.slice(0, Math.max(shown, 1)).map((q, i) => (
              <Bubble key={i} q={q} i={i} />
            ))}
            <div
              style={{
                display: 'flex',
                gap: 8,
                padding: '18px 22px',
                width: 'fit-content',
                borderRadius: 26,
                borderBottomLeftRadius: 8,
                background: C.white,
                boxShadow: `0 10px 28px ${rgba(C.ink, 0.08)}`,
                opacity: typing ? 1 : 0,
              }}
            >
              {[0, 1, 2].map((d) => (
                <div
                  key={d}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    background: C.muted,
                    opacity: 0.35 + 0.65 * Math.max(0, Math.sin(frame / 3 - d)),
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {AuraGlow} from '../primitives/AuraGlow';
import {Check} from '../primitives/Check';
import {KineticText} from '../primitives/KineticText';
import {PointerCursor} from '../primitives/PointerCursor';
import {C, EASE_IO, ease, pop, rgba} from '../theme';
import {FONT_DISPLAY, FONT_UI} from '../../theme/fonts';

/** The chasing loop, briefly: unanswered questions from abroad. */
const BUBBLES = [
  {text: 'Did you see the doctor?', x: 170, y: 300, r: -4},
  {text: 'What did they say?', x: 1390, y: 250, r: 3},
  {text: 'Did the dose change?', x: 230, y: 760, r: 3},
  {text: 'Call me back?', x: 1450, y: 800, r: -3},
];

type Row = {title: string; meta: string; tone: string; when: string};
const ROWS: Row[] = [
  {title: 'Lab results shared', meta: 'HbA1c stable · no changes needed', tone: C.tealDeep, when: 'Mon'},
  {title: 'Refill delivered', meta: 'Metformin · 90 days', tone: C.tealDeep, when: 'Tue'},
  {title: 'Cardiology visit complete', meta: 'Medication unchanged • Next checkup scheduled', tone: C.teal, when: 'Today'},
  {title: 'Blood pressure logged', meta: '128/82 · within target', tone: C.tealDeep, when: 'Today'},
  {title: 'Physio confirmed', meta: 'Thursday 4:00 PM · ride arranged', tone: C.tealDeep, when: 'Thu'},
];
const ACTIVE = 2;
const ROW_H = 112;
const GAP = 16;
const FEED_TOP = 330;
const FEED_W = 860;

const FOCUS_AT = 100;
const CURSOR_AT = 94;
export const CLICK_AT = 120;

export const VisibilityFeed: React.FC = () => {
  const frame = useCurrentFrame();
  const focus = ease(frame, FOCUS_AT, 16);
  const clicked = ease(frame, CLICK_AT + 2, 16);
  const warm = 1 - ease(frame, 40, 30);
  const feedDrift = Math.sin(frame / 30) * 4;

  const activeTop = FEED_TOP + ACTIVE * (ROW_H + GAP);
  return (
    <AbsoluteFill>
      <AuraGlow
        blobs={[
          {x: 960, y: 620, r: 480, color: C.teal, alpha: 0.32 * (1 - warm * 0.5)},
          {x: 360, y: 360, r: 300, color: C.coral, alpha: 0.26 * warm},
          {x: 1560, y: 760, r: 300, color: C.amber, alpha: 0.22 * warm},
          {x: 960, y: activeTop + 60, r: 260, color: C.teal, alpha: 0.35 * focus},
        ]}
      />

      {/* chasing bubbles pop, then blur out of the way */}
      {BUBBLES.map((b, i) => {
        const s = pop(frame, 6 + i * 5, 30, 220, 16);
        const out = ease(frame, 40 + i * 3, 16, EASE_IO);
        return (
          <div
            key={b.text}
            style={{
              position: 'absolute',
              left: b.x,
              top: b.y,
              transform: `rotate(${b.r}deg) scale(${(0.8 + 0.2 * s) * (1 - out * 0.15)}) translateY(${Math.sin(frame / 9 + i) * 4}px)`,
              opacity: Math.min(1, s * 1.4) * (1 - out),
              filter: `blur(${out * 10}px)`,
              fontFamily: FONT_UI,
            }}
          >
            <div
              style={{
                padding: '18px 26px',
                borderRadius: 26,
                borderBottomRightRadius: 8,
                background: C.white,
                border: `2px solid ${rgba(C.coral, 0.45)}`,
                boxShadow: `0 16px 40px ${rgba(C.coral, 0.15)}`,
                fontSize: 30,
                fontWeight: 600,
                color: C.ink,
                whiteSpace: 'nowrap',
              }}
            >
              {b.text}
            </div>
            <div style={{marginTop: 8, textAlign: 'right', fontSize: 19, fontWeight: 600, color: C.coral}}>No reply</div>
          </div>
        );
      })}

      <div style={{position: 'absolute', left: 0, right: 0, top: 420, display: 'flex', justifyContent: 'center'}}>
        <KineticText text={'Still ~chasing~ Mom or Dad\nfor every update?'} start={4} strikeAt={34} exitAt={52} size={104} stagger={3} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 120, display: 'flex', justifyContent: 'center'}}>
        <KineticText text={'Clear updates. *Zero chasing.*'} start={60} size={88} stagger={4} />
      </div>

      {/* stacked feed with depth-of-field focus on the active update */}
      <div style={{position: 'absolute', left: 960 - FEED_W / 2, top: 0, width: FEED_W, transform: `translateY(${feedDrift}px)`}}>
        {ROWS.map((r, i) => {
          const inP = pop(frame, 64 + i * 5, 30, 170, 18);
          const active = i === ACTIVE;
          const blur = active ? 0 : focus * (Math.abs(i - ACTIVE) === 1 ? 4 : 6);
          const opacity = Math.min(1, inP * 1.3) * (active ? 1 : 1 - focus * 0.55);
          const scale = active ? 1 + focus * 0.04 + clicked * 0.01 : 1 - focus * 0.02;
          const top = FEED_TOP + i * (ROW_H + GAP) + (1 - inP) * 140;
          return (
            <div
              key={r.title}
              style={{
                position: 'absolute',
                top,
                left: 0,
                width: FEED_W,
                height: ROW_H + (active ? clicked * 26 : 0),
                boxSizing: 'border-box',
                padding: '0 30px',
                display: 'flex',
                alignItems: 'center',
                gap: 22,
                borderRadius: 26,
                background: C.white,
                border: `2px solid ${active ? rgba(C.teal, 0.25 + focus * 0.5) : C.line}`,
                boxShadow: active
                  ? `0 ${20 + focus * 20}px ${50 + focus * 30}px ${rgba(C.tealDeep, 0.12 + focus * 0.14)}`
                  : `0 10px 30px ${rgba(C.ink, 0.06)}`,
                transform: `scale(${scale})`,
                opacity,
                filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
                zIndex: active ? 2 : 1,
                fontFamily: FONT_UI,
              }}
            >
              <Check p={active ? ease(frame, CLICK_AT + 4, 14) : 1} size={44} />
              <div style={{flex: 1, minWidth: 0}}>
                <div style={{fontFamily: FONT_DISPLAY, color: C.ink, fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em'}}>{r.title}</div>
                <div style={{color: active ? C.tealDeep : C.muted, fontSize: 21, fontWeight: active ? 600 : 500, marginTop: 4, whiteSpace: 'nowrap'}}>
                  {r.meta}
                </div>
                {active && (
                  <div
                    style={{
                      marginTop: 8,
                      height: clicked * 22,
                      overflow: 'hidden',
                      opacity: clicked,
                      color: C.muted,
                      fontSize: 18,
                      fontWeight: 500,
                    }}
                  >
                    Shared with you · no calls needed
                  </div>
                )}
              </div>
              <div
                style={{
                  padding: '8px 16px',
                  borderRadius: 99,
                  background: active ? rgba(C.teal, 0.16) : '#F1F5F9',
                  color: active ? C.tealDeep : C.muted,
                  fontWeight: 700,
                  fontSize: 18,
                }}
              >
                {r.when}
              </div>
            </div>
          );
        })}
      </div>

      <PointerCursor from={[1640, 1060]} to={[1210, activeTop + 96]} start={CURSOR_AT} travel={24} clickAt={CLICK_AT} />
    </AbsoluteFill>
  );
};

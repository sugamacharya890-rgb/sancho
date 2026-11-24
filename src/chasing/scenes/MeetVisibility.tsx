import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {AuraGlow} from '../../promo/primitives/AuraGlow';
import {Check} from '../../promo/primitives/Check';
import {KineticText} from '../../promo/primitives/KineticText';
import {PointerCursor} from '../../promo/primitives/PointerCursor';
import {SanchoLogo} from '../../promo/primitives/SanchoLogo';
import {C, EASE_IO, ease, lerp, pop, rgba} from '../../promo/theme';
import {FONT_DISPLAY, FONT_UI} from '../../theme/fonts';
import {useLayout} from '../layout';

const LOGO_AT = 15; // global 180 = 6.0s, on the beat
const DOCK_AT = 66; // lockup glides up to become the header
const FEED_AT = 75; // 0:08 — stacked UI feed
const FOCUS_AT = 104;
const CURSOR_AT = 106;
export const CLICK_AT = 135; // global 300 = 10.0s, on the beat
const CALLOUT_AT = 150; // 0:10.5 — "Clarity without chasing."

type Row = {title: string; meta: string; when: string};
const ROWS: Row[] = [
  {title: 'Refill delivered', meta: 'Metformin · 90-day supply', when: 'Mon'},
  {title: 'Lab results reviewed', meta: 'HbA1c stable · no changes', when: 'Tue'},
  {title: 'Visit summary shared • Next step clear', meta: 'Cardiology · BP stable · Follow-up Mon 9:00', when: 'Today'},
  {title: 'Blood pressure logged', meta: '128/82 · within target', when: 'Today'},
  {title: 'Physio confirmed', meta: 'Thursday 4:00 PM · ride arranged', when: 'Thu'},
];
const ACTIVE = 2;
const ROW_H = 100;
const GAP = 14;
const FEED_TOP_LANDSCAPE = 236;
const FEED_TOP_VERTICAL = 610;
const FEED_W_LANDSCAPE = 900;
const FEED_W_VERTICAL = 960;

export const MeetVisibility: React.FC = () => {
  const frame = useCurrentFrame();
  const {W, H, pick, vertical} = useLayout();
  const FEED_TOP = pick(FEED_TOP_LANDSCAPE, FEED_TOP_VERTICAL);
  const FEED_W = pick(FEED_W_LANDSCAPE, FEED_W_VERTICAL);
  const meet = pop(frame, 0);
  const dock = ease(frame, DOCK_AT, 22, EASE_IO);
  const focus = ease(frame, FOCUS_AT, 16);
  const clicked = ease(frame, CLICK_AT + 2, 16);
  const exit = ease(frame, 196, 14, EASE_IO);
  const activeTop = FEED_TOP + ACTIVE * (ROW_H + GAP);

  return (
    <AbsoluteFill>
      <AuraGlow
        blobs={[
          {x: W / 2, y: H / 2, r: 500 + 60 * ease(frame, 0, 30), color: C.teal, alpha: 0.38},
          {x: pick(620, 260), y: pick(760, 1400), r: 300, color: C.tealDeep, alpha: 0.14},
          {x: pick(1340, 820), y: pick(330, 520), r: 280, color: C.teal, alpha: 0.2},
          {x: W / 2, y: activeTop + 50, r: 280, color: C.teal, alpha: 0.3 * focus},
        ]}
      />
      <AbsoluteFill style={{opacity: 1 - exit, transform: `translateX(${-exit * 120}px)`, filter: exit > 0 ? `blur(${exit * 10}px)` : undefined}}>
        {/* Meet [Sancho] → docks as the header */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: lerp(H / 2 - 90, pick(60, 300), dock),
            display: 'flex',
            justifyContent: 'center',
            transform: `scale(${lerp(pick(1, 0.8), pick(0.42, 0.5), dock)})`,
            transformOrigin: '50% 0%',
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: 44, height: 180}}>
            <div
              style={{
                fontFamily: FONT_DISPLAY,
                fontWeight: 800,
                fontSize: 128,
                letterSpacing: '-0.045em',
                color: C.muted,
                opacity: Math.min(1, meet * 1.5) * (1 - dock),
                transform: `translateY(${(1 - meet) * 60}px)`,
                filter: meet < 0.98 ? `blur(${(1 - meet) * 10}px)` : undefined,
                width: lerp(330, 0, dock),
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}
            >
              Meet
            </div>
            {frame >= LOGO_AT - 1 && <SanchoLogo start={LOGO_AT} size={150} />}
          </div>
        </div>

        {/* stacked UI feed with depth-of-field focus */}
        <div style={{position: 'absolute', left: (W - FEED_W) / 2, top: 0, width: FEED_W, transform: `translateY(${Math.sin(frame / 30) * 4}px)`}}>
          {ROWS.map((r, i) => {
            const inP = pop(frame, FEED_AT + i * 5, 30, 170, 18);
            const active = i === ACTIVE;
            const blur = active ? 0 : focus * (Math.abs(i - ACTIVE) === 1 ? 4 : 6);
            return (
              <div
                key={r.title}
                style={{
                  position: 'absolute',
                  top: FEED_TOP + i * (ROW_H + GAP) + (1 - inP) * 160,
                  left: 0,
                  width: FEED_W,
                  height: ROW_H + (active ? clicked * 26 : 0),
                  boxSizing: 'border-box',
                  padding: '0 28px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 22,
                  borderRadius: 26,
                  background: C.white,
                  border: `2px solid ${active ? rgba(C.teal, 0.25 + focus * 0.5) : C.line}`,
                  boxShadow: active
                    ? `0 ${20 + focus * 20}px ${50 + focus * 30}px ${rgba(C.tealDeep, 0.12 + focus * 0.14)}`
                    : `0 10px 30px ${rgba(C.ink, 0.06)}`,
                  transform: `scale(${active ? 1 + focus * 0.04 : 1 - focus * 0.02})`,
                  opacity: Math.min(1, inP * 1.3) * (active ? 1 : 1 - focus * 0.55),
                  filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
                  zIndex: active ? 2 : 1,
                  fontFamily: FONT_UI,
                }}
              >
                <Check p={active ? ease(frame, CLICK_AT + 4, 14) : 1} size={42} />
                <div style={{flex: 1, minWidth: 0}}>
                  <div style={{fontFamily: FONT_DISPLAY, color: C.ink, fontSize: 27, fontWeight: 700, letterSpacing: '-0.02em', whiteSpace: 'nowrap'}}>
                    {r.title}
                  </div>
                  <div style={{color: active ? C.tealDeep : C.muted, fontSize: 20, fontWeight: active ? 600 : 500, marginTop: 4, whiteSpace: 'nowrap'}}>
                    {r.meta}
                  </div>
                  {active && (
                    <div style={{marginTop: 8, height: clicked * 22, overflow: 'hidden', opacity: clicked, color: C.muted, fontSize: 18, fontWeight: 500}}>
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

        <div style={{position: 'absolute', left: 0, right: 0, top: pick(862, 1300), display: 'flex', justifyContent: 'center'}}>
          <KineticText text={vertical ? 'Clarity\n*without chasing.*' : 'Clarity *without chasing.*'} start={CALLOUT_AT} size={pick(78, 88)} stagger={4} />
        </div>

        <PointerCursor from={pick<[number, number]>([1660, 1080], [1000, 1750])} to={[W / 2 + pick(280, 300), activeTop + 90]} start={CURSOR_AT} travel={24} clickAt={CLICK_AT} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {AuraGlow} from '../../promo/primitives/AuraGlow';
import {BrandRibbon} from '../../promo/primitives/BrandRibbon';
import {Check} from '../../promo/primitives/Check';
import {KineticText} from '../../promo/primitives/KineticText';
import {LOGO_SRC} from '../../promo/primitives/SanchoLogo';
import {C, EASE_IO, ease, pop, rgba} from '../../promo/theme';
import {FONT_DISPLAY, FONT_UI} from '../../theme/fonts';
import {useLayout} from '../layout';

const CARD_AT = 15; // global 390 = 13.0s
const TAGS_AT = 90; // 0:15.5
/** Timeline stops complete on the beat; the last two stay "up next". */
const STOPS = [
  {label: 'Doctor visit', when: 'Tue', at: 30},
  {label: 'Refill', when: 'Wed', at: 45},
  {label: 'Lab test', when: 'Fri', at: 60},
  {label: 'Follow-up', when: 'Mon', at: 75},
  {label: 'Eye exam', when: 'Next Tue', at: null},
] as {label: string; when: string; at: number | null}[];

const CARD_W = 1000;
// stops sit inside the card's 920px content box with room for centered labels
const TRACK_X0 = 90;
const TRACK_W = 740;

const TimelineCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {W, pick} = useLayout();
  const s = pop(frame, CARD_AT, 30, 150, 16);
  const float = Math.sin(frame / 22) * 6;
  const out = ease(frame, 168, 12, EASE_IO);
  const step = TRACK_W / (STOPS.length - 1);
  // progress line flows to each completed stop, then keeps easing toward the next
  const done = STOPS.filter((x) => x.at !== null && frame >= x.at).length;
  const fill = Math.min(STOPS.length - 1, Math.max(0, done - 1) + ease(frame, 80, 90, EASE_IO) * 0.55) * step;
  return (
    <div
      style={{
        position: 'absolute',
        left: (W - CARD_W) / 2,
        top: pick(395, 690),
        width: CARD_W,
        height: 380,
        boxSizing: 'border-box',
        padding: '34px 40px',
        borderRadius: 34,
        background: C.white,
        boxShadow: `0 40px 90px ${rgba(C.tealDeep, 0.22)}, 0 10px 30px ${rgba(C.ink, 0.08)}`,
        opacity: Math.min(1, s * 1.4) * (1 - out),
        transform: `translateY(${(1 - s) * 120 + float - out * 40}px) rotate(${(1 - s) * 3 + Math.sin(frame / 40) * 0.4}deg) scale(${(0.9 + 0.1 * s) * pick(1, 0.96)})`,
        filter: s < 0.97 || out > 0 ? `blur(${(1 - Math.min(1, s)) * 10 + out * 10}px)` : undefined,
        fontFamily: FONT_UI,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
        <Img src={staticFile(LOGO_SRC)} style={{width: 42, height: 42}} />
        <div style={{fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 32, color: C.ink, letterSpacing: '-0.03em', flex: 1}}>
          Mom&apos;s care, this month
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '9px 18px',
            borderRadius: 99,
            background: rgba(C.teal, 0.14),
            color: C.tealDeep,
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          <div style={{width: 9, height: 9, borderRadius: 5, background: C.teal, transform: `scale(${1 + Math.sin(frame / 6) * 0.3})`}} />
          Moving forward
        </div>
      </div>

      {/* horizontal timeline */}
      <div style={{position: 'relative', marginTop: 70, height: 170}}>
        <div style={{position: 'absolute', left: TRACK_X0, top: 22, width: TRACK_W, height: 6, borderRadius: 3, background: '#E8EEF4'}} />
        <div
          style={{
            position: 'absolute',
            left: TRACK_X0,
            top: 22,
            width: fill,
            height: 6,
            borderRadius: 3,
            background: `linear-gradient(90deg, ${C.tealDeep}, ${C.teal})`,
            boxShadow: `0 0 14px ${rgba(C.teal, 0.5)}`,
          }}
        />
        {STOPS.map((st, i) => {
          const x = TRACK_X0 + i * step;
          const p = st.at === null ? 0 : ease(frame, st.at, 12);
          const inP = ease(frame, CARD_AT + 8 + i * 5, 18);
          const next = i === done;
          return (
            <div key={st.label} style={{position: 'absolute', left: x - 90, top: 0, width: 180, textAlign: 'center', opacity: inP}}>
              <div style={{display: 'flex', justifyContent: 'center', height: 50, alignItems: 'center'}}>
                {p > 0.01 ? (
                  <Check p={p} size={50} />
                ) : (
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      boxSizing: 'border-box',
                      borderRadius: 25,
                      background: C.white,
                      border: `3px solid ${next ? C.teal : '#CBD5E1'}`,
                      boxShadow: next ? `0 0 0 ${6 + Math.sin(frame / 6) * 4}px ${rgba(C.teal, 0.18)}` : undefined,
                    }}
                  />
                )}
              </div>
              <div style={{marginTop: 18, fontSize: 22, fontWeight: 700, color: C.ink, whiteSpace: 'nowrap'}}>{st.label}</div>
              <div style={{marginTop: 4, fontSize: 18, fontWeight: 600, whiteSpace: 'nowrap', color: p > 0.5 ? C.tealDeep : next ? C.teal : C.muted}}>
                {p > 0.5 ? `Done · ${st.when}` : next ? `Up next · ${st.when}` : st.when}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SideTag: React.FC<{text: string; side: 'left' | 'right'; at: number}> = ({text, side, at}) => {
  const frame = useCurrentFrame();
  const {vertical} = useLayout();
  const s = pop(frame, at, 30, 200, 15);
  const out = ease(frame, 166, 12, EASE_IO);
  const dir = side === 'left' ? -1 : 1;
  return (
    <div
      style={{
        position: 'absolute',
        // landscape: a pair beneath the card; vertical: stacked and centered
        ...(vertical
          ? {top: side === 'left' ? 1150 : 1270, left: 0, right: 0, justifyContent: 'center'}
          : {top: 870, [side]: 960 - 40 - 430, width: 430, justifyContent: side === 'left' ? 'flex-end' : 'flex-start'}),
        display: 'flex',
        opacity: Math.min(1, s * 1.4) * (1 - out),
        transform: `translateX(${(1 - s) * dir * 70}px) translateY(${Math.sin(frame / 18 + (side === 'left' ? 0 : 2)) * 3}px)`,
        filter: s < 0.97 ? `blur(${(1 - Math.min(1, s)) * 8}px)` : undefined,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '18px 30px',
          borderRadius: 99,
          background: C.white,
          border: `2px solid ${rgba(C.teal, 0.35)}`,
          boxShadow: `0 16px 40px ${rgba(C.tealDeep, 0.14)}`,
          fontFamily: FONT_DISPLAY,
          fontWeight: 800,
          fontSize: 40,
          letterSpacing: '-0.03em',
          color: C.ink,
          whiteSpace: 'nowrap',
        }}
      >
        <Check p={1} size={36} />
        {text}
      </div>
    </div>
  );
};

export const FollowThroughBehind: React.FC = () => {
  const {W, pick} = useLayout();
  return (
  <AbsoluteFill>
    <AuraGlow
      blobs={[
        {x: W / 2, y: pick(600, 900), r: 520, color: C.teal, alpha: 0.4},
        {x: pick(520, 240), y: pick(320, 420), r: 300, color: C.tealDeep, alpha: 0.14},
        {x: pick(1420, 860), y: pick(820, 1400), r: 320, color: C.teal, alpha: 0.2},
      ]}
    />
    <BrandRibbon start={0} duration={34} exitAt={150} />
    <TimelineCard />
    <div style={{position: 'absolute', left: 0, right: 0, top: pick(110, 300), display: 'flex', justifyContent: 'center'}}>
      <KineticText text={'Steady follow-through\n*behind the scenes.*'} start={4} exitAt={166} size={pick(88, 80)} stagger={3} />
    </div>
    <SideTag text="Nothing slips" side="left" at={TAGS_AT} />
    <SideTag text="No micromanaging" side="right" at={TAGS_AT + 5} />
  </AbsoluteFill>
  );
};

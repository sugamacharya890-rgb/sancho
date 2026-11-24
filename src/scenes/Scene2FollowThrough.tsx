import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ContinuityTrack, TrackGeometry, trackY} from '../primitives/ContinuityTrack';
import {FadeSlideText} from '../primitives/FadeSlideText';
import {SanchoMark} from '../primitives/SanchoMark';
import {StatusCard} from '../primitives/StatusCard';
import {COLORS, EASE_IN_OUT, EASE_OUT, SAFE, hexA, lerp, progress} from '../theme/theme';
import {CARD_W, CARE_ITEMS, S1_END, chaosPose} from './careItems';

const ROW_Y = 548; // card centers on the track
const SLOT_X0 = 300;
const SLOT_GAP = 430;
const MARKER_X = 1000;
const SLOT_SCALE = 0.84;
const CARD_H = 88;

/** Track scroll: still → eases up to a steady cruising speed → keeps going on its own. */
const SPEED = 3;
const RAMP_START = 60;
const RAMP = 60;
export const trackScroll = (f: number) => {
  if (f < RAMP_START) return 0;
  const t = f - RAMP_START;
  if (t < RAMP) return (SPEED * t * t) / (2 * RAMP);
  return (SPEED * RAMP) / 2 + SPEED * (t - RAMP);
};

/** First frame at which slot i's center reaches the "now" marker. */
const crossFrame = (i: number) => {
  const need = SLOT_X0 + i * SLOT_GAP - MARKER_X;
  if (need <= 0) return null;
  for (let f = 0; f < 2000; f++) if (trackScroll(f) >= need) return f;
  return null;
};

export const Scene2FollowThrough: React.FC = () => {
  const frame = useCurrentFrame();
  const scroll = trackScroll(frame);
  const geo: TrackGeometry = {y: 700, amplitude: 16, wavelength: 960, scroll: scroll * 0.6};

  const trackDraw = progress(frame, 26, 70);

  const cards = CARE_ITEMS.map((item, i) => {
    const from = chaosPose(i, S1_END);
    // shared-element morph: chaos pose → aligned slot, 5-frame stagger
    const m = progress(frame, 14 + i * 5, 54, EASE_OUT);
    const sx = SLOT_X0 + i * SLOT_GAP - scroll;
    const x = lerp(from.x, sx, m);
    const y = lerp(from.y, ROW_Y, m) - Math.sin(m * Math.PI) * 30;
    const rot = lerp(from.rot, 0, m);
    const scale = lerp(from.scale, SLOT_SCALE, m);
    const blur = lerp(from.blur, 0, m);
    const opacity = lerp(from.opacity, 1, m);

    // resolve: already-behind slots get handled right after landing, others as they pass "now"
    const cf = crossFrame(i);
    const resolveAt = cf === null ? 92 + i * 14 : Math.max(cf, 92);
    const resolved = progress(frame, resolveAt, 26);
    return {item, i, x, y, rot, scale, blur, opacity, m, resolved, z: from.z};
  });

  const lockIn = progress(frame, 10, 44);
  const lockWord = progress(frame, 26, 34);
  const stemsOpacity = progress(frame, 70, 30);

  // a calm teal sweep washes away the amber at the hand-off
  const sweep = progress(frame, 0, 48, EASE_IN_OUT);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(100deg, transparent ${sweep * 120 - 30}%, ${hexA(COLORS.teal, 0.07)} ${sweep * 120 - 10}%, transparent ${sweep * 120 + 10}%)`,
          opacity: 1 - progress(frame, 40, 20),
        }}
      />

      <ContinuityTrack
        {...geo}
        draw={trackDraw}
        markerX={MARKER_X}
        nodes={cards.map((c) => ({x: c.x, done: c.resolved * stemsOpacity}))}
      />

      {/* stems connecting each card to its node on the line */}
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        {cards.map((c) => {
          const y0 = c.y + (CARD_H / 2) * c.scale;
          const y1 = trackY(c.x, geo) - 11;
          return (
            <line
              key={c.i}
              x1={c.x}
              x2={c.x}
              y1={y0}
              y2={lerp(y0, y1, stemsOpacity)}
              stroke={c.resolved > 0.5 ? COLORS.teal : hexA(COLORS.tealBlue, 0.9)}
              strokeWidth={2}
              opacity={stemsOpacity * c.m}
            />
          );
        })}
      </svg>

      {[...cards]
        .sort((a, b) => (a.m < 0.5 ? a.z - b.z : 0))
        .map((c) => (
          <div
            key={c.i}
            style={{
              position: 'absolute',
              left: c.x - CARD_W / 2,
              top: c.y - CARD_H / 2,
              opacity: c.opacity,
              transform: `rotate(${c.rot}deg) scale(${c.scale})`,
              filter: c.blur > 0.05 ? `blur(${c.blur}px)` : undefined,
            }}
          >
            <StatusCard
              {...c.item}
              width={CARD_W}
              resolved={c.resolved}
              alert={1 - c.m}
              phase={c.i * 11}
            />
          </div>
        ))}

      {/* brand lockup + headline beats */}
      <div style={{position: 'absolute', left: SAFE.x, top: SAFE.top, opacity: lockIn}}>
        <SanchoMark size={52} draw={lockIn} word={lockWord} />
      </div>
      <div style={{position: 'absolute', left: SAFE.x, top: 222}}>
        <FadeSlideText
          text={'Sancho stays on top of *ongoing care*\nand follow-through.'}
          start={40}
          exitAt={222}
          fontSize={62}
        />
      </div>
      <div style={{position: 'absolute', left: SAFE.x, top: 222}}>
        <FadeSlideText
          text={"So you don't have to manage\nevery detail *alone*."}
          start={238}
          exitAt={402}
          fontSize={62}
        />
      </div>
    </AbsoluteFill>
  );
};

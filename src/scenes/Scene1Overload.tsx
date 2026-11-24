import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FadeSlideText} from '../primitives/FadeSlideText';
import {StatusCard} from '../primitives/StatusCard';
import {COLORS, EASE_IN_OUT, SAFE, hexA, progress} from '../theme/theme';
import {FONT_UI} from '../theme/fonts';
import {ALERT_AT, CARD_W, CARE_ITEMS, chaosPose} from './careItems';

/** Abroad ↔ home time-zone cue: two clocks joined by a dashed arc with a travelling pulse. */
const TimeZoneCue: React.FC<{start: number; exitAt: number}> = ({start, exitAt}) => {
  const frame = useCurrentFrame();
  const inP = progress(frame, start, 30);
  const exit = progress(frame, exitAt, 18, EASE_IN_OUT);
  const arcP = progress(frame, start + 12, 40);
  const mins = Math.floor(frame / 24); // clocks keep ticking
  const fmt = (h: number, m: number, ap: string) =>
    `${h}:${String((m + mins) % 60).padStart(2, '0')} ${ap}`;

  const clock = (label: string, time: string, tone: string, delay: number) => {
    const p = progress(frame, start + delay, 26);
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '10px 18px',
          borderRadius: 999,
          background: hexA(COLORS.card, 0.85),
          border: `1.5px solid ${hexA(COLORS.gray, 0.18)}`,
          opacity: p,
          transform: `translateY(${(1 - p) * 14}px)`,
          fontFamily: FONT_UI,
        }}
      >
        <div style={{width: 10, height: 10, borderRadius: 5, background: tone, boxShadow: `0 0 10px ${tone}`}} />
        <span style={{color: COLORS.gray, fontSize: 19, fontWeight: 500}}>{label}</span>
        <span style={{color: COLORS.white, fontSize: 19, fontWeight: 600, fontVariantNumeric: 'tabular-nums'}}>{time}</span>
      </div>
    );
  };

  const arcLen = 200;
  const pulseT = (frame % 70) / 70;
  // quadratic arc between the two pills, sampled for the pulse position
  const P0 = [0, 62], P1 = [100, 0], P2 = [200, 62];
  const qp = (t: number) => [
    (1 - t) ** 2 * P0[0] + 2 * (1 - t) * t * P1[0] + t * t * P2[0],
    (1 - t) ** 2 * P0[1] + 2 * (1 - t) * t * P1[1] + t * t * P2[1],
  ];
  const [px, py] = qp(pulseT);

  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.x,
        top: SAFE.top,
        opacity: inP * (1 - exit),
        transform: `translateY(${-exit * 14}px)`,
        filter: exit > 0 ? `blur(${exit * 6}px)` : undefined,
      }}
    >
      <svg width={arcLen + 40} height={90} style={{position: 'absolute', left: 284, top: -40, overflow: 'visible'}}>
        <path
          d={`M${P0[0]} ${P0[1]} Q${P1[0]} ${P1[1]} ${P2[0]} ${P2[1]}`}
          fill="none"
          stroke={hexA(COLORS.gray, 0.45)}
          strokeWidth={2}
          strokeDasharray="3 9"
          strokeDashoffset={-frame * 0.6}
          style={{clipPath: `inset(0 ${(1 - arcP) * 100}% 0 0)`}}
        />
        <circle cx={px} cy={py} r={4.5} fill={COLORS.amber} opacity={arcP * Math.sin(pulseT * Math.PI)} />
      </svg>
      <div style={{display: 'flex', gap: 220, alignItems: 'center'}}>
        {clock('You, abroad', fmt(11, 40, 'PM'), COLORS.gray, 0)}
        {clock('Mom & Dad', fmt(10, 25, 'AM'), COLORS.amber, 6)}
      </div>
    </div>
  );
};

export const Scene1Overload: React.FC = () => {
  const frame = useCurrentFrame();

  const order = CARE_ITEMS.map((_, i) => i).sort((a, b) => chaosPose(a, frame).z - chaosPose(b, frame).z);

  return (
    <AbsoluteFill>
      <TimeZoneCue start={8} exitAt={322} />

      {/* scattered, overlapping care details — depth-layered, drifting, pulsing amber */}
      {order.map((i) => {
        const p = chaosPose(i, frame);
        const alertStart = ALERT_AT[i];
        const alert = alertStart === null ? 0 : progress(frame, alertStart, 20);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: p.x - CARD_W / 2,
              top: p.y - 44,
              opacity: p.opacity,
              transform: `rotate(${p.rot}deg) scale(${p.scale})`,
              filter: p.blur > 0.05 ? `blur(${p.blur}px)` : undefined,
            }}
          >
            <StatusCard {...CARE_ITEMS[i]} width={CARD_W} alert={alert} phase={i * 11} />
          </div>
        );
      })}

      <div style={{position: 'absolute', left: SAFE.x, top: 330}}>
        <FadeSlideText
          text={'Caring for aging parents\nfrom abroad means holding\n*too many details* at once.'}
          accent={COLORS.amber}
          start={118}
          exitAt={326}
          fontSize={60}
          maxWidth={860}
        />
      </div>
    </AbsoluteFill>
  );
};

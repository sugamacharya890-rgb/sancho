import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FadeSlideText} from '../primitives/FadeSlideText';
import {Icon, IconName} from '../primitives/Icons';
import {SanchoMark} from '../primitives/SanchoMark';
import {COLORS, EASE_IN_OUT, WIDTH, hexA, lerp, progress} from '../theme/theme';
import {FONT_DISPLAY, FONT_UI} from '../theme/fonts';

export type OutroProps = {
  /** Call-to-action label on the pill. */
  ctaLabel?: string;
  /** Line under the CTA — swap for the real store availability or URL. */
  ctaSub?: string;
};

const MOVE_AT = 112; // lockup glides left, phone arrives
const BLOCK_W = 900;
const BLOCK_CENTER_FINAL = 600;

const PHONE_ROWS: {icon: IconName; title: string; meta: string; next?: boolean}[] = [
  {icon: 'calendar', title: 'Cardiology visit', meta: 'Summary shared'},
  {icon: 'pill', title: 'Metformin refill', meta: 'Delivered'},
  {icon: 'flask', title: 'Blood test results', meta: 'Reviewed · stable'},
  {icon: 'heart', title: 'BP checks', meta: 'Back on schedule'},
  {icon: 'calendar', title: 'Follow-up blood test', meta: 'Mon 9:00 · ride arranged', next: true},
];

/** Clean app glimpse — outcome-first, light "clinical off-white" screen. */
const PhoneMockup: React.FC = () => {
  const frame = useCurrentFrame();
  const p = progress(frame, MOVE_AT + 10, 40);
  const float = Math.sin(frame / 34) * 5;
  const tilt = Math.sin(frame / 60) * 0.6;
  return (
    <div
      style={{
        position: 'absolute',
        left: 1215,
        top: 150,
        width: 380,
        height: 680,
        borderRadius: 54,
        padding: 12,
        boxSizing: 'border-box',
        background: 'linear-gradient(160deg, #22344A, #0A1520)',
        border: `1.5px solid ${hexA(COLORS.gray, 0.25)}`,
        boxShadow: `0 40px 90px ${hexA('#02070D', 0.6)}, 0 0 80px ${hexA(COLORS.teal, 0.14)}`,
        opacity: p,
        transform: `translateY(${(1 - p) * 140 + float}px) rotate(${tilt}deg) scale(${0.92 + 0.08 * p})`,
        filter: p < 1 ? `blur(${(1 - p) * 14}px)` : undefined,
        fontFamily: FONT_UI,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 43,
          background: COLORS.offWhite,
          overflow: 'hidden',
          padding: '26px 22px',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        <div style={{width: 92, height: 24, borderRadius: 12, background: '#0A1520', margin: '-12px auto 18px'}} />
        <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
          <SanchoMark size={30} showWord={false} />
          <div style={{fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 24, color: COLORS.slate, letterSpacing: '-0.02em'}}>
            Mom&apos;s care
          </div>
        </div>
        <div
          style={{
            marginTop: 14,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '7px 13px',
            borderRadius: 999,
            background: hexA(COLORS.teal, 0.16),
            color: COLORS.tealBlue,
            fontWeight: 600,
            fontSize: 15,
          }}
        >
          <div style={{width: 8, height: 8, borderRadius: 4, background: COLORS.teal}} />
          Everything on track
        </div>
        <div style={{marginTop: 18, position: 'relative'}}>
          {/* vertical continuity line */}
          <div
            style={{
              position: 'absolute',
              left: 19,
              top: 22,
              width: 2.5,
              height: `${progress(frame, MOVE_AT + 30, 70, EASE_IN_OUT) * 82}%`,
              background: `linear-gradient(${COLORS.teal}, ${COLORS.tealBlue})`,
              borderRadius: 2,
            }}
          />
          {PHONE_ROWS.map((r, i) => {
            const rp = progress(frame, MOVE_AT + 30 + i * 6, 24);
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '11px 0',
                  opacity: rp,
                  transform: `translateY(${(1 - rp) * 14}px)`,
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    flexShrink: 0,
                    background: r.next ? COLORS.white : COLORS.teal,
                    border: r.next ? `2.5px solid ${COLORS.teal}` : undefined,
                    boxSizing: 'border-box',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: r.next ? `0 0 0 ${4 + Math.sin(frame / 8) * 3}px ${hexA(COLORS.teal, 0.18)}` : undefined,
                  }}
                >
                  {r.next ? (
                    <Icon name={r.icon} size={19} color={COLORS.tealBlue} strokeWidth={2.2} />
                  ) : (
                    <Icon name="check" size={20} color={COLORS.white} strokeWidth={2.8} />
                  )}
                </div>
                <div style={{minWidth: 0}}>
                  <div style={{color: COLORS.slate, fontSize: 17.5, fontWeight: 600}}>{r.title}</div>
                  <div style={{color: r.next ? COLORS.tealBlue : '#64748B', fontSize: 14.5, marginTop: 2, fontWeight: r.next ? 600 : 400}}>
                    {r.next ? `Next · ${r.meta}` : r.meta}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* latest update — the "visibility without chasing" payoff inside the app */}
        <div
          style={{
            marginTop: 14,
            padding: '14px 16px',
            borderRadius: 18,
            background: COLORS.white,
            border: `1.5px solid ${hexA(COLORS.teal, 0.35)}`,
            boxShadow: `0 10px 24px ${hexA(COLORS.slate, 0.08)}`,
            opacity: progress(frame, MOVE_AT + 70, 26),
            transform: `translateY(${(1 - progress(frame, MOVE_AT + 70, 26)) * 18}px)`,
          }}
        >
          <div style={{color: COLORS.tealBlue, fontSize: 12.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase'}}>
            Latest update · just now
          </div>
          <div style={{color: COLORS.slate, fontSize: 16, fontWeight: 600, marginTop: 5, lineHeight: 1.35}}>
            Visit summary shared: BP stable, dose updated to 5 mg.
          </div>
        </div>
      </div>
    </div>
  );
};

export const Scene4Outro: React.FC<OutroProps> = ({
  ctaLabel = 'Download the Sancho app',
  ctaSub = 'Care that keeps moving — wherever you are.',
}) => {
  const frame = useCurrentFrame();
  const enter = progress(frame, 0, 24);
  const ring = progress(frame, 6, 50);
  const word = progress(frame, 22, 34);
  const move = progress(frame, MOVE_AT, 44, EASE_IN_OUT);
  const blockLeft = lerp((WIDTH - BLOCK_W) / 2, BLOCK_CENTER_FINAL - BLOCK_W / 2, move);
  const cta = progress(frame, MOVE_AT + 40, 30);
  const glowBreath = 1 + Math.sin(frame / 30) * 0.05;
  const glowX = lerp(960, BLOCK_CENTER_FINAL, move);

  return (
    <AbsoluteFill style={{opacity: enter}}>
      {/* soft ambient teal glow + slow concentric rings behind the lockup */}
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <defs>
          <radialGradient id="outroGlow">
            <stop offset="0%" stopColor={COLORS.teal} stopOpacity={0.24} />
            <stop offset="100%" stopColor={COLORS.teal} stopOpacity={0} />
          </radialGradient>
        </defs>
        <ellipse cx={glowX} cy={440} rx={620 * glowBreath} ry={460 * glowBreath} fill="url(#outroGlow)" />
        {[0, 1, 2].map((k) => {
          const t = ((frame + k * 50) % 150) / 150;
          return (
            <circle
              key={k}
              cx={glowX}
              cy={420}
              r={110 + t * 330}
              fill="none"
              stroke={COLORS.teal}
              strokeWidth={1.5}
              opacity={(1 - t) * 0.22 * ring}
            />
          );
        })}
      </svg>

      <div
        style={{
          position: 'absolute',
          left: blockLeft,
          top: 300,
          width: BLOCK_W,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: `translateY(${-move * 40}px) scale(${1 - move * 0.12})`,
        }}
      >
        <SanchoMark size={112} draw={ring} word={word} wordSize={104} gap={30} />
        <div style={{marginTop: 46}}>
          <FadeSlideText
            text={'Dependable care follow-through.\n*Peace of mind* from afar.'}
            start={40}
            fontSize={50}
            align="center"
            lineHeight={1.25}
          />
        </div>
        <div
          style={{
            marginTop: 48,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
            opacity: cta,
            transform: `translateY(${(1 - cta) * 22}px)`,
            filter: cta < 1 ? `blur(${(1 - cta) * 6}px)` : undefined,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '20px 36px',
              borderRadius: 999,
              background: COLORS.teal,
              color: COLORS.slate,
              fontFamily: FONT_DISPLAY,
              fontWeight: 700,
              fontSize: 30,
              boxShadow: `0 0 ${30 + Math.sin(frame / 14) * 12}px ${hexA(COLORS.teal, 0.45)}`,
            }}
          >
            {ctaLabel}
            <div style={{transform: `translateX(${Math.sin(frame / 10) * 3}px)`}}>
              <Icon name="arrow" size={28} color={COLORS.slate} strokeWidth={2.6} />
            </div>
          </div>
          <div style={{fontFamily: FONT_UI, color: COLORS.gray, fontSize: 22, fontWeight: 500}}>{ctaSub}</div>
        </div>
      </div>

      <PhoneMockup />
    </AbsoluteFill>
  );
};

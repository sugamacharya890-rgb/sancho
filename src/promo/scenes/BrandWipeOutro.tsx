import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {AuraGlow} from '../primitives/AuraGlow';
import {KineticText} from '../primitives/KineticText';
import {SanchoLogo} from '../primitives/SanchoLogo';
import {C, EASE, EASE_IO, ease, pop, rgba} from '../theme';
import {FONT_DISPLAY, FONT_UI} from '../../theme/fonts';

const WIPE = 14;
const CIRCLE_AT = 60;
export const OUTRO_LOGO_AT = 75;

export type OutroProps = {
  /** Small CTA under the lockup — set to the real store line / URL. */
  cta?: string;
};

export const BrandWipeOutro: React.FC<OutroProps> = ({cta = 'Download the Sancho app'}) => {
  const frame = useCurrentFrame();
  const wipe = ease(frame, 0, WIPE, EASE_IO);
  const lead = ease(frame, -3, WIPE, EASE_IO);
  const circle = ease(frame, CIRCLE_AT, 22, EASE);
  const pill = pop(frame, 24, 30, 200, 15);
  const tealOut = ease(frame, CIRCLE_AT - 4, 18, EASE_IO);
  const tag = ease(frame, OUTRO_LOGO_AT + 12, 18);
  const ctaP = pop(frame, OUTRO_LOGO_AT + 20, 30, 190, 16);

  // diagonal geometric wipe: a light leading band, then the full teal field
  const poly = (p: number) => {
    const x = -40 + p * 185; // percent — fully covers the bottom-right corner at p=1
    return `polygon(-40% 0%, ${x}% 0%, ${x - 30}% 100%, -40% 100%)`;
  };

  return (
    <AbsoluteFill>
      {/* full-bleed teal brand field  */}
      <AbsoluteFill
        style={{
          clipPath: poly(wipe),
          background: `linear-gradient(135deg, ${C.tealDeep} 0%, ${C.teal} 100%)`,
        }}
      >
        {/* slow diagonal light sheen so the brand field is never static */}
        <AbsoluteFill
          style={{
            background: `linear-gradient(115deg, transparent ${frame * 1.6 - 40}%, rgba(255,255,255,0.16) ${frame * 1.6 - 20}%, transparent ${frame * 1.6}%)`,
          }}
        />
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 1 - tealOut,
            transform: `translateY(${Math.sin(frame / 14) * 5}px) scale(${1 + frame * 0.0012})`,
          }}
        >
          <KineticText text="Stay on top of care." start={8} size={120} color={C.white} accent={C.white} />
          <div
            style={{
              marginTop: 40,
              padding: '22px 44px',
              borderRadius: 99,
              background: C.white,
              color: C.tealDeep,
              fontFamily: FONT_DISPLAY,
              fontWeight: 800,
              fontSize: 44,
              letterSpacing: '-0.02em',
              opacity: Math.min(1, pill * 1.4),
              transform: `scale(${(0.6 + 0.4 * pill) * (1 + Math.sin(frame / 6) * 0.015)})`,
              boxShadow: `0 20px 50px ${rgba('#063B44', 0.3)}`,
            }}
          >
            Peace of mind from afar
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
      {/* leading light band of the geometric wipe */}
      <AbsoluteFill style={{clipPath: poly(lead), background: rgba(C.teal, 0.35), opacity: 1 - wipe}} />
      {/* white canvas + lockup, expanding white circle cut-out on top of the teal field */}
      <AbsoluteFill style={{clipPath: `circle(${circle * 75}% at 50% 50%)`}}>
        <AuraGlow
          blobs={[
            {x: 960, y: 520, r: 460, color: C.teal, alpha: 0.34},
            {x: 640, y: 700, r: 280, color: C.tealDeep, alpha: 0.12},
            {x: 1300, y: 380, r: 260, color: C.teal, alpha: 0.18},
          ]}
        />
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `translateY(-30px) scale(${1 + Math.max(0, frame - OUTRO_LOGO_AT) * 0.0006})`}}>
            {frame >= OUTRO_LOGO_AT - 1 && <SanchoLogo start={OUTRO_LOGO_AT} size={176} />}
            <div
              style={{
                marginTop: 40,
                fontFamily: FONT_DISPLAY,
                fontWeight: 600,
                fontSize: 40,
                letterSpacing: '-0.02em',
                color: C.muted,
                opacity: tag,
                transform: `translateY(${(1 - tag) * 20}px)`,
              }}
            >
              Dependable care follow-through.
            </div>
            <div
              style={{
                marginTop: 34,
                padding: '16px 30px',
                borderRadius: 99,
                background: C.ink,
                color: C.white,
                fontFamily: FONT_UI,
                fontWeight: 700,
                fontSize: 26,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                opacity: Math.min(1, ctaP * 1.4),
                transform: `translateY(${(1 - ctaP) * 24}px) scale(${0.9 + 0.1 * ctaP})`,
                boxShadow: `0 14px 34px ${rgba(C.ink, 0.2)}`,
              }}
            >
              {cta}
              <svg width={24} height={24} viewBox="0 0 24 24" style={{transform: `translateX(${Math.sin(frame / 8) * 3}px)`}}>
                <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke={C.teal} strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

    </AbsoluteFill>
  );
};

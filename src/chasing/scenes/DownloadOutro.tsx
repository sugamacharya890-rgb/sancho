import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {AuraGlow} from '../../promo/primitives/AuraGlow';
import {SanchoLogo} from '../../promo/primitives/SanchoLogo';
import {C, EASE, EASE_IO, ease, pop, rgba} from '../../promo/theme';
import {FONT_DISPLAY, FONT_UI} from '../../theme/fonts';
import {useLayout} from '../layout';

const PILL_AT = 12;
const CIRCLE_AT = 75; // 0:21 — global 630, on the beat
const LOGO_AT = 90; // global 645 = 21.5s
const CTA_AT = 105; // global 660 = 22.0s

export type DownloadOutroProps = {
  ctaLabel?: string;
  tagline?: string;
};

export const DownloadOutro: React.FC<DownloadOutroProps> = ({
  ctaLabel = 'Download Now',
  tagline = 'Stay informed with calm confidence.',
}) => {
  const frame = useCurrentFrame();
  const {W, H, pick} = useLayout();
  const wipe = ease(frame, 0, 14, EASE_IO);
  const lead = ease(frame, -3, 14, EASE_IO);
  const pill = pop(frame, PILL_AT, 30, 200, 15);
  const tealOut = ease(frame, CIRCLE_AT - 4, 16, EASE_IO);
  const circle = ease(frame, CIRCLE_AT, 22, EASE);
  const tag = ease(frame, LOGO_AT + 10, 18);
  const cta = pop(frame, CTA_AT, 30, 190, 14);
  const poly = (p: number) => {
    const x = -40 + p * 185;
    return `polygon(-40% 0%, ${x}% 0%, ${x - 30}% 100%, -40% 100%)`;
  };

  return (
    <AbsoluteFill>
      {/* full-bleed teal brand field */}
      <AbsoluteFill style={{clipPath: poly(wipe), background: `linear-gradient(135deg, ${C.tealDeep} 0%, ${C.teal} 100%)`}}>
        <AbsoluteFill
          style={{
            background: `linear-gradient(115deg, transparent ${frame * 1.6 - 40}%, rgba(255,255,255,0.16) ${frame * 1.6 - 20}%, transparent ${frame * 1.6}%)`,
          }}
        />
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: 1 - tealOut}}>
          <div
            style={{
              padding: pick('30px 60px', '28px 48px'),
              borderRadius: 99,
              background: C.white,
              color: C.tealDeep,
              fontFamily: FONT_DISPLAY,
              fontWeight: 800,
              fontSize: pick(76, 62),
              letterSpacing: '-0.035em',
              whiteSpace: 'nowrap',
              opacity: Math.min(1, pill * 1.4),
              transform: `scale(${(0.6 + 0.4 * pill) * (1 + Math.sin(frame / 7) * 0.012)}) translateY(${Math.sin(frame / 14) * 4}px)`,
              boxShadow: `0 26px 60px ${rgba('#063B44', 0.3)}`,
            }}
          >
            Calm care from anywhere.
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
      <AbsoluteFill style={{clipPath: poly(lead), background: rgba(C.teal, 0.35), opacity: 1 - wipe}} />

      {/* expanding white circle → centered lockup + Download Now */}
      <AbsoluteFill style={{clipPath: `circle(${circle * 75}% at 50% 50%)`}}>
        <AuraGlow
          blobs={[
            {x: W / 2, y: H / 2 - 40, r: 470, color: C.teal, alpha: 0.34},
            {x: pick(640, 280), y: pick(720, 1250), r: 280, color: C.tealDeep, alpha: 0.12},
            {x: pick(1300, 820), y: pick(380, 650), r: 260, color: C.teal, alpha: 0.18},
          ]}
        />
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transform: `translateY(-20px) scale(${1 + Math.max(0, frame - LOGO_AT) * 0.0005})`,
            }}
          >
            {frame >= LOGO_AT - 1 && <SanchoLogo start={LOGO_AT} size={176} />}
            <div
              style={{
                marginTop: 38,
                fontFamily: FONT_DISPLAY,
                fontWeight: 600,
                fontSize: 40,
                letterSpacing: '-0.02em',
                color: C.muted,
                opacity: tag,
                transform: `translateY(${(1 - tag) * 20}px)`,
              }}
            >
              {tagline}
            </div>
            <div
              style={{
                marginTop: 40,
                padding: '22px 44px 22px 36px',
                borderRadius: 99,
                background: C.ink,
                color: C.white,
                fontFamily: FONT_UI,
                fontWeight: 700,
                fontSize: 34,
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                opacity: Math.min(1, cta * 1.4),
                transform: `translateY(${(1 - cta) * 30}px) scale(${(0.85 + 0.15 * cta) * (1 + Math.sin(frame / 9) * 0.01)})`,
                boxShadow: `0 18px 44px ${rgba(C.ink, 0.22)}, 0 0 ${24 + Math.sin(frame / 10) * 10}px ${rgba(C.teal, 0.35)}`,
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 23,
                  background: C.teal,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width={26} height={26} viewBox="0 0 24 24" style={{transform: `translateY(${Math.sin(frame / 7) * 2}px)`}}>
                  <path d="M12 4v12M6.5 11l5.5 5.5 5.5-5.5M5 20h14" fill="none" stroke={C.white} strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              {ctaLabel}
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

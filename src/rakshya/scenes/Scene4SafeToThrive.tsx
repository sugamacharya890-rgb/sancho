import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {SANS} from '../fonts';
import {ArrowIcon} from '../primitives/Icons';
import {RakshyaLockup} from '../primitives/RakshyaLockup';
import {SerifReveal} from '../primitives/SerifReveal';
import {C, SAFE, ease, mix, rgba} from '../theme';

const LOCKUP_AT = 70;
const CTA_AT = 92;
const NOTE_AT = 112;

export type Scene4Props = {
  url?: string;
  ctaLabel?: string;
  note?: string;
};

/** 0:18–0:24 — Every woman. Every child. Safe to thrive. + lockup & CTA. */
export const Scene4SafeToThrive: React.FC<Scene4Props> = ({
  url = 'rakshyanp.com',
  ctaLabel = 'Explore Rakshya',
  note = 'Tap to visit & share anonymously.',
}) => {
  const frame = useCurrentFrame();
  const enter = ease(frame, 0, 24);
  const rule = ease(frame, LOCKUP_AT - 12, 34);
  const lockup = ease(frame, LOCKUP_AT, 30);
  const cta = ease(frame, CTA_AT, 30);
  const noteP = ease(frame, NOTE_AT, 26);
  // slow breathing + a single soft sheen across the button
  const breathe = 1 + Math.sin(Math.max(0, frame - CTA_AT - 30) / 16) * 0.008;
  const sheen = mix(-40, 140, ease(frame, CTA_AT + 26, 40));

  return (
    <AbsoluteFill
      style={{
        padding: `${SAFE.top + 90}px ${SAFE.left}px 0`,
        alignItems: 'center',
        opacity: enter,
      }}
    >
      <SerifReveal
        start={4}
        stagger={7}
        wordDur={28}
        fontSize={132}
        lineHeight={1.04}
        align="center"
        segments={[{text: 'Every woman.'}, {br: true}, {text: 'Every child.'}, {br: true}, {text: 'Safe to thrive.', italic: true, accent: true}]}
      />

      <div style={{width: 520 * rule, height: 1.5, background: C.hairline, marginTop: 70, marginBottom: 70}} />

      <div style={{opacity: lockup, transform: `translateY(${mix(24, 0, lockup)}px)`}}>
        <RakshyaLockup size={104} />
      </div>

      <div
        style={{
          marginTop: 72,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          padding: '30px 50px',
          borderRadius: 999,
          background: C.crimson,
          color: C.white,
          fontFamily: SANS,
          fontSize: 36,
          whiteSpace: 'nowrap',
          opacity: cta,
          transform: `translateY(${mix(30, 0, cta)}px) scale(${mix(0.94, 1, cta) * breathe})`,
          boxShadow: `0 22px 50px ${rgba(C.crimson, 0.3 * cta)}`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(105deg, transparent ${sheen - 20}%, ${rgba(C.white, 0.22)} ${sheen}%, transparent ${sheen + 20}%)`,
          }}
        />
        <span style={{position: 'relative', fontWeight: 600}}>{ctaLabel}</span>
        <span style={{position: 'relative', opacity: 0.55}}>·</span>
        <span style={{position: 'relative', fontWeight: 500}}>{url}</span>
        <span style={{position: 'relative', display: 'flex', transform: `translateX(${mix(-8, 0, cta)}px)`}}>
          <ArrowIcon size={34} color={C.white} />
        </span>
      </div>

      <p
        style={{
          margin: '30px 0 0',
          fontFamily: SANS,
          fontSize: 28,
          color: C.inkSoft,
          opacity: noteP,
          transform: `translateY(${mix(12, 0, noteP)}px)`,
        }}
      >
        {note}
      </p>
    </AbsoluteFill>
  );
};

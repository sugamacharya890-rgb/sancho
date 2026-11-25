import React from 'react';
import {useCurrentFrame} from 'remotion';
import {SANS} from '../../fonts';
import {ArrowIcon} from '../../primitives/Icons';
import {Pill} from '../../primitives/Pill';
import {RakshyaLockup} from '../../primitives/RakshyaLockup';
import {SceneShell} from '../../primitives/SceneShell';
import {SerifReveal} from '../../primitives/SerifReveal';
import {C, ease, mix, rgba} from '../../theme';
import {sp} from '../../reel02/timeline';
import {R3} from '../timeline';

export type Scene4SeeWhatsComingProps = {url?: string; handle?: string};

/** 0:18–0:24 — Rakshya lockup + "See what's coming at rakshyanp.com". */
export const Scene4SeeWhatsComing: React.FC<Scene4SeeWhatsComingProps> = ({url = 'rakshyanp.com', handle = '@rakshya'}) => {
  const frame = useCurrentFrame();
  const lock = sp(frame, 0, 34);
  const cta = sp(frame, 50, 28);
  const sheen = mix(-40, 140, ease(frame, 80, 40));
  const breathe = 1 + Math.sin(Math.max(0, frame - 80) / 15) * 0.008;

  return (
    <SceneShell duration={R3.close.duration + 40} align="center">
      <div style={{opacity: lock, transform: `translateY(${mix(26, 0, lock)}px) scale(${mix(0.96, 1, lock)})`}}>
        <RakshyaLockup size={112} />
      </div>
      <div style={{width: 460 * ease(frame, 10, 30), height: 1.5, background: C.hairline, margin: '64px 0 56px'}} />
      <SerifReveal
        start={14}
        stagger={6}
        wordDur={26}
        fontSize={132}
        lineHeight={1.0}
        align="center"
        segments={[{text: 'See what’s'}, {br: true}, {text: 'coming.', italic: true, accent: true}]}
      />
      <div
        style={{
          marginTop: 64,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '30px 52px',
          borderRadius: 999,
          background: C.crimson,
          color: C.white,
          fontFamily: SANS,
          fontSize: 38,
          whiteSpace: 'nowrap',
          opacity: cta,
          transform: `translateY(${mix(26, 0, cta)}px) scale(${mix(0.94, 1, cta) * breathe})`,
          boxShadow: `0 22px 50px ${rgba(C.crimson, 0.3 * cta)}`,
        }}
      >
        <div style={{position: 'absolute', inset: 0, background: `linear-gradient(105deg, transparent ${sheen - 20}%, ${rgba(C.white, 0.22)} ${sheen}%, transparent ${sheen + 20}%)`}} />
        <span style={{position: 'relative', fontWeight: 500}}>Visit</span>
        <span style={{position: 'relative', fontWeight: 600}}>{url}</span>
        <span style={{position: 'relative', display: 'flex'}}>
          <ArrowIcon size={36} color={C.white} />
        </span>
      </div>
      <div style={{display: 'flex', gap: 12, marginTop: 34}}>
        {['Updates', 'Resources', 'Support'].map((t, i) => {
          const p = sp(frame, 70 + i * 7, 22);
          return (
            <div key={t} style={{opacity: p, transform: `translateY(${mix(14, 0, p)}px)`}}>
              <Pill tone="outline" style={{fontSize: 21, padding: '12px 22px'}}>
                {t}
              </Pill>
            </div>
          );
        })}
      </div>
      <p style={{margin: '34px 0 0', fontFamily: SANS, fontSize: 30, color: C.inkSoft, opacity: ease(frame, 96, 24)}}>
        Follow <span style={{color: C.crimson, fontWeight: 600}}>{handle}</span> &amp; visit the site.
      </p>
    </SceneShell>
  );
};

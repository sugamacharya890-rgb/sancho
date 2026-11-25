import React from 'react';
import {useCurrentFrame} from 'remotion';
import {SANS} from '../../fonts';
import {Card} from '../../primitives/Card';
import {ArrowIcon, BookmarkIcon, SendIcon} from '../../primitives/Icons';
import {RakshyaLockup} from '../../primitives/RakshyaLockup';
import {SerifReveal} from '../../primitives/SerifReveal';
import {C, ease, mix, rgba} from '../../theme';
import {R2, sp} from '../timeline';
import {SceneShell} from '../../primitives/SceneShell';

export type Scene4HelpInOnePlaceProps = {url?: string; shareNote?: string};

/** 0:19–0:24 — "Help & community in one place." + visit rakshyanp.com, save or share. */
export const Scene4HelpInOnePlace: React.FC<Scene4HelpInOnePlaceProps> = ({
  url = 'rakshyanp.com',
  shareNote = 'Share it with someone who might need it.',
}) => {
  const frame = useCurrentFrame();
  const card = sp(frame, 2, 34);
  const cta = sp(frame, 56, 28);
  const sheen = mix(-40, 140, ease(frame, 84, 40));
  const breathe = 1 + Math.sin(Math.max(0, frame - 84) / 15) * 0.008;

  return (
    <SceneShell duration={R2.close.duration + 40} align="center">
      <Card p={card} style={{width: '100%', padding: '64px 56px 60px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{opacity: ease(frame, 8, 26)}}>
          <RakshyaLockup size={96} />
        </div>
        <div style={{width: 420 * ease(frame, 16, 30), height: 1.5, background: C.hairline, margin: '50px 0 44px'}} />
        <SerifReveal
          start={18}
          stagger={6}
          wordDur={26}
          fontSize={112}
          lineHeight={1.02}
          align="center"
          segments={[{text: 'Help & community'}, {br: true}, {text: 'in one place.', italic: true, accent: true}]}
        />
        <div
          style={{
            marginTop: 54,
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '28px 48px',
            borderRadius: 999,
            background: C.crimson,
            color: C.white,
            fontFamily: SANS,
            fontSize: 36,
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
            <ArrowIcon size={34} color={C.white} />
          </span>
        </div>
      </Card>

      <div style={{display: 'flex', gap: 16, marginTop: 40}}>
        {[
          {Icon: BookmarkIcon, label: 'Save this Reel'},
          {Icon: SendIcon, label: 'Share it'},
        ].map(({Icon, label}, i) => {
          const p = sp(frame, 74 + i * 8, 24);
          return (
            <div
              key={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '18px 30px',
                borderRadius: 999,
                background: C.white,
                border: `1.5px solid ${C.hairline}`,
                fontFamily: SANS,
                fontWeight: 600,
                fontSize: 28,
                color: C.ink,
                opacity: p,
                transform: `translateY(${mix(18, 0, p)}px)`,
              }}
            >
              <Icon size={30} /> {label}
            </div>
          );
        })}
      </div>
      <p style={{margin: '24px 0 0', fontFamily: SANS, fontSize: 28, color: C.inkSoft, opacity: ease(frame, 94, 24)}}>{shareNote}</p>
    </SceneShell>
  );
};

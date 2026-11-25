import React from 'react';
import {useCurrentFrame} from 'remotion';
import {SANS, SERIF} from '../../fonts';
import {Card} from '../../primitives/Card';
import {ClipIcon, CompassIcon, PeopleIcon, SoundIcon} from '../../primitives/Icons';
import {Dot, Pill} from '../../primitives/Pill';
import {SceneShell} from '../../primitives/SceneShell';
import {SerifReveal} from '../../primitives/SerifReveal';
import {C, EASE_IO, ease, mix, rgba} from '../../theme';
import {sp} from '../../reel02/timeline';
import {CUES3, R3} from '../timeline';

/** What the tools are being designed to do — framed as design intent, not shipped features. */
export const STEPS = [
  {Icon: ClipIcon, title: 'Within reach', body: 'Clip it on and carry it — there when you need it.'},
  {Icon: SoundIcon, title: 'Immediate attention', body: 'Draw attention around you, fast.'},
  {Icon: PeopleIcon, title: 'Your trusted circle', body: 'Let the people you trust know.'},
  {Icon: CompassIcon, title: 'Move to safety', body: 'Clear guidance to get somewhere safe.'},
];

const ROW_H = 150;

/** 0:06–0:13 — four simple steps, clearly labelled as in development / coming soon. */
export const Scene2SimpleSteps: React.FC = () => {
  const frame = useCurrentFrame();
  const at = STEPS.map((_, i) => CUES3.steps[i] - R3.steps.from);
  // index of the active step, eased between steps for the sliding highlight
  const pos = at.reduce((acc, a, i) => (i === 0 ? ease(frame, a, 12, EASE_IO) - 1 : acc + ease(frame, a, 14, EASE_IO)), 0);
  const rail = ease(frame, at[0], at[3] - at[0] + 10, EASE_IO);
  const pulse = 0.55 + 0.45 * Math.sin(frame / 7);

  return (
    <SceneShell duration={R3.steps.duration}>
      <div style={{display: 'flex', gap: 14, opacity: ease(frame, 2, 22)}}>
        <Pill tone="solid">
          <Dot color={C.white} size={10} /> <span style={{opacity: mix(1, pulse, ease(frame, 30, 20))}}>Coming soon</span>
        </Pill>
        <Pill tone="outline">In development</Pill>
      </div>
      <SerifReveal
        start={8}
        stagger={6}
        wordDur={24}
        fontSize={118}
        lineHeight={1.0}
        style={{marginTop: 38}}
        segments={[{text: 'Simple steps.'}, {br: true}, {text: 'Real safety.', italic: true, accent: true}]}
      />
      <span style={{marginTop: 22, fontFamily: SANS, fontSize: 30, color: C.inkSoft, opacity: ease(frame, 26, 22)}}>How Rakshya’s tools are being designed to work:</span>

      <Card p={sp(frame, 36)} style={{marginTop: 34, padding: '20px 30px', position: 'relative'}}>
        {/* sliding highlight behind the active step */}
        <div
          style={{
            position: 'absolute',
            left: 14,
            right: 14,
            top: 20 + Math.max(0, pos) * ROW_H,
            height: ROW_H,
            borderRadius: 26,
            background: '#F5E4E6',
            opacity: ease(frame, at[0], 12),
          }}
        />
        {/* progress rail */}
        <div style={{position: 'absolute', left: 30 + 40, top: 20 + ROW_H / 2, width: 2, height: ROW_H * 3, background: C.hairline}} />
        <div style={{position: 'absolute', left: 30 + 40, top: 20 + ROW_H / 2, width: 2, height: ROW_H * 3 * rail, background: C.crimson}} />
        {STEPS.map(({Icon, title, body}, i) => {
          const on = ease(frame, at[i], 14);
          const active = Math.max(0, 1 - Math.abs(pos - i));
          return (
            <div key={title} style={{position: 'relative', height: ROW_H, display: 'flex', alignItems: 'center', gap: 30}}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: on > 0.5 ? C.crimson : C.white,
                  border: `2px solid ${on > 0.5 ? C.crimson : C.hairline}`,
                  fontFamily: SERIF,
                  fontSize: 38,
                  color: on > 0.5 ? C.white : C.inkMute,
                  transform: `scale(${1 + active * 0.06})`,
                  boxShadow: active > 0.5 ? `0 10px 24px ${rgba(C.crimson, 0.25)}` : 'none',
                }}
              >
                0{i + 1}
              </div>
              <div style={{flex: 1, opacity: mix(0.45, 1, on)}}>
                <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 34, color: C.ink, letterSpacing: '-0.01em'}}>{title}</div>
                <div style={{marginTop: 6, fontFamily: SANS, fontSize: 26, color: C.inkSoft, opacity: mix(0.6, 1, on)}}>{body}</div>
              </div>
              <div style={{opacity: mix(0.35, 1, on), transform: `translateX(${mix(10, 0, on)}px)`}}>
                <Icon size={44} color={on > 0.5 ? C.crimson : C.inkMute} />
              </div>
            </div>
          );
        })}
      </Card>
      <span style={{marginTop: 22, fontFamily: SANS, fontSize: 24, color: C.inkMute, opacity: ease(frame, at[3] + 8, 20)}}>
        Not for sale yet — follow along for launch updates.
      </span>
    </SceneShell>
  );
};

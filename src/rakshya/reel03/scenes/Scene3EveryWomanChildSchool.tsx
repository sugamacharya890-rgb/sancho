import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {SANS, SERIF} from '../../fonts';
import {Card} from '../../primitives/Card';
import {BookIcon, ChildIcon, ShieldIcon} from '../../primitives/Icons';
import {Pill} from '../../primitives/Pill';
import {SceneShell} from '../../primitives/SceneShell';
import {SerifReveal} from '../../primitives/SerifReveal';
import {C, EASE_IO, ease, mix, rgba} from '../../theme';
import {sp} from '../../reel02/timeline';
import {CUES3, R3} from '../timeline';

const PILLARS = [
  {Icon: ShieldIcon, label: 'Personal safety', who: 'For women'},
  {Icon: ChildIcon, label: 'Child protection', who: 'For children'},
  {Icon: BookIcon, label: 'Community education', who: 'For schools'},
];
const DISTRICTS = 77;
const COLS = 11;

/** 0:13–0:18 — every woman, every child, every school: the vision across all 77 districts. */
export const Scene3EveryWomanChildSchool: React.FC = () => {
  const frame = useCurrentFrame();
  const fillAt = CUES3.districts - R3.vision.from;
  const filled = interpolate(frame, [fillAt, fillAt + 38], [0, DISTRICTS], {easing: EASE_IO, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <SceneShell duration={R3.vision.duration}>
      <div style={{opacity: ease(frame, 2, 20)}}>
        <Pill>Our vision</Pill>
      </div>
      <SerifReveal
        start={4}
        stagger={4}
        wordDur={22}
        fontSize={112}
        lineHeight={1.0}
        style={{marginTop: 36}}
        segments={[{text: 'Every woman.'}, {br: true}, {text: 'Every child.'}, {br: true}, {text: 'Every school.', italic: true, accent: true}]}
      />
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 46}}>
        {PILLARS.map(({Icon, label, who}, i) => (
          <Card key={label} p={sp(frame, CUES3.pillars[i] - R3.vision.from, 24)} style={{padding: '26px 22px'}}>
            <Icon size={42} />
            <div style={{marginTop: 16, fontFamily: SANS, fontWeight: 600, fontSize: 20, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.crimson}}>{who}</div>
            <div style={{marginTop: 6, fontFamily: SERIF, fontSize: 38, lineHeight: 1.04, color: C.ink}}>{label}</div>
          </Card>
        ))}
      </div>
      <Card p={sp(frame, fillAt - 8, 24)} tint="blush" style={{marginTop: 20, padding: '30px 34px', display: 'flex', alignItems: 'center', gap: 34}}>
        <div style={{display: 'grid', gridTemplateColumns: `repeat(${COLS}, 26px)`, gap: 12, flexShrink: 0}}>
          {Array.from({length: DISTRICTS}, (_, i) => {
            const on = Math.min(1, Math.max(0, filled - i));
            return (
              <div
                key={i}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  background: on > 0 ? rgba(C.crimson, mix(0.15, 1, on)) : C.white,
                  border: `1.5px solid ${on > 0.5 ? C.crimson : C.hairline}`,
                  transform: `scale(${mix(0.8, 1, on)})`,
                }}
              />
            );
          })}
        </div>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <span style={{fontFamily: SERIF, fontSize: 104, lineHeight: 0.9, color: C.crimson}}>{Math.round(filled)}</span>
          <span style={{fontFamily: SANS, fontWeight: 500, fontSize: 26, color: C.inkSoft}}>districts — all of Nepal</span>
        </div>
      </Card>
    </SceneShell>
  );
};

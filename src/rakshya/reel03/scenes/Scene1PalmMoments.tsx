import React from 'react';
import {useCurrentFrame} from 'remotion';
import {SANS, SERIF} from '../../fonts';
import {Card} from '../../primitives/Card';
import {BusIcon, MoonIcon, PinIcon, SchoolIcon} from '../../primitives/Icons';
import {Dot, Pill} from '../../primitives/Pill';
import {SceneShell} from '../../primitives/SceneShell';
import {SerifReveal} from '../../primitives/SerifReveal';
import {C, ease, rgba} from '../../theme';
import {sp} from '../../reel02/timeline';
import {CUES3, R3} from '../timeline';

export const MOMENTS_NP = [
  {Icon: BusIcon, title: 'Crowded micro-buses', note: 'Rush hour, every day'},
  {Icon: MoonIcon, title: 'Walking home after dark', note: 'The last stretch of the lane'},
  {Icon: SchoolIcon, title: 'The school gate', note: 'Drop-off and pick-up'},
  {Icon: PinIcon, title: 'Travel across Nepal', note: 'Bus parks & long roads'},
];

/** 0:00–0:06 — "Protection that fits in your palm." Framed in real everyday moments. */
export const Scene1PalmMoments: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <SceneShell duration={R3.palm.duration} fadeIn={false}>
      <div style={{opacity: ease(frame, 0, 20)}}>
        <Pill>
          <Dot /> Built for life in Nepal
        </Pill>
      </div>
      <SerifReveal
        start={6}
        stagger={4}
        wordDur={24}
        fontSize={122}
        lineHeight={1.0}
        style={{marginTop: 40}}
        segments={[{text: 'Protection that'}, {br: true}, {text: 'fits'}, {text: 'in your palm.', italic: true, accent: true}]}
      />
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 60}}>
        {MOMENTS_NP.map(({Icon, title, note}, i) => {
          const p = sp(frame, CUES3.moments[i] - R3.palm.from, 26);
          return (
            <Card key={title} p={p} tint={i % 3 === 0 ? 'white' : 'blush'} style={{padding: '30px 30px 32px', minHeight: 250}}>
              <div style={{width: 72, height: 72, borderRadius: 22, background: rgba(C.crimson, 0.07), display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Icon size={40} />
              </div>
              <div style={{marginTop: 22, fontFamily: SERIF, fontSize: 44, lineHeight: 1.04, color: C.ink}}>{title}</div>
              <div style={{marginTop: 10, fontFamily: SANS, fontSize: 24, color: C.inkMute}}>{note}</div>
            </Card>
          );
        })}
      </div>
    </SceneShell>
  );
};

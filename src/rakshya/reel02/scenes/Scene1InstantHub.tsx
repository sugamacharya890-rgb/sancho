import React from 'react';
import {useCurrentFrame} from 'remotion';
import {SANS, SERIF} from '../../fonts';
import {Card} from '../../primitives/Card';
import {PhoneIcon} from '../../primitives/Icons';
import {Dot, Pill} from '../../primitives/Pill';
import {SerifReveal} from '../../primitives/SerifReveal';
import {C, ease, mix, rgba} from '../../theme';
import {CUES, R2, sp} from '../timeline';
import {SceneShell} from '../../primitives/SceneShell';

export const HELPLINES_FULL = [
  {number: '100', label: 'Nepal Police'},
  {number: '1145', label: 'Women’s Helpline'},
  {number: '1098', label: 'Child Helpline'},
  {number: '1660-010-2005', label: 'Psychosocial Support · TPO Nepal'},
];

const at = (g: number) => g - R2.hub.from;
const TAP_ROW = 1;

/** 0:00–0:06 — "Where do you turn in seconds?" Free, nationwide help, one tap away. */
export const Scene1InstantHub: React.FC = () => {
  const frame = useCurrentFrame();
  const tap = at(CUES.hubTap);
  const tapLit = ease(frame, tap, 14) * (1 - ease(frame, tap + 26, 16));
  const ripple = ease(frame, tap, 24);

  return (
    <SceneShell duration={R2.hub.duration} fadeIn={false}>
      <div style={{opacity: ease(frame, 0, 20)}}>
        <Pill>
          <Dot /> Free · Nationwide
        </Pill>
      </div>

      <SerifReveal
        start={8}
        stagger={5}
        wordDur={24}
        fontSize={124}
        lineHeight={1.0}
        style={{marginTop: 40}}
        segments={[{text: 'Where do you turn'}, {br: true}, {text: 'in seconds?', italic: true, accent: true}]}
      />

      <Card p={sp(frame, 48)} style={{marginTop: 56, padding: '34px 34px 18px'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10}}>
          <span style={{fontFamily: SERIF, fontSize: 48, color: C.ink}}>Emergency hub</span>
          <Pill tone="solid" style={{fontSize: 19, padding: '10px 18px'}}>
            One tap
          </Pill>
        </div>
        {HELPLINES_FULL.map(({number, label}, i) => {
          const p = sp(frame, at(CUES.hubRows[i]), 26);
          const lit = i === TAP_ROW ? tapLit : 0;
          const press = i === TAP_ROW ? Math.sin(ease(frame, tap, 10) * Math.PI) : 0;
          return (
            <div
              key={number}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 20,
                margin: '0 -18px',
                padding: '22px 18px',
                borderRadius: 24,
                borderTop: i === 0 ? 'none' : `1.5px solid ${rgba(C.hairline, 1 - lit)}`,
                background: rgba('#F5E4E6', lit),
                opacity: p,
                transform: `translateY(${mix(26, 0, p)}px)`,
              }}
            >
              <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
                <span style={{fontFamily: SERIF, fontSize: number.length > 5 ? 60 : 70, lineHeight: 1, color: C.crimson, letterSpacing: '-0.01em'}}>
                  {number}
                </span>
                <span style={{fontFamily: SANS, fontWeight: 500, fontSize: 26, color: C.inkSoft}}>{label}</span>
              </div>
              <div style={{position: 'relative', width: 86, height: 86, flexShrink: 0}}>
                {i === TAP_ROW && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '50%',
                      border: `3px solid ${C.crimson}`,
                      transform: `scale(${1 + ripple * 0.9})`,
                      opacity: frame >= tap ? 0.5 * (1 - ripple) : 0,
                    }}
                  />
                )}
                <div
                  style={{
                    width: 86,
                    height: 86,
                    borderRadius: '50%',
                    background: C.crimson,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: `scale(${1 - press * 0.08})`,
                    boxShadow: `0 10px 24px ${rgba(C.crimson, 0.22 + lit * 0.2)}`,
                  }}
                >
                  <PhoneIcon size={38} color={C.white} />
                </div>
              </div>
            </div>
          );
        })}
      </Card>
    </SceneShell>
  );
};

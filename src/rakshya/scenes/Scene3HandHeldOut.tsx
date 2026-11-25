import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {DEVANAGARI, SANS, SERIF} from '../fonts';
import {Card} from '../primitives/Card';
import {CompassIcon, PeopleIcon, PhoneIcon} from '../primitives/Icons';
import {Pill} from '../primitives/Pill';
import {C, EASE_IO, R, SAFE, ease, exitAt, mix, rgba} from '../theme';

export const HELPLINES = [
  {number: '100', label: 'Nepal Police'},
  {number: '1145', label: 'Women’s helpline'},
  {number: '1098', label: 'Child helpline'},
];

const WORD_AT = 6; // "रक्षा" — music: soft bell at 11.2s
const DOCK_AT = 74; // title block glides up to make room
const CARDS_AT = 92;
const TAP_AT = 158; // a gentle "one tap" on 1145

const FeatureHead: React.FC<{Icon: React.FC<{size?: number}>; title: string; tag?: string}> = ({Icon, title, tag}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
    <div style={{width: 64, height: 64, borderRadius: 20, background: rgba(C.crimson, 0.07), display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <Icon size={36} />
    </div>
    <span style={{fontFamily: SERIF, fontSize: 50, color: C.ink, letterSpacing: '-0.01em', flex: 1}}>{title}</span>
    {tag && <Pill style={{fontSize: 20, padding: '10px 18px'}}>{tag}</Pill>}
  </div>
);

/** 0:11–0:18 — Rakshya, रक्षा: a hand held out. Community, one-tap helplines, tools for Nepal. */
export const Scene3HandHeldOut: React.FC = () => {
  const frame = useCurrentFrame();
  const out = exitAt(frame, R.rakshya.duration);
  const word = ease(frame, WORD_AT, 40);
  const name = ease(frame, WORD_AT + 14, 34);
  const line = ease(frame, WORD_AT + 30, 30);
  const dock = ease(frame, DOCK_AT, 34, EASE_IO);
  const ring = ease(frame, 0, 80);
  const tap = ease(frame, TAP_AT, 24);
  const tapPress = Math.sin(Math.min(1, ease(frame, TAP_AT, 10)) * Math.PI);

  return (
    <AbsoluteFill style={{opacity: 1 - out, transform: `translateY(${-60 * out}px)`}}>
      {/* the "hand held out": a warm circle opening behind the word */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: mix(860, 470, dock),
          width: 760,
          height: 760,
          marginLeft: -380,
          marginTop: -380,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${rgba(C.white, 0.95)} 0%, ${rgba(C.cardBlush, 0.6)} 55%, transparent 72%)`,
          border: `1.5px solid ${rgba(C.crimson, 0.12 * (1 - dock))}`,
          transform: `scale(${mix(0.55, 1, ring) * mix(1, 0.7, dock)})`,
          opacity: ring,
        }}
      />

      {/* title block — centered hero, then docks to the top */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: mix(560, SAFE.top + 10, dock),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: `scale(${mix(1, 0.6, dock)})`,
          transformOrigin: '50% 0%',
        }}
      >
        <span
          style={{
            fontFamily: DEVANAGARI,
            fontWeight: 500,
            fontSize: 150,
            lineHeight: 1.3,
            color: C.crimson,
            opacity: word,
            transform: `translateY(${mix(30, 0, word)}px)`,
            filter: `blur(${(1 - word) * 8}px)`,
          }}
        >
          रक्षा
        </span>
        <span
          style={{
            fontFamily: SERIF,
            fontSize: 176,
            lineHeight: 0.95,
            color: C.ink,
            letterSpacing: '-0.02em',
            opacity: name,
            transform: `translateY(${mix(24, 0, name)}px)`,
          }}
        >
          Rakshya
        </span>
        <span
          style={{
            marginTop: 26,
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 70,
            color: C.crimson,
            opacity: line,
            transform: `translateY(${mix(18, 0, line)}px)`,
          }}
        >
          A hand held out.
        </span>
      </div>

      {/* what the hand offers */}
      <div
        style={{
          position: 'absolute',
          left: SAFE.left,
          right: SAFE.right,
          top: 700,
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        <Card p={ease(frame, CARDS_AT, 30)} style={{padding: '32px 36px'}}>
          <FeatureHead Icon={PeopleIcon} title="An anonymous community" />
          <p style={{margin: '16px 0 0', fontFamily: SANS, fontSize: 30, lineHeight: 1.45, color: C.inkSoft}}>
            Share what happened without your name. Here, your story is believed.
          </p>
        </Card>

        <Card p={ease(frame, CARDS_AT + 16, 30)} tint="blush" style={{padding: '32px 36px'}}>
          <FeatureHead Icon={PhoneIcon} title="One-tap helplines" tag="24/7" />
          <div style={{display: 'flex', gap: 16, marginTop: 24}}>
            {HELPLINES.map(({number, label}, i) => {
              const p = ease(frame, CARDS_AT + 30 + i * 8, 24);
              const active = number === '1145';
              const lit = active ? tap : 0;
              return (
                <div
                  key={number}
                  style={{
                    flex: 1,
                    position: 'relative',
                    overflow: 'hidden',
                    padding: '22px 10px 20px',
                    borderRadius: 24,
                    textAlign: 'center',
                    background: lit > 0 ? `color-mix(in srgb, ${C.crimson} ${lit * 100}%, ${C.white})` : C.white,
                    border: `1.5px solid ${lit > 0.5 ? C.crimson : C.hairline}`,
                    opacity: p,
                    transform: `translateY(${mix(20, 0, p)}px) scale(${1 - (active ? tapPress * 0.04 : 0)})`,
                    boxShadow: lit > 0 ? `0 14px 34px ${rgba(C.crimson, 0.25 * lit)}` : 'none',
                  }}
                >
                  {active && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        width: 320,
                        height: 320,
                        marginLeft: -160,
                        marginTop: -160,
                        borderRadius: '50%',
                        background: rgba(C.white, 0.35),
                        transform: `scale(${ease(frame, TAP_AT, 22)})`,
                        opacity: 1 - ease(frame, TAP_AT + 6, 20),
                      }}
                    />
                  )}
                  <div style={{position: 'relative', fontFamily: SERIF, fontSize: 68, lineHeight: 1, color: lit > 0.5 ? C.white : C.crimson}}>{number}</div>
                  <div style={{position: 'relative', marginTop: 10, fontFamily: SANS, fontWeight: 500, fontSize: 22, color: lit > 0.5 ? rgba(C.white, 0.9) : C.inkSoft}}>
                    {label}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card p={ease(frame, CARDS_AT + 32, 30)} style={{padding: '32px 36px'}}>
          <FeatureHead Icon={CompassIcon} title="Tools built for Nepal" />
          <p style={{margin: '16px 0 0', fontFamily: SANS, fontSize: 30, lineHeight: 1.45, color: C.inkSoft}}>
            Practical safety tools made for everyday life here — on the road, online and at home.
          </p>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

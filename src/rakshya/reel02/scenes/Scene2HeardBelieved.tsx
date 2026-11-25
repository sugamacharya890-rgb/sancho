import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {SANS, SERIF} from '../../fonts';
import {Card} from '../../primitives/Card';
import {CheckIcon, LockIcon, MaskIcon} from '../../primitives/Icons';
import {Pill} from '../../primitives/Pill';
import {SerifReveal} from '../../primitives/SerifReveal';
import {C, ease, mix, rgba} from '../../theme';
import {CUES, R2, sp} from '../timeline';
import {SceneShell} from './SceneShell';

const at = (g: number) => g - R2.heard.from;
/** An illustrative draft being typed — the viewer's own words, not a published testimonial. */
const DRAFT = 'I never told anyone what happened on the bus. Writing it here, I finally feel lighter.';
const TYPE_FROM = 64;
const TYPE_TO = 128;
const STEPS = ['Shared, no name', 'Reviewed with care', 'Met with support'];

/** 0:06–0:13 — "You are heard. You are believed." Anonymous sharing, reviewed thoughtfully. */
export const Scene2HeardBelieved: React.FC = () => {
  const frame = useCurrentFrame();
  const chars = Math.floor(interpolate(frame, [TYPE_FROM, TYPE_TO], [0, DRAFT.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const typing = frame < TYPE_TO + 6;
  const caret = typing && Math.floor(frame / 8) % 2 === 0 && frame >= TYPE_FROM - 6;
  const post = at(CUES.postTap);
  const press = Math.sin(ease(frame, post, 10) * Math.PI);
  const posted = ease(frame, post + 4, 14);

  return (
    <SceneShell duration={R2.heard.duration}>
      <div style={{display: 'flex', gap: 14, opacity: ease(frame, 4, 22)}}>
        <Pill>No account, no name</Pill>
        <Pill tone="outline">Privacy first</Pill>
      </div>

      <SerifReveal
        start={10}
        stagger={6}
        wordDur={26}
        fontSize={124}
        lineHeight={1.0}
        style={{marginTop: 38}}
        segments={[{text: 'You are heard.'}, {br: true}, {text: 'You are believed.', italic: true, accent: true}]}
      />

      <Card p={sp(frame, 52)} style={{marginTop: 52, padding: '32px 36px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          <div
            style={{
              width: 66,
              height: 66,
              borderRadius: '50%',
              background: '#F5E4E6',
              border: `2px dashed ${rgba(C.crimson, 0.35)}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MaskIcon size={34} />
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 2}}>
            <span style={{fontFamily: SANS, fontWeight: 600, fontSize: 30, color: C.ink}}>Anonymous</span>
            <span style={{fontFamily: SANS, fontSize: 23, color: C.inkMute}}>No sign-up · Your name is never shown</span>
          </div>
        </div>
        <div
          style={{
            marginTop: 24,
            minHeight: 148,
            padding: '22px 26px',
            borderRadius: 22,
            background: '#FDF6F6',
            border: `1.5px solid ${C.hairline}`,
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 42,
            lineHeight: 1.18,
            color: C.ink,
          }}
        >
          {chars === 0 ? <span style={{color: C.inkMute}}>Share what happened…</span> : DRAFT.slice(0, chars)}
          <span style={{display: 'inline-block', width: 3, height: 40, marginLeft: 3, verticalAlign: '-6px', background: C.crimson, opacity: caret ? 1 : 0}} />
        </div>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24}}>
          <span style={{display: 'flex', alignItems: 'center', gap: 10, fontFamily: SANS, fontSize: 24, fontWeight: 500, color: C.inkSoft}}>
            <LockIcon size={28} /> Private by default
          </span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '18px 30px',
              borderRadius: 999,
              background: C.crimson,
              color: C.white,
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: 26,
              transform: `scale(${1 - press * 0.06})`,
              boxShadow: `0 12px 28px ${rgba(C.crimson, 0.25)}`,
            }}
          >
            {posted > 0.5 ? <CheckIcon size={28} color={C.white} /> : null}
            {posted > 0.5 ? 'Shared anonymously' : 'Share anonymously'}
          </div>
        </div>
      </Card>

      {/* progress: shared → reviewed → supported */}
      <div style={{position: 'relative', display: 'flex', justifyContent: 'space-between', marginTop: 40, padding: '0 10px'}}>
        <div style={{position: 'absolute', left: 90, right: 90, top: 27, height: 3, background: C.hairline}} />
        <div
          style={{
            position: 'absolute',
            left: 90,
            top: 27,
            height: 3,
            background: C.crimson,
            width: `calc((100% - 180px) * ${ease(frame, at(CUES.steps[0]), at(CUES.steps[2]) - at(CUES.steps[0]))})`,
          }}
        />
        {STEPS.map((label, i) => {
          const p = sp(frame, at(CUES.steps[i]), 22);
          return (
            <div key={label} style={{position: 'relative', width: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: p > 0.02 ? C.crimson : C.white,
                  border: `2px solid ${p > 0.02 ? C.crimson : C.hairline}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `scale(${mix(0.85, 1, p)})`,
                }}
              >
                <span style={{opacity: p, display: 'flex'}}>
                  <CheckIcon size={30} color={C.white} />
                </span>
              </div>
              <span style={{fontFamily: SANS, fontWeight: 600, fontSize: 23, textAlign: 'center', color: p > 0.5 ? C.ink : C.inkMute, whiteSpace: 'nowrap'}}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </SceneShell>
  );
};

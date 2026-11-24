import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FadeSlideText} from '../primitives/FadeSlideText';
import {Icon, IconName} from '../primitives/Icons';
import {SanchoMark} from '../primitives/SanchoMark';
import {COLORS, EASE_IN_OUT, SAFE, hexA, progress} from '../theme/theme';
import {FONT_DISPLAY, FONT_UI} from '../theme/fonts';

const PANEL = {left: 1040, top: 158, width: 720};

type Msg = {from: 'you' | 'mom'; text: string; at: number};
/** The chasing loop: questions from abroad, partial answers from home. */
export const MESSAGES: Msg[] = [
  {from: 'you', text: 'Did you go to the clinic?', at: 14},
  {from: 'mom', text: 'Yes, this morning', at: 32},
  {from: 'you', text: 'What did the doctor say?', at: 48},
  {from: 'mom', text: 'Something about the BP pills…', at: 66},
  {from: 'you', text: 'Did the dosage change?', at: 82},
  {from: 'mom', text: 'Ask your uncle, he took me', at: 100},
  {from: 'you', text: 'Can you call me back?', at: 116},
];

const DISSOLVE_AT = 168; // bubbles drift apart
export const SUMMARY_AT = 190; // calm summary arrives

/** Scatter vector per bubble so the thread falls apart organically. */
const SCATTER = [
  [-40, -70], [60, -50], [-70, -20], [80, 10], [-50, 40], [70, 60], [-30, 90],
];

const Bubble: React.FC<{m: Msg; i: number}> = ({m, i}) => {
  const frame = useCurrentFrame();
  const p = progress(frame, m.at, 22);
  const d = progress(frame, DISSOLVE_AT + i * 4, 26, EASE_IN_OUT);
  const you = m.from === 'you';
  const unanswered = i === MESSAGES.length - 1;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: you ? 'flex-end' : 'flex-start',
        opacity: p * (1 - d),
        transform: `translate(${SCATTER[i][0] * d}px, ${(1 - p) * 18 + SCATTER[i][1] * d}px) scale(${0.96 + 0.04 * p - 0.08 * d}) rotate(${(i % 2 ? 1 : -1) * 4 * d}deg)`,
        transformOrigin: you ? '100% 50%' : '0% 50%',
        filter: d > 0 || p < 1 ? `blur(${(1 - p) * 6 + d * 10}px)` : undefined,
      }}
    >
      <div
        style={{
          maxWidth: 440,
          padding: '13px 20px',
          borderRadius: 22,
          borderBottomRightRadius: you ? 6 : 22,
          borderBottomLeftRadius: you ? 22 : 6,
          background: you ? hexA(COLORS.amber, 0.13) : hexA(COLORS.card, 0.95),
          border: `1.5px solid ${you ? hexA(COLORS.amber, 0.4) : hexA(COLORS.gray, 0.16)}`,
          color: COLORS.white,
          fontFamily: FONT_UI,
          fontSize: 22,
          fontWeight: 500,
          whiteSpace: 'nowrap',
        }}
      >
        {m.text}
      </div>
      {unanswered && (
        <div
          style={{
            marginTop: 6,
            fontFamily: FONT_UI,
            fontSize: 16,
            color: COLORS.amber,
            opacity: progress(frame, m.at + 14, 16) * (0.65 + 0.35 * Math.sin(frame / 7)),
          }}
        >
          Delivered · no reply
        </div>
      )}
    </div>
  );
};

const ChatThread: React.FC = () => {
  const frame = useCurrentFrame();
  const inP = progress(frame, 0, 26);
  const out = progress(frame, DISSOLVE_AT + 10, 30, EASE_IN_OUT);
  const typing = frame > 120 && frame < DISSOLVE_AT;
  return (
    <div
      style={{
        position: 'absolute',
        left: PANEL.left,
        top: PANEL.top,
        width: PANEL.width,
        transform: `translateY(${Math.sin(frame / 26) * 6}px) rotate(${Math.sin(frame / 47) * 0.4}deg)`,
      }}
    >
      {/* thread frame */}
      <div
        style={{
          position: 'absolute',
          inset: '-24px -28px',
          height: 650,
          borderRadius: 32,
          background: hexA('#13263A', 0.7),
          border: `1.5px solid ${hexA(COLORS.gray, 0.14)}`,
          opacity: inP * (1 - out),
          transform: `translateX(${(1 - inP) * 60}px) scale(${1 - out * 0.04})`,
        }}
      />
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          marginBottom: 22,
          opacity: inP * (1 - out),
          transform: `translateX(${(1 - inP) * 60}px)`,
          fontFamily: FONT_UI,
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 23,
            background: hexA(COLORS.coral, 0.25),
            color: COLORS.coral,
            fontWeight: 700,
            fontSize: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          M
        </div>
        <div>
          <div style={{color: COLORS.white, fontSize: 21, fontWeight: 600}}>Mom</div>
          <div style={{color: COLORS.gray, fontSize: 16}}>
            {typing ? 'typing…' : 'last seen 3 hours ago'}
          </div>
        </div>
      </div>
      <div style={{position: 'relative', display: 'flex', flexDirection: 'column', gap: 12}}>
        {MESSAGES.map((m, i) => (
          <Bubble key={i} m={m} i={i} />
        ))}
      </div>
    </div>
  );
};

const ROWS: {icon: IconName; label: string; text: string}[] = [
  {icon: 'heart', label: 'What happened', text: 'Blood pressure stable. Heart rhythm normal.'},
  {icon: 'pill', label: 'Medication', text: 'Amlodipine updated to 5 mg, once daily.'},
  {icon: 'calendar', label: "What's next", text: 'Follow-up blood test · Mon 9:00'},
];

const SummaryCard: React.FC = () => {
  const frame = useCurrentFrame();
  const p = progress(frame, SUMMARY_AT, 34);
  const float = Math.sin((frame - SUMMARY_AT) / 26) * 7;
  const footer = progress(frame, SUMMARY_AT + 44, 24);
  const bar = progress(frame, SUMMARY_AT + 50, 150, EASE_IN_OUT);
  return (
    <div
      style={{
        position: 'absolute',
        left: PANEL.left,
        top: PANEL.top + 40,
        width: PANEL.width,
        boxSizing: 'border-box',
        padding: '30px 34px',
        borderRadius: 28,
        background: `linear-gradient(165deg, #233249, ${COLORS.card})`,
        border: `1.5px solid ${hexA(COLORS.teal, 0.35)}`,
        boxShadow: `0 30px 70px ${hexA('#02070D', 0.5)}, 0 0 60px ${hexA(COLORS.teal, 0.12)}`,
        opacity: p,
        transform: `translateY(${(1 - p) * 50 + float}px) scale(${0.94 + 0.06 * p})`,
        filter: p < 1 ? `blur(${(1 - p) * 12}px)` : undefined,
        fontFamily: FONT_UI,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
        <SanchoMark size={36} showWord={false} />
        <div style={{flex: 1}}>
          <div style={{color: COLORS.white, fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 700}}>
            Visit summary
          </div>
          <div style={{color: COLORS.gray, fontSize: 17, marginTop: 2}}>Mom · Cardiology visit · Thu 10:30</div>
        </div>
        <div
          style={{
            padding: '7px 14px',
            borderRadius: 999,
            background: hexA(COLORS.teal, 0.14),
            color: COLORS.teal,
            fontSize: 15.5,
            fontWeight: 600,
          }}
        >
          Shared with you
        </div>
      </div>
      <div style={{height: 1.5, background: hexA(COLORS.gray, 0.16), margin: '24px 0 8px'}} />
      {ROWS.map((r, i) => {
        const rp = progress(frame, SUMMARY_AT + 16 + i * 6, 26);
        return (
          <div
            key={r.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              padding: '16px 0',
              borderBottom: i < ROWS.length - 1 ? `1px solid ${hexA(COLORS.gray, 0.1)}` : undefined,
              opacity: rp,
              transform: `translateX(${(1 - rp) * 24}px)`,
            }}
          >
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: 14,
                background: hexA(COLORS.teal, 0.13),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon name={r.icon} size={25} color={COLORS.teal} />
            </div>
            <div>
              <div
                style={{
                  color: COLORS.gray,
                  fontSize: 14.5,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {r.label}
              </div>
              <div style={{color: COLORS.white, fontSize: 22, fontWeight: 500, marginTop: 3}}>{r.text}</div>
            </div>
          </div>
        );
      })}
      <div style={{marginTop: 16, display: 'flex', alignItems: 'center', gap: 12, opacity: footer}}>
        <Icon name="check" size={20} color={COLORS.teal} strokeWidth={2.6} draw={footer} />
        <span style={{color: COLORS.teal, fontSize: 17, fontWeight: 600}}>Clear, complete — no follow-up calls needed</span>
      </div>
      <div style={{marginTop: 16, height: 4, borderRadius: 2, background: hexA(COLORS.tealBlue, 0.3), overflow: 'hidden', opacity: footer}}>
        <div style={{width: `${bar * 100}%`, height: '100%', background: COLORS.teal, borderRadius: 2}} />
      </div>
    </div>
  );
};

export const Scene3Visibility: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = progress(frame, 0, 30);
  const exit = progress(frame, 404, 26, EASE_IN_OUT);
  return (
    <AbsoluteFill
      style={{
        opacity: enter * (1 - exit),
        transform: `scale(${1 - exit * 0.03})`,
        filter: exit > 0 ? `blur(${exit * 8}px)` : undefined,
      }}
    >
      <ChatThread />
      {frame >= SUMMARY_AT - 2 && <SummaryCard />}

      <div style={{position: 'absolute', left: SAFE.x, top: 360}}>
        <FadeSlideText
          text={'One visit. *Seven messages.*\nStill no clear answer.'}
          accent={COLORS.amber}
          start={20}
          exitAt={166}
          fontSize={62}
          maxWidth={840}
        />
      </div>
      <div style={{position: 'absolute', left: SAFE.x, top: 300}}>
        <FadeSlideText
          text={'Know what happened\nat every visit and\n*what comes next*—'}
          start={196}
          exitAt={410}
          fontSize={62}
          maxWidth={840}
        />
        <div style={{marginTop: 26}}>
          <FadeSlideText
            text="without chasing Mom or Dad for answers."
            start={232}
            exitAt={410}
            fontSize={34}
            fontWeight={500}
            color={hexA(COLORS.white, 0.82)}
            letterSpacing="-0.01em"
            stagger={2}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

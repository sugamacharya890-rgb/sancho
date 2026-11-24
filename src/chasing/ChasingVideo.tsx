import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile} from 'remotion';
import {ChasingLoop} from './scenes/ChasingLoop';
import {DownloadOutro} from './scenes/DownloadOutro';
import {FollowThroughBehind} from './scenes/FollowThroughBehind';
import {MeetVisibility} from './scenes/MeetVisibility';
import {S} from './timeline';
import {VO_SPANS} from './voiceoverTiming';
import '../theme/fonts';

export type ChasingVideoProps = {
  /** Background track in public/. */
  bgm?: string;
  /** Voiceover in public/ (Script 02 narration). Pass null for a music-only cut. */
  voiceover?: string | null;
};

const FPS = 30;
/** Outgoing scene stays mounted under the incoming transition. */
const TAIL = 16;
/** Music level while the voice is speaking (≈ -10.5 dB) and the ramp in frames. */
const DUCK = 0.3;
const RAMP = 6;

/** 1 between lines, DUCK under speech — smooth ramps so the music breathes in the gaps. */
const duckAt = (f: number) => {
  let g = 1;
  for (const [s, e] of VO_SPANS) {
    const a = s * FPS;
    const b = e * FPS;
    const inside = interpolate(f, [a - RAMP, a, b, b + RAMP * 2], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    g = Math.min(g, 1 - (1 - DUCK) * inside);
  }
  return g;
};

export const ChasingVideo: React.FC<ChasingVideoProps> = ({bgm = 'audio/sancho-chasing-bgm.mp3', voiceover = 'audio/sancho-chasing-vo.mp3'}) => (
  <AbsoluteFill style={{background: '#F8FAFC'}}>
    <Sequence from={S.chasing.from} durationInFrames={S.chasing.duration} name="1 · The chasing loop">
      <ChasingLoop />
    </Sequence>
    <Sequence from={S.meet.from} durationInFrames={S.meet.duration} name="2 · Meet Sancho & visibility">
      <MeetVisibility />
    </Sequence>
    <Sequence from={S.behind.from} durationInFrames={S.behind.duration + TAIL} name="3 · Follow-through behind the scenes">
      <FollowThroughBehind />
    </Sequence>
    <Sequence from={S.outro.from} durationInFrames={S.outro.duration} name="4 · Download Now outro">
      <DownloadOutro />
    </Sequence>
    <Audio
      src={staticFile(bgm)}
      volume={(f) =>
        interpolate(f, [0, 4, S.total - 24, S.total], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) *
        (voiceover ? duckAt(f) : 1)
      }
    />
    {voiceover && <Audio src={staticFile(voiceover)} />}
  </AbsoluteFill>
);

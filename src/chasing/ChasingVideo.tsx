import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile} from 'remotion';
import {ChasingLoop} from './scenes/ChasingLoop';
import {DownloadOutro} from './scenes/DownloadOutro';
import {FollowThroughBehind} from './scenes/FollowThroughBehind';
import {MeetVisibility} from './scenes/MeetVisibility';
import {S} from './timeline';
import '../theme/fonts';

export type ChasingVideoProps = {
  /** Background track in public/. */
  bgm?: string;
  /** Optional recorded voiceover in public/ (Script 02 narration). When set, music ducks under it. */
  voiceover?: string;
};

/** Outgoing scene stays mounted under the incoming transition. */
const TAIL = 16;

export const ChasingVideo: React.FC<ChasingVideoProps> = ({bgm = 'audio/sancho-chasing-bgm.mp3', voiceover}) => (
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
        interpolate(f, [0, 4, S.total - 24, S.total], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) * (voiceover ? 0.35 : 1)
      }
    />
    {voiceover && <Audio src={staticFile(voiceover)} />}
  </AbsoluteFill>
);

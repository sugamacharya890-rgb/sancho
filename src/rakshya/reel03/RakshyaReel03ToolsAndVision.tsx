import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile} from 'remotion';
import '../fonts';
import {Backdrop} from '../primitives/Backdrop';
import {TAIL} from '../theme';
import {Scene1PalmMoments} from './scenes/Scene1PalmMoments';
import {Scene2SimpleSteps} from './scenes/Scene2SimpleSteps';
import {Scene3EveryWomanChildSchool} from './scenes/Scene3EveryWomanChildSchool';
import {Scene4SeeWhatsComing} from './scenes/Scene4SeeWhatsComing';
import {R3} from './timeline';

export type RakshyaReel03ToolsAndVisionProps = {
  /** Background track in public/ (scripts/compose_rakshya_reel03_bgm.py). null → silent export. */
  music?: string | null;
  musicVolume?: number;
  /** Instagram handle shown in the closing frame. */
  handle?: string;
};

/**
 * Rakshya · Reel 03 — "Everyday Protection & Tools Built for Nepal" (24s, 1080×1920).
 *
 * Audio hook points (88 BPM; beat grid offset so beat 24 = 540f):
 *   0f        — warm pad + plucked eighth-note arpeggio, Dmaj9
 *   70–131f   — one pluck per everyday-moment card (beats 1–4)
 *   180f      — steps: soft kick + shaker enter, the rhythm starts moving forward
 *   233–356f  — rising pluck on each step 01 → 04 (every two beats)
 *   396–458f  — full groove; a note per pillar, shimmer as the 77 districts fill
 *   540f      — bar 7 downbeat: Dadd9 bloom under the lockup, then rest on D
 */
export const RakshyaReel03ToolsAndVision: React.FC<RakshyaReel03ToolsAndVisionProps> = ({
  music = 'audio/rakshya-reel03-bgm.mp3',
  musicVolume = 0.9,
  handle,
}) => (
  <AbsoluteFill>
    <Backdrop />
    <Sequence from={R3.palm.from} durationInFrames={R3.palm.duration + TAIL} name="1 · Fits in your palm">
      <Scene1PalmMoments />
    </Sequence>
    <Sequence from={R3.steps.from} durationInFrames={R3.steps.duration + TAIL} name="2 · Simple steps (coming soon)">
      <Scene2SimpleSteps />
    </Sequence>
    <Sequence from={R3.vision.from} durationInFrames={R3.vision.duration + TAIL} name="3 · Every woman, child, school">
      <Scene3EveryWomanChildSchool />
    </Sequence>
    <Sequence from={R3.close.from} durationInFrames={R3.close.duration} name="4 · See what's coming">
      <Scene4SeeWhatsComing handle={handle} />
    </Sequence>
    {music && (
      <Audio
        src={staticFile(music)}
        volume={(f) =>
          musicVolume * interpolate(f, [0, 10, R3.total - 30, R3.total], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
        }
      />
    )}
  </AbsoluteFill>
);

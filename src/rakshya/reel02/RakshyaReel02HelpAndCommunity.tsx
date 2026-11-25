import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile} from 'remotion';
import '../fonts';
import {Backdrop} from '../primitives/Backdrop';
import {TAIL} from '../theme';
import {Scene1InstantHub} from './scenes/Scene1InstantHub';
import {Scene2HeardBelieved} from './scenes/Scene2HeardBelieved';
import {Scene3DiscreetRealLife} from './scenes/Scene3DiscreetRealLife';
import {Scene4HelpInOnePlace} from './scenes/Scene4HelpInOnePlace';
import {R2} from './timeline';

export type RakshyaReel02HelpAndCommunityProps = {
  /** Background track in public/ (scripts/compose_rakshya_reel02_bgm.py). null → silent export. */
  music?: string | null;
  musicVolume?: number;
};

/**
 * Rakshya · Reel 02 — "One-Tap Help & Anonymous Community" (24s, 1080×1920).
 *
 * Audio hook points (82 BPM; bar grid offset so bar 7 = 570f):
 *   0f      — warm pad + soft marimba pulse, Cmaj9 → Am9
 *   62–95f  — one marimba note per helpline row (eighth notes)
 *   140f    — tap on 1145: soft two-note chime
 *   180f    — "You are heard": soft brushed groove enters
 *   318f / 330–366f — share tap + three rising step notes
 *   474f    — quick exit tap: gentle chime, groove drops to pad for a breath
 *   570f    — bar 7 downbeat: Cadd9 resolution bloom; outro rests on C
 */
export const RakshyaReel02HelpAndCommunity: React.FC<RakshyaReel02HelpAndCommunityProps> = ({
  music = 'audio/rakshya-reel02-bgm.mp3',
  musicVolume = 0.9,
}) => (
  <AbsoluteFill>
    <Backdrop />
    <Sequence from={R2.hub.from} durationInFrames={R2.hub.duration + TAIL} name="1 · Instant access hub">
      <Scene1InstantHub />
    </Sequence>
    <Sequence from={R2.heard.from} durationInFrames={R2.heard.duration + TAIL} name="2 · Heard & believed">
      <Scene2HeardBelieved />
    </Sequence>
    <Sequence from={R2.discreet.from} durationInFrames={R2.discreet.duration + TAIL} name="3 · Discreet, built for real life">
      <Scene3DiscreetRealLife />
    </Sequence>
    <Sequence from={R2.close.from} durationInFrames={R2.close.duration} name="4 · Help & community in one place">
      <Scene4HelpInOnePlace />
    </Sequence>
    {music && (
      <Audio
        src={staticFile(music)}
        volume={(f) =>
          musicVolume * interpolate(f, [0, 10, R2.total - 30, R2.total], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
        }
      />
    )}
  </AbsoluteFill>
);

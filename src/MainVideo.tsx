import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile} from 'remotion';
import {BrandWipeOutro} from './promo/scenes/BrandWipeOutro';
import {FollowThroughUI} from './promo/scenes/FollowThroughUI';
import {HookAndBrand} from './promo/scenes/HookAndBrand';
import {VisibilityFeed} from './promo/scenes/VisibilityFeed';
import {T} from './promo/theme';
import './theme/fonts';

/** Overlap so the next scene's transition plays over the outgoing one. */
const TAIL = 16;

export type MainVideoProps = {
  /** Background track in public/ — A: audio/sancho-promo-bgm.mp3, B: audio/sancho-promo-bgm-b.mp3 */
  bgm?: string;
};

export const MainVideo: React.FC<MainVideoProps> = ({bgm = 'audio/sancho-promo-bgm.mp3'}) => (
  <AbsoluteFill style={{background: '#F8FAFC'}}>
    <Sequence from={T.hook.from} durationInFrames={T.hook.duration} name="1 · Hook & brand">
      <HookAndBrand />
    </Sequence>
    <Sequence from={T.follow.from} durationInFrames={T.follow.duration} name="2 · Follow-through UI">
      <FollowThroughUI />
    </Sequence>
    {/* stays mounted under the teal wipe until it fully covers the frame */}
    <Sequence from={T.feed.from} durationInFrames={T.feed.duration + TAIL} name="3 · Visibility feed">
      <VisibilityFeed />
    </Sequence>
    <Sequence from={T.outro.from} durationInFrames={T.outro.duration} name="4 · Brand wipe & outro">
      <BrandWipeOutro />
    </Sequence>
    {/* Original 120 bpm tracks (scripts/compose_promo_bgm*.py), hits locked to scene beats */}
    <Audio
      src={staticFile(bgm)}
      volume={(f) => interpolate(f, [0, 4, T.total - 24, T.total], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
    />
  </AbsoluteFill>
);

import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {AmbientGrid} from './primitives/AmbientGrid';
import {Scene1Overload} from './scenes/Scene1Overload';
import {Scene2FollowThrough} from './scenes/Scene2FollowThrough';
import {Scene3Visibility} from './scenes/Scene3Visibility';
import {Scene4Outro} from './scenes/Scene4Outro';
import {TIMELINE} from './theme/theme';
import './theme/fonts';

export const MainVideo: React.FC = () => {
  const frame = useCurrentFrame();
  // atmosphere: warm friction through the overload, resolving to calm teal with Sancho
  // ...briefly re-warms during the chasing thread in Scene 3, then settles for good
  const warmth = interpolate(frame, [0, 90, 300, 360, 430, 790, 830, 940, 990], [0.35, 0.75, 1, 1, 0, 0, 0.55, 0.55, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <AmbientGrid warmth={warmth} />
      <Sequence from={TIMELINE.s1.from} durationInFrames={TIMELINE.s1.duration} name="Scene 1 · Overload">
        <Scene1Overload />
      </Sequence>
      <Sequence from={TIMELINE.s2.from} durationInFrames={TIMELINE.s2.duration} name="Scene 2 · Follow-through">
        <Scene2FollowThrough />
      </Sequence>
      <Sequence from={TIMELINE.s3.from} durationInFrames={TIMELINE.s3.duration} name="Scene 3 · Visibility">
        <Scene3Visibility />
      </Sequence>
      <Sequence from={TIMELINE.s4.from} durationInFrames={TIMELINE.s4.duration} name="Scene 4 · Outro">
        <Scene4Outro />
      </Sequence>
      {/* Original score composed for this cut (scripts/compose_score.py), synced to the timeline */}
      <Audio src={staticFile('audio/sancho-score.mp3')} />
    </AbsoluteFill>
  );
};

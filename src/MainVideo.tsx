import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {AmbientGrid} from './primitives/AmbientGrid';
import {Scene1Overload} from './scenes/Scene1Overload';
import {Scene2FollowThrough} from './scenes/Scene2FollowThrough';
import {TIMELINE} from './theme/theme';
import './theme/fonts';

export const MainVideo: React.FC = () => {
  const frame = useCurrentFrame();
  // atmosphere: warm friction through the overload, resolving to calm teal with Sancho
  const warmth = interpolate(frame, [0, 90, 300, 360, 430], [0.35, 0.75, 1, 1, 0], {
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
    </AbsoluteFill>
  );
};

import React from 'react';
import {Composition} from 'remotion';
import {MainVideo} from './MainVideo';
import {FPS, HEIGHT, TIMELINE, WIDTH} from './theme/theme';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="SanchoExplainer"
      component={MainVideo}
      durationInFrames={TIMELINE.total}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  </>
);

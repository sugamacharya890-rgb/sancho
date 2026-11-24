import React from 'react';
import {Composition} from 'remotion';
import {MainVideo} from './MainVideo';
import {FPS, HEIGHT, TIMELINE, WIDTH} from './theme/theme';

export const RemotionRoot: React.FC = () => (
  <>
    {/* Step 2 review cut: Scenes 1–2 (0:00–0:26). Full 1440-frame comp lands in Step 3. */}
    <Composition
      id="SanchoExplainer"
      component={MainVideo}
      durationInFrames={TIMELINE.s3.from}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  </>
);

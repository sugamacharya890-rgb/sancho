import React from 'react';
import {Composition} from 'remotion';
import {ExplainerVideo} from './ExplainerVideo';
import {MainVideo} from './MainVideo';
import {T} from './promo/theme';
import {FPS, HEIGHT, TIMELINE, WIDTH} from './theme/theme';

export const RemotionRoot: React.FC = () => (
  <>
    {/* v2 brief: light, reference-matched 22s promo */}
    <Composition id="SanchoPromo" component={MainVideo} durationInFrames={T.total} fps={FPS} width={WIDTH} height={HEIGHT} />
    {/* v1 brief: dark 48s explainer (kept for reference) */}
    <Composition id="SanchoExplainer" component={ExplainerVideo} durationInFrames={TIMELINE.total} fps={FPS} width={WIDTH} height={HEIGHT} />
  </>
);

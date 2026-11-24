import React from 'react';
import {Composition} from 'remotion';
import {ChasingVideo} from './chasing/ChasingVideo';
import {S} from './chasing/timeline';
import {ExplainerVideo} from './ExplainerVideo';
import {MainVideo} from './MainVideo';
import {T} from './promo/theme';
import {FPS, HEIGHT, TIMELINE, WIDTH} from './theme/theme';

export const RemotionRoot: React.FC = () => (
  <>
    {/* v2 brief: light, reference-matched 22s promo */}
    <Composition id="SanchoPromo" component={MainVideo} durationInFrames={T.total} fps={FPS} width={WIDTH} height={HEIGHT} />
    {/* same visuals, alternative background track B (warm marimba + piano, half-time groove) */}
    <Composition
      id="SanchoPromoBgmB"
      component={MainVideo}
      defaultProps={{bgm: 'audio/sancho-promo-bgm-b.mp3'}}
      durationInFrames={T.total}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    {/* Script 02: "Effortless Clarity Without Chasing" — 24s, same identity */}
    <Composition id="SanchoChasingVideo" component={ChasingVideo} durationInFrames={S.total} fps={FPS} width={WIDTH} height={HEIGHT} />
    {/* v1 brief: dark 48s explainer (kept for reference) */}
    <Composition id="SanchoExplainer" component={ExplainerVideo} durationInFrames={TIMELINE.total} fps={FPS} width={WIDTH} height={HEIGHT} />
  </>
);

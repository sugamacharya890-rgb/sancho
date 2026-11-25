import React from 'react';
import {Composition} from 'remotion';
import {ChasingVideo} from './chasing/ChasingVideo';
import {S} from './chasing/timeline';
import {VO_SPANS_NE} from './chasing/voiceoverTimingNe';
import {ExplainerVideo} from './ExplainerVideo';
import {MainVideo} from './MainVideo';
import {R as RAKSHYA, RakshyaReel01Origin} from './rakshya';
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
    {/* same cut with the male voice (am_michael), and a music-only version */}
    <Composition
      id="SanchoChasingVideoMaleVO"
      component={ChasingVideo}
      defaultProps={{voiceover: 'audio/sancho-chasing-vo-male.mp3'}}
      durationInFrames={S.total}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    {/* Nepali voiceover — AI4Bharat Indic Parler-TTS, female speaker "Amrita", per-line emotion */}
    <Composition
      id="SanchoChasingVideoNepaliVO"
      component={ChasingVideo}
      defaultProps={{voiceover: 'audio/sancho-chasing-vo-ne.mp3', voSpans: VO_SPANS_NE}}
      durationInFrames={S.total}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    {/* 9:16 phone cut (Instagram Reels / Stories / TikTok), music only */}
    <Composition
      id="SanchoChasingVertical"
      component={ChasingVideo}
      defaultProps={{voiceover: null}}
      durationInFrames={S.total}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="SanchoChasingVideoMusicOnly"
      component={ChasingVideo}
      defaultProps={{voiceover: null}}
      durationInFrames={S.total}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    {/* Rakshya (रक्षा) · Reel 01 — Origin & Why Silence Isn't Safety · 24s Instagram Reel */}
    <Composition id="RakshyaReel01Origin" component={RakshyaReel01Origin} durationInFrames={RAKSHYA.total} fps={30} width={1080} height={1920} />
    <Composition
      id="RakshyaReel01OriginSilent"
      component={RakshyaReel01Origin}
      defaultProps={{music: null}}
      durationInFrames={RAKSHYA.total}
      fps={30}
      width={1080}
      height={1920}
    />
    {/* v1 brief: dark 48s explainer (kept for reference) */}
    <Composition id="SanchoExplainer" component={ExplainerVideo} durationInFrames={TIMELINE.total} fps={FPS} width={WIDTH} height={HEIGHT} />
  </>
);

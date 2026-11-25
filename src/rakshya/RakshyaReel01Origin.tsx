import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile} from 'remotion';
import {Backdrop} from './primitives/Backdrop';
import {Scene1QuietReality} from './scenes/Scene1QuietReality';
import {Scene2SilenceNotSafety} from './scenes/Scene2SilenceNotSafety';
import {Scene3HandHeldOut} from './scenes/Scene3HandHeldOut';
import {Scene4SafeToThrive} from './scenes/Scene4SafeToThrive';
import {R, TAIL} from './theme';
import './fonts';

export type RakshyaReel01OriginProps = {
  /**
   * Background track in public/. Default is the original, license-free 80 BPM piano + felt pad
   * from scripts/compose_rakshya_bgm.py. Pass null to export silent and add music in Instagram.
   */
  music?: string | null;
  /** Peak music level — leave headroom for a voiceover laid on top. */
  musicVolume?: number;
};

/**
 * Rakshya · Reel 01 — "Origin & Why Silence Isn't Safety" (24s, 1080×1920).
 *
 * Audio hook points (80 BPM: beat = 22.5f, bar = 90f):
 *   0f    — pad swells in from silence, sparse piano (Dm9)
 *   150f  — "Silence is not safety": a low held note, the piano thins out
 *   336f  — "रक्षा": soft high bell over a held Asus4 → A
 *   360f  — bar 4: the progression turns major (Fmaj7), flowing piano arpeggio
 *   540f  — bar 7 downbeat: "Every woman. Every child." warm full chord bloom
 *   690–720f — fade to rest
 */
export const RakshyaReel01Origin: React.FC<RakshyaReel01OriginProps> = ({
  music = 'audio/rakshya-reel01-bgm.mp3',
  musicVolume = 0.9,
}) => (
  <AbsoluteFill>
    <Backdrop />
    <Sequence from={R.quiet.from} durationInFrames={R.quiet.duration + TAIL} name="1 · The quiet reality">
      <Scene1QuietReality />
    </Sequence>
    <Sequence from={R.silence.from} durationInFrames={R.silence.duration + TAIL} name="2 · Silence is not safety">
      <Scene2SilenceNotSafety />
    </Sequence>
    <Sequence from={R.rakshya.from} durationInFrames={R.rakshya.duration + TAIL} name="3 · Rakshya — a hand held out">
      <Scene3HandHeldOut />
    </Sequence>
    <Sequence from={R.close.from} durationInFrames={R.close.duration} name="4 · Safe to thrive + CTA">
      <Scene4SafeToThrive />
    </Sequence>
    {music && (
      <Audio
        src={staticFile(music)}
        volume={(f) =>
          musicVolume * interpolate(f, [0, 12, R.total - 30, R.total], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
        }
      />
    )}
  </AbsoluteFill>
);

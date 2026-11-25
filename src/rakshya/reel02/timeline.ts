import {spring} from 'remotion';

/**
 * Reel 02 — "One-Tap Help & Anonymous Community" (24s, 1080×1920 @ 30fps).
 * Music: 82 BPM → 1 beat ≈ 21.95 frames, 1 bar ≈ 87.8 frames. The bar grid is offset by 1.44s
 * so that bar 7's downbeat lands exactly on the closing frame (19.0s = frame 570).
 */
export const R2 = {
  hub: {from: 0, duration: 180}, // 0:00–0:06
  heard: {from: 180, duration: 210}, // 0:06–0:13
  discreet: {from: 390, duration: 180}, // 0:13–0:19
  close: {from: 570, duration: 150}, // 0:19–0:24
  total: 720,
} as const;

/**
 * Global frames of every on-screen "touch" — scripts/compose_rakshya_reel02_bgm.py places a soft
 * marimba note on each one. Change a value here → change it there too.
 */
export const CUES = {
  hubRows: [62, 73, 84, 95], // helpline rows land on eighth notes
  hubTap: 140, // tap on 1145
  postTap: 318, // "Share anonymously"
  steps: [330, 348, 366], // shared → reviewed with care → met with support
  exitTap: 474, // quick exit
  close: 570, // resolution
} as const;

/** Calm spring, no overshoot — cards settle rather than bounce. */
export const sp = (frame: number, at: number, durationInFrames = 30) =>
  spring({frame: frame - at, fps: 30, durationInFrames, config: {damping: 200, mass: 0.9, stiffness: 110}});

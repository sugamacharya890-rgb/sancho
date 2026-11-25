import {Easing, interpolate} from 'remotion';

/**
 * Rakshya (रक्षा) — editorial blush/crimson system matched to rakshyanp.com.
 * Vertical Reels canvas: 1080×1920 @ 30fps.
 */
export const C = {
  canvas: '#FBF2F2',
  canvasAlt: '#FAF3F3',
  card: '#FFFFFF',
  cardBlush: '#FFF9F9',
  cardWarm: '#F7ECEC',
  hairline: '#E8D6D8',
  crimson: '#7A1C24',
  crimsonBright: '#8B1E28',
  ink: '#1A1819',
  inkSoft: '#5B4F52',
  inkMute: '#8C7F82',
  white: '#FFFFFF',
} as const;

export const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

/**
 * Story beats (frames). The music is 80 BPM → 1 beat = 22.5 frames, 1 bar = 90 frames (3s).
 * Scene 4 lands on the downbeat of bar 7 (18s); see scripts/compose_rakshya_bgm.py.
 */
export const R = {
  quiet: {from: 0, duration: 150}, // 0:00–0:05
  silence: {from: 150, duration: 180}, // 0:05–0:11
  rakshya: {from: 330, duration: 210}, // 0:11–0:18
  close: {from: 540, duration: 180}, // 0:18–0:24
  total: 720,
} as const;

/** Frames the outgoing scene stays mounted under the incoming one (soft cross-dissolve). */
export const TAIL = 14;

/**
 * Instagram Reels safe area on a 1080×1920 canvas: the top ~250px holds the account row,
 * the bottom ~360px holds caption + audio bar, the right ~130px holds the action rail.
 */
export const SAFE = {top: 270, bottom: 1560, left: 96, right: 132} as const;

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IO = Easing.bezier(0.65, 0, 0.35, 1);

/** 0→1 over [start, start+dur], clamped, calm ease-out. */
export const ease = (frame: number, start: number, dur: number, easing = EASE_OUT) =>
  interpolate(frame, [start, start + dur], [0, 1], {easing, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

/** Scene exit: 0 while on screen, 1 once fully dissolved into the next scene. */
export const exitAt = (frame: number, sceneDuration: number) => ease(frame, sceneDuration - 4, TAIL + 4, EASE_IO);

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

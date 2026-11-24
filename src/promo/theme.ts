import {Easing, interpolate, spring} from 'remotion';

/** Light, reference-matched palette from the v2 brief. */
export const C = {
  canvas: '#F8FAFC',
  white: '#FFFFFF',
  teal: '#2EC4B6', // bright trust teal
  tealDeep: '#1F7A8C', // calm clinical teal
  ink: '#0F172A', // headlines, card titles
  muted: '#64748B', // secondary text
  line: '#E2E8F0',
  coral: '#E07A5F', // friction (sparingly)
  amber: '#FFB703',
} as const;

export const FPS = 30;
/** 120 bpm → one beat every 15 frames. Visual pops land on the beat grid. */
export const BEAT = 15;

/** Scene blueprint (22s / 660 frames). */
export const T = {
  hook: {from: 0, duration: 135}, // 0:00 – 0:04.5
  follow: {from: 135, duration: 195}, // 0:04.5 – 0:11
  feed: {from: 330, duration: 195}, // 0:11 – 0:17.5
  outro: {from: 525, duration: 135}, // 0:17.5 – 0:22
  total: 660,
} as const;

export const EASE = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IO = Easing.bezier(0.65, 0, 0.35, 1);

export const ease = (frame: number, start: number, dur: number, e: (t: number) => number = EASE) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: e,
  });

/** Confident settle with a whisper of overshoot (no cartoon bounce). */
export const pop = (frame: number, start: number, fps = FPS, stiffness = 170, damping = 16) =>
  spring({frame: frame - start, fps, config: {stiffness, damping, mass: 0.9}});

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const rgba = (hex: string, a: number) => {
  const p = parseInt(hex.slice(1), 16);
  return `rgba(${(p >> 16) & 255}, ${(p >> 8) & 255}, ${p & 255}, ${a})`;
};

export const SHADOW = `0 24px 60px ${rgba('#0F172A', 0.10)}, 0 4px 14px ${rgba('#0F172A', 0.06)}`;

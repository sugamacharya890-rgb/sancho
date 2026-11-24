import {Easing, interpolate} from 'remotion';

/** Exact Sancho color system from the motion brief. */
export const COLORS = {
  slate: '#0F1E2E', // primary canvas — deep calm slate
  offWhite: '#F7F9FB', // warm clinical off-white
  teal: '#2EC4B6', // trust & continuity accent
  tealBlue: '#1F7A8C', // secondary system anchor
  amber: '#FFB703', // human friction / alert
  coral: '#E07A5F', // secondary friction highlight
  white: '#FFFFFF',
  gray: '#94A3B8', // muted cool gray labels
  card: '#1E293B', // elevated card surface
} as const;

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

/** Master timeline (frames @ 30fps). */
export const TIMELINE = {
  s1: {from: 0, duration: 360}, // 0:00 – 0:12  remote overload
  s2: {from: 360, duration: 420}, // 0:12 – 0:26  ongoing follow-through
  s3: {from: 780, duration: 420}, // 0:26 – 0:40  visibility without chasing
  s4: {from: 1200, duration: 240}, // 0:40 – 0:48  outro
  total: 1440,
} as const;

/** Brief-mandated arrival easing: cubic-bezier(0.16, 1, 0.3, 1). */
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
/** Gentle symmetric ease for exits / ambient moves. */
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);

export const STAGGER = 5; // frames between related elements (brief: 4–6)

/** Eased 0→1 progress between two frames (clamped). */
export const progress = (
  frame: number,
  start: number,
  duration: number,
  easing: (t: number) => number = EASE_OUT,
) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Mix two hex colors (t: 0 → a, 1 → b). */
export const mixHex = (a: string, b: string, t: number) => {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (p: number, s: number) => (p >> s) & 255;
  const m = (s: number) => Math.round(lerp(ch(pa, s), ch(pb, s), t));
  return `rgb(${m(16)}, ${m(8)}, ${m(0)})`;
};

export const hexA = (hex: string, alpha: number) => {
  const p = parseInt(hex.slice(1), 16);
  return `rgba(${(p >> 16) & 255}, ${(p >> 8) & 255}, ${p & 255}, ${alpha})`;
};

/** Layout safe zones: lower third (y > LOWER_THIRD) is kept clear for captions. */
export const SAFE = {x: 140, top: 110, lowerThird: 850} as const;

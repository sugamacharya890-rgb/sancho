/**
 * Reel 03 — "Everyday Protection & Tools Built for Nepal" (24s, 1080×1920 @ 30fps).
 * Music: 88 BPM → 1 beat ≈ 20.45 frames, 1 bar ≈ 81.8 frames. The beat grid is offset so that
 * bar 7's downbeat lands exactly on the closing lockup (18.0s = frame 540).
 */
export const R3 = {
  palm: {from: 0, duration: 180}, // 0:00–0:06
  steps: {from: 180, duration: 210}, // 0:06–0:13
  vision: {from: 390, duration: 150}, // 0:13–0:18
  close: {from: 540, duration: 180}, // 0:18–0:24
  total: 720,
} as const;

export const BPM3 = 88;
const BEAT_F = (60 / BPM3) * 30;
const GRID_F = 540 - 24 * BEAT_F; // beat 0 of the grid (≈ frame 49)
/** Global frame of grid beat n — every reveal below sits on a beat. */
export const beatFrame = (n: number) => Math.round(GRID_F + n * BEAT_F);

/**
 * On-screen hits. scripts/compose_rakshya_reel03_bgm.py places a pluck on each one using the
 * same beat numbers — retime here and there together.
 */
export const CUES3 = {
  moments: [1, 2, 3, 4].map(beatFrame), // four everyday moments
  steps: [9, 11, 13, 15].map(beatFrame), // 01 → 04, every two beats
  pillars: [18, 19, 20].map(beatFrame), // women · children · schools
  districts: beatFrame(21), // 77-district grid starts filling
  close: beatFrame(24), // = 540
} as const;

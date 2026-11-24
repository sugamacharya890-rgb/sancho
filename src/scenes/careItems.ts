import {CardData} from '../primitives/StatusCard';
import {EASE_OUT, TIMELINE, progress} from '../theme/theme';

/**
 * The parent's care details. Shown as visual proof of overload (Scene 1) and of
 * follow-through (Scene 2) — never as software features.
 */
export const CARE_ITEMS: CardData[] = [
  {icon: 'calendar', title: 'Cardiology visit', meta: 'Thu 10:30 · not confirmed', resolvedMeta: 'Confirmed · Thu 10:30'},
  {icon: 'pill', title: 'Metformin refill', meta: 'Only 3 days left', resolvedMeta: 'Refilled · delivered'},
  {icon: 'flask', title: 'Blood test results', meta: 'Still waiting', resolvedMeta: 'Reviewed · all stable'},
  {icon: 'note', title: "Doctor's advice", meta: 'Recheck BP in 2 weeks', resolvedMeta: 'BP rechecked · on track'},
  {icon: 'heart', title: 'BP checks', meta: 'Missed 4 days', resolvedMeta: 'Back on schedule'},
  {icon: 'eye', title: 'Eye exam', meta: 'Needs rescheduling', resolvedMeta: 'Rescheduled · Mon 9:00'},
  {icon: 'pill', title: 'Amlodipine dose', meta: 'Did it change?', resolvedMeta: 'Updated · 5 mg daily'},
  {icon: 'activity', title: 'Physiotherapy', meta: 'Twice weekly · who drives?', resolvedMeta: 'Rides arranged'},
  {icon: 'doc', title: 'Insurance claim', meta: 'Form not submitted', resolvedMeta: 'Submitted'},
];

export const CARD_W = 390;

/** Scene-1 resting place for each card: center x/y, rotation, depth (0 = far, 1 = near). */
const CHAOS = [
  {x: 1250, y: 255, r: -4, z: 0.9, from: [380, -140]},
  {x: 1615, y: 340, r: 3, z: 0.72, from: [420, 60]},
  {x: 1330, y: 470, r: 2, z: 1, from: [300, 260]},
  {x: 1640, y: 575, r: -3, z: 0.85, from: [380, 180]},
  {x: 1215, y: 675, r: 4, z: 0.6, from: [160, 380]},
  {x: 1560, y: 165, r: -6, z: 0.38, from: [260, -320]},
  {x: 1700, y: 790, r: 5, z: 0.42, from: [300, 340]},
  {x: 1150, y: 395, r: -5, z: 0.3, from: [-60, -380]},
  {x: 1440, y: 770, r: -2, z: 0.78, from: [120, 400]},
];

/** Accelerating arrival frames — details pile up faster and faster. */
export const ENTER_AT = [34, 54, 72, 88, 102, 114, 125, 135, 144];

/** Which cards carry an amber warning pulse, and when it starts. */
export const ALERT_AT = [null, 150, 200, 240, 175, 260, 215, 285, 230] as (number | null)[];

export type Pose = {x: number; y: number; rot: number; scale: number; blur: number; opacity: number; z: number};

/**
 * Card pose at a given Scene-1 local frame. Scene 2 calls this with the final
 * Scene-1 frame so the hand-off between scenes is pixel-continuous.
 */
export const chaosPose = (i: number, f: number): Pose => {
  const c = CHAOS[i];
  const p = progress(f, ENTER_AT[i], 28, EASE_OUT);
  // drift grows over time: details starting to slip and overlap
  const unrest = 1 + Math.max(0, f - 170) / 120;
  const t = f + i * 37;
  const depthScale = 0.78 + c.z * 0.22;
  return {
    x: c.x + c.from[0] * (1 - p) + Math.sin(t / 62) * 9 * unrest,
    y: c.y + c.from[1] * (1 - p) + Math.cos(t / 51) * 7 * unrest,
    rot: c.r * (0.4 + 0.6 * p) + (1 - p) * c.r * 3 + Math.sin(t / 74) * 1.1 * unrest,
    scale: depthScale * (0.92 + 0.08 * p),
    blur: (1 - c.z) * 4.2 + (1 - p) * 6,
    opacity: p * (0.5 + c.z * 0.5),
    z: c.z,
  };
};

export const S1_END = TIMELINE.s1.duration;

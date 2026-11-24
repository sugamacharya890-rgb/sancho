import React from 'react';
import {useCurrentFrame} from 'remotion';
import {COLORS, WIDTH, hexA} from '../theme/theme';

export type TrackGeometry = {
  /** Baseline y of the track. */
  y: number;
  amplitude: number;
  wavelength: number;
  /** Horizontal phase offset in px (advances to make the track flow). */
  scroll: number;
};

/** y-position on the track at screen x — lets cards hang their stems exactly on the line. */
export const trackY = (x: number, g: TrackGeometry) =>
  g.y + Math.sin(((x + g.scroll) / g.wavelength) * Math.PI * 2) * g.amplitude;

type Props = TrackGeometry & {
  /** 0..1 left-to-right draw-on reveal of the whole line. */
  draw: number;
  /** "Now" position: solid teal behind it (handled), dashed ahead (upcoming). */
  markerX: number;
  /** 0..1 visibility of the "now" marker. */
  markerOpacity?: number;
  /** Screen-x of nodes to render on the line. */
  nodes?: {x: number; done: number}[];
  width?: number;
  opacity?: number;
};

/**
 * The continuity line: a steady, gently undulating teal flow that keeps moving
 * forward on its own. Handled stretch is solid and glowing, upcoming stretch is
 * a calm dashed tealBlue, and a light pulse travels toward the "now" marker.
 */
export const ContinuityTrack: React.FC<Props> = ({
  draw,
  markerX,
  markerOpacity = 1,
  nodes = [],
  width = WIDTH,
  opacity = 1,
  ...g
}) => {
  const frame = useCurrentFrame();
  const pts: string[] = [];
  for (let x = -20; x <= width + 20; x += 8) pts.push(`${x},${trackY(x, g).toFixed(2)}`);
  const d = `M${pts.join(' L')}`;
  const revealW = (width + 40) * draw;

  // pulses travel from the left edge toward the marker, looping
  const pulses = [0, 0.5].map((o) => (((frame / 75 + o) % 1) * markerX));

  return (
    <svg
      width={width}
      height={1080}
      style={{position: 'absolute', left: 0, top: 0, opacity, overflow: 'visible'}}
    >
      <defs>
        <clipPath id="ctReveal">
          <rect x={-20} y={0} width={revealW} height={1080} />
        </clipPath>
        <clipPath id="ctDone">
          <rect x={-20} y={0} width={Math.min(revealW, markerX + 20)} height={1080} />
        </clipPath>
        <linearGradient id="ctGrad" x1="0" x2={markerX} y1="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={COLORS.tealBlue} stopOpacity={0.2} />
          <stop offset="55%" stopColor={COLORS.tealBlue} />
          <stop offset="100%" stopColor={COLORS.teal} />
        </linearGradient>
        <filter id="ctGlow" x="-10%" y="-200%" width="120%" height="500%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id="ctDotGlow" x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      <g clipPath="url(#ctReveal)">
        {/* upcoming — calm dashed line */}
        <path
          d={d}
          fill="none"
          stroke={hexA(COLORS.tealBlue, 0.7)}
          strokeWidth={3}
          strokeDasharray="2 14"
          strokeDashoffset={-g.scroll}
          strokeLinecap="round"
        />
        {/* handled — solid glowing teal */}
        <g clipPath="url(#ctDone)">
          <path d={d} fill="none" stroke={COLORS.teal} strokeWidth={10} opacity={0.35} filter="url(#ctGlow)" />
          <path d={d} fill="none" stroke="url(#ctGrad)" strokeWidth={4} strokeLinecap="round" />
          {pulses.map((px, i) => (
            <circle
              key={i}
              cx={px}
              cy={trackY(px, g)}
              r={5}
              fill={COLORS.white}
              opacity={0.15 + 0.75 * (px / markerX)}
              filter="url(#ctDotGlow)"
            />
          ))}
        </g>

        {nodes.map((n, i) => (
          <g key={i} transform={`translate(${n.x} ${trackY(n.x, g)})`}>
            <circle r={11} fill={COLORS.slate} stroke={n.done > 0.5 ? COLORS.teal : hexA(COLORS.tealBlue, 0.9)} strokeWidth={2.5} />
            <circle r={5.5 * n.done} fill={COLORS.teal} />
          </g>
        ))}
      </g>

      {/* "now" marker */}
      <g opacity={markerOpacity * Math.min(1, draw * 1.6)} transform={`translate(${markerX} ${trackY(markerX, g)})`}>
        <circle r={24 + Math.sin(frame / 12) * 3} fill={hexA(COLORS.teal, 0.12)} />
        <circle r={14} fill={COLORS.slate} stroke={COLORS.teal} strokeWidth={3} />
        <circle r={6} fill={COLORS.teal} />
      </g>
    </svg>
  );
};

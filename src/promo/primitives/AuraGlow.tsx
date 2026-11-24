import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, rgba} from '../theme';

export type Blob = {x: number; y: number; r: number; color: string; alpha?: number};

/**
 * Crisp off-white canvas with soft diffused aura halos (filter: blur(60px+)).
 * Blobs drift and breathe continuously so holds never sit still.
 */
export const AuraGlow: React.FC<{blobs: Blob[]; intensity?: number; grain?: boolean}> = ({
  blobs,
  intensity = 1,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.canvas, overflow: 'hidden'}}>
      {/* faint top-to-bottom light falloff */}
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${C.white} 0%, ${C.canvas} 60%, #F1F5F9 100%)`}} />
      {blobs.map((b, i) => {
        const breathe = 1 + Math.sin(frame / 28 + i * 1.7) * 0.06;
        const dx = Math.sin(frame / 50 + i) * 30;
        const dy = Math.cos(frame / 44 + i * 2) * 22;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: b.x - b.r + dx,
              top: b.y - b.r + dy,
              width: b.r * 2,
              height: b.r * 2,
              borderRadius: '50%',
              background: rgba(b.color, (b.alpha ?? 0.35) * intensity),
              filter: 'blur(80px)',
              transform: `scale(${breathe})`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

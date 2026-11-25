import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {HEIGHT, SAFE, ease, exitAt, mix} from '../theme';

/** Centers a scene inside the Reels safe area and handles the calm rise-in / lift-out. */
export const SceneShell: React.FC<{duration: number; children: React.ReactNode; fadeIn?: boolean; align?: 'stretch' | 'center'}> = ({
  duration,
  children,
  fadeIn = true,
  align = 'stretch',
}) => {
  const frame = useCurrentFrame();
  const enter = fadeIn ? ease(frame, 0, 24) : 1;
  const out = exitAt(frame, duration);
  return (
    <AbsoluteFill
      style={{
        padding: `${SAFE.top}px ${SAFE.right}px ${HEIGHT - SAFE.bottom}px ${SAFE.left}px`,
        justifyContent: 'center',
        alignItems: align,
        opacity: enter * (1 - out),
        transform: `translateY(${mix(50, 0, enter) - 60 * out}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

import React from 'react';
import {DEVANAGARI, SANS, SERIF} from '../fonts';
import {C, rgba} from '../theme';

/**
 * Brand mark: a crimson tile holding "र" (first letter of रक्षा).
 * Swap for the official rakshyanp.com logo file if/when one is provided.
 */
export const RakshyaMark: React.FC<{size?: number}> = ({size = 96}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.3,
      background: `linear-gradient(150deg, ${C.crimsonBright} 0%, ${C.crimson} 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: `0 ${size * 0.18}px ${size * 0.4}px ${rgba(C.crimson, 0.28)}`,
      flexShrink: 0,
    }}
  >
    <span style={{fontFamily: DEVANAGARI, fontWeight: 500, fontSize: size * 0.56, color: C.white, lineHeight: 1, marginTop: size * 0.04}}>र</span>
  </div>
);

export const RakshyaLockup: React.FC<{size?: number; tagline?: string}> = ({
  size = 96,
  tagline = 'रक्षा · A safer Nepal, together',
}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: size * 0.28}}>
    <RakshyaMark size={size} />
    <div style={{display: 'flex', flexDirection: 'column', gap: size * 0.04}}>
      <span style={{fontFamily: SERIF, fontSize: size * 0.86, lineHeight: 0.95, color: C.ink, letterSpacing: '-0.015em'}}>Rakshya</span>
      <span style={{fontFamily: SANS, fontWeight: 500, fontSize: size * 0.24, color: C.inkSoft, letterSpacing: '0.02em'}}>{tagline}</span>
    </div>
  </div>
);

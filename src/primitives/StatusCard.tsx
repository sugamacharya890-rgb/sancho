import React from 'react';
import {useCurrentFrame} from 'remotion';
import {COLORS, hexA, mixHex} from '../theme/theme';
import {FONT_UI} from '../theme/fonts';
import {Icon, IconName} from './Icons';

export type CardData = {
  icon: IconName;
  title: string;
  /** Meta line while unresolved (e.g. "3 days left"). */
  meta: string;
  /** Meta line once resolved (e.g. "Refilled · delivered"). */
  resolvedMeta?: string;
};

type Props = CardData & {
  width?: number;
  /** 0 = amber / unresolved, 1 = teal / resolved. */
  resolved?: number;
  /** 0..1 strength of the amber warning pulse ring. */
  alert?: number;
  /** Frame offset so pulses don't all fire in sync. */
  phase?: number;
  /** Draw a soft glow under resolved cards. */
  style?: React.CSSProperties;
};

/**
 * The single card primitive used for scattered care details (Scene 1), the
 * aligned items on the continuity track (Scene 2) and summary rows (Scene 3).
 */
export const StatusCard: React.FC<Props> = ({
  icon,
  title,
  meta,
  resolvedMeta,
  width = 380,
  resolved = 0,
  alert = 0,
  phase = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const tone = mixHex(COLORS.amber, COLORS.teal, resolved);
  const pulseT = ((frame + phase) % 54) / 54;
  const pulse = alert * (1 - resolved);

  const showResolvedMeta = resolvedMeta !== undefined;
  const metaA = showResolvedMeta ? 1 - resolved : 1;

  return (
    <div
      style={{
        position: 'relative',
        width,
        boxSizing: 'border-box',
        padding: '18px 20px',
        borderRadius: 20,
        background: `linear-gradient(160deg, ${hexA('#24324A', 0.96)}, ${hexA(COLORS.card, 0.96)})`,
        border: `1.5px solid ${mixHex('#34445C', '#23756F', resolved)}`,
        boxShadow: `0 18px 40px ${hexA('#02070D', 0.45)}, 0 0 ${28 * resolved}px ${hexA(COLORS.teal, 0.18 * resolved)}`,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        fontFamily: FONT_UI,
        ...style,
      }}
    >
      {/* amber warning pulse ring */}
      {pulse > 0.01 && (
        <div
          style={{
            position: 'absolute',
            inset: -2 - pulseT * 14,
            borderRadius: 22 + pulseT * 14,
            border: `2px solid ${hexA(COLORS.amber, (1 - pulseT) * 0.55 * pulse)}`,
            pointerEvents: 'none',
          }}
        />
      )}
      {/* resolved accent edge */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 18,
          bottom: 18,
          width: 3,
          borderRadius: 3,
          background: tone,
          opacity: 0.35 + resolved * 0.65,
        }}
      />
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: tone,
          opacity: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: `inset 0 0 0 100px ${hexA(COLORS.card, 0.82)}`,
        }}
      >
        <Icon name={icon} size={26} color={tone} />
      </div>
      <div style={{flex: 1, minWidth: 0}}>
        <div
          style={{
            color: COLORS.white,
            fontSize: 22,
            fontWeight: 600,
            lineHeight: 1.25,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </div>
        <div style={{position: 'relative', height: 24, marginTop: 4}}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              color: COLORS.gray,
              fontSize: 17.5,
              fontWeight: 500,
              whiteSpace: 'nowrap',
              opacity: metaA,
              transform: `translateY(${(1 - metaA) * -8}px)`,
            }}
          >
            {meta}
          </div>
          {showResolvedMeta && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                color: COLORS.teal,
                fontSize: 17.5,
                fontWeight: 500,
                whiteSpace: 'nowrap',
                opacity: resolved,
                transform: `translateY(${(1 - resolved) * 8}px)`,
              }}
            >
              {resolvedMeta}
            </div>
          )}
        </div>
      </div>
      {/* status badge: amber dot → teal check */}
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 17,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: hexA(COLORS.teal, 0.16 * resolved),
          border: `1.5px solid ${resolved > 0.02 ? hexA(COLORS.teal, 0.7 * resolved) : 'transparent'}`,
        }}
      >
        {resolved < 0.5 ? (
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              background: COLORS.amber,
              opacity: (1 - resolved * 2) * (0.7 + 0.3 * Math.sin((frame + phase) / 6)),
              boxShadow: `0 0 12px ${hexA(COLORS.amber, 0.7)}`,
            }}
          />
        ) : (
          <Icon name="check" size={20} color={COLORS.teal} strokeWidth={2.6} draw={(resolved - 0.5) * 2} />
        )}
      </div>
    </div>
  );
};

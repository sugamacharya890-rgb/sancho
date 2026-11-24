import React from 'react';

export type IconName =
  | 'calendar'
  | 'pill'
  | 'flask'
  | 'note'
  | 'heart'
  | 'eye'
  | 'activity'
  | 'doc'
  | 'chat'
  | 'check'
  | 'arrow';

const PATHS: Record<IconName, React.ReactNode> = {
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="3" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
  pill: (
    <>
      <rect x="2.8" y="8.5" width="18.4" height="7" rx="3.5" transform="rotate(-35 12 12)" />
      <path d="M9.2 8.6l5.3 7.2" />
    </>
  ),
  flask: <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3M7.5 14h9" />,
  note: (
    <>
      <path d="M6 3.5h9l4 4V20a.5.5 0 0 1-.5.5h-12A.5.5 0 0 1 6 20z" />
      <path d="M9 11h7M9 14.5h7M9 18h4" />
    </>
  ),
  heart: <path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10zM6 12h3l1.5-2.5 2 5 1.5-2.5h4" />,
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  activity: <path d="M3 12h4l2.5-6 5 12 2.5-6h4" />,
  doc: (
    <>
      <rect x="5" y="3.5" width="14" height="17" rx="2.5" />
      <path d="M8.5 8h7M8.5 12h7M8.5 16h4" />
    </>
  ),
  chat: <path d="M4 5.5h16v10H10l-4.5 4v-4H4z" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
};

export const Icon: React.FC<{
  name: IconName;
  size?: number;
  color: string;
  strokeWidth?: number;
  /** 0..1 stroke draw-on (used for the check mark). */
  draw?: number;
}> = ({name, size = 24, color, strokeWidth = 1.9, draw}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{display: 'block', flexShrink: 0}}
  >
    <g
      style={
        draw === undefined
          ? undefined
          : {strokeDasharray: 30, strokeDashoffset: 30 * (1 - draw)}
      }
    >
      {PATHS[name]}
    </g>
  </svg>
);

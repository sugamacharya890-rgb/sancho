import React from 'react';
import {C} from '../theme';

type IconProps = {size?: number; color?: string};
const Svg: React.FC<IconProps & {children: React.ReactNode}> = ({size = 44, color = C.crimson, children}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

export const BusIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <rect x="4" y="3.5" width="16" height="14" rx="3" />
    <path d="M4 11h16M8 3.5v7.5M16 3.5v7.5" />
    <circle cx="8" cy="14.5" r="1" />
    <circle cx="16" cy="14.5" r="1" />
    <path d="M7 17.5v2.5M17 17.5v2.5" />
  </Svg>
);

export const MessageIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M4 5.5h16v10H10l-4.5 3.5V15.5H4z" />
    <path d="M8 9.5h8M8 12h5" />
  </Svg>
);

export const ChildIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="6.5" r="2.6" />
    <path d="M7.5 20v-4.5a4.5 4.5 0 0 1 9 0V20" />
    <path d="M10.5 13.5c.4.4.9.6 1.5.6s1.1-.2 1.5-.6" />
  </Svg>
);

export const ShieldIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M12 3l7 3v5.5c0 4.5-3 7.8-7 9.5-4-1.7-7-5-7-9.5V6z" />
    <path d="M9 12l2.2 2.2L15.5 10" />
  </Svg>
);

export const PeopleIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3.5 19.5a5.5 5.5 0 0 1 11 0" />
    <circle cx="17" cy="9" r="2.3" />
    <path d="M16 13.6a4.5 4.5 0 0 1 5 5.9" />
  </Svg>
);

export const PhoneIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M6.5 3.5h3l1.5 4-2 1.3a10 10 0 0 0 5.2 5.2l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z" />
  </Svg>
);

export const CompassIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M15.5 8.5l-2 5-5 2 2-5z" />
  </Svg>
);

export const ArrowIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);

export const LockIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
    <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
  </Svg>
);

export const CheckIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M5.5 12.5l4 4 9-9" />
  </Svg>
);

export const BookmarkIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M7 3.5h10v17l-5-3.6-5 3.6z" />
  </Svg>
);

export const SendIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M20.5 3.5L10 14M20.5 3.5l-6.5 17-4-6.5-6.5-4z" />
  </Svg>
);

export const ExitIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M14 4.5h4.5v15H14M10 8l-4 4 4 4M6 12h9" />
  </Svg>
);

export const EyeOffIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M3.5 12s3-6 8.5-6c1.6 0 3 .5 4.2 1.2M20.5 12s-3 6-8.5 6c-1.6 0-3-.5-4.2-1.2" />
    <path d="M4.5 4.5l15 15" />
  </Svg>
);

export const MaskIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="8.5" r="3.5" />
    <path d="M5 20a7 7 0 0 1 14 0" />
    <path d="M9.5 8.3h5" />
  </Svg>
);

export const MoonIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z" />
  </Svg>
);

export const SchoolIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M3.5 9.5L12 5l8.5 4.5L12 14z" />
    <path d="M7 11.5v4.5c1.4 1.3 3 2 5 2s3.6-.7 5-2v-4.5M20.5 9.5v5" />
  </Svg>
);

export const PinIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z" />
    <circle cx="12" cy="10" r="2.4" />
  </Svg>
);

export const ClipIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <rect x="7" y="3.5" width="10" height="17" rx="5" />
    <path d="M10 8.5v7a2 2 0 0 0 4 0V7" />
  </Svg>
);

export const SoundIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="2.5" />
    <path d="M8 8a5.6 5.6 0 0 0 0 8M16 8a5.6 5.6 0 0 1 0 8M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14" />
  </Svg>
);

export const BookIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M12 6.5C10 5 7 4.5 4 5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V5c-3-.5-6 0-8 1.5zM12 6.5v13" />
  </Svg>
);

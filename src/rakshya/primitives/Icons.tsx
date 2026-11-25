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

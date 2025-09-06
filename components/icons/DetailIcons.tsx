

import React from 'react';

// FIX: Add IconProps interface to allow passing className.
interface IconProps {
    className?: string;
}

// FIX: Update IconWrapper to accept and apply className prop.
const IconWrapper: React.FC<IconProps & { children: React.ReactNode }> = ({ children, className }) => (
  <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {children}
  </svg>
);

// FIX: Update component to accept IconProps.
export const ClockIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </IconWrapper>
);

// FIX: Update component to accept IconProps.
export const GaugeIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <path d="M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0 -20 0" />
    <path d="M12 12l0 -5" />
    <path d="M12 12l-3.5 2" />
  </IconWrapper>
);

// FIX: Update component to accept IconProps.
export const RoadIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}>
        <path d="M4 19l4-14" />
        <path d="M16 5l4 14" />
        <path d="M12 8v8" />
    </IconWrapper>
);

// FIX: Update component to accept IconProps.
export const StopIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}>
        <circle cx="12" cy="12" r="10" />
        <rect x="9" y="9" width="6" height="6" />
    </IconWrapper>
);

// FIX: Update component to accept IconProps.
export const GpsIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
        <line x1="12" y1="2" x2="12" y2="5" />
        <line x1="12" y1="19" x2="12" y2="22" />
        <line x1="2" y1="12" x2="5" y2="12" />
        <line x1="19" y1="12" x2="22" y2="12" />
    </IconWrapper>
);

// FIX: Update component to accept IconProps.
export const SignalSlashIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}>
        <path d="M12 18l.01 0" />
        <path d="M9.172 15.172a4 4 0 0 1 5.656 0" />
        <path d="M6.343 12.343a8 8 0 0 1 11.314 0" />
        <path d="M3 3l18 18" />
    </IconWrapper>
);

// FIX: Update component to accept IconProps.
export const CycleIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}>
        <path d="M12 2v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="m4.93 19.07 1.41-1.41" />
        <path d="M12 20v2" />
        <path d="m19.07 19.07-1.41-1.41" />
        <path d="M22 12h-2" />
        <path d="m19.07 4.93-1.41-1.41" />
        <path d="M10 4.204a8.001 8.001 0 0 0-4.196 1.8" />
        <path d="M3.5 10.065a8 8 0 0 0 0 3.87" />
        <path d="M10 19.796a8 8 0 0 0 4-1.801" />
        <path d="M18.696 15.1A8.001 8.001 0 0 0 20.5 12" />
    </IconWrapper>
);

// FIX: Update component to accept IconProps.
export const UsersIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </IconWrapper>
);

export const CheckCircleIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </IconWrapper>
);
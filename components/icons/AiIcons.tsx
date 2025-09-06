

import React from 'react';

// FIX: Added IconProps interface to allow passing className to icons.
interface IconProps {
    className?: string;
}

// FIX: Updated IconWrapper to accept and apply className prop.
const IconWrapper: React.FC<IconProps & { children: React.ReactNode }> = ({ children, className }) => (
  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {children}
  </svg>
);

// FIX: Updated component to accept IconProps.
export const SparklesIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}>
        <path d="M12 3L9.5 8L4 9.5L9.5 11L12 16L14.5 11L20 9.5L14.5 8L12 3z"/>
        <path d="M5 21L6 18"/>
        <path d="M19 21L18 18"/>
        <path d="M21 5l-3 1"/>
        <path d="M3 5l3 1"/>
    </IconWrapper>
);

// FIX: Updated component to accept IconProps.
export const RouteIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}>
        <circle cx="6" cy="19" r="2" />
        <circle cx="18" cy="5" r="2" />
        <path d="M12 19h4.5a3.5 3.5 0 0 0 0-7h-7a3.5 3.5 0 0 1 0-7H12" />
    </IconWrapper>
);

// FIX: Updated component to accept IconProps.
export const ClockIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </IconWrapper>
);

// FIX: Updated component to accept IconProps.
export const BrainIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}>
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15A2.5 2.5 0 0 1 9.5 22h-1A2.5 2.5 0 0 1 6 19.5v-15A2.5 2.5 0 0 1 8.5 2h1Z" />
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15A2.5 2.5 0 0 0 14.5 22h1A2.5 2.5 0 0 0 18 19.5v-15A2.5 2.5 0 0 0 15.5 2h-1Z" />
    </IconWrapper>
);

// FIX: Updated component to accept IconProps.
export const UserIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </IconWrapper>
);

// FIX: Updated component to accept IconProps.
export const NavigationIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}>
        <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </IconWrapper>
);

// FIX: Updated component to accept IconProps.
export const SearchIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </IconWrapper>
);

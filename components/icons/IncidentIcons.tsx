
import React from 'react';

interface IconProps {
    className?: string;
    width?: number | string;
    height?: number | string;
}

const IconWrapper: React.FC<IconProps & { children: React.ReactNode }> = ({ children, className, width = 24, height = 24 }) => (
    <svg 
        aria-hidden="true"
        width={width} 
        height={height} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        {children}
    </svg>
);

export const TrafficIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}>
        <rect x="7" y="2" width="10" height="20" rx="3" />
        <circle cx="12" cy="7" r="1.5" fill="currentColor" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        <circle cx="12" cy="17" r="1.5" fill="currentColor" />
    </IconWrapper>
);

export const AccidentIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}>
        <path d="M10 22V16" />
        <path d="M5 16H3l-1-5 4-1 1 5Z" />
        <path d="M14 16h2l1-5-4-1-1 5Z" />
        <path d="M4 11V9" />
        <path d="M15 11V9" />
    </IconWrapper>
);

export const HazardIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}>
        <path d="M12 2L2 22h20L12 2z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </IconWrapper>
);

export const PoliceIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}>
        <path d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3z" />
        <path d="m9 12 2 2 4-4" />
    </IconWrapper>
);

export const RoadClosureIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}>
        <path d="M18 6L6 18" />
        <path d="M6 6l12 12" />
        <path d="M12 4V2" />
        <path d="M12 22v-2" />
        <path d="M20 12h2" />
        <path d="M2 12h2" />
    </IconWrapper>
);

export const FuelIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}>
        <line x1="10" y1="14" x2="10" y2="22" />
        <line x1="6" y1="14" x2="6" y2="22" />
        <path d="M17 14V5.2a2 2 0 0 0-1.4-1.9L9.8 2.1a2 2 0 0 0-2.2 1.2L6 8" />
        <path d="M6 10h11v4h-11z" />
    </IconWrapper>
);

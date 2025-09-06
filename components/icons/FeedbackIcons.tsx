
import React from 'react';

interface IconProps {
    className?: string;
}

const IconWrapper: React.FC<IconProps & { children: React.ReactNode }> = ({ children, className }) => (
  <svg 
    aria-hidden="true"
    width="24" 
    height="24" 
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

export const ThumbsUpIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}>
        <path d="M7 10v12" />
        <path d="M17 10V4a2 2 0 00-2-2v0a2 2 0 00-2 2v6h5l2 8H7" />
    </IconWrapper>
);

export const ThumbsDownIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}>
        <path d="M7 14V2" />
        <path d="M17 14v6a2 2 0 002-2v0a2 2 0 00-2-2h-5l-2-8H7" />
    </IconWrapper>
);

export const BroomIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}>
        <path d="M19.4 12.6 14 7.2 12 5H7l-2.4 2.4a2 2 0 0 0 0 2.8L7.4 13l2.3 2.3-2.7 2.7" />
        <path d="M18 11.5 12.5 6" />
        <path d="M14 16h6" />
    </IconWrapper>
);

export const MusicIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}>
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
    </IconWrapper>
);

export const OvercrowdIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}>
        <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
    </IconWrapper>
);

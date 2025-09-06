

import React from 'react';

// FIX: Added IconProps interface to allow passing className to icons.
interface IconProps {
    className?: string;
}

// FIX: Updated IconWrapper to accept and apply className prop.
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

// FIX: Updated component to accept IconProps.
export const InfoIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
    </IconWrapper>
);

// FIX: Updated component to accept IconProps.
export const CheckCircleIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </IconWrapper>
);

// FIX: Updated component to accept IconProps.
export const WarningIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}>
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </IconWrapper>
);

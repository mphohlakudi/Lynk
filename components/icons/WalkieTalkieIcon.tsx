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

export const WalkieTalkieIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}>
        <path d="M18 6L6 18" />
        <path d="M12 20v-4" />
        <path d="M12 8V4" />
        <path d="M14 10a2 2 0 01-4 0" />
        <path d="M10 14a2 2 0 014 0" />
        <rect x="4" y="4" width="16" height="16" rx="2" />
    </IconWrapper>
);

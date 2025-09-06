import React from 'react';

interface IconProps {
    className?: string;
}

const IconWrapper: React.FC<IconProps & { children: React.ReactNode }> = ({ children, className }) => (
  <svg 
    aria-hidden="true"
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="currentColor"
    className={className || "text-white"}
  >
    {children}
  </svg>
);

export const PlayIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}>
        <path d="M8 5v14l11-7z" />
    </IconWrapper>
);

export const PauseIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props} className={props.className || "text-cyan-400"}>
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </IconWrapper>
);

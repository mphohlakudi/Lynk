import React from 'react';

interface IconProps {
    className?: string;
    width?: number | string;
    height?: number | string;
}

export const SpeakerIcon: React.FC<IconProps> = ({ className, width = 24, height = 24 }) => (
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
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
);

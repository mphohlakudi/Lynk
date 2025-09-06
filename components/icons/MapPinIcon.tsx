
import React from 'react';

interface IconProps {
    className?: string;
}

export const MapPinIcon: React.FC<IconProps> = ({ className }) => (
    <svg 
        aria-hidden="true"
        width="5" 
        height="5" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={className}
    >
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
    </svg>
);

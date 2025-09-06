
import React from 'react';

interface IconProps {
    className?: string;
}

export const DirectionalArrowIcon: React.FC<IconProps> = ({ className }) => (
    <svg 
        aria-hidden="true"
        width="80" 
        height="80" 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <defs>
            <linearGradient id="arrowGradient" x1="50" y1="15" x2="50" y2="85" gradientUnits="userSpaceOnUse">
                <stop stopColor="#06B6D4" />
                <stop offset="1" stopColor="#22D3EE" />
            </linearGradient>
        </defs>
        <path 
            d="M50 15 L85 85 L50 70 L15 85 Z" 
            fill="url(#arrowGradient)" 
            stroke="#FFFFFF" 
            strokeWidth="3"
            strokeLinejoin="round"
        />
    </svg>
);

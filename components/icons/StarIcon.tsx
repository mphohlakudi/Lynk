

import React from 'react';

interface StarIconProps {
    className?: string;
    filled?: boolean;
    half?: boolean;
}

export const StarIcon: React.FC<StarIconProps> = ({ className, filled = false, half = false }) => {
    const starId = `star-grad-${React.useId()}`;
    const fullPath = "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";
    
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            fill="none"
            aria-hidden="true"
        >
            <defs>
                <linearGradient id={starId}>
                    <stop offset="50%" stopColor="currentColor" />
                    <stop offset="50%" stopColor="transparent" stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={fullPath} stroke="currentColor" fill={
                half ? `url(#${starId})` : (filled ? 'currentColor' : 'none')
            } />
        </svg>
    );
};

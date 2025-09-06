
import React from 'react';

interface IconProps {
    className?: string;
}

export const CloudDownloadIcon: React.FC<IconProps> = ({ className }) => (
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
        <path d="M8 17l4 4 4-4" />
        <path d="M12 12v9" />
        <path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29" />
    </svg>
);

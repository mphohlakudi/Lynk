
import React from 'react';

interface IconProps {
    className?: string;
}

export const HapticIcon: React.FC<IconProps> = ({ className }) => (
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
        <path d="M3 8a4.95 4.95 0 0 1 0 8" />
        <path d="M6 5a9.07 9.07 0 0 1 0 14" />
        <path d="M9 2a12.94 12.94 0 0 1 0 20" />
    </svg>
);

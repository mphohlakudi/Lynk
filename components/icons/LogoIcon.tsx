

import React from 'react';

export const LogoIcon: React.FC = () => (
    <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-yellow-400"
        aria-hidden="true"
    >
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="8" y1="4" x2="8" y2="12" />
        <path d="M16 4v3" />
        <path d="M19 4v3" />
        <circle cx="7" cy="19" r="2" fill="currentColor" />
        <circle cx="17" cy="19" r="2" fill="currentColor" />
    </svg>
);


import React from 'react';

// FIX: Added IconProps interface to allow passing props to the component.
interface IconProps {
    className?: string;
}

// FIX: Updated component to accept props. The default className is for usages without props.
export const TruckIcon: React.FC<IconProps> = ({ className = "text-cyan-400" }) => (
    <svg aria-hidden="true" width="6" height="6" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11C5.84 5 5.28 5.42 5.08 6.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
    </svg>
);

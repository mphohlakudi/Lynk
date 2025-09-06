
import React from 'react';

interface IconProps {
    className?: string;
    style?: React.CSSProperties;
}

const PixelIconWrapper: React.FC<IconProps & { children: React.ReactNode }> = ({ children, className, style }) => (
  <svg 
    aria-hidden="true"
    width="32" 
    height="32" 
    viewBox="0 0 24 24" 
    className={className}
    style={style}
    shapeRendering="crispEdges"
    fill="currentColor"
  >
    {children}
  </svg>
);

export const DotIcon: React.FC<IconProps> = (props) => (
    <PixelIconWrapper {...props}>
        <path d="M10 10h4v4h-4z"/>
    </PixelIconWrapper>
);

export const HeartIcon: React.FC<IconProps> = (props) => (
    <PixelIconWrapper {...props}>
        <path d="M9 6h2v1h-2zm4 0h2v1h-2z M7 7h10v1h-10z M6 8h12v2h-12z M7 10h10v1h-10z M8 11h8v1h-8z M9 12h6v1h-6z M10 13h4v1h-4z M11 14h2v1h-2z"/>
    </PixelIconWrapper>
);

export const CoinIcon: React.FC<IconProps> = (props) => (
    <PixelIconWrapper {...props}>
        <path d="M9 2 h6 v1 h2 v1 h1 v16 h-1 v1 h-2 v1 H9 v-1 H7 v-1 H6 V4 h1 V3 h2 V2z M9 5 v14 h6 V5 H9z M10 7 h4 v10 h-4 V7z"/>
    </PixelIconWrapper>
);

export const MolotovIcon: React.FC<IconProps> = (props) => (
    <PixelIconWrapper {...props}>
        <path d="M10 3 h1 v1 h1 v1 h1 v1 h-1 v1 h-1 v-1 h-1 v-1 h-1 v-1 h1z M7 9 h10 v1 h1 v10 H6 v-10 h1 V9z M8 11 v8 h8 v-8 H8z"/>
    </PixelIconWrapper>
);

export const GhostIcon: React.FC<IconProps> = (props) => (
    <PixelIconWrapper {...props}>
        <path d="M8 6 h8 v1 h2 v8 h-1 v1 h-2 v1 h-2 v-1 h-2 v1 h-2 v-1 h-2 v-1 h-1 v-8 h2 v-1 z M9 9 h3 v3 h-3 z M13 9 h3 v3 h-3 z"/>
    </PixelIconWrapper>
);

export const KeyIcon: React.FC<IconProps> = (props) => (
    <PixelIconWrapper {...props}>
        <path d="M6 3 h10 v8 H6z M8 5 v4 h6 v-4 H8z M10 11 v10 h2 v-10z M12 16 h2 v2 h-2z M12 19 h4 v2 h-4z"/>
    </PixelIconWrapper>
);
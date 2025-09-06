
import { useState, useEffect } from 'react';

export type Orientation = 'portrait' | 'landscape';

export const useScreenOrientation = (): Orientation => {
    const getOrientation = () => {
        // Check if window and matchMedia are available
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
            return 'landscape'; // Default for server-side rendering or unsupported environments
        }
        return window.matchMedia("(orientation: portrait)").matches ? 'portrait' : 'landscape';
    };

    const [orientation, setOrientation] = useState<Orientation>(getOrientation());

    useEffect(() => {
        // Ensure this effect runs only on the client side
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
            return;
        }

        const mediaQuery = window.matchMedia("(orientation: portrait)");

        const handleOrientationChange = (e: MediaQueryListEvent) => {
            setOrientation(e.matches ? 'portrait' : 'landscape');
        };
        
        mediaQuery.addEventListener('change', handleOrientationChange);

        return () => {
            mediaQuery.removeEventListener('change', handleOrientationChange);
        };
    }, []);

    return orientation;
};

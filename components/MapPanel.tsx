
import React, { useState, useEffect, useCallback } from 'react';
import { Trip, RouteSegment, TripPhase, Point, AppMode, CommuterStatus, CommuterStatusType, HailPing, WalkieTalkieMessage, CommuterAvatar } from '../types';
import { DirectionalArrowIcon } from './icons/DirectionalArrowIcon';
import { TruckIcon } from './icons/TruckIcon';
import { MapPinIcon } from './icons/MapPinIcon';
import { CloudDownloadIcon } from './icons/CloudDownloadIcon';
import { SpeakerIcon } from './icons/SpeakerIcon';
import { HeartIcon, CoinIcon, MolotovIcon, GhostIcon, KeyIcon, DotIcon } from './icons/CommuterAvatarIcons';

interface MapPanelProps {
    trip: Trip;
    route: RouteSegment[];
    isOffline?: boolean;
    appMode: AppMode;
    commuterPosition: Point | null;
    commuterStatus: CommuterStatus;
    commuterAvatar: CommuterAvatar;
    isMapCached?: boolean;
    hailPings: HailPing[];
    walkieTalkieMessages: WalkieTalkieMessage[];
}

// Helper functions for distance calculation
const distance = (p1: Point, p2: Point) => Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

const findClosestPointOnSegment = (p: Point, a: Point, b: Point): Point => {
    const atob = { x: b.x - a.x, y: b.y - a.y };
    const atop = { x: p.x - a.x, y: p.y - a.y };
    const len = atob.x * atob.x + atob.y * atob.y;
    if (len === 0) return a;
    let t = (atop.x * atob.x + atop.y * atob.y) / len;
    t = Math.max(0, Math.min(1, t));
    return { x: a.x + atob.x * t, y: a.y + atob.y * t };
};

const calculateDistanceAlongRoute = (point: Point, route: RouteSegment[]): number => {
    let minDistance = Infinity;
    let bestSegmentIndex = -1;
    let closestPointOnRoute: Point | null = null;

    route.forEach((segment, index) => {
        const closestPointOnSegment = findClosestPointOnSegment(point, segment.start, segment.end);
        const d = distance(point, closestPointOnSegment);
        if (d < minDistance) {
            minDistance = d;
            bestSegmentIndex = index;
            closestPointOnRoute = closestPointOnSegment;
        }
    });

    if (bestSegmentIndex === -1 || !closestPointOnRoute) return 0;

    let totalDistance = 0;
    for (let i = 0; i < bestSegmentIndex; i++) {
        totalDistance += route[i].distance;
    }

    totalDistance += distance(route[bestSegmentIndex].start, closestPointOnRoute);
    return totalDistance;
};

const MapPanel: React.FC<MapPanelProps> = ({ trip, route, isOffline = false, appMode, commuterPosition, commuterStatus, commuterAvatar, isMapCached = false, hailPings = [], walkieTalkieMessages = [] }) => {
    const [heading, setHeading] = useState<number | null>(null);
    const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied'>('prompt');

    const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
        if (event.alpha !== null) {
            setHeading(event.alpha); // Compass heading, 0 is North
        }
    }, []);

    const requestPermission = useCallback(async () => {
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            try {
                const status = await (DeviceOrientationEvent as any).requestPermission();
                if (status === 'granted') {
                    setPermissionState('granted');
                    window.addEventListener('deviceorientation', handleOrientation);
                } else {
                    setPermissionState('denied');
                }
            } catch (e) {
                setPermissionState('denied');
            }
        } else {
            // For browsers that don't require permission
            setPermissionState('granted');
            window.addEventListener('deviceorientation', handleOrientation);
        }
    }, [handleOrientation]);

    useEffect(() => {
        // Automatically try to enable compass on non-iOS browsers
        if (typeof (DeviceOrientationEvent as any).requestPermission !== 'function') {
            requestPermission();
        }
        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, [handleOrientation, requestPermission]);

    const renderDriverOrOnboardView = () => {
        const userPos = trip.currentPosition;
        const isCommuterOnboard = appMode === AppMode.Commuter && commuterStatus.destinationPosition;
        const destinationPos = isCommuterOnboard
            ? commuterStatus.destinationPosition as Point
            : (route.length > 0 ? route[route.length - 1].end : userPos);
        
        const dx = destinationPos.x - userPos.x;
        const dy = destinationPos.y - userPos.y;

        // Bearing: angle in degrees from North, clockwise.
        const bearing = (Math.atan2(dx, -dy) * (180 / Math.PI) + 360) % 360;
        
        // Rotate arrow to point in the real-world direction of the destination
        const arrowRotation = heading !== null ? bearing - heading : bearing;

        const isMainTrip = trip.phase === TripPhase.MainRoute || trip.phase === TripPhase.ToRank;
        
        const etaMinutes = isCommuterOnboard ? commuterStatus.etaMinutes : trip.eta;
        // Derive distance from ETA for display: distance = speed * time. speed = 10 units/sec
        const remainingDistanceUnits = (etaMinutes ?? 0) * 60 * 10;
        const remainingKm = Math.max(0, (remainingDistanceUnits * 17.5) / 1000);

        const nextStreet = isCommuterOnboard 
            ? commuterStatus.destinationName || 'Your Stop'
            : (isMainTrip && trip.segmentIndex >= 0 && trip.segmentIndex + 1 < route.length ? route[trip.segmentIndex + 1].street : trip.destination);

        const maxPingDistance = 150; // Max distance in map units to show a ping
        const radarVhSize = 40; // Pings at max distance will be this many vh units from center

        if (permissionState === 'prompt' && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            return (
                <div className="text-center">
                    <p className="text-white mb-4">Enable compass for accurate directions.</p>
                    <button onClick={requestPermission} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg">
                        Enable Compass
                    </button>
                </div>
            );
        }

        return (
            <>
                {permissionState === 'denied' && (
                     <div className="absolute top-4 left-4 right-4 bg-yellow-900/50 border border-yellow-700 text-yellow-300 text-sm p-2 rounded-lg text-center z-10" role="alert">
                        Compass access denied. Arrow points relative to top of screen.
                    </div>
                )}
                <div className="absolute top-8 text-center transition-opacity duration-500" role="status" aria-live="polite">
                    <p className="text-gray-400 text-lg">{isCommuterOnboard ? 'Approaching' : 'Next'}</p>
                    <p className="text-white text-3xl font-bold">{nextStreet}</p>
                </div>

                <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
                    <div className="absolute inset-0 transition-transform duration-500 ease-linear" style={{ transform: `rotate(${arrowRotation}deg)` }}>
                         <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full border-2 border-black shadow-lg"></div>
                    </div>
                    
                    <div className="transition-transform duration-500 ease-in-out" style={{ transform: `rotate(${arrowRotation}deg)` }}>
                        <DirectionalArrowIcon />
                    </div>

                    <div className="absolute w-3 h-3">
                        <div 
                            className="absolute w-full h-full rounded-full border border-cyan-400/75 animate-ripple"
                            style={{ animationDelay: '0s' }}
                        ></div>
                        <div 
                            className="absolute w-full h-full rounded-full border border-cyan-400/75 animate-ripple"
                            style={{ animationDelay: '1s' }}
                        ></div>
                    </div>

                    <div className="absolute w-3 h-3 bg-cyan-400 rounded-full border-2 border-black shadow-lg"></div>

                    {/* Hail Pings Overlay */}
                    {appMode === AppMode.Driver && <div className="absolute inset-0" aria-hidden="true">
                        {hailPings.map(ping => {
                            const ping_dx = ping.position.x - userPos.x;
                            const ping_dy = ping.position.y - userPos.y;
                            
                            const pingDist = distance(ping.position, userPos);
                            if (pingDist > maxPingDistance) return null; // Too far

                            const bearingToPing = (Math.atan2(ping_dx, -ping_dy) * (180 / Math.PI) + 360) % 360;
                            const pingRotation = heading !== null ? bearingToPing - heading : bearingToPing;
                            const screenDist = (pingDist / maxPingDistance) * radarVhSize;

                            return (
                                <div 
                                    key={ping.id}
                                    className="absolute top-1/2 left-1/2 w-4 h-4"
                                    style={{ transform: `rotate(${pingRotation}deg) translateY(-${screenDist}vh) translate(-50%, -50%)` }}
                                >
                                    <div className="hail-ping-blip w-full h-full"></div>
                                </div>
                            );
                        })}
                    </div>}
                </div>

                <div className="absolute bottom-8 flex w-full items-end justify-center gap-12 text-center transition-opacity duration-500" role="status" aria-live="polite">
                    <div>
                        <p className="text-white text-4xl font-bold font-mono">{remainingKm.toFixed(1)}</p>
                        <p className="text-gray-400 text-md">km away</p>
                    </div>
                    {isMainTrip && (etaMinutes ?? 0) > 0 && (
                        <div>
                            <p className="text-white text-4xl font-bold font-mono">{etaMinutes}</p>
                            <p className="text-gray-400 text-md">min ETA</p>
                        </div>
                    )}
                </div>
            </>
        );
    };

    const renderCommuterAvatar = (dynamicColor: string) => {
        const props = {
            style: { color: dynamicColor },
            className: "w-8 h-8"
        };
        switch (commuterAvatar) {
            case CommuterAvatar.DOT:
                return <DotIcon {...props} />;
            case CommuterAvatar.HEART:
                return <HeartIcon {...props} />;
            case CommuterAvatar.COIN:
                return <CoinIcon {...props} />;
            case CommuterAvatar.MOLOTOV:
                return <MolotovIcon {...props} />;
            case CommuterAvatar.GHOST:
                return <GhostIcon {...props} />;
            case CommuterAvatar.KEY:
                return <KeyIcon {...props} />;
            default:
                return <DotIcon {...props} />;
        }
    };

    const renderCommuterWaitingView = () => {
        if (!commuterPosition) {
            return (
                <div className="text-center">
                    <p className="text-white">Waiting for commuter location...</p>
                </div>
            );
        }

        const minibusPos = trip.currentPosition;
        const distToMinibus = distance(commuterPosition, minibusPos);
        
        // Proximity is 0 (far) to 1 (close). Color hue shifts from 60 (yellow) to 120 (green).
        const proximity = 1 - Math.min(1, Math.max(0, (distToMinibus - 5) / (100 - 5)));
        const hue = 60 + proximity * 60;
        const dynamicColor = `hsl(${hue}, 90%, 55%)`;

        const distanceKm = Math.max(0, (distToMinibus * 17.5) / 1000);
        const etaMinutes = commuterStatus.countdownSeconds && commuterStatus.countdownSeconds > 0 ? Math.ceil(commuterStatus.countdownSeconds / 60) : 0;
        const isTripActive = trip.phase !== TripPhase.Idle && trip.phase !== TripPhase.Finished;

        return (
            <>
                <div className="absolute top-8 text-center transition-opacity duration-500" role="status" aria-live="polite">
                    <p className="text-gray-400 text-lg">Taxi Location</p>
                    <p className="text-white text-3xl font-bold">{isTripActive ? trip.currentStreet : 'Trip Not Active'}</p>
                </div>

                <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
                    <div className="absolute w-3 h-3">
                        <div 
                            className="absolute w-full h-full rounded-full border animate-ripple"
                            style={{ borderColor: dynamicColor, animationDelay: '0s' }}
                        ></div>
                        <div 
                            className="absolute w-full h-full rounded-full border animate-ripple"
                            style={{ borderColor: dynamicColor, animationDelay: '1s' }}
                        ></div>
                    </div>
                    <div className="absolute flex items-center justify-center">
                        {renderCommuterAvatar(dynamicColor)}
                    </div>
                </div>

                <div className="absolute bottom-8 flex w-full items-end justify-center gap-12 text-center transition-opacity duration-500" role="status" aria-live="polite">
                    {isTripActive ? (
                        <>
                            <div>
                                <p className="text-white text-4xl font-bold font-mono">{distanceKm.toFixed(1)}</p>
                                <p className="text-gray-400 text-md">km away</p>
                            </div>
                            {etaMinutes > 0 && (
                                <div>
                                    <p className="text-white text-4xl font-bold font-mono">{etaMinutes}</p>
                                    <p className="text-gray-400 text-md">min ETA</p>
                                </div>
                            )}
                        </>
                    ) : (
                         <div>
                            <p className="text-gray-400 text-lg">Taxi is currently idle.</p>
                        </div>
                    )}
                </div>
            </>
        );
    };

    const renderCommuterArrivalView = () => (
        <div role="alert" className="absolute inset-0 bg-green-500/20 backdrop-blur-sm flex flex-col items-center justify-center text-center text-white z-10 transition-all duration-500">
            <style>{`.pulse-truck { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; } @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.1); } }`}</style>
            <div className="w-20 h-20 mb-4 pulse-truck">
                <TruckIcon className="w-full h-full text-green-300" />
            </div>
            <h2 className="text-4xl font-bold text-green-100 drop-shadow-lg">Taxi is here!</h2>
            <p className="text-lg mt-2 text-green-200">Please board safely.</p>
        </div>
    );

    const getCommuterContent = () => {
        switch (commuterStatus.type) {
            case CommuterStatusType.EN_ROUTE:
            case CommuterStatusType.APPROACHING_STOP:
                return renderDriverOrOnboardView();
            case CommuterStatusType.ARRIVED_FOR_PICKUP:
                return renderCommuterArrivalView();
            default: // IDLE, AWAITING_PICKUP, etc.
                return renderCommuterWaitingView();
        }
    };

    return (
        <div className="relative w-full h-full bg-black flex flex-col items-center justify-center p-4 overflow-hidden select-none">
            <style>{`
                @keyframes ripple {
                    from { transform: scale(1); opacity: 0.75; }
                    to { transform: scale(45); opacity: 0; }
                }
                .animate-ripple { animation: ripple 2s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
                .hail-ping-blip {
                    border-radius: 50%;
                    background-color: rgba(22, 211, 238, 0.75);
                    box-shadow: 0 0 5px #22D3EE, 0 0 10px #22D3EE;
                    animation: hail-pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                @keyframes hail-pulse {
                    0%, 100% {
                        transform: scale(0.5);
                        opacity: 0.5;
                    }
                    50% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
                @keyframes alert-pulse {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                    50% {
                        transform: scale(1.2);
                        opacity: 0.7;
                    }
                }
                .animate-alert-pulse {
                    animation: alert-pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
            {isOffline && (
                <div role="alert" className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
                    <div className="text-center p-4 rounded-lg">
                        <p className="text-2xl font-bold text-white">OFFLINE MODE</p>
                        <p className="text-gray-300 mt-1">Features may be limited.</p>
                    </div>
                </div>
            )}
            
            {isOffline && isMapCached && (
                <div className="absolute top-4 right-4 bg-green-900/50 border border-green-700 text-green-300 text-xs px-2 py-1 rounded-full flex items-center gap-1.5 z-10">
                    <CloudDownloadIcon className="w-4 h-4" />
                    <span>Offline Map Active</span>
                </div>
            )}

            <svg width="100%" height="100%" className="absolute inset-0" aria-hidden="true">
                <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(107, 114, 128, 0.1)" strokeWidth="1"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Walkie Talkie Message Alerts */}
                {walkieTalkieMessages.map(msg => (
                     <foreignObject key={msg.id} x={msg.position.x - 2} y={msg.position.y - 2} width="4" height="4">
                        <div className="w-full h-full flex items-center justify-center">
                            <SpeakerIcon className="w-4 h-4 text-yellow-400 animate-alert-pulse" />
                        </div>
                    </foreignObject>
                ))}
            </svg>
            
            {appMode === AppMode.Driver ? renderDriverOrOnboardView() : getCommuterContent()}
        </div>
    );
};

export default MapPanel;

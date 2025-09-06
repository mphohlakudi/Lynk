import { Trip, MinibusStatus, RouteSegment, Driver, TripPhase, Destination } from './types';

// New route based on OSM data for Apel, Limpopo
export const ROUTE_SEGMENTS: RouteSegment[] = [
    { street: 'R579 / Jane Furse Rd', start: { x: 42, y: 54 }, end: { x: 52, y: 42 }, distance: 156 },
    { street: 'Apel Main Rd', start: { x: 52, y: 42 }, end: { x: 61, y: 33 }, distance: 127, stopDuration: 15, landmarks: ["Apel Community Hall", "Local Market"] },
    { street: 'Mooiplaas St', start: { x: 61, y: 33 }, end: { x: 74, y: 42 }, distance: 158, landmarks: ["Mooiplaas School", "Tuck Shop"] },
    { street: 'Ga-Nkoana Rd', start: { x: 74, y: 42 }, end: { x: 74, y: 71 }, distance: 290, stopDuration: 10, landmarks: ["Ga-Nkoana Primary", "Water Tower"] },
    { street: 'Strydkraal Rd', start: { x: 74, y: 71 }, end: { x: 85, y: 65 }, distance: 125 }
];

export const DESTINATIONS: Destination[] = ROUTE_SEGMENTS.map((segment, index) => ({
    name: segment.landmarks?.[0] || segment.street,
    position: segment.end,
    segmentIndex: index,
})).reduce((acc, current) => { // Remove duplicates
    if (!acc.find(item => item.name === current.name)) {
        acc.push(current);
    }
    return acc;
}, [] as Destination[]);


export const DEFAULT_DRIVER: Driver = {
    name: 'Jabu Cele',
    profilePictureUrl: 'https://placehold.co/100x100/374151/a0aec0.png?text=JC',
    rating: 4.5,
};

export const INITIAL_TRIP_DATA: Trip = {
    id: 'TRIP-456',
    origin: 'Jane Furse',
    destination: 'Strydkraal A',
    progress: 0,
    eta: 45,
    totalTime: 0,
    movingTime: 0,
    stoppedTime: 0,
    stops: 0,
    passengers: 0,
    status: MinibusStatus.Idle,
    phase: TripPhase.Idle,
    currentStreet: 'Depot',
    currentPosition: { x: 42, y: 54 },
    driver: DEFAULT_DRIVER,
    segmentIndex: -1,
};

export const DRIVER_PIN = '1234';


export interface Point {
    x: number;
    y: number;
}

export interface RouteSegment {
    street: string;
    start: Point;
    end: Point;
    distance: number;
    stopDuration?: number; // in seconds
    landmarks?: string[];
}

export enum MinibusStatus {
    Moving = 'MOVING',
    Stopped = 'STOPPED',
    Idle = 'IDLE',
    Finished = 'FINISHED',
}

export enum TripPhase {
    Idle = 'IDLE',
    ToRank = 'TO_RANK',
    MainRoute = 'MAIN_ROUTE',
    Roaming = 'ROAMING',
    Finished = 'FINISHED',
}

export interface Driver {
    name: string;
    profilePictureUrl: string;
    rating: number; // out of 5
}

export interface Trip {
    id: string;
    origin: string;
    destination: string;
    progress: number; // percentage
    eta: number; // minutes
    totalTime: number; // seconds
    movingTime: number; // seconds
    stoppedTime: number; // seconds
    stops: number;
    passengers: number;
    status: MinibusStatus;
    phase: TripPhase;
    currentStreet: string;
    currentPosition: Point;
    driver: Driver;
    segmentIndex: number;
}

export interface AIInsight {
    id: number;
    title: string;
    content: string;
    isLoading: boolean;
}

export interface Notification {
    id: number;
    message: string;
    type: 'warning' | 'info' | 'success';
}

// Types for Gemini Service responses
export interface OptimizedRouteResponse {
    optimizedRoute: string[];
    reason: string;
}

export interface PredictiveETAResponse {
    predictiveETA: number;
    factors: string[];
}

export interface DriverBehaviorResponse {
    summary: string;
    suggestions: string[];
}

export interface DriverFeedbackResponse {
    rating: number;
    feedback: string;
}

export interface LandmarkDirectionsResponse {
    directions: string[];
}

export interface HotspotSuggestionResponse {
    hotspot: string;
    reason: string;
}

// FIX: Add IncidentType enum to resolve import error in CrowdsourcePanel.tsx
export enum IncidentType {
    Traffic = 'TRAFFIC',
    Accident = 'ACCIDENT',
    Hazard = 'HAZARD',
    Police = 'POLICE',
    RoadClosure = 'ROAD_CLOSURE',
    FuelPrice = 'FUEL_PRICE',
}


// Type for driver behavior data sent to Gemini
export interface DriverBehaviorData {
    idleTime: number;
    harshBrakingEvents: number;
    frequentStops: number;
}

// Types for App Mode and Commuter Interaction
export enum AppMode {
    Driver = 'DRIVER',
    Commuter = 'COMMUTER',
}

// NEW TYPES for Commuter Experience
export enum CommuterStatusType {
    IDLE = 'IDLE',
    WAITING_AT_RANK = 'WAITING_AT_RANK',
    AWAITING_PICKUP = 'AWAITING_PICKUP',
    ARRIVED_FOR_PICKUP = 'ARRIVED_FOR_PICKUP',
    SELECTING_DESTINATION = 'SELECTING_DESTINATION',
    EN_ROUTE = 'EN_ROUTE',
    APPROACHING_STOP = 'APPROACHING_STOP',
    AT_FILLING_STATION = 'AT_FILLING_STATION',
    DROPPED_OFF = 'DROPPED_OFF',
}

export interface CommuterStatus {
    type: CommuterStatusType;
    message: string;
    countdownSeconds?: number;
    targetPosition?: Point;
    destinationName?: string;
    destinationPosition?: Point;
    destinationSegmentIndex?: number;
    etaMinutes?: number;
}

// Types for Offline Map Caching
export interface OfflineMapRegion {
    id: string;
    name: string;
    size: string;
    isDownloaded: boolean;
    isDownloading?: boolean;
}

// Type for Commuter Hail Pings
export interface HailPing {
    id: number;
    position: Point;
    timestamp: number;
}

// Type for Destinations
export interface Destination {
    name: string;
    position: Point;
    segmentIndex: number;
}

// Type for Walkie Talkie Messages
export interface WalkieTalkieMessage {
    id: number;
    audioUrl: string;
    sender: string;
    position: Point;
    timestamp: number;
}

// Types for Commuter Avatar Customization
export enum CommuterAvatar {
    DOT = 'DOT',
    HEART = 'HEART',
    COIN = 'COIN',
    MOLOTOV = 'MOLOTOV',
    GHOST = 'GHOST',
    KEY = 'KEY',
}

export interface CommuterPreferences {
    id: string;
    avatar: CommuterAvatar;
    name: string;
    hapticFeedbackEnabled: boolean;
}

// NEW TYPES for Trip Logging
export enum PassengerReportCategory {
    SafeDriving = 'SAFE_DRIVING',
    RecklessDriving = 'RECKLESS_DRIVING',
    Cleanliness = 'CLEANLINESS',
    MusicVolume = 'MUSIC_VOLUME',
    Overcrowding = 'OVERCROWDING',
    Other = 'OTHER',
}

export interface PassengerReport {
    id: string;
    tripId: string;
    category: PassengerReportCategory;
    comment?: string;
    timestamp: number;
}

export interface TripLogPoint {
    position: Point;
    timestamp: number;
}

export interface PassengerMilestone {
    count: number;
    timestamp: number;
}

export interface IdleEvent {
    position: Point;
    startTime: number;
    endTime: number;
    reason: 'Pre-Trip' | 'Unscheduled Stop';
}

export interface TripLog {
    id: string;
    startTime: number;
    endTime: number | null;
    path: TripLogPoint[];
    passengerMilestones: PassengerMilestone[];
    passengerReports: PassengerReport[];
    idleEvents: IdleEvent[];
    totalDistance: number;
    averageSpeed: number; // in map units per second
    maxPassengers: number;
    finalState?: Trip; // a snapshot of the trip state at the end
    // Performance Metrics
    averagePassengers: number;
    capacityUtilization: number;
    positiveReports: number;
    negativeReports: number;
}
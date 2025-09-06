
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Trip, MinibusStatus, AIInsight, Notification, DriverFeedbackResponse, Point, TripPhase, AppMode, CommuterStatus, CommuterStatusType, OptimizedRouteResponse, PredictiveETAResponse, DriverBehaviorResponse, LandmarkDirectionsResponse, HotspotSuggestionResponse, OfflineMapRegion, HailPing, Destination, WalkieTalkieMessage, CommuterPreferences, CommuterAvatar, TripLog, PassengerReportCategory } from './types';
import { INITIAL_TRIP_DATA, ROUTE_SEGMENTS, DRIVER_PIN, DESTINATIONS } from './constants';
import MapPanel from './components/MapPanel';
import TripDetailsPanel from './components/TripDetailsPanel';
import AIInsightsPanel from './components/AIInsightsPanel';
import Notifications from './components/Notifications';
import { getDriverBehaviorAnalysis, getDriverFeedback, getHotspotSuggestion, getLandmarkDirections, getPredictiveEta, getRouteOptimization } from './services/geminiService';
import { LogoIcon } from './components/icons/LogoIcon';
import DriverProfilePanel from './components/DriverProfilePanel';
import LandmarkNavigationPanel from './components/LandmarkNavigationPanel';
import { SettingsIcon } from './components/icons/SettingsIcon';
import SettingsModal from './components/SettingsModal';
import CommuterStatusPanel from './components/CommuterStatusPanel';
import { useScreenOrientation } from './hooks/useScreenOrientation';
import WalkieTalkiePanel from './components/WalkieTalkiePanel';
import { tripLogService } from './services/tripLogService';
import TripLogPanel from './components/TripLogPanel';
import CommuterFeedbackPanel from './components/CommuterFeedbackPanel';
import { hapticService } from './services/hapticService';
import CrowdsourcePanel from './components/CrowdsourcePanel';
import { IncidentType } from './types';

// Bounding box for mapping real-world GPS coordinates to the 100x100 SVG map.
// This is based on the OSM data for Apel, Limpopo.
const GPS_BOUNDS = { latMin: -24.59, latMax: -24.35, lonMin: 29.57, lonMax: 29.88 };

// --- Route & ETA Utility Functions ---

const distance = (p1: Point, p2: Point) => Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

const normalizeGpsCoords = (lat: number, lon: number): Point => {
    // Clamp the values to the bounds to prevent the icon from going off-map
    const clampedLat = Math.max(GPS_BOUNDS.latMin, Math.min(GPS_BOUNDS.latMax, lat));
    const clampedLon = Math.max(GPS_BOUNDS.lonMin, Math.min(GPS_BOUNDS.lonMax, lon));

    const latRange = GPS_BOUNDS.latMax - GPS_BOUNDS.latMin;
    const lonRange = GPS_BOUNDS.lonMax - GPS_BOUNDS.lonMin;

    // Y is inverted because SVG Y=0 is top, but max latitude is "north" (less negative)
    const y = 100 - ((clampedLat - GPS_BOUNDS.latMin) / latRange) * 100;
    const x = ((clampedLon - GPS_BOUNDS.lonMin) / lonRange) * 100;
    
    return { x, y };
};

const calculateEta = (currentPos: Point, currentSegmentIdx: number, destinationSegmentIdx: number): number => {
    const speed = 10; // units per second from simulation
    if (currentSegmentIdx < 0 || currentSegmentIdx >= ROUTE_SEGMENTS.length) return 0;
    if (currentSegmentIdx > destinationSegmentIdx) return 0; // Passed

    let totalRemainingDistance = 0;

    if (currentSegmentIdx === destinationSegmentIdx) {
        totalRemainingDistance = distance(currentPos, ROUTE_SEGMENTS[destinationSegmentIdx].end);
    } else {
        // 1. Distance remaining on current segment
        totalRemainingDistance += distance(currentPos, ROUTE_SEGMENTS[currentSegmentIdx].end);

        // 2. Sum of full intermediate segments
        for (let i = currentSegmentIdx + 1; i < destinationSegmentIdx; i++) {
            totalRemainingDistance += ROUTE_SEGMENTS[i].distance;
        }

        // 3. Full distance of destination segment
        totalRemainingDistance += ROUTE_SEGMENTS[destinationSegmentIdx].distance;
    }

    const etaSeconds = totalRemainingDistance / speed;
    return Math.max(0, Math.ceil(etaSeconds / 60));
};

const App: React.FC = () => {
    const [trip, setTrip] = useState<Trip>(INITIAL_TRIP_DATA);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
    const [isSimulating, setIsSimulating] = useState<boolean>(false);
    const [hailPings, setHailPings] = useState<HailPing[]>([]);
    // FIX: Completed truncated state declaration.
    const [dailyLogs, setDailyLogs] = useState<TripLog[]>(tripLogService.getDailyLogs());
    const [appMode, setAppMode] = useState<AppMode>(AppMode.Driver);
    const [isDriverUnlocked, setIsDriverUnlocked] = useState<boolean>(false);
    const [driverPin, setDriverPin] = useState<string>(DRIVER_PIN);
    const [commuterStatus, setCommuterStatus] = useState<CommuterStatus>({ type: CommuterStatusType.IDLE, message: 'Waiting for Taxi' });
    const [commuterPosition, setCommuterPosition] = useState<Point | null>({ x: 50, y: 50 });
    const [commuterPreferences, setCommuterPreferences] = useState<CommuterPreferences>({ id: 'commuter-1', avatar: CommuterAvatar.DOT, name: 'Alex', hapticFeedbackEnabled: true });
    const [landmarkDirections, setLandmarkDirections] = useState<string[]>([]);
    const [isLandmarkDirectionsLoading, setIsLandmarkDirectionsLoading] = useState<boolean>(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
    const [walkieTalkieMessages, setWalkieTalkieMessages] = useState<WalkieTalkieMessage[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [offlineRegions, setOfflineRegions] = useState<OfflineMapRegion[]>([
        { id: 'apel-central', name: 'Apel Central', size: '15.2 MB', isDownloaded: false },
    ]);
    const [isMapCached, setIsMapCached] = useState<boolean>(false);

    const isTripActive = trip.phase !== TripPhase.Idle && trip.phase !== TripPhase.Finished;
    const orientation = useScreenOrientation();
    
    // --- UTILS & HELPERS ---
    const addNotification = useCallback((message: string, type: 'info' | 'warning' | 'success') => {
        const newNotification: Notification = { id: Date.now(), message, type };
        setNotifications(prev => [newNotification, ...prev].slice(0, 5));
        if (commuterPreferences.hapticFeedbackEnabled) {
            hapticService.vibrateNotification(type);
        }
    }, [commuterPreferences.hapticFeedbackEnabled]);

    // --- AI INSIGHTS ---
    const addAiInsight = useCallback(async (
        title: string,
        action: () => Promise<any>
    ) => {
        const insightId = Date.now();
        setAiInsights(prev => [{ id: insightId, title, content: '', isLoading: true }, ...prev]);
        try {
            const response = await action();
            let content = 'Could not parse AI response.';
            if (response.optimizedRoute) content = `Route: ${response.optimizedRoute.join(' -> ')}\nReason: ${response.reason}`;
            else if (response.predictiveETA) content = `New ETA: ${response.predictiveETA} mins\nFactors: ${response.factors.join(', ')}`;
            else if (response.summary) content = `Summary: ${response.summary}\nSuggestions: ${response.suggestions.join('\n- ')}`;
            else if (response.feedback) content = `Rating: ${response.rating.toFixed(1)}/5\nFeedback: ${response.feedback}`;
            else if (response.directions) content = response.directions.join('\n');
            else if (response.hotspot) content = `Suggestion: Go to ${response.hotspot}\nReason: ${response.reason}`;

            setAiInsights(prev => prev.map(i => i.id === insightId ? { ...i, content, isLoading: false } : i));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            setAiInsights(prev => prev.map(i => i.id === insightId ? { ...i, content: `Error: ${errorMessage}`, isLoading: false } : i));
            addNotification(`AI ${title} failed.`, 'warning');
        }
    }, [addNotification]);

    const handleOptimizeRoute = () => addAiInsight('Route Optimization', () => getRouteOptimization(ROUTE_SEGMENTS));
    const handlePredictiveETA = () => addAiInsight('Predictive ETA', () => getPredictiveEta(trip.eta, trip.progress));
    const handleAnalyzeBehavior = () => addAiInsight('Driver Behavior', () => getDriverBehaviorAnalysis({ idleTime: trip.stoppedTime, harshBrakingEvents: 3, frequentStops: trip.stops }));
    const handleGetFeedback = () => addAiInsight('Driver Feedback', () => getDriverFeedback({ stops: trip.stops, idleTime: trip.stoppedTime }));
    const handleGetDirections = () => {
        if (trip.segmentIndex >= 0 && trip.segmentIndex < ROUTE_SEGMENTS.length) {
            setIsLandmarkDirectionsLoading(true);
            addAiInsight('Landmark Directions', () => getLandmarkDirections(ROUTE_SEGMENTS[trip.segmentIndex], trip.destination))
                .then(() => setIsLandmarkDirectionsLoading(false));
        } else {
            addNotification('Cannot get directions, trip not on main route.', 'warning');
        }
    };
    const handleSuggestHotspot = () => addAiInsight('Hotspot Suggestion', getHotspotSuggestion);

    // --- SETTINGS & MODE ---
    const handleModeChange = (newMode: AppMode, pin?: string) => {
        if (newMode === AppMode.Driver) {
            if (isDriverUnlocked || pin === driverPin) {
                setAppMode(AppMode.Driver);
                setIsDriverUnlocked(true);
                addNotification('Switched to Driver Mode', 'success');
            } else {
                addNotification('Incorrect PIN for Driver Mode', 'warning');
            }
        } else {
            setAppMode(AppMode.Commuter);
            addNotification('Switched to Commuter Mode', 'info');
        }
        setIsSettingsModalOpen(false);
    };
    
    // --- RENDER LOGIC ---
    // Placeholder for simulation and other complex logic
    useEffect(() => {
        const handle = setInterval(() => {
            if (isSimulating) {
                // Dummy simulation logic
                setTrip(prev => ({ ...prev, progress: Math.min(100, prev.progress + 0.1) }));
            }
        }, 100);
        return () => clearInterval(handle);
    }, [isSimulating]);
    
    const handleSetPin = (newPin: string, confirmPin: string) => {
        if (newPin !== confirmPin) {
            addNotification("PINs do not match.", "warning");
            return;
        }
        if (newPin.length !== 4) {
             addNotification("PIN must be 4 digits.", "warning");
             return;
        }
        setDriverPin(newPin);
        addNotification("Driver PIN has been updated.", "success");
    }

    const handleStartRecording = () => { if (isTripActive) setIsRecording(true); };
    const handleStopRecording = () => { if (isTripActive) setIsRecording(false); };

    // --- COMMUTER ACTIONS ---
    const handleHailTaxi = () => {
        setCommuterStatus({ type: CommuterStatusType.AWAITING_PICKUP, message: "Hailing Taxi..." });
        addNotification("Your hail has been sent!", "success");
    };

    const handleCancelHail = () => {
        setCommuterStatus({ type: CommuterStatusType.IDLE, message: 'Waiting for Taxi' });
        addNotification("Hail cancelled.", "info");
    };
    
    const handleSetDestination = (destination: Destination) => {
        setCommuterStatus({
            type: CommuterStatusType.EN_ROUTE,
            message: `On way to ${destination.name}`,
            destinationName: destination.name,
            destinationPosition: destination.position,
            destinationSegmentIndex: destination.segmentIndex,
            etaMinutes: calculateEta(trip.currentPosition, trip.segmentIndex, destination.segmentIndex)
        });
    }
    
    const handleAddReport = (category: PassengerReportCategory, comment?: string) => {
        tripLogService.addPassengerReport({ category, comment });
        addNotification("Feedback submitted. Thank you!", "success");
    };
    
    const handleClearLogs = () => {
        tripLogService.clearDailyLogs();
        setDailyLogs([]);
        addNotification("Today's trip logs have been cleared.", "success");
    };
    
    const handleAddIncident = (type: IncidentType, details?: string) => {
        const message = details ? `${type}: ${details}` : `${type} reported nearby`;
        addNotification(message, 'info');
    };
    
    const handleDownloadMap = (regionId: string) => {
         setOfflineRegions(prev => prev.map(r => r.id === regionId ? {...r, isDownloading: true} : r));
         setTimeout(() => {
              setOfflineRegions(prev => prev.map(r => r.id === regionId ? {...r, isDownloading: false, isDownloaded: true} : r));
              setIsMapCached(true);
              addNotification("Offline map for Apel Central downloaded.", "success");
         }, 3000);
    };
    
    const handleDeleteMap = (regionId: string) => {
        setOfflineRegions(prev => prev.map(r => r.id === regionId ? {...r, isDownloaded: false} : r));
        setIsMapCached(false);
        addNotification("Offline map deleted.", "info");
    };


    const renderDriverPanels = () => (
        <>
            <DriverProfilePanel driver={trip.driver} />
            <TripDetailsPanel trip={trip} />
            <AIInsightsPanel
                insights={aiInsights}
                onOptimizeRoute={handleOptimizeRoute}
                onPredictiveETA={handlePredictiveETA}
                onAnalyzeBehavior={handleAnalyzeBehavior}
                onGetFeedback={handleGetFeedback}
                onGetDirections={handleGetDirections}
                onSuggestHotspot={handleSuggestHotspot}
                isSimulating={isSimulating}
                tripPhase={trip.phase}
            />
            <LandmarkNavigationPanel directions={landmarkDirections} isLoading={isLandmarkDirectionsLoading} />
            <CrowdsourcePanel onAddIncident={handleAddIncident} isTripActive={isTripActive} />
            <WalkieTalkiePanel 
                isRecording={isRecording}
                onStartRecording={handleStartRecording}
                onStopRecording={handleStopRecording}
                messages={walkieTalkieMessages}
                isTripActive={isTripActive}
            />
            <TripLogPanel logs={dailyLogs} onClearLogs={handleClearLogs} />
        </>
    );

    const renderCommuterPanels = () => (
        <>
            <CommuterStatusPanel 
                status={commuterStatus}
                isTripActive={isTripActive}
                onRequestStop={() => addNotification("Stop requested!", "info")}
                onHailTaxi={handleHailTaxi}
                onCancelHail={handleCancelHail}
                destinations={DESTINATIONS}
                onSetDestination={handleSetDestination}
                commuterName={commuterPreferences.name}
                onNameChange={(name) => setCommuterPreferences(p => ({ ...p, name }))}
            />
            <CommuterFeedbackPanel onAddReport={handleAddReport} isTripActive={isTripActive} />
        </>
    );

    return (
        <main className={`w-screen h-screen bg-gray-900 text-white flex overflow-hidden font-sans ${orientation === 'landscape' ? 'flex-row' : 'flex-col'}`}>
            <header className={`absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm ${orientation === 'landscape' ? 'bg-opacity-0 backdrop-blur-none' : ''}`}>
                <div className="flex items-center gap-3">
                    <LogoIcon />
                    <h1 className="text-xl font-bold text-white">Lynk</h1>
                    <button onClick={() => setIsSimulating(!isSimulating)} className="ml-4 px-3 py-1 text-sm font-semibold bg-green-600 hover:bg-green-500 rounded-md">
                        {isSimulating ? "Stop Sim" : "Start Sim"}
                    </button>
                </div>
                <button onClick={() => setIsSettingsModalOpen(true)} className="p-2 rounded-full hover:bg-white/10" aria-label="Open settings">
                    <SettingsIcon />
                </button>
            </header>

            <div className="flex-1 flex flex-col relative pt-16 md:pt-0">
                <MapPanel
                    trip={trip}
                    route={ROUTE_SEGMENTS}
                    appMode={appMode}
                    commuterPosition={commuterPosition}
                    commuterStatus={commuterStatus}
                    commuterAvatar={commuterPreferences.avatar}
                    isMapCached={isMapCached}
                    hailPings={hailPings}
                    walkieTalkieMessages={walkieTalkieMessages}
                />
            </div>

            <aside className={`flex flex-col gap-4 p-4 overflow-y-auto bg-black/30 backdrop-blur-md border-gray-800 ${orientation === 'landscape' ? 'w-96 border-l' : 'h-1/2 border-t'}`}>
                {appMode === AppMode.Driver ? renderDriverPanels() : renderCommuterPanels()}
            </aside>

            <Notifications notifications={notifications} setNotifications={setNotifications} />
            <SettingsModal
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
                currentMode={appMode}
                onModeChange={handleModeChange}
                offlineRegions={offlineRegions}
                onDownloadMap={handleDownloadMap}
                onDeleteMap={handleDeleteMap}
                isDriverUnlocked={isDriverUnlocked}
                commuterPreferences={commuterPreferences}
                onAvatarChange={(avatar) => setCommuterPreferences(p => ({ ...p, avatar }))}
                onSetPin={handleSetPin}
                onToggleHapticFeedback={() => setCommuterPreferences(p => ({ ...p, hapticFeedbackEnabled: !p.hapticFeedbackEnabled }))}
            />
        </main>
    );
};

export default App;

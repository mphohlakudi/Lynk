
import { Trip, TripLog, PassengerReport, Point, PassengerReportCategory, IdleEvent, RouteSegment } from '../types';
import { ROUTE_SEGMENTS } from '../constants';

const LOG_STORAGE_KEY = 'lynk_trip_logs';
const MAP_UNIT_TO_KM = 17.5 / 1000; // Conversion factor based on map scale

// --- Utility Functions (copied from MapPanel for route mapping) ---
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

const mapPointToStreet = (point: Point): string => {
    let minDistance = Infinity;
    let bestSegment: RouteSegment | null = null;

    ROUTE_SEGMENTS.forEach(segment => {
        const closestPointOnSegment = findClosestPointOnSegment(point, segment.start, segment.end);
        const d = distance(point, closestPointOnSegment);
        if (d < minDistance) {
            minDistance = d;
            bestSegment = segment;
        }
    });

    return bestSegment ? bestSegment.street : "Unknown Area";
};


// --- Log Storage Helpers ---
const getLogsFromStorage = (): TripLog[] => {
    try {
        const rawLogs = localStorage.getItem(LOG_STORAGE_KEY);
        return rawLogs ? JSON.parse(rawLogs) : [];
    } catch (e) {
        console.error("Failed to parse logs from storage", e);
        return [];
    }
};

const saveLogsToStorage = (logs: TripLog[]) => {
    try {
        localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(logs));
    } catch (e) {
        console.error("Failed to save logs to storage", e);
    }
};

let activeTripLog: TripLog | null = null;
let activeIdleEvent: { position: Point; startTime: number; reason: 'Pre-Trip' | 'Unscheduled Stop' } | null = null;

export const tripLogService = {
    startNewTripLog: (trip: Trip): TripLog => {
        const newLog: TripLog = {
            id: trip.id,
            startTime: Date.now(),
            endTime: null,
            path: [{ position: trip.currentPosition, timestamp: Date.now() }],
            passengerMilestones: [{ count: trip.passengers, timestamp: Date.now() }],
            passengerReports: [],
            idleEvents: [],
            totalDistance: 0,
            averageSpeed: 0,
            maxPassengers: trip.passengers,
            averagePassengers: 0,
            capacityUtilization: 0,
            positiveReports: 0,
            negativeReports: 0,
        };
        activeTripLog = newLog;
        activeIdleEvent = null;
        return newLog;
    },

    updateTripLog: (trip: Trip) => {
        if (!activeTripLog || activeTripLog.id !== trip.id) return;
        
        const lastPoint = activeTripLog.path[activeTripLog.path.length - 1];
        if (distance(lastPoint.position, trip.currentPosition) > 1) {
             activeTripLog.path.push({ position: trip.currentPosition, timestamp: Date.now() });
        }

        const lastPassengerCount = activeTripLog.passengerMilestones[activeTripLog.passengerMilestones.length - 1].count;
        if (trip.passengers !== lastPassengerCount) {
            activeTripLog.passengerMilestones.push({ count: trip.passengers, timestamp: Date.now() });
            activeTripLog.maxPassengers = Math.max(activeTripLog.maxPassengers, trip.passengers);
        }
    },

    startIdleEvent: (position: Point, reason: 'Pre-Trip' | 'Unscheduled Stop') => {
        if (!activeTripLog || activeIdleEvent) return;
        activeIdleEvent = { position, reason, startTime: Date.now() };
    },

    endIdleEvent: () => {
        if (!activeTripLog || !activeIdleEvent) return;
        const newIdleEvent: IdleEvent = {
            ...activeIdleEvent,
            endTime: Date.now(),
        };
        activeTripLog.idleEvents.push(newIdleEvent);
        activeIdleEvent = null;
    },

    addPassengerReport: (report: { category: PassengerReportCategory, comment?: string}) => {
        if (!activeTripLog) return;

        const newReport: PassengerReport = {
            ...report,
            id: `report-${Date.now()}`,
            tripId: activeTripLog.id,
            timestamp: Date.now(),
        };

        activeTripLog.passengerReports.push(newReport);
    },

    endTripLog: (finalTrip: Trip) => {
        if (!activeTripLog || activeTripLog.id !== finalTrip.id) return;
        
        if (activeIdleEvent) {
            tripLogService.endIdleEvent();
        }

        activeTripLog.endTime = Date.now();
        activeTripLog.finalState = { ...finalTrip };

        // --- Calculate final stats ---
        let totalDistance = 0;
        for (let i = 1; i < activeTripLog.path.length; i++) {
            totalDistance += distance(activeTripLog.path[i-1].position, activeTripLog.path[i].position);
        }
        activeTripLog.totalDistance = totalDistance;
        activeTripLog.averageSpeed = finalTrip.movingTime > 0 ? totalDistance / finalTrip.movingTime : 0;

        // Calculate passenger metrics
        let totalPassengerSeconds = 0;
        const milestones = [...activeTripLog.passengerMilestones];
        milestones.push({ count: finalTrip.passengers, timestamp: activeTripLog.endTime });

        for (let i = 0; i < milestones.length - 1; i++) {
            const durationMs = milestones[i+1].timestamp - milestones[i].timestamp;
            totalPassengerSeconds += milestones[i].count * (durationMs / 1000);
        }
        const totalTripSeconds = (activeTripLog.endTime - activeTripLog.startTime) / 1000;
        activeTripLog.averagePassengers = totalTripSeconds > 0 ? totalPassengerSeconds / totalTripSeconds : 0;
        activeTripLog.capacityUtilization = totalTripSeconds > 0 ? (activeTripLog.averagePassengers / 16) * 100 : 0;

        // Tally feedback reports
        activeTripLog.positiveReports = activeTripLog.passengerReports.filter(r => r.category === PassengerReportCategory.SafeDriving).length;
        activeTripLog.negativeReports = activeTripLog.passengerReports.length - activeTripLog.positiveReports;
        
        // --- Save Log ---
        const allLogs = getLogsFromStorage();
        const filteredLogs = allLogs.filter(log => log.id !== activeTripLog!.id);
        saveLogsToStorage([...filteredLogs, activeTripLog]);
        
        activeTripLog = null;
    },

    getDailyLogs: (): TripLog[] => {
        const allLogs = getLogsFromStorage();
        const today = new Date().toDateString();
        return allLogs.filter(log => new Date(log.startTime).toDateString() === today);
    },

    clearDailyLogs: () => {
        const allLogs = getLogsFromStorage();
        const today = new Date().toDateString();
        const otherDaysLogs = allLogs.filter(log => new Date(log.startTime).toDateString() !== today);
        saveLogsToStorage(otherDaysLogs);
    },

    formatLogsForExport: (logs: TripLog[]): string => {
        if (logs.length === 0) return "No trips logged for today.";

        const formatDuration = (ms: number) => {
            const totalSeconds = Math.floor(ms / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            return `${minutes}m ${seconds}s`;
        };

        let reportString = `--- LYNK DAILY REPORT: ${new Date().toLocaleDateString()} ---\n\n`;
        
        logs.forEach((log, index) => {
            const durationMs = (log.endTime || Date.now()) - log.startTime;
            const totalIdleTimeMs = log.idleEvents.reduce((sum, event) => sum + (event.endTime - event.startTime), 0);
            const comfortScore = log.passengerReports.length > 0 ? (log.positiveReports / log.passengerReports.length) * 100 : 100;
            const avgSpeedKmh = (log.averageSpeed * MAP_UNIT_TO_KM) * 3600;

            reportString += `====== TRIP ${index + 1} (ID: ${log.id}) ======\n`;
            reportString += `Time: ${new Date(log.startTime).toLocaleTimeString()} - ${log.endTime ? new Date(log.endTime).toLocaleTimeString() : 'In Progress'}\n`;
            reportString += `Duration: ${formatDuration(durationMs)}\n`;
            reportString += `Distance: ${(log.totalDistance * MAP_UNIT_TO_KM).toFixed(2)} km\n`;
            reportString += `\n--- PERFORMANCE ---\n`;
            reportString += `- Speed (Avg): ${avgSpeedKmh.toFixed(1)} km/h\n`;
            reportString += `- Comfort Score: ${comfortScore.toFixed(0)}% (${log.positiveReports}/${log.passengerReports.length} positive reports)\n`;
            reportString += `- Capacity Util.: ${log.capacityUtilization.toFixed(1)}% (Avg ${log.averagePassengers.toFixed(1)} / Max ${log.maxPassengers} passengers)\n`;
            
            if(log.idleEvents.length > 0) {
                reportString += `\n--- IDLE TIME (Total: ${formatDuration(totalIdleTimeMs)}) ---\n`;
                log.idleEvents.forEach(event => {
                    const eventDurationMs = event.endTime - event.startTime;
                    reportString += `- [${new Date(event.startTime).toLocaleTimeString()}] ${event.reason} near ${mapPointToStreet(event.position)} for ${formatDuration(eventDurationMs)}\n`;
                });
            }

            const uniqueStreets = log.path.map(p => mapPointToStreet(p.position))
                .filter((street, i, arr) => i === 0 || street !== arr[i-1]);
            
            reportString += `\n--- ROUTE ---\n`;
            reportString += uniqueStreets.join(' -> ') + '\n';

            if (log.passengerReports.length > 0) {
                reportString += `\n--- PASSENGER FEEDBACK ---\n`;
                log.passengerReports.forEach(report => {
                    reportString += `- [${new Date(report.timestamp).toLocaleTimeString()}] ${report.category.replace(/_/g, ' ')}${report.comment ? `: "${report.comment}"` : ''}\n`;
                });
            }
            reportString += `\n\n`;
        });

        return reportString;
    }
};

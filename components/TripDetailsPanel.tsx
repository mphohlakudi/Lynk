
import React from 'react';
import { Trip, MinibusStatus, TripPhase } from '../types';
import { ClockIcon, GpsIcon, GaugeIcon, RoadIcon, StopIcon, SignalSlashIcon, CycleIcon, UsersIcon } from './icons/DetailIcons';

interface TripDetailsPanelProps {
    trip: Trip;
    isLowDataMode?: boolean;
}

const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: string | number; unit?: string }> = ({ icon, label, value, unit }) => (
    <>
        <dt className="flex items-center gap-3 text-gray-300">
            <div className="text-gray-400">{icon}</div>
            <span>{label}</span>
        </dt>
        <dd className="font-semibold text-white text-right">
            {value} <span className="text-gray-400 text-sm">{unit}</span>
        </dd>
    </>
);


const TripDetailsPanel: React.FC<TripDetailsPanelProps> = ({ trip, isLowDataMode = false }) => {
    const isGpsActive = trip.currentStreet === 'Live GPS Tracking';

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    const statusStyle = "bg-gray-700/50 text-white px-2 py-0.5 rounded-md inline-block border border-gray-600 font-semibold";
    
    const phaseText = {
        [TripPhase.Idle]: 'Idle',
        [TripPhase.ToRank]: 'To Rank',
        [TripPhase.MainRoute]: 'Main Route',
        [TripPhase.Roaming]: 'Roaming',
        [TripPhase.Finished]: 'Finished',
    }

    return (
        <div className="bg-black/60 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-gray-800 flex flex-col gap-4">
            <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Trip Details</h2>
            
            <div className="text-center">
                <p className="text-sm text-gray-400">{trip.origin}</p>
                <p className="text-lg font-bold text-white mx-2" aria-hidden="true">➔</p>
                <p className="text-sm text-gray-400">{trip.destination}</p>
            </div>

            {trip.phase === TripPhase.MainRoute && (
                 <div className="w-full bg-gray-800 rounded-full h-2.5" role="progressbar" aria-valuenow={trip.progress} aria-valuemin={0} aria-valuemax={100} aria-valuetext={`${trip.progress.toFixed(1)}% complete`}>
                    <div className="bg-white h-2.5 rounded-full" style={{ width: `${trip.progress}%` }}></div>
                </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-center">
                {trip.phase === TripPhase.MainRoute ? (
                    <div>
                        <p className="text-sm text-gray-400">Progress</p>
                        <p className="text-lg font-bold text-white">{trip.progress.toFixed(1)}%</p>
                    </div>
                ) : (
                    <div>
                        <p className="text-sm text-gray-400">Passengers</p>
                        <p className="text-lg font-bold text-white">{trip.passengers}</p>
                    </div>
                )}
                <div >
                    <p className="text-sm text-gray-400">Status</p>
                    <p className={statusStyle}>
                        {trip.status}
                    </p>
                </div>
            </div>
            
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 items-center">
                <DetailItem 
                    icon={<CycleIcon />} 
                    label="Trip Phase"
                    value={phaseText[trip.phase]} 
                />
                 <DetailItem 
                    icon={isGpsActive ? <GpsIcon /> : <RoadIcon />} 
                    label={isGpsActive ? "Location Source" : "Current Area"}
                    value={isGpsActive ? "Live GPS" : trip.currentStreet} 
                />
                {isGpsActive && isLowDataMode && (
                    <DetailItem icon={<SignalSlashIcon />} label="Data Mode" value="Low" unit="90s" />
                )}
                {!isGpsActive && trip.phase === TripPhase.MainRoute && (
                     <DetailItem icon={<ClockIcon />} label="ETA" value={trip.eta} unit="min" />
                )}
                 {!isGpsActive && (
                    <>
                        <DetailItem icon={<GaugeIcon />} label="Moving Time" value={formatTime(trip.movingTime)} />
                        <DetailItem icon={<StopIcon />} label="Stopped Time" value={formatTime(trip.stoppedTime)} />
                        <DetailItem icon={<UsersIcon />} label="Passengers" value={trip.passengers} unit="/ 16" />
                    </>
                )}
            </dl>
        </div>
    );
};

export default TripDetailsPanel;

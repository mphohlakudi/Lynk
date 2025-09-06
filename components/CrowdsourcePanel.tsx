import React from 'react';
import { IncidentType } from '../types';
import { TrafficIcon, AccidentIcon, HazardIcon, PoliceIcon, RoadClosureIcon, FuelIcon } from './icons/IncidentIcons';

interface CrowdsourcePanelProps {
    onAddIncident: (type: IncidentType, details?: string) => void;
    isTripActive: boolean;
}

const ReportButton: React.FC<{ onClick: () => void; disabled: boolean; icon: React.ReactNode; text: string }> = ({ onClick, disabled, icon, text }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-900 hover:bg-gray-800 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700 hover:border-gray-500"
        aria-label={`Report ${text}`}
    >
        {icon}
        <span className="text-xs font-semibold text-gray-300 group-hover:text-white">{text}</span>
    </button>
);


const CrowdsourcePanel: React.FC<CrowdsourcePanelProps> = ({ onAddIncident, isTripActive }) => {
    const handleFuelReport = () => {
        const price = prompt("Enter fuel price per litre (e.g., 25.50):");
        if (price && !isNaN(parseFloat(price))) {
            onAddIncident(IncidentType.FuelPrice, `R ${parseFloat(price).toFixed(2)}`);
        } else if (price !== null) {
            alert("Please enter a valid number for the price.");
        }
    };
    
    return (
        <div className="bg-black/60 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-gray-800 flex flex-col gap-4">
            <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Report Incident</h2>
            <div className="grid grid-cols-3 gap-2">
                <ReportButton onClick={() => onAddIncident(IncidentType.Traffic)} disabled={!isTripActive} icon={<TrafficIcon className="text-orange-400" />} text="Traffic" />
                <ReportButton onClick={() => onAddIncident(IncidentType.Accident)} disabled={!isTripActive} icon={<AccidentIcon className="text-red-500" />} text="Accident" />
                <ReportButton onClick={() => onAddIncident(IncidentType.Police)} disabled={!isTripActive} icon={<PoliceIcon className="text-blue-400" />} text="Police" />
                <ReportButton onClick={() => onAddIncident(IncidentType.Hazard)} disabled={!isTripActive} icon={<HazardIcon className="text-yellow-400" />} text="Hazard" />
                <ReportButton onClick={() => onAddIncident(IncidentType.RoadClosure)} disabled={!isTripActive} icon={<RoadClosureIcon className="text-gray-400" />} text="Closure" />
                <ReportButton onClick={handleFuelReport} disabled={!isTripActive} icon={<FuelIcon className="text-green-400" />} text="Fuel Price" />
            </div>
        </div>
    );
};

export default CrowdsourcePanel;
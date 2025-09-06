import React from 'react';
import { PassengerReportCategory } from '../types';
import { ThumbsUpIcon, ThumbsDownIcon, BroomIcon, MusicIcon, OvercrowdIcon } from './icons/FeedbackIcons';

interface CommuterFeedbackPanelProps {
    onAddReport: (category: PassengerReportCategory, comment?: string) => void;
    isTripActive: boolean;
}

const FeedbackButton: React.FC<{ onClick: () => void; disabled: boolean; icon: React.ReactNode; text: string; }> = ({ onClick, disabled, icon, text }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="flex flex-col items-center justify-center gap-1.5 p-2 bg-gray-900 hover:bg-gray-800 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700 hover:border-gray-500 group"
        aria-label={`Report: ${text}`}
    >
        {icon}
        <span className="text-xs font-semibold text-gray-300 group-hover:text-white">{text}</span>
    </button>
);

const CommuterFeedbackPanel: React.FC<CommuterFeedbackPanelProps> = ({ onAddReport, isTripActive }) => {
    return (
        <div className="bg-black/60 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-gray-800 flex flex-col gap-4">
            <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Rate Your Ride</h2>
            <p className="text-sm text-gray-400">Your feedback helps improve the service. Reports are anonymous.</p>
            <div className="grid grid-cols-3 gap-2">
                <FeedbackButton onClick={() => onAddReport(PassengerReportCategory.SafeDriving)} disabled={!isTripActive} icon={<ThumbsUpIcon className="text-green-400"/>} text="Safe Driving"/>
                <FeedbackButton onClick={() => onAddReport(PassengerReportCategory.RecklessDriving)} disabled={!isTripActive} icon={<ThumbsDownIcon className="text-red-400"/>} text="Reckless"/>
                <FeedbackButton onClick={() => onAddReport(PassengerReportCategory.Cleanliness)} disabled={!isTripActive} icon={<BroomIcon className="text-cyan-400"/>} text="Clean"/>
                <FeedbackButton onClick={() => onAddReport(PassengerReportCategory.MusicVolume)} disabled={!isTripActive} icon={<MusicIcon className="text-purple-400"/>} text="Music"/>
                <FeedbackButton onClick={() => onAddReport(PassengerReportCategory.Overcrowding)} disabled={!isTripActive} icon={<OvercrowdIcon className="text-yellow-400"/>} text="Crowded"/>
                <FeedbackButton onClick={() => {
                    const comment = prompt("Please provide any other feedback:");
                    if (comment) onAddReport(PassengerReportCategory.Other, comment);
                }} disabled={!isTripActive} icon={<span className="text-gray-300 text-xl font-bold">...</span>} text="Other"/>
            </div>
        </div>
    );
};

export default CommuterFeedbackPanel;


import React, { useState } from 'react';
import { TripLog } from '../types';
import { tripLogService } from '../services/tripLogService';

interface TripLogPanelProps {
    logs: TripLog[];
    onClearLogs: () => void;
}

const LogModal: React.FC<{ content: string; onClose: () => void }> = ({ content, onClose }) => (
    <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
    >
        <div
            className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-6 w-full max-w-lg text-white"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-4">
                <h2 className="text-xl font-bold">Full Daily Log</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl p-1 rounded-full leading-none">&times;</button>
            </div>
            <textarea
                readOnly
                value={content}
                className="w-full h-80 bg-gray-950 text-gray-300 font-mono text-xs p-2 rounded-md border border-gray-700 focus:outline-none"
            />
            <button
                onClick={() => navigator.clipboard.writeText(content)}
                className="w-full mt-4 px-4 py-2 rounded-lg font-semibold transition-all bg-cyan-600 hover:bg-cyan-500 text-white"
            >
                Copy to Clipboard
            </button>
        </div>
    </div>
);

const TripLogPanel: React.FC<TripLogPanelProps> = ({ logs, onClearLogs }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const summary = {
        totalTrips: logs.length,
        totalMovingTime: logs.reduce((sum, log) => sum + (log.finalState?.movingTime || 0), 0),
        totalReports: logs.reduce((sum, log) => sum + log.passengerReports.length, 0),
    };

    const handleClear = () => {
        if (window.confirm("Are you sure you want to clear all of today's trip logs? This cannot be undone.")) {
            onClearLogs();
        }
    };

    const formattedLog = tripLogService.formatLogsForExport(logs);

    return (
        <>
            {isModalOpen && <LogModal content={formattedLog} onClose={() => setIsModalOpen(false)} />}
            <div className="flex flex-col gap-4">
                {logs.length === 0 ? (
                    <p className="text-gray-400 text-center">No trips have been logged today.</p>
                ) : (
                    <>
                        <div className="grid grid-cols-3 gap-2 text-center">
                            <div>
                                <p className="text-2xl font-bold text-white">{summary.totalTrips}</p>
                                <p className="text-xs text-gray-400">Total Trips</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{Math.floor(summary.totalMovingTime / 60)}</p>
                                <p className="text-xs text-gray-400">Mins Moving</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{summary.totalReports}</p>
                                <p className="text-xs text-gray-400">Reports</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="w-full px-4 py-2 rounded-lg font-semibold transition-all bg-gray-700 hover:bg-gray-600 text-white"
                            >
                                View Full Log
                            </button>
                            <button
                                onClick={handleClear}
                                className="w-full px-4 py-2 rounded-lg font-semibold transition-all bg-red-800 hover:bg-red-700 text-white"
                            >
                                Clear Logs
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default TripLogPanel;

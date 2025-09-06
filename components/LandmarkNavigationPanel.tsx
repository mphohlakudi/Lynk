
import React from 'react';
import { NavigationIcon } from './icons/AiIcons';
import { RoadIcon } from './icons/DetailIcons';

interface LandmarkNavigationPanelProps {
    directions: string[];
    isLoading: boolean;
}

const LandmarkNavigationPanel: React.FC<LandmarkNavigationPanelProps> = ({ directions, isLoading }) => {
    return (
        <div className="bg-black/60 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-gray-800 flex flex-col gap-3" aria-live="polite" aria-busy={isLoading}>
            <div className="flex items-center gap-3 border-b border-gray-700 pb-2">
                <NavigationIcon className="text-cyan-400" />
                <h2 className="text-xl font-bold text-white">Landmark Navigation</h2>
            </div>
            <div className="flex flex-col gap-2 min-h-[100px] max-h-48 overflow-y-auto pr-2">
                {isLoading && (
                     <div className="flex items-center justify-center h-full text-gray-400">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Generating directions...</span>
                    </div>
                )}
                {!isLoading && directions.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                         <RoadIcon />
                        <p className="mt-2 text-sm">Get landmark-based directions from the AI Assistant.</p>
                    </div>
                )}
                {!isLoading && directions.length > 0 && (
                    <ul className="space-y-2">
                        {directions.map((step, index) => (
                           <li key={index} className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-5 h-5 mt-1 flex items-center justify-center text-cyan-400 rounded-full text-xs font-bold" aria-hidden="true">
                                    {index + 1}
                                </div>
                                <p className="text-gray-300 text-sm">{step}</p>
                           </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default LandmarkNavigationPanel;

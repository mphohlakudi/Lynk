
import React from 'react';
import { AIInsight, TripPhase } from '../types';
import { BrainIcon, ClockIcon, NavigationIcon, RouteIcon, SparklesIcon, UserIcon, SearchIcon } from './icons/AiIcons';

interface AIInsightsPanelProps {
    insights: AIInsight[];
    onOptimizeRoute: () => void;
    onPredictiveETA: () => void;
    onAnalyzeBehavior: () => void;
    onGetFeedback: () => void;
    onGetDirections: () => void;
    onSuggestHotspot: () => void;
    isSimulating: boolean;
    tripPhase: TripPhase;
}

const AIButton: React.FC<{ onClick: () => void; disabled: boolean; icon: React.ReactNode; text: string }> = ({ onClick, disabled, icon, text }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700 hover:border-gray-500"
    >
        {icon}
        <span className="text-sm font-semibold">{text}</span>
    </button>
);


const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ insights, onOptimizeRoute, onPredictiveETA, onAnalyzeBehavior, onGetFeedback, onGetDirections, onSuggestHotspot, isSimulating, tripPhase }) => {
    const isMainRoute = tripPhase === TripPhase.MainRoute;
    const isRoaming = tripPhase === TripPhase.Roaming;

    return (
        <div className="bg-black/60 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-gray-800 flex flex-col gap-4">
            <div className="flex items-center gap-3 border-b border-gray-700 pb-2">
                 <SparklesIcon className="text-cyan-400" />
                <h2 className="text-xl font-bold text-white">AI Assistant</h2>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
                <AIButton onClick={onOptimizeRoute} disabled={!isSimulating || !isMainRoute} icon={<RouteIcon className="text-cyan-400" />} text="Optimize" />
                <AIButton onClick={onPredictiveETA} disabled={!isSimulating || !isMainRoute} icon={<ClockIcon className="text-cyan-400" />} text="Predict ETA" />
                <AIButton onClick={onGetDirections} disabled={!isSimulating || !isMainRoute} icon={<NavigationIcon className="text-cyan-400" />} text="Directions" />
                <AIButton onClick={onAnalyzeBehavior} disabled={!isSimulating} icon={<BrainIcon className="text-cyan-400" />} text="Analyze" />
                <AIButton onClick={onGetFeedback} disabled={!isSimulating} icon={<UserIcon className="text-cyan-400" />} text="Feedback" />
                <AIButton onClick={onSuggestHotspot} disabled={!isSimulating || !isRoaming} icon={<SearchIcon className="text-cyan-400" />} text="Hotspot" />
            </div>

            <div aria-live="polite" className="flex flex-col gap-3 max-h-48 overflow-y-auto pr-2">
                {insights.length === 0 && (
                    <p className="text-gray-400 text-center py-4">Run the simulation and click a button to get AI insights.</p>
                )}
                {insights.map(insight => (
                    <div key={insight.id} className="bg-gray-900/50 p-3 rounded-lg border border-gray-700" aria-busy={insight.isLoading}>
                        <h3 className="font-semibold text-white">{insight.title}</h3>
                        <p className="text-sm text-gray-300 whitespace-pre-wrap">
                            {insight.isLoading ? 'Thinking...' : insight.content}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AIInsightsPanel;

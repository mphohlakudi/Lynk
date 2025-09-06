import React, { useState, useRef } from 'react';
import { WalkieTalkieMessage } from '../types';
import { WalkieTalkieIcon } from './icons/WalkieTalkieIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { PlayIcon, PauseIcon } from './icons/PlaybackIcons';

interface WalkieTalkiePanelProps {
    isRecording: boolean;
    onStartRecording: () => void;
    onStopRecording: () => void;
    messages: WalkieTalkieMessage[];
    isTripActive: boolean;
}

const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 10) return 'Just now';
    if (seconds < 60) return `${seconds}s ago`;
    return `${Math.floor(seconds / 60)}m ago`;
};

const WalkieTalkiePanel: React.FC<WalkieTalkiePanelProps> = ({ isRecording, onStartRecording, onStopRecording, messages, isTripActive }) => {
    const [activeAudio, setActiveAudio] = useState<HTMLAudioElement | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handlePlay = (message: WalkieTalkieMessage) => {
        if (activeAudio) {
            activeAudio.pause();
            activeAudio.currentTime = 0;
        }

        const audio = new Audio(message.audioUrl);
        audioRef.current = audio;
        setActiveAudio(audio);
        audio.play();

        audio.onended = () => {
            setActiveAudio(null);
        };
        audio.onpause = () => {
             setActiveAudio(null);
        }
    };

    return (
        <div className="bg-black/60 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-gray-800 flex flex-col gap-4">
            <div className="flex items-center gap-3 border-b border-gray-700 pb-2">
                <WalkieTalkieIcon className="text-cyan-400" />
                <h2 className="text-xl font-bold text-white">Walkie-Talkie Channel</h2>
            </div>
            
            <div className="flex flex-col gap-2 min-h-[120px] max-h-48 overflow-y-auto pr-2">
                {messages.length === 0 && (
                    <p className="text-gray-400 text-center py-4">No recent alerts. Hold the button below to report a hazard.</p>
                )}
                {messages.map(msg => (
                    <div key={msg.id} className="bg-gray-900/50 p-2 rounded-lg flex items-center gap-3">
                        <button 
                            onClick={() => handlePlay(msg)}
                            className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                            aria-label="Play alert"
                        >
                            {activeAudio?.src === msg.audioUrl ? <PauseIcon /> : <PlayIcon />}
                        </button>
                        <div className="flex-grow">
                            <p className="font-semibold text-white text-sm">{msg.sender}</p>
                            <p className="text-xs text-gray-400">{formatTimeAgo(msg.timestamp)}</p>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onMouseDown={onStartRecording}
                onMouseUp={onStopRecording}
                onMouseLeave={onStopRecording}
                onTouchStart={(e) => { e.preventDefault(); onStartRecording(); }}
                onTouchEnd={(e) => { e.preventDefault(); onStopRecording(); }}
                disabled={!isTripActive}
                aria-pressed={isRecording}
                className={`relative flex flex-col items-center justify-center w-full p-4 rounded-lg font-semibold transition-all duration-200 border-2 ${
                    isRecording 
                        ? 'bg-red-600/50 border-red-500 text-white animate-pulse' 
                        : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-cyan-400 hover:text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-600`}
                aria-label={isRecording ? 'Recording in progress, release to send' : 'Hold to talk'}
            >
                <MicrophoneIcon />
                <span className="mt-1 text-sm">{isRecording ? 'Recording...' : 'Hold to Talk'}</span>
            </button>
        </div>
    );
};

export default WalkieTalkiePanel;
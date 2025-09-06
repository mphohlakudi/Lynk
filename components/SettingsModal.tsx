
import React, { useState, useEffect, useRef } from 'react';
import { AppMode, OfflineMapRegion, CommuterPreferences, CommuterAvatar } from '../types';
import { MapIcon } from './icons/MapIcon';
import { HeartIcon, CoinIcon, MolotovIcon, GhostIcon, KeyIcon, DotIcon } from './icons/CommuterAvatarIcons';
import { HapticIcon } from './icons/HapticIcon';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentMode: AppMode;
    onModeChange: (newMode: AppMode, pin?: string) => void;
    offlineRegions: OfflineMapRegion[];
    onDownloadMap: (regionId: string) => void;
    onDeleteMap: (regionId: string) => void;
    isDriverUnlocked: boolean;
    commuterPreferences: CommuterPreferences;
    onAvatarChange: (avatar: CommuterAvatar) => void;
    onSetPin: (newPin: string, confirmPin: string) => void;
    onToggleHapticFeedback: () => void;
}

const AvatarButton: React.FC<{ avatar: CommuterAvatar, currentAvatar: CommuterAvatar, onSelect: () => void, children: React.ReactNode }> = ({ avatar, currentAvatar, onSelect, children }) => {
    const isSelected = avatar === currentAvatar;
    return (
        <button
            onClick={onSelect}
            className={`flex-1 flex items-center justify-center p-3 rounded-lg transition-all border-2 ${isSelected ? 'bg-cyan-600/50 border-cyan-400' : 'bg-gray-700/50 border-gray-600 hover:border-gray-500'}`}
            aria-label={`Select ${avatar.toLowerCase()} avatar`}
            aria-pressed={isSelected}
        >
            {children}
        </button>
    );
};


const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentMode, onModeChange, offlineRegions, onDownloadMap, onDeleteMap, isDriverUnlocked, commuterPreferences, onAvatarChange, onSetPin, onToggleHapticFeedback }) => {
    const [pin, setPin] = useState('');
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const modalRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (isOpen) {
            const modalElement = modalRef.current;
            if (!modalElement) return;

            const handleEsc = (event: KeyboardEvent) => {
                if (event.key === 'Escape') {
                    onClose();
                }
            };
            
            const focusableElements = modalElement.querySelectorAll<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            const handleTabKey = (event: KeyboardEvent) => {
                if (event.key !== 'Tab') return;

                if (event.shiftKey) { // shift + tab
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        event.preventDefault();
                    }
                } else { // tab
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        event.preventDefault();
                    }
                }
            };
            
            document.addEventListener('keydown', handleEsc);
            document.addEventListener('keydown', handleTabKey);
            
            closeButtonRef.current?.focus();

            return () => {
                document.removeEventListener('keydown', handleEsc);
                document.removeEventListener('keydown', handleTabKey);
            };
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleDriverSwitch = () => {
        onModeChange(AppMode.Driver, pin);
        setPin('');
    };

    const handleCommuterSwitch = () => {
        onModeChange(AppMode.Commuter);
    };

    const handleSetPinClick = () => {
        onSetPin(newPin, confirmPin);
    };

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
        >
            <div 
                ref={modalRef}
                className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-6 w-full max-w-sm text-white"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-4">
                    <h2 id="settings-title" className="text-2xl font-bold">Settings</h2>
                    <button ref={closeButtonRef} onClick={onClose} className="text-gray-400 hover:text-white text-2xl p-1 rounded-full leading-none">&times;</button>
                </div>
                
                <div className="space-y-6">
                    {/* App Mode Section */}
                    <div>
                         <h3 className="text-lg font-semibold text-gray-300 mb-2">App Mode</h3>
                        <div className="bg-gray-800/50 p-4 rounded-lg">
                            <p className="text-gray-300 mb-4">
                                Current: <span className="font-semibold text-cyan-400">{currentMode === AppMode.Driver ? 'Driver' : 'Commuter'}</span>
                            </p>
                            
                            {currentMode === AppMode.Driver ? (
                                <div>
                                    <p className="text-sm text-gray-400 mb-2">Switch to the commuter view to track the Taxi.</p>
                                    <button 
                                        onClick={handleCommuterSwitch}
                                        className="w-full px-4 py-2 rounded-lg font-semibold transition-all duration-300 bg-cyan-600 hover:bg-cyan-500 text-white"
                                    >
                                        Switch to Commuter Mode
                                    </button>
                                </div>
                            ) : (
                                isDriverUnlocked ? (
                                    <div>
                                        <p className="text-sm text-gray-400 mb-2">Switch back to the driver view.</p>
                                        <button
                                            onClick={() => onModeChange(AppMode.Driver)}
                                            className="w-full px-4 py-2 rounded-lg font-semibold transition-all duration-300 bg-gray-700 hover:bg-gray-600 text-white border border-gray-600"
                                        >
                                            Switch to Driver Mode
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <label htmlFor="driver-pin" className="block text-sm font-medium text-gray-300 mb-2">
                                            Enter PIN for Driver Mode
                                        </label>
                                        <input
                                            type="password"
                                            id="driver-pin"
                                            value={pin}
                                            onChange={(e) => setPin(e.target.value)}
                                            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                            placeholder="****"
                                        />
                                        <button 
                                            onClick={handleDriverSwitch}
                                            className="w-full mt-3 px-4 py-2 rounded-lg font-semibold transition-all duration-300 bg-gray-700 hover:bg-gray-600 text-white border border-gray-600"
                                        >
                                            Unlock Driver Mode
                                        </button>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                     {/* Security Section (only in Driver Mode) */}
                     {currentMode === AppMode.Driver && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-300 mb-2">Security</h3>
                            <div className="bg-gray-800/50 p-4 rounded-lg space-y-3">
                                <p className="text-sm text-gray-400">Set a custom 4-digit PIN to access Driver Mode.</p>
                                <div>
                                    <label htmlFor="new-pin" className="sr-only">
                                        New PIN
                                    </label>
                                    <input
                                        type="password"
                                        id="new-pin"
                                        value={newPin}
                                        onChange={(e) => setNewPin(e.target.value.replace(/[^0-9]/g, ''))}
                                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                        placeholder="New 4-Digit PIN"
                                        maxLength={4}
                                        inputMode="numeric"
                                        autoComplete="new-password"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="confirm-pin" className="sr-only">
                                        Confirm New PIN
                                    </label>
                                    <input
                                        type="password"
                                        id="confirm-pin"
                                        value={confirmPin}
                                        onChange={(e) => setConfirmPin(e.target.value.replace(/[^0-9]/g, ''))}
                                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                        placeholder="Confirm PIN"
                                        maxLength={4}
                                        inputMode="numeric"
                                        autoComplete="new-password"
                                    />
                                </div>
                                <button
                                    onClick={handleSetPinClick}
                                    className="w-full px-4 py-2 rounded-lg font-semibold transition-all duration-300 bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-50"
                                    disabled={newPin.length < 4 || confirmPin.length < 4}
                                >
                                    Set New PIN
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Avatar Section (only in Commuter Mode) */}
                    {currentMode === AppMode.Commuter && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-300 mb-2">Commuter Avatar</h3>
                            <div className="bg-gray-800/50 p-4 rounded-lg space-y-3">
                                <p className="text-sm text-gray-400 mb-2">Choose a retro icon to represent you on the map.</p>
                                <div className="grid grid-cols-3 gap-2">
                                     <AvatarButton avatar={CommuterAvatar.DOT} currentAvatar={commuterPreferences.avatar} onSelect={() => onAvatarChange(CommuterAvatar.DOT)}>
                                        <DotIcon className="text-yellow-400" />
                                    </AvatarButton>
                                     <AvatarButton avatar={CommuterAvatar.HEART} currentAvatar={commuterPreferences.avatar} onSelect={() => onAvatarChange(CommuterAvatar.HEART)}>
                                        <HeartIcon className="text-yellow-400" />
                                    </AvatarButton>
                                    <AvatarButton avatar={CommuterAvatar.COIN} currentAvatar={commuterPreferences.avatar} onSelect={() => onAvatarChange(CommuterAvatar.COIN)}>
                                        <CoinIcon className="text-yellow-400" />
                                    </AvatarButton>
                                    <AvatarButton avatar={CommuterAvatar.MOLOTOV} currentAvatar={commuterPreferences.avatar} onSelect={() => onAvatarChange(CommuterAvatar.MOLOTOV)}>
                                        <MolotovIcon className="text-yellow-400" />
                                    </AvatarButton>
                                    <AvatarButton avatar={CommuterAvatar.GHOST} currentAvatar={commuterPreferences.avatar} onSelect={() => onAvatarChange(CommuterAvatar.GHOST)}>
                                        <GhostIcon className="text-yellow-400" />
                                    </AvatarButton>
                                    <AvatarButton avatar={CommuterAvatar.KEY} currentAvatar={commuterPreferences.avatar} onSelect={() => onAvatarChange(CommuterAvatar.KEY)}>
                                        <KeyIcon className="text-yellow-400" />
                                    </AvatarButton>
                                </div>
                            </div>
                        </div>
                    )}

                     {/* Accessibility Section (only in Commuter Mode) */}
                     {currentMode === AppMode.Commuter && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-300 mb-2">Accessibility</h3>
                             <div className="bg-gray-800/50 p-4 rounded-lg space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <HapticIcon className="text-gray-400 flex-shrink-0" />
                                        <div>
                                            <label htmlFor="haptic-toggle" className="font-semibold text-white">Haptic Feedback</label>
                                            <p className="text-xs text-gray-400">Vibration for key events</p>
                                        </div>
                                    </div>
                                    <button
                                        id="haptic-toggle"
                                        role="switch"
                                        aria-checked={commuterPreferences.hapticFeedbackEnabled}
                                        onClick={onToggleHapticFeedback}
                                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ${commuterPreferences.hapticFeedbackEnabled ? 'bg-cyan-500' : 'bg-gray-700'}`}
                                    >
                                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${commuterPreferences.hapticFeedbackEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Offline Maps Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-300 mb-2">Offline Maps</h3>
                        <div className="bg-gray-800/50 p-4 rounded-lg space-y-3">
                            {offlineRegions.map(region => (
                                <div key={region.id} className="flex items-center gap-3">
                                    <MapIcon className="text-gray-400 flex-shrink-0" />
                                    <div className="flex-grow">
                                        <p className="font-semibold text-white">{region.name}</p>
                                        <p className="text-xs text-gray-400">{region.size}</p>
                                    </div>
                                    {region.isDownloading ? (
                                        <div className="w-20 text-center">
                                            <div className="w-full bg-gray-700 rounded-full h-1.5">
                                                <div className="bg-cyan-500 h-1.5 rounded-full animate-pulse"></div>
                                            </div>
                                            <p className="text-xs text-cyan-400 mt-1">Downloading...</p>
                                        </div>
                                    ) : region.isDownloaded ? (
                                        <button 
                                            onClick={() => onDeleteMap(region.id)}
                                            className="px-3 py-1 text-xs font-semibold rounded-md bg-red-800 hover:bg-red-700 text-white transition-colors"
                                        >
                                            Delete
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => onDownloadMap(region.id)}
                                            className="px-3 py-1 text-xs font-semibold rounded-md bg-blue-700 hover:bg-blue-600 text-white transition-colors"
                                        >
                                            Download
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;